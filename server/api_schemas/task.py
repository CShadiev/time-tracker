from pydantic import BaseModel, Field, validator
from typing import Optional, Literal, Iterable
from typing import overload
import datetime as dt
from uuid import uuid4
from config import config
from mysql_server import database
from mysql_server.schemas import DBTask
from sqlalchemy import select, update, delete
import exceptions as exc
from validators import datetime_validator


LabelField = Field(max_length=32)
DescriptionField = Field(max_length=512, default=None)
ExpectedTimeField = Field(ge=0, default=None)

TIMEZONE = config.TIMEZONE


@overload
def parse_task(data: DBTask) -> "Task":
    ...


@overload
def parse_task(data: Iterable[DBTask]) -> list["Task"]:
    ...


def parse_task(data: DBTask | Iterable[DBTask]) -> "Task | list[Task]":
    """Parses a DBTask object or a list of DBTask objects
    into a Task object or a list of Task objects.
    """
    if isinstance(data, DBTask):
        data.created_at = data.created_at.replace(tzinfo=TIMEZONE)
        if data.completed_at is not None:
            data.completed_at = data.completed_at.replace(tzinfo=TIMEZONE)
        return Task.parse_obj(data.__dict__)

    elif isinstance(data, Iterable):
        for entry in data:
            entry.created_at = entry.created_at.replace(tzinfo=TIMEZONE)
            if entry.completed_at is not None:
                entry.completed_at = entry.completed_at.replace(tzinfo=TIMEZONE)
        return [Task.parse_obj(entry.__dict__) for entry in data]

    else:
        raise TypeError("Invalid data type")


class ModifyTaskRequest(BaseModel):
    """
    Request body for modifying a task.

    only the following fields are allowed to be modified:
    label, description, expected_time.
    """

    label: Optional[str] = LabelField
    description: Optional[str] = DescriptionField
    expected_time: Optional[int] = ExpectedTimeField


class CreateTaskRequest(BaseModel):
    """
    Request body for creating a task.
    """

    label: str = LabelField
    description: Optional[str] = DescriptionField
    expected_time: Optional[int] = ExpectedTimeField
    parent_id: Optional[str] = None


class Task(BaseModel):
    """
    Task object.

    Note: expected_time is in seconds.
    Datetime objects must be timezone-aware.
    """

    key: str
    user: str
    label: str = LabelField
    description: Optional[str] = DescriptionField
    level: Literal["task", "subtask"]
    project_id: str
    created_at: dt.datetime
    completed_at: Optional[dt.datetime] = None
    expected_time: Optional[int] = ExpectedTimeField
    parent_id: Optional[str] = None
    is_archived: bool = False
    children: Optional[list["Task"]] = None

    class Config:
        json_encoders = {dt.datetime: lambda x: x.isoformat()}

    @validator("created_at")
    def validate_created_at(cls, v):
        return datetime_validator(v)

    @validator("completed_at")
    def validate_completed_at(cls, v):
        if v is None:
            return None
        return datetime_validator(v)

    @classmethod
    def create(cls, user: str, project_id: str, request: CreateTaskRequest) -> "Task":
        """Creates a new task and returns Task object."""
        parent_id = request.parent_id

        task = cls(
            key=str(uuid4()),
            user=user,
            label=request.label,
            description=request.description,
            level="task" if parent_id is None else "subtask",
            project_id=project_id,
            created_at=dt.datetime.now(tz=TIMEZONE),
            expected_time=request.expected_time,
            parent_id=parent_id,
        )
        return task

    @classmethod
    def find_one(cls, key: str, username: str | None = None) -> "Task":
        """Finds a task in database and returns Task object."""
        with database.create_session() as session:
            db_task = session.execute(select(DBTask).where(DBTask.key == key)).scalar()
            if db_task is None:
                raise exc.TaskNotFoundError(key)
        task = parse_task(db_task)
        if username:
            if task.user != username:
                raise exc.ForeignTaskError
        return task

    @classmethod
    def find_all(cls, user: str | None = None, project_id: str | None = None) -> list["Task"]:
        """Returns all tasks.
        Either user or project_id must be provided.

        Returns the list of Task objects.
        """
        with database.create_session() as session:
            query = select(DBTask)
            if user is None and project_id is None:
                raise ValueError("either user or project_id must be provided")
            if user is not None:
                query = query.where(DBTask.user == user)
            if project_id is not None:
                query = query.where(DBTask.project_id == project_id)

            query = query.order_by(DBTask.created_at)
            tasks = session.execute(query).scalars().all()
            return parse_task(tasks)

    def insert(self):
        """Saves task to database."""
        with database.create_session() as session:
            db_task = DBTask(
                key=self.key,
                user=self.user,
                label=self.label,
                description=self.description,
                created_at=self.created_at,
                level=self.level,
                completed_at=self.completed_at,
                is_archived=self.is_archived,
                project_id=self.project_id,
                parent_id=self.parent_id,
                expected_time=self.expected_time,
            )

            session.add(db_task)
            session.commit()

    def modify(self, request: ModifyTaskRequest):
        """Updates task in database."""
        values = request.dict()
        with database.create_session() as session:
            session.execute(update(DBTask).where(DBTask.key == self.key).values(**values))
            session.commit()

    def archive(self):
        """Archives task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(DBTask.key == self.key).values(is_archived=True)
            )
            session.commit()

    def restore(self):
        """Restores task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(DBTask.key == self.key).values(is_archived=False)
            )
            session.commit()

    def complete(self):
        """Completes task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask)
                .where(DBTask.key == self.key)
                .values(completed_at=dt.datetime.now(tz=TIMEZONE))
            )
            session.commit()

    def uncomplete(self):
        """Uncompletes task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(DBTask.key == self.key).values(completed_at=None)
            )
            session.commit()

    def remove(self):
        """Removes task from database.
        Generally not supposed to be used.
        """
        with database.create_session() as session:
            session.execute(delete(DBTask).where(DBTask.key == self.key))
            session.commit()
