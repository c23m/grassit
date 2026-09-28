from fastapi import FastAPI

import os
from pathlib import Path

from app.routers import article, auth, test, user
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(test.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(article.router)

PUBLIC_DIR = Path(os.getenv("PUBLIC_DIR", "./public"))
if not PUBLIC_DIR.is_absolute():
    # 相对路径以 backend/ 为准，避免因启动目录不同而报「目录不存在」
    PUBLIC_DIR = Path(__file__).resolve().parent.parent / PUBLIC_DIR
app.mount("/public", StaticFiles(directory=PUBLIC_DIR), name="public")
