from api_schemas.user import User
from api_schemas.project import Project
from api_schemas.task import Task


def clean_up():
    user = User.get_by_username('PhilipGlass')
    projects = Project.find_all(user.username)
    tasks = Task.find_all(user.username)
    for task in tasks:
        if task.level == 'subtask':
            task.remove()

    for task in tasks:
        if task.level == 'task':
            task.remove()

    for project in projects:
        project.remove()

    user.remove()
