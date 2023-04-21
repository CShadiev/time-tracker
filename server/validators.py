import re


def username_validator(username: str) -> str:
    """
    Username must:
        - start with a letter
        - be at least 3 characters long
        - be at most 32 characters long
        - contain only alphanumeric characters
        - have no spaces

    It will also be converted to lowercase.
    """
    assert username[0].isalpha(), 'Username must start with a letter'
    assert len(username) >= 3, 'Username must be at least 3 characters long'
    assert len(username) <= 32, 'Username must be at most 32 characters long'
    assert username.isalnum(), 'Username must contain only letters and numbers'
    assert ' ' not in username, 'Username must not contain spaces'

    return username.lower()


def password_validator(password: str) -> str:
    """
    Password must:
        - be at least 8 characters long
        - be at most 32 characters long
        - contain only alphanumeric characters and the following
          special characters: + - * ^ $ . ? ! _ (space)
    """
    assert len(password) >= 8, 'Password must be at least 8 characters long'
    assert len(password) <= 32, 'Password must be at most 32 characters long'

    allowed_chars = re.compile(r'[a-zA-Z0-9\+\-\*\^\$\.\?\!_ ]+')
    errmsg = 'Password contains invalid characters'
    assert re.fullmatch(
        allowed_chars, password) is not None, errmsg

    return password
