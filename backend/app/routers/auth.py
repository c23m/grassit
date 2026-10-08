from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Header, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app import security
from app.database import Database
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, TokenResponse
from app.schemas.user import UserMe

router = APIRouter(prefix="/auth", tags=["auth"])

# 前端统一经 `/api` 前缀访问（开发由 Vite 代理、生产由 Nginx 反代，都会剥掉 `/api` 再转给后端），
# 所以 cookie 的 path 必须写浏览器实际看到的那条路径：写 `/auth` 的话浏览器匹配不上 `/api/auth/...`，
# 请求里根本不会带这个 cookie，刷新必然 401
REFRESH_COOKIE_PATH = "/api/auth"


async def get_current_user(
    db: Database,
    authorization: Annotated[str | None, Header()] = None,
) -> UserMe:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
    token = authorization[7:]
    user_id = security.decode_token(token, "access")
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
    return UserMe.model_validate(user)


UserFromToken = Annotated[UserMe, Depends(get_current_user)]


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(response: Response, body: LoginRequest, db: Database) -> LoginResponse:
    user = await db.scalar(select(User).where(User.username == body.username))
    if user is None or not security.verify_password(
        body.password.get_secret_value(), user.password_hash
    ):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong username or password")
    response.set_cookie(
        key="refreshToken",
        value=security.create_token(user.id, "refresh"),
        httponly=True,
        samesite="strict",
        max_age=30 * 24 * 3600,
        path=REFRESH_COOKIE_PATH,
    )
    token = security.create_token(user.id, "access")
    return LoginResponse(token=token, user=UserMe.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    response.delete_cookie("refreshToken", path=REFRESH_COOKIE_PATH)
    return None


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: Database) -> UserMe:
    if await db.scalar(select(User).where(User.username == body.username)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Username already exists")
    if body.email and await db.scalar(select(User).where(User.email == body.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already exists")
    obj = User(
        username=body.username,
        nickname=body.nickname,
        password_hash=security.hash_password(body.password.get_secret_value()),
        email=body.email,
    )
    try:
        db.add(obj)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Username or email already exists"
        )
    return UserMe.model_validate(obj)


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh(
    response: Response,
    refresh_token: Annotated[str | None, Cookie(alias="refreshToken")] = None,
) -> TokenResponse:
    if refresh_token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    try:
        user_id = security.decode_token(refresh_token, "refresh")
    except HTTPException:
        response.delete_cookie("refreshToken", path=REFRESH_COOKIE_PATH)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    token = security.create_token(user_id, "access")
    return TokenResponse(token=token)
