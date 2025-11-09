import os

from pydantic import BaseModel

class BotSettings(BaseModel):
    token: str

class RedisSettings(BaseModel):
    host: str
    port: int

class Settings(BaseModel):
    bot_settings: BotSettings
    redis_settings: RedisSettings

def get_settings() -> Settings:
    return Settings(
        bot_settings=BotSettings(
            token=os.environ["TG_BOT_TOKEN"]
        ),
        redis_settings=RedisSettings(
            host=os.environ["REDIS_HOST"],
            port=os.environ["REDIS_PORT"]
        )
    )