from datetime import date, datetime
from typing import Annotated
from uuid import UUID

from pydantic import Field

from app.schemas import BaseSchema
from app.schemas.user import UserBase


class ArticleInfo(BaseSchema):
    slug: str
    title: str
    author: UserBase
    createdAt: datetime
    updatedAt: datetime
    tags: list[str] = []


class Article(ArticleInfo):
    uuid: UUID
    content: str


class ArticleCreated(BaseSchema):
    slug: str
    title: str
    author: str
    content: str
    tags: list[str] = []


class ArticleFilterParams(BaseSchema):
    author: str | None = Field(
        default=None,
        description="author's username",
        pattern=r"^[a-zA-Z_-]+$",
        max_length=50,
    )
    title: str | None = Field(default=None, max_length=50)
    slug: str | None = Field(
        default=None, description="Not uuid", pattern=r"^[a-z0-9-]+$", max_length=50
    )
    start: date | None = Field(
        default=None,
        title="Created time from",
        description="default is not limited",
    )
    end: date | None = Field(
        default=None,
        title="Created time to",
        description="default is now",
    )
    tags: list[str] = []
