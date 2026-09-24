from fastapi import APIRouter

from app.routers.auth import UserFromToken
from app.schemas.user import UserMe

router = APIRouter(prefix="/users", tags=["user"])


@router.get("/me", status_code=200)
async def me(user_me: UserFromToken) -> UserMe:
    return user_me


@router.get("/{username}", status_code=200)
def get_user(username: str):
    # 临时：不管谁，都返回样例
    return {
        "nickname": "ming",
        "createdAt": "2026-09-01",
        "avatar": "/avatar/1a1a1a1a1a1a.jpeg",
    }


@router.delete("/{username}", status_code=204)
def delete_user(username: str):
    return None
