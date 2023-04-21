from typing import Annotated
from fastapi import Cookie, Response
from api_schemas.user import User
import exceptions as exc

Atk = Annotated[str | None, Cookie(alias='time-tracker-app')]


def validate_access_token(access_token: str | None) -> User:
    """validates access token."""
    if not access_token:
        raise exc.MissingTokenError

    return User.get_by_token(access_token)


class NoContentResponse(Response):
    """A response with 204 status code."""

    def __init__(self):
        super().__init__(status_code=204)
