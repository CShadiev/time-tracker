from mysql_server import database
from mysql_server.schemas import DBSession
from pydantic import BaseModel
from uuid import uuid4
import datetime as dt


class Session(BaseModel):
    """
    Session object.

    duration is in seconds.
    """
    key: str
    task_id: str
    completed_at: dt.datetime
    duration: int

    @classmethod
    def create(
            cls, task_id: str,
            completed_at: dt.datetime,
            duration: int) -> 'Session':

        session = cls(
            key=str(uuid4()),
            task_id=task_id,
            completed_at=completed_at,
            duration=duration)
        return session

    def insert(self):
        with database.create_session() as session:
            db_session = DBSession(
                key=self.key,
                task_id=self.task_id,
                completed_at=self.completed_at,
                duration=self.duration)
            session.add(db_session)
            session.commit()
