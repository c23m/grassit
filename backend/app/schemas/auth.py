from pydantic import EmailStr, Field, SecretStr

from app.schemas import BaseSchema


class TokenResponse(BaseSchema):
    token: str


class RegisterRequest(BaseSchema):
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z-_]+$")
    nickname: str = Field(min_length=1)
    password: SecretStr = Field(min_length=6)
    email: EmailStr | None = None


class LoginRequest(BaseSchema):
    username: str
    password: SecretStr
