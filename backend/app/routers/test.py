from datetime import datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy import text

from app.database import Database
from app.schemas.test import Test

router = APIRouter(prefix="/test", tags=["test"])


@router.get("")
async def return_test_info(db: Database) -> Test:
    db_status: Literal["OK", "Not Ready"] = "Not Ready"
    result = await db.execute(text("SELECT 1"))
    if result.scalar_one():
        db_status = "OK"
    return Test(time=datetime.now(), version="0.1.0.1", db_status=db_status)
