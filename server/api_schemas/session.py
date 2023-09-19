from mysql_server import database
from mysql_server.schemas import DBSession
from mysql_server.schemas import DBTask, DBProject
from sqlalchemy import select
from pydantic import BaseModel, Field
from pydantic import validator
from validators import datetime_validator
from uuid import uuid4
import datetime as dt
from typing import overload, Iterable, Optional
from config import config as cfg


class GetSessionsRequest(BaseModel):
    """Request object for get_sessions()."""

    ts_start: dt.datetime
    ts_end: dt.datetime

    @validator("ts_start", "ts_end")
    def validate_ts(cls, v: dt.datetime):
        return datetime_validator(v)


class Session(BaseModel):
    """
    Session object.

    duration is in seconds.

    NOTE: session is added when formally complete
    therefore completed_at should allways be present.
    user is optional only as a API request parameter,
    but should allways be present in the database.
    """

    key: str = Field(default_factory=uuid4)
    task_id: str
    completed_at: dt.datetime
    duration: int
    user: Optional[str]

    @validator("completed_at")
    def validate_completed_at(cls, v: dt.datetime):
        return datetime_validator(v)

    class Config:
        json_encoders = {dt.datetime: lambda v: v.isoformat()}


class ExtendedSession(Session):
    """Session object with additional fields."""

    task: str
    project: str


@overload
def parse_session(data: DBSession) -> "ExtendedSession":
    ...


@overload
def parse_session(data: Iterable) -> list["ExtendedSession"]:
    ...


def parse_session(
    data: DBSession | Iterable[DBSession],
) -> "ExtendedSession | list[ExtendedSession]":
    """Parses a DBSession object or a list of DBSession objects
    into a Session object or a list of Session objects, respectively.
    """
    if isinstance(data, DBSession):
        data.completed_at = data.completed_at.replace(tzinfo=cfg.TIMEZONE)
        return ExtendedSession.parse_obj(
            {
                **data.__dict__,
                "task": data.task_obj.label,
                "project": data.task_obj.project_obj.label,
            }
        )

    elif isinstance(data, Iterable):
        for entry in data:
            if isinstance(entry, DBSession):
                entry.completed_at = entry.completed_at.replace(tzinfo=cfg.TIMEZONE)
            else:
                raise TypeError("Invalid data type")
        return [
            ExtendedSession.parse_obj(
                {
                    **entry.__dict__,
                    "task": entry.task_obj.label,
                    "project": entry.task_obj.project_obj.label,
                }
            )
            for entry in data
        ]
    else:
        raise TypeError("Invalid data type")


def get_many(
    user: str, ts_start: dt.datetime, ts_end: dt.datetime
) -> list["ExtendedSession"]:
    with database.create_session() as session:
        query = (
            select(DBSession)
            .where(DBSession.user == user)
            .where(
                DBSession.completed_at >= ts_start,
                DBSession.completed_at <= ts_end,
            )
            .order_by(DBSession.completed_at)
        )

        result = session.scalars(query).all()
        return parse_session(result)


def create(
    key: str, task_id: str, completed_at: dt.datetime, duration: int, user: str
) -> str:
    with database.create_session() as session:
        db_session = DBSession(
            key=str(key),
            task_id=task_id,
            completed_at=completed_at,
            duration=duration,
            user=user,
        )
        session.add(db_session)
        session.commit()
        return db_session.key
