import os

from pydantic import BaseModel


class DBSettings(BaseModel):
    url: str


def get_db_settings() -> DBSettings:
    return DBSettings(
        url=os.getenv("DATABASE_URL")
    )