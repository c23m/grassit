from datetime import datetime
from typing import Literal

from app.schemas import BaseSchema


class Test(BaseSchema):
    time: datetime
    version: str
    message: str | None = None
    db_status: Literal["OK", "Not Ready"] = "Not Ready"
