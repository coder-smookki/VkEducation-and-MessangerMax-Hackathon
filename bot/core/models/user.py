from pydantic import Field
from bot.core.models.base import BaseCoreModel


class User(BaseCoreModel):
    id: int | None = Field(default=None)     # PK, может отсутствовать при создании
    user_id: int                              # обязательное поле
    username: str | None = Field(default=None, max_length=255)
