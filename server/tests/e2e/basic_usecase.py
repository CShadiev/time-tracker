from api_schemas.user import User
from api_schemas.project import Project, ModifyProjectRequest
from api_schemas.task import Task


def clean_up():
    user = User.get_by_username('PhilipGlass')
    projects = Project.find_all(user.username)
    tasks = Task.find_all(user.username)
    for task in tasks:
        if task.level == 'subtask':
            Task.remove(task.key)

    for task in tasks:
        if task.level == 'task':
            Task.remove(task.key)

    for project in projects:
        project.remove()

    user.remove()


def scenario_1():
    """
    Create project, rename label, add two tasks and one subtask.
    """
    user = User.create('PhilipGlass', 'MadRushByPhilipGlass')
    user.sign_up()
    project = Project.create(user.username, 'My first project',
                             'This is my first project')
    project.insert()
    modify_request = ModifyProjectRequest(
        label='My best project')
    project = Project.find(project.key)
    project.modify(modify_request)
    project = Project.find_all(user.username)[0]
    assert project.label == 'My best project'
    task1 = Task.create(user.username, 'My first task', project.key,
                        expected_time=100 * 60)
    task1.insert()
    task2 = Task.create(user.username, 'My second task', project.key,
                        expected_time=200 * 60)
    task2.insert()
    subtask = Task.create(user.username, 'My first subtask', project.key,
                          expected_time=50 * 60, parent_id=task1.key)
    subtask.insert()
    tasks = Task.find_all(user.username)
    assert len(tasks) == 3
    print(tasks)
