from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, DateTime, Integer
from sqlalchemy import Boolean
from mysql_server import MySQLServerBase
from typing import Optional
from datetime import datetime


class DBUser(MySQLServerBase):
    __tablename__ = 'user'

    username: Mapped[str] = mapped_column(
        String(32), unique=True, primary_key=True)
    password_hash: Mapped[str] = mapped_column(String(128))


class DBProject(MySQLServerBase):
    __tablename__ = 'project'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    user: Mapped[str] = mapped_column(ForeignKey(DBUser.username))
    label: Mapped[str] = mapped_column(String(32))
    description: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)


class DBTask(MySQLServerBase):
    __tablename__ = 'task'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    user: Mapped[str] = mapped_column(ForeignKey(DBUser.username))
    label: Mapped[str] = mapped_column(String(32))
    level: Mapped[str] = mapped_column(String(32))
    project_id: Mapped[str] = mapped_column(ForeignKey(DBProject.key))
    description: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True)
    expected_time: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True)
    parent_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey(key), nullable=True)
    is_archived: Mapped[Optional[bool]] = mapped_column(
        Boolean, default=False)


class DBSession(MySQLServerBase):
    __tablename__ = 'session'

    key: Mapped[str] = mapped_column(String(36), primary_key=True)
    task_id: Mapped[str] = mapped_column(ForeignKey(DBTask.key))
    completed_at: Mapped[Optional[datetime]]
    duration: Mapped[Optional[int]]
