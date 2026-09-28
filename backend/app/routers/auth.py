from datetime import date
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Header, HTTPException, Response, status
from fastapi.security import OAuth2AuthorizationCodeBearer

from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserMe

router = APIRouter(prefix="/auth", tags=["auth"])


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
) -> UserMe:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
    token = authorization[7:]
    if token == "invalid-token":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
    return UserMe(
        username="ming",
        nickname="小明",
        created_at=date(2026, 9, 1),
        avatar="/avatar/1a1a1a1a1a1a.jpeg",
        email="gst@example.com",
    )


UserMeDepend = Annotated[UserMe, Depends(get_current_user)]


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(response: Response, user: LoginRequest) -> TokenResponse:
    if user.password.get_secret_value() != user.username + "pwd":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong username or password")
    response.set_cookie(
        key="refreshToken",
        value="fake-refresh-token",
        httponly=True,
        samesite="strict",
        max_age=30 * 24 * 3600,
        path="/auth",
    )
    return TokenResponse(token="fake-token")


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    response.delete_cookie("refreshToken", path="/auth")
    return None


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: RegisterRequest) -> UserMe:
    return UserMe(
        username=user.username, nickname=user.nickname, created_at=date.today()
    )


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh(
    refresh_token: Annotated[str, Cookie(alias="refreshToken")], response: Response
) -> TokenResponse:
    if refresh_token == "out-of-date":
        response.delete_cookie("refreshToken", path="/auth")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    return TokenResponse(token="another-fake-token")
