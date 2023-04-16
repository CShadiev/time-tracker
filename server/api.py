from fastapi import FastAPI
from fastapi import Response, Cookie
from typing import Annotated
from api_schemas import SignRequest
from api_schemas import user as user_api
import config
import re
import exceptions as exc


app = FastAPI()


AccessToken = Annotated[str | None, Cookie(alias='time-tracker-app')]


@app.post('/users')
async def sign_up(data: SignRequest):
    """sign up a new user.
    validates username and password.
    """
    if user_api.user_exists(data.username):
        raise exc.InputValidationError('Username taken')

    username = data.username.lower()
    if not username.isalnum():
        raise exc.InputValidationError('Username must be alphanumeric')

    if len(username) < 3:
        raise exc.InputValidationError(
            'Username must be at least 3 characters long')

    if username[0].isdigit():
        raise exc.InputValidationError('Username must start with a letter')

    if len(data.password) < 8:
        raise exc.InputValidationError(
            'Password must be at least 8 characters long')

    if len(data.password) > 16:
        raise exc.InputValidationError(
            'Password must be at most 16 characters long')

    # check password for allowed characters
    allowed_chars = re.compile(r'[a-zA-Z0-9\+\-\*\^\$\.\?\!_ ]+')
    if re.fullmatch(allowed_chars, data.password) is None:
        raise exc.InputValidationError('Password contains invalid characters')

    user = user_api.create_user(username, data.password)
    user.sign_up()
    return Response(status_code=201)


@app.get('/users/{username}/exists')
def user_exists(username: str) -> bool:
    """check whether given username is already taken."""
    return user_api.user_exists(username)


@app.post('/users/sign_in')
async def sign_in(data: SignRequest, response: Response):
    """sign in a user and stores JWT token as a cookie."""
    user = user_api.get_user_by_username(data.username)
    if not user:
        raise exc.UserNotFoundError

    if not user.verify_password(data.password):
        raise exc.IncorrectPasswordError

    token = user.generate_access_token()
    max_age = round(config.TOKEN_TIMEOUT_TD.total_seconds())
    use_secure_cookie = config.DEV_MODE is False
    response.status_code = 201
    response.set_cookie('time-tracker-app', token, max_age=max_age,
                        secure=use_secure_cookie, httponly=True, path='/')
    return response


@app.get('/users/me')
def get_username(access_token: AccessToken = None):
    """returns username of the user who sent the request."""
    if not access_token:
        raise exc.MissingTokenError

    user = user_api.get_user_by_token(access_token)
    return {'username': user.username}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('api:app', port=5000, reload=True,
                root_path='/')
