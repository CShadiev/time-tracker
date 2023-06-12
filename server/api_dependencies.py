from fastapi import Cookie, Response
from api_schemas.user import User
import exceptions as exc
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends
from config import config
from re import sub


# make sure there are no multiple "/" signs
token_url = sub(r'//+', '/', config.UVICORN_HOME + '/users/sign_in/')


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/sign_in/")
AccessToken = Annotated[str | None, Depends(oauth2_scheme)]


def validate_access_token(access_token: str | None) -> User:
    """validates access token."""
    if not access_token:
        raise exc.MissingTokenError

    return User.get_by_token(access_token)


class NoContentResponse(Response):
    """A response with 204 status code."""

    def __init__(self):
        super().__init__(status_code=204)
