from fastapi.routing import APIRouter
from fastapi import Response
from fastapi.security import OAuth2PasswordRequestForm
from api_dependencies import validate_access_token
from api_schemas.user import User, SignRequest
import exceptions as exc
from api_dependencies import AccessToken
from fastapi import Depends
from typing import Annotated


router = APIRouter(prefix='/users')


def __sign_in(username: str, password: str):
    """sign in a user and stores JWT token."""
    user = User.get_by_username(username)
    if not user:
        raise exc.UserNotFoundError

    if not user.verify_password(password):
        raise exc.IncorrectPasswordError

    token = user.generate_access_token()
    return {"access_token": token, "token_type": "bearer"}


@router.post('/')
def sign_up(data: SignRequest):
    """sign up a new user.
    """
    user = User.create(data.username, data.password)
    user.sign_up()
    return Response(status_code=201)


@router.get('/{username}/exists/')
def user_exists(username: str) -> bool:
    """check whether given username is already taken."""
    return User.exists(username)


@router.post('/sign_in/')
async def sign_in(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """sign in a user and stores JWT token.
    This endpoint accepts a standard OAuth2PasswordRequestForm.
    """
    return __sign_in(form_data.username, form_data.password)


@router.post('/token/')
async def get_token(request: SignRequest):
    """returns JWT token for the user.
    This endpoint accepts a JSON request.
    """
    return __sign_in(request.username, request.password)


@router.get('/me')
def get_username(access_token: AccessToken):
    """returns username of the user who sent the request."""
    user = validate_access_token(access_token)
    return {'username': user.username}
