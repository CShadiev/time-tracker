from pydantic import BaseModel
from mysql_server import database
from mysql_server.schemas import DBUser
from sqlalchemy import select
from passlib.hash import bcrypt_sha256
from uuid import uuid4
import config
from jose import jwt
import datetime as dt
from fastapi import HTTPException


class User(BaseModel):
    id: str
    username: str
    password_hash: str

    def sign_up(self):
        """Add user to the database."""
        with database.create_session() as session:
            user = DBUser()
            user.id = self.id
            user.username = self.username
            user.password_hash = self.password_hash

            session.add(user)
            session.commit()

    def verify_password(self, password: str) -> bool:
        return bcrypt_sha256.verify(password, self.password_hash)

    def generate_access_token(
            self, expire_in: dt.timedelta = config.TOKEN_TIMEOUT_TD) -> str:

        expire_ts = dt.datetime.now(tz=config.TIMEZONE) + expire_in
        data = self.dict()
        data['valid_till'] = expire_ts
        return jwt.encode(data, config.SECRET_KEY, config.JWT_ENCR_ALGORITHM)


def create_user(username: str, password: str) -> User:
    user = User(
        id=str(uuid4()),
        username=username,
        password_hash=bcrypt_sha256.hash(password))
    return user


def get_user_by_username(username: str) -> User | None:
    """finds username in the database and returns User object.

    if user not found, returns None.
    """
    with database.create_session() as session:
        qry = select(DBUser).where(DBUser.username == username)
        user = session.scalar(qry)

        if user:
            return User.parse_obj(user.__dict__)
    return None


def get_user_by_token(token: str) -> User:
    """Returns User object from data decoded from JWT token.

    If valid_till < now, it will raise HTTPException.
    """

    data = jwt.decode(token, config.SECRET_KEY, config.JWT_ENCR_ALGORITHM)
    if dt.datetime.now(tz=config.TIMEZONE) > data['valid_till']:
        raise HTTPException(400, 'JWT token expired.')

    return User(**data)


def user_exists(username: str) -> bool:
    """Checks whether a user with given username
    already exists in the database.
    """
    with database.create_session() as session:
        qry = select(DBUser).where(DBUser.username == username)
        user = session.scalar(qry)

    return user is not None
