from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import String, ForeignKey, DateTime, Integer
from sqlalchemy import Boolean
from mysql_server import MySQLServerBase
from typing import Literal, Optional
from datetime import datetime


class DBUser(MySQLServerBase):
    __tablename__ = 'user'

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    username: Mapped[str] = mapped_column(String(32), unique=True)
    password_hash: Mapped[str] = mapped_column(String(128))
    session_token: Mapped[Optional[str]] = mapped_column(
        String(64), nullable=True)


class Project(MySQLServerBase):
    __tablename__ = 'project'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey(DBUser.id))
    label: Mapped[str] = mapped_column(String(32))
    description: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    level: Literal['project'] = 'project'
    children: Mapped[list['Task']] = relationship()


class Task(MySQLServerBase):
    __tablename__ = 'task'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    label: Mapped[str] = mapped_column(String(32))
    level: Literal['task'] = 'task'
    project_id: Mapped[str] = mapped_column(ForeignKey(Project.key))
    description: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True)
    expected_time: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True)
    is_removed: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)

    children: Mapped[list['Subtask']] = relationship()


class Subtask(MySQLServerBase):
    __tablename__ = 'subtask'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    label: Mapped[str] = mapped_column(String(32))
    level: Literal['subtask'] = 'subtask'
    description: Mapped[str] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    expected_time: Mapped[int] = mapped_column(Integer, nullable=True)
    is_removed: Mapped[bool] = mapped_column(Boolean, default=False)
    parent_task_id: Mapped[str] = mapped_column(ForeignKey(Task.key))
