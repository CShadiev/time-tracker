from fastapi.routing import APIRouter
from api_dependencies import validate_access_token, Atk
from api_dependencies import NoContentResponse
from api_schemas.project import Project, ModifyProjectRequest
from api_schemas.project import CreateProjectRequest
import exceptions as exc


router = APIRouter(prefix='/projects')


@router.get('/')
def get_projects(access_token: str | None = Atk()) -> list[Project]:
    """returns all projects of the user who sent the request."""
    user = validate_access_token(access_token)
    return Project.find_all(user.username)


@router.post('/')
def create_project(
        request: CreateProjectRequest,
        access_token: str | None = Atk()) -> str:
    """creates a new project.
    Returns the key of the created project.
    """
    user = validate_access_token(access_token)
    project = Project.create(user.username, request.label, request.description)
    project.insert()
    return project.key


@router.post('/{project_key}')
def modify_project(project_key: str, request: ModifyProjectRequest,
                   access_token: str | None = Atk()):
    """modifies a project."""
    user = validate_access_token(access_token)
    project = Project.find_one(project_key)
    if project.user != user.username:
        raise exc.ForeignProjectError

    project.modify(request)
    return NoContentResponse()


@router.get('/{project_key}/archive')
def archive_project(project_key: str, access_token: str | None = Atk()):
    """archives a project."""
    user = validate_access_token(access_token)
    project = Project.find_one(project_key)
    if project.user != user.username:
        raise exc.ForeignProjectError

    project.archive()
    return NoContentResponse()


@router.get('/{project_key}/restore')
def restore_project(project_key: str, access_token: str | None = Atk()):
    """restores a project."""
    user = validate_access_token(access_token)
    project = Project.find_one(project_key)
    if project.user != user.username:
        raise exc.ForeignProjectError

    project.restore()
    return NoContentResponse()
