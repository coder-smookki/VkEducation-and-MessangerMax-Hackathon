import os
from pydantic import BaseModel


class BotSettings(BaseModel):
    token: str


class RedisSettings(BaseModel):
    host: str
    port: int


class DatabaseSettings(BaseModel):
    user: str
    password: str
    host: str
    host_port: int
    db: str


class Settings(BaseModel):
    bot_settings: BotSettings
    redis_settings: RedisSettings
    db: DatabaseSettings


def get_settings() -> Settings:
    return Settings(
        bot_settings=BotSettings(
            token=os.environ["BOT_TOKEN"]
        ),
        redis_settings=RedisSettings(
            host=os.environ["REDIS_HOST"],
            port=int(os.environ["REDIS_PORT"])
        ),
        db=DatabaseSettings(
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            host=os.environ["DB_HOST"],
            host_port=int(os.environ["DB_PORT"]),
            db=os.environ["DB_NAME"]
        )
    )
