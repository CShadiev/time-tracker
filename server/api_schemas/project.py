from pydantic import BaseModel, Field
from mysql_server.schemas import DBProject
from typing import Optional
import datetime as dt
from uuid import uuid4
from config import TIMEZONE
from mysql_server import database
from sqlalchemy import select, update, delete
import exceptions as exc


LabelField = Field(max_length=32)
DescriptionField = Field(max_length=512, default=None)


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
    level: str = 'project'
    is_archived: bool = False

    class Config:
        json_encoders = {
            dt.datetime: lambda x: x.isoformat()
        }

    @classmethod
    def create(
            cls, user: str, label: str,
            description: Optional[str] = None) -> 'Project':
        """Creates a new project and returns Project object."""
        project = cls(
            key=str(uuid4()),
            user=user,
            label=label,
            description=description,
            created_at=dt.datetime.now(tz=TIMEZONE))

        return project

    @classmethod
    def find(cls, key: str) -> 'Project':
        """Returns a project."""
        with database.create_session() as session:
            qry = select(DBProject).where(DBProject.key == key)
            db_project = session.execute(qry).scalars().first()
            if not db_project:
                raise exc.ProjectNotFoundError(key)
        return cls.parse_obj(db_project.__dict__)

    @classmethod
    def find_all(cls, user: str) -> list['Project']:
        """Returns all projects of a user."""
        with database.create_session() as session:
            qry = select(DBProject).where(
                DBProject.user == user)
            db_projects = session.execute(qry).scalars().all()

        return [cls.parse_obj(db_project.__dict__) for db_project
                in db_projects]

    def insert(self):
        """Saves project to database."""
        with database.create_session() as session:
            db_project = DBProject(
                key=self.key,
                user=self.user,
                label=self.label,
                description=self.description,
                created_at=self.created_at,
                is_archived=self.is_archived)
            session.add(db_project)
            session.commit()

    def modify(self, request: ModifyProjectRequest) -> None:
        """Modifies a project."""
        with database.create_session() as session:
            values = request.dict()
            stmt = update(DBProject).where(
                DBProject.key == self.key).values(
                    **values)
            session.execute(stmt)
            session.commit()

    def archive(self) -> None:
        """Archives a project."""
        with database.create_session() as session:
            stmt = update(DBProject).where(
                DBProject.key == self.key).values(
                    is_archived=True)
            session.execute(stmt)
            session.commit()

    def restore(self) -> None:
        """Restores a project."""
        with database.create_session() as session:
            stmt = update(DBProject).where(
                DBProject.key == self.key).values(
                    is_archived=False)
            session.execute(stmt)
            session.commit()

    def remove(self) -> None:
        """Removes a project.
        Normally, this method should not be used.
        """
        with database.create_session() as session:
            stmt = delete(DBProject).where(
                DBProject.key == self.key)
            session.execute(stmt)
            session.commit()
