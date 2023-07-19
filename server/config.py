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
    TIMEZONE: ZoneInfo
    USE_SECURE_COOKIES: bool

    DB_HOST: str
    DB_PORT: int
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_NAME: str
    TYPE: Literal["mysql"] = "mysql"

    UVICORN_HOME: str
    UVICORN_PORT: int

    class Config:
        arbitrary_types_allowed = True

    @validator("TOKEN_TIMEOUT_TD", pre=True)
    def validate_token_timeout(cls, v: str | None):
        assert v is not None
        return timedelta(days=int(v))

    @validator("USE_SECURE_COOKIES", pre=True)
    def validate_secure_cookies(cls, v: str | None):
        assert v is not None
        return bool(int(v))

    @validator("TIMEZONE", pre=True)
    def validate_timezone(cls, v: str | None):
        assert v is not None
        return ZoneInfo(v)

    @validator("UVICORN_PORT", pre=True)
    def validate_uvicorn_port(cls, v: str | None):
        assert v is not None
        return int(v)


config = Config.parse_obj(env)
