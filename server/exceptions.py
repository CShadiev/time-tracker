from fastapi import HTTPException


class DBObjectNotFoundError(HTTPException):
    pass


class PermissionDeniedError(HTTPException):
    def __init__(self, detail: str | None = None):
        if detail is not None:
            _detail = f': {detail}'
        else:
            _detail = ''
        super().__init__(
            status_code=403, detail=_detail)


class UserExistsError(HTTPException):
    def __init__(self, username: str):
        super().__init__(
            status_code=400, detail=f'Username {username} taken')


class TokenExpiredError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401, detail='Access token expired')


class MissingTokenError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401, detail='Missing access token')


class UserNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404, detail='User not found')


class IncorrectPasswordError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401, detail='Incorrect password')


class ProjectNotFoundError(DBObjectNotFoundError):
    def __init__(self, key: str):
        super().__init__(
            status_code=404, detail=f'Project {key} not found')


class ForeignProjectError(PermissionDeniedError):
    def __init__(self):
        super().__init__(detail='Project not owned by user')


class TaskNotFoundError(DBObjectNotFoundError):
    def __init__(self, key: str):
        super().__init__(
            status_code=404, detail=f'Task {key} not found')


class ForeignTaskError(PermissionDeniedError):
    def __init__(self):
        super().__init__(detail='Task not owned by user')
