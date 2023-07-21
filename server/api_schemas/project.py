from pydantic import BaseModel, Field, validator
from mysql_server.schemas import DBProject
from typing import Optional
import datetime as dt
from uuid import uuid4
from config import config
from mysql_server import database
from sqlalchemy import select, update, delete
import exceptions as exc
from validators import datetime_validator
from typing import Iterable, overload
from api_schemas.task import Task
from sqlalchemy.sql.expression import false


LabelField = Field(max_length=32)
DescriptionField = Field(max_length=512, default=None)

TIMEZONE = config.TIMEZONE


@overload
def parse_project(data: DBProject) -> "Project":
    ...


@overload
def parse_project(data: Iterable[DBProject]) -> list["Project"]:
    ...


def parse_project(data: DBProject | Iterable[DBProject]) -> "Project | list[Project]":
    """Parses a DBProject object or a list of DBProject objects
    into a Project object or a list of Project objects.
    """
    if isinstance(data, DBProject):
        data.created_at = data.created_at.replace(tzinfo=TIMEZONE)
        return Project.parse_obj(data.__dict__)

    elif isinstance(data, Iterable):
        for entry in data:
            entry.created_at = entry.created_at.replace(tzinfo=TIMEZONE)
        return [Project.parse_obj(entry.__dict__) for entry in data]

    else:
        raise TypeError("Invalid data type")


class ModifyProjectRequest(BaseModel):
    """
    Request body for modifying a project.

    only two fields are allowed to be modified:
    label and description.
    """

    label: Optional[str] = LabelField
    description: Optional[str] = DescriptionField


class CreateProjectRequest(BaseModel):
    """
    Request body for creating a project.
    """

    label: str = LabelField
    description: Optional[str] = DescriptionField


class Project(BaseModel):
    key: str
    user: str
    label: str = LabelField
    description: Optional[str] = DescriptionField
    created_at: dt.datetime
    level: str = "project"
    is_archived: bool = False
    children: list["Task"] | None = None

    class Config:
        json_encoders = {dt.datetime: lambda x: x.isoformat()}

    @validator("created_at")
    def validate_created_at(cls, v):
        return datetime_validator(v)

    @classmethod
    def create(cls, user: str, label: str, description: Optional[str] = None) -> "Project":
        """Creates a new project and returns Project object."""
        project = cls(
            key=str(uuid4()),
            user=user,
            label=label,
            description=description,
            created_at=dt.datetime.now(tz=TIMEZONE),
        )

        return project

    @classmethod
    def find_one(cls, key: str) -> "Project":
        """Returns a project."""
        with database.create_session() as session:
            qry = select(DBProject).where(DBProject.key == key)
            db_project = session.execute(qry).scalars().first()
            if not db_project:
                raise exc.ProjectNotFoundError(key)

        return parse_project(db_project)

    @classmethod
    def find_all(cls, user: str, recursive: bool = False) -> list["Project"]:
        """Returns all projects of a user."""
        with database.create_session() as session:
            qry = (
                select(DBProject).where(DBProject.user == user).order_by(DBProject.created_at)
            )
            qry = qry.where(DBProject.is_archived == false())
            db_projects = session.execute(qry).scalars().all()

        projects = parse_project(db_projects)
        if recursive:
            tasks = Task.find_all(user=user)
            # put subtasks in parent task's children list
            task_map: dict[str, Task] = {}
            for task in tasks:
                # assume that subtasks always follow parent tasks
                if task.parent_id is None:
                    task_map[task.key] = task
                if task.parent_id is not None:
                    parent_task = task_map[task.parent_id]
                    if parent_task.children is None:
                        parent_task.children = []
                    parent_task.children.append(task)

            for project in projects:
                project.children = [
                    task for task in task_map.values() if task.project_id == project.key
                ]
                if len(project.children) == 0:
                    project.children = None

        return projects

    def insert(self):
        """Saves project to database."""
        with database.create_session() as session:
            db_project = DBProject(
                key=self.key,
                user=self.user,
                label=self.label,
                description=self.description,
                created_at=self.created_at,
                is_archived=self.is_archived,
            )
            session.add(db_project)
            session.commit()

    def modify(self, request: ModifyProjectRequest) -> None:
        """Modifies a project."""
        with database.create_session() as session:
            values = request.dict(exclude_unset=True)
            stmt = update(DBProject).where(DBProject.key == self.key).values(**values)
            session.execute(stmt)
            session.commit()

    def archive(self) -> None:
        """Archives a project."""
        with database.create_session() as session:
            stmt = update(DBProject).where(DBProject.key == self.key).values(is_archived=True)
            session.execute(stmt)
            session.commit()

    def restore(self) -> None:
        """Restores a project."""
        with database.create_session() as session:
            stmt = (
                update(DBProject).where(DBProject.key == self.key).values(is_archived=False)
            )
            session.execute(stmt)
            session.commit()

    def remove(self) -> None:
        """Removes a project.
        Normally, this method should not be used.
        """
        with database.create_session() as session:
            stmt = delete(DBProject).where(DBProject.key == self.key)
            session.execute(stmt)
            session.commit()
