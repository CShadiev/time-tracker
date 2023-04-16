from fastapi import HTTPException


class InputValidationError(HTTPException):
    def __init__(self, message: str):
        super().__init__(status_code=400, detail=message)


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
