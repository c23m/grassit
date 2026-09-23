from datetime import date, datetime, time
from typing import Annotated

from fastapi import APIRouter, Query

from app.schemas.article import *

router = APIRouter(prefix="/articles", tags=["article"])

SAMPLE_LIST_ITEM = {
    "slug": "my-article",
    "author": {"username": "admin", "nickname": "管理员"},
    "title": "请输入文本",
    "createdAt": "2026-09-01 10:00:00",
    "updatedAt": "2026-09-02 14:30:00",
    "tags": ["game", "ue5"],
}

SAMPLE_DETAIL = {
    "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
    "slug": "my-article",
    "author": {"username": "admin", "nickname": "管理员"},
    "title": "标题内容",
    "createdAt": "2026-09-01 10:00:00",
    "updatedAt": "2026-09-02 14:30:00",
    "content": "# 一级标题\n\n正文内容...\n\n## 二级标题...",
    "tags": ["test", "grassit", "gst"],
}


@router.get("")
def list_articles(
    filter_paras: Annotated[ArticleFilterParams, Query()],
) -> list[ArticleInfo]:
    return [ArticleInfo.model_validate(SAMPLE_LIST_ITEM)]


@router.get("/{identifier}")
def get_article(identifier: str) -> Article:
    return Article.model_validate(SAMPLE_DETAIL)


@router.post("", status_code=201)
def create_article(info: ArticleCreated):
    uuid = info.slug
    return None


@router.delete("/{identifier}", status_code=204)
def delete_article(identifier: str):
    return None
