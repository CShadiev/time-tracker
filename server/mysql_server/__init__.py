from sqlalchemy.orm import DeclarativeBase
from db_helper import DBConfig, DBHelper
from config import config


config = DBConfig(
    HOST=config.DB_HOST,
    PORT=config.DB_PORT,
    USER=config.DB_USERNAME,
    PASSWORD=config.DB_PASSWORD,
    DATABASE=config.DB_NAME)


class MySQLServerBase(DeclarativeBase):
    pass


database = DBHelper(config)
