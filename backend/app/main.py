from fastapi import FastAPI

import os

from app.routers import article, auth, test, user
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(test.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(article.router)

PUBLIC_DIR = os.getenv("PUBLIC_DIR", "./public")
app.mount("/public", StaticFiles(directory=PUBLIC_DIR), name="public")
