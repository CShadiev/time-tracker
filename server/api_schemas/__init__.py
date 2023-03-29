from pydantic import BaseModel


class SignRequest(BaseModel):
    username: str
    password: str
