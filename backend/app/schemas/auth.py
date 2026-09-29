from pydantic import EmailStr, Field, SecretStr

from app.schemas import BaseSchema
from app.schemas.user import UserMe


class TokenResponse(BaseSchema):
    token: str


class LoginResponse(BaseSchema):
    """登录响应：token 之外带上用户信息，前端登录后不必再拉一次 /users/me"""

    token: str
    user: UserMe


class RegisterRequest(BaseSchema):
    username: str = Field(
        min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_-]*$"
    )
    nickname: str = Field(min_length=1, max_length=30)
    password: SecretStr = Field(min_length=6, max_length=128)
    email: EmailStr | None = None


class LoginRequest(BaseSchema):
    username: str
    password: SecretStr = Field(max_length=128)
