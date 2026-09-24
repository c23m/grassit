import datetime
from typing import Literal

import jwt
from fastapi import HTTPException, status
from pwdlib import PasswordHash

from app.config import settings

_password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return _password_hasher.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return _password_hasher.verify(password, hashed)


def create_token(user_id: int, token_type: Literal["access", "refresh"]) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    if token_type == "access":
        valid_time = datetime.timedelta(minutes=settings.access_token_expire_minutes)
    else:
        valid_time = datetime.timedelta(days=settings.refresh_token_expire_days)
    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": now + valid_time,
            "type": token_type,
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return token


def decode_token(token: str, token_type: Literal["access", "refresh"]) -> int:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            settings.jwt_algorithm,
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid token",
        )
    user_id = payload.get("sub")
    if user_id is None or token_type != payload["type"]:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid token",
        )
    return int(user_id)
