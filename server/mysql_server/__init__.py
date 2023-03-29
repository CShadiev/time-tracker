from sqlalchemy.orm import DeclarativeBase
from db_helper import DBConfig, DBHelper


config = DBConfig(
    HOST='datalion.ru',
    PORT=3306,
    USER='root',
    PASSWORD='88EmptyCompanyCells00',
    DATABASE='time_tracker_app')


class MySQLServerBase(DeclarativeBase):
    pass


database = DBHelper(config)
