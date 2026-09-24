from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import article, auth, test, user

app = FastAPI()

app.include_router(test.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(article.router)

PUBLIC_DIR = Path(settings.public_dir)
if not PUBLIC_DIR.is_absolute():
    # 相对路径以 backend/ 为准，避免因启动目录不同而报「目录不存在」
    PUBLIC_DIR = Path(__file__).resolve().parent.parent / PUBLIC_DIR
app.mount("/public", StaticFiles(directory=PUBLIC_DIR), name="public")
