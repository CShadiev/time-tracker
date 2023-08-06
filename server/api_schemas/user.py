from pydantic import BaseModel, Field, validator
from mysql_server import database
from mysql_server.schemas import DBUser
from sqlalchemy import select, delete
from passlib.hash import bcrypt_sha256
from config import config
from jose import jwt
import datetime as dt
import exceptions as exc
from validators import username_validator
from validators import password_validator
from logging import getLogger


UsernameField = Field(description=username_validator.__doc__ or "")
PasswordField = Field(description=password_validator.__doc__ or "")
logger = getLogger("user")


class SignRequest(BaseModel):
    """Request body for signing up a new user and signing in."""

    username: str = UsernameField
    password: str = PasswordField

    @validator("username")
    def validate_username(cls, value):
        return username_validator(value)

    @validator("password")
    def validate_password(cls, value):
        return password_validator(value)


class User(BaseModel):
    username: str = UsernameField
    password_hash: str = PasswordField

    @validator("username")
    def validate_username(cls, value):
        return username_validator(value)

    @classmethod
    def exists(cls, username: str) -> bool:
        """Checks whether a user with given username
        already exists in the database.
        """
        username = username.lower()
        with database.create_session() as session:
            qry = select(DBUser).where(DBUser.username == username)
            user = session.scalar(qry)

        return user is not None

    @classmethod
    def create(cls, username: str, password: str) -> "User":
        """Creates a new user and returns User object."""
        # check if user already exists
        password_validator(password)

        if cls.exists(username):
            raise exc.UserExistsError(username)

        user = cls(username=username,
                   password_hash=bcrypt_sha256.hash(password))
        return user

    @classmethod
    def get_by_username(cls, username: str) -> "User":
        """Get user by username."""
        username = username.lower()
        logger.info(f"Getting user {username} from database.")
        with database.create_session() as session:
            qry = select(DBUser).where(DBUser.username == username)
            user = session.scalar(qry)

        if user is None:
            logger.error(f"User {username} not found.")
            raise exc.UserNotFoundError

        return cls(username=user.username, password_hash=user.password_hash)

    @classmethod
    def get_by_token(cls, token: str) -> "User":
        """Returns User object from data decoded from JWT token.

        If valid_till < now, it will raise HTTPException.
        """

        logger.info("Getting user from token.")
        data = jwt.decode(token, config.SECRET_KEY, config.JWT_ENCR_ALGORITHM)
        now = dt.datetime.now(tz=config.TIMEZONE)
        valid_till = dt.datetime.fromisoformat(data["valid_till_ISO"])

        if now > valid_till:
            logger.error("Token expired.")
            logger.debug(f"Token valid till: {valid_till.isoformat()}"
                         f" now: {now.isoformat()}")
            raise exc.TokenExpiredError

        return cls(**data)

    def sign_up(self):
        """Add user to the database."""
        with database.create_session() as session:
            user = DBUser()
            user.username = self.username
            user.password_hash = self.password_hash

            session.add(user)
            session.commit()

    def verify_password(self, password: str) -> bool:
        return bcrypt_sha256.verify(password, self.password_hash)

    def generate_access_token(self, expire_in: dt.timedelta = config.TOKEN_TIMEOUT_TD) -> str:
        expire_ts = dt.datetime.now(tz=config.TIMEZONE) + expire_in
        data = self.dict()
        data["valid_till_ISO"] = expire_ts.isoformat()
        return jwt.encode(data, config.SECRET_KEY, config.JWT_ENCR_ALGORITHM)

    def remove(self):
        """Remove user from the database."""
        with database.create_session() as session:
            qry = delete(DBUser).where(DBUser.username == self.username)
            session.execute(qry)
            session.commit()
