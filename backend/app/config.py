import os

from pydantic import BaseModel

class BotSettings(BaseModel):
    token: str

class Settings(BaseModel):
    bot_settings: BotSettings

def get_settings() -> Settings:
    return Settings(
        bot_settings=BotSettings(
            token=os.environ["TG_BOT_TOKEN"]
        ))