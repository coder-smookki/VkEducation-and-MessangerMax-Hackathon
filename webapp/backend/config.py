import os
from typing import Optional

class Settings:
    BOT_TOKEN: Optional[str] = os.getenv("BOT_TOKEN")
    
    def validate(self):
        if not self.BOT_TOKEN:
            raise ValueError("BOT_TOKEN environment variable is not set")

def get_settings() -> Settings:
    settings = Settings()
    settings.validate()
    return settings