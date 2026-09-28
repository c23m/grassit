from datetime import date, datetime, time
from typing import Annotated

from pydantic import ConfigDict, EmailStr, field_validator, Field, SecretStr

from app.schemas import BaseSchema


class UserBase(BaseSchema):
    username: str
    nickname: str
    avatar: str | None = None
    created_at: date
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "username": "admin",
                    "nickname": "Administrator",
                    "avatar": None,
                    "createdAt": "2026-9-17",
                }
            ]
        },
    )

    @field_validator("created_at", mode="before")
    @classmethod
    def _truncate_to_date(cls, value):
        if isinstance(value, datetime):
            return value.date()
        return value


class UserMe(UserBase):
    email: EmailStr | None = None
    github: str | None = None
    model_config = ConfigDict(
        validate_by_name=True,
    )
