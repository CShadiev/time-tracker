from fastapi.routing import APIRouter
from api_dependencies import validate_access_token
from api_dependencies import AccessToken
from api_schemas import session


router = APIRouter(prefix="/session")


@router.post("/")
def get_sessions(access_token: AccessToken, request: session.GetSessionsRequest):
    """returns all sessions of the user."""
    user = validate_access_token(access_token)
    return session.get_many(user.username, request.ts_start, request.ts_end)


@router.post("/add")
def add_session(access_token: AccessToken, request: session.Session):
    """creates a new session."""
    user = validate_access_token(access_token)
    session.create(
        key=request.key,
        task_id=request.task_id,
        completed_at=request.completed_at,
        duration=request.duration,
        user=user.username,
    )
    return request.key
