from pydantic import BaseModel, Field
from typing import Optional, Literal
import datetime as dt
from uuid import uuid4
from config import TIMEZONE
from mysql_server import database
from mysql_server.schemas import DBTask
from sqlalchemy import select, update, delete


class ModifyTaskRequest(BaseModel):
    """
    Request body for modifying a task.

    only the following fields are allowed to be modified:
    label, description, expected_time.
    """
    key: str
    label: Optional[str] = Field(max_length=32)
    description: Optional[str] = Field(max_length=512, default=None)
    expected_time: Optional[int] = None


class Task(BaseModel):
    """
    expected_time is in seconds.
    """
    key: str
    user: str
    label: str = Field(max_length=32)
    description: Optional[str] = Field(max_length=512, default=None)
    level: Literal['task', 'subtask']
    project_id: str
    created_at: dt.datetime
    completed_at: Optional[dt.datetime] = None
    expected_time: Optional[int] = None
    parent_id: Optional[str] = None
    is_archived: bool = False

    @classmethod
    def create(
            cls, user: str, label: str,
            project_id: str,
            description: Optional[str] = None,
            expected_time: Optional[int] = None,
            parent_id: Optional[str] = None) -> 'Task':
        """Creates a new task and returns Task object."""
        task = cls(
            key=str(uuid4()),
            user=user,
            label=label,
            description=description,
            level='task' if parent_id is None else 'subtask',
            project_id=project_id,
            created_at=dt.datetime.now(tz=TIMEZONE),
            expected_time=expected_time,
            parent_id=parent_id)
        return task

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
                expected_time=self.expected_time)

            session.add(db_task)
            session.commit()

    @classmethod
    def update(cls, request: ModifyTaskRequest):
        """Updates task in database."""
        values = request.dict(exclude={'key'})
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(
                    DBTask.key == request.key).values(**values))
            session.commit()

    @classmethod
    def archive(cls, key: str):
        """Archives task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(
                    DBTask.key == key).values(is_archived=True))
            session.commit()

    @classmethod
    def restore(cls, key: str):
        """Restores task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(
                    DBTask.key == key).values(is_archived=False))
            session.commit()

    @classmethod
    def complete(cls, key: str):
        """Completes task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(
                    DBTask.key == key).values(
                        completed_at=dt.datetime.now(tz=TIMEZONE)))
            session.commit()

    @classmethod
    def uncomplete(cls, key: str):
        """Uncompletes task in database."""
        with database.create_session() as session:
            session.execute(
                update(DBTask).where(
                    DBTask.key == key).values(completed_at=None))
            session.commit()

    @classmethod
    def find_all(
            cls, user: str | None = None,
            project_id: str | None = None):
        """Returns all tasks."""
        with database.create_session() as session:
            query = select(DBTask)
            if user is not None:
                query = query.where(DBTask.user == user)
            if project_id is not None:
                query = query.where(DBTask.project_id == project_id)
            tasks = session.execute(query).scalars().all()
            return [cls.parse_obj(task.__dict__) for task in tasks]

    @classmethod
    def remove(cls, key: str):
        """Removes task from database."""
        with database.create_session() as session:
            session.execute(delete(DBTask).where(DBTask.key == key))
            session.commit()
