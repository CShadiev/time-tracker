from zoneinfo import ZoneInfo
from datetime import timedelta
import os
from dotenv import load_dotenv
from pydantic import BaseModel, validator
from typing import Literal


load_dotenv()


env = os.environ


class Config(BaseModel):
    SECRET_KEY: str
    JWT_ENCR_ALGORITHM: str
    TOKEN_TIMEOUT_TD: timedelta
    TIMEZONE: ZoneInfo  # internal timezone (DB and api)
    USE_SECURE_COOKIES: bool

    DB_HOST: str
    DB_PORT: int
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_NAME: str
    TYPE: Literal["mysql"] = "mysql"

    UVICORN_HOME: str
    UVICORN_PORT: int
    UVICORN_RELOAD: bool = False

    class Config:
        arbitrary_types_allowed = True

    @validator("TOKEN_TIMEOUT_TD", pre=True)
    def validate_token_timeout(cls, v: str | None):
        assert v is not None
        return timedelta(days=int(v))

    @validator("TIMEZONE", pre=True)
    def validate_timezone(cls, v: str | None):
        assert v is not None
        return ZoneInfo(v)


config = Config.parse_obj(env)
