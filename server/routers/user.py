from fastapi.routing import APIRouter
from fastapi import Response
from api_dependencies import validate_access_token, Atk
from api_schemas.user import User, SignRequest
from config import config
import exceptions as exc


router = APIRouter(prefix='/users')


@router.post('/')
def sign_up(data: SignRequest):
    """sign up a new user.
    """
    user = User.create(data.username, data.password)
    user.sign_up()
    return Response(status_code=201)


@router.get('/{username}/exists')
def user_exists(username: str) -> bool:
    """check whether given username is already taken."""
    return User.exists(username)


@router.post('/sign_in')
async def sign_in(data: SignRequest, response: Response):
    """sign in a user and stores JWT token as a cookie."""
    user = User.get_by_username(data.username)
    if not user:
        raise exc.UserNotFoundError

    if not user.verify_password(data.password):
        raise exc.IncorrectPasswordError

    token = user.generate_access_token()
    max_age = round(config.TOKEN_TIMEOUT_TD.total_seconds())
    use_secure_cookie = config.USE_SECURE_COOKIES
    response.status_code = 201
    response.set_cookie('time-tracker-app', token, max_age=max_age,
                        secure=use_secure_cookie, httponly=True, path='/')
    return response


@router.get('/me')
def get_username(access_token: str | None = Atk()):
    """returns username of the user who sent the request."""
    user = validate_access_token(access_token)
    return {'username': user.username}
