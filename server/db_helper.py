from sqlalchemy import URL
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from pydantic import BaseModel
from typing import Literal


class DBConfig(BaseModel):
    HOST: str
    PORT: int
    USER: str
    PASSWORD: str
    DATABASE: str
    TYPE: Literal['mysql'] = 'mysql'


class DBHelper:
    def __init__(self, config: DBConfig) -> None:
        if config.TYPE == 'mysql':
            c_string = URL.create(
                'mysql', config.USER, config.PASSWORD,
                config.HOST, config.PORT, config.DATABASE)
            self.engine = create_engine(c_string)
        else:
            raise ValueError('Invalid database type')

    def create_session(self):
        return Session(self.engine)
