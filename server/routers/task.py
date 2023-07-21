from fastapi.routing import APIRouter
from api_dependencies import validate_access_token
from api_dependencies import AccessToken
from api_dependencies import NoContentResponse
from api_schemas.task import Task, ModifyTaskRequest
from api_schemas.task import CreateTaskRequest
import exceptions as exc


router = APIRouter(prefix="/tasks")


@router.get("/")
def get_tasks(project_key: str, access_token: AccessToken) -> list[Task]:
    """returns all tasks of the user."""
    user = validate_access_token(access_token)
    return Task.find_all(user.username, project_key)


@router.get("/{task_key}/")
def get_task(task_key: str, access_token: AccessToken) -> Task:
    """returns a task."""
    user = validate_access_token(access_token)
    return Task.find_one(task_key, user.username)


@router.post("/")
def create_task(
    project_key: str, request: CreateTaskRequest, access_token: AccessToken
) -> str:
    """creates a new task.
    Returns the key of the created task.
    """
    user = validate_access_token(access_token)
    task = Task.create(user=user.username, project_id=project_key, request=request)
    task.insert()
    return task.key


@router.post("/{task_key}/modify/")
def modify_task(task_key: str, request: ModifyTaskRequest, access_token: AccessToken):
    """modifies a task."""
    user = validate_access_token(access_token)
    task = Task.find_one(task_key)
    if task.user != user.username:
        raise exc.ForeignTaskError

    task.modify(request)
    return NoContentResponse()


@router.get("/{task_key}/archive/")
def archive_task(task_key: str, access_token: AccessToken):
    """archives a task."""
    user = validate_access_token(access_token)
    task = Task.find_one(task_key)
    if task.user != user.username:
        raise exc.ForeignTaskError

    task.archive()
    return NoContentResponse()


@router.get("/{task_key}/restore/")
def restore_task(task_key: str, access_token: AccessToken):
    """restores a task."""
    user = validate_access_token(access_token)
    task = Task.find_one(task_key)
    if task.user != user.username:
        raise exc.ForeignTaskError

    task.restore()
    return NoContentResponse()


@router.get("/{task_key}/complete/")
def complete_task(task_key: str, access_token: AccessToken):
    """completes a task."""
    user = validate_access_token(access_token)
    task = Task.find_one(task_key)
    if task.user != user.username:
        raise exc.ForeignTaskError

    task.complete()
    return NoContentResponse()


@router.get("/{task_key}/uncomplete/")
def uncomplete_task(task_key: str, access_token: AccessToken):
    """uncompletes a task."""
    user = validate_access_token(access_token)
    task = Task.find_one(task_key)
    if task.user != user.username:
        raise exc.ForeignTaskError

    task.uncomplete()
    return NoContentResponse()
