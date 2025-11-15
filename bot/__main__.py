import asyncio
import redis.asyncio as redis_async
from maxbot import Bot, Dispatcher
from maxbot.middleware import LoggingMiddleware, ThrottlingMiddleware

from bot.middlewares.user import UserMiddleware
from bot.middlewares.database import DatabaseMiddleware
from bot.handlers.start import create_commands_router
from bot.callbacks.start import create_callbacks_router
from bot.config import get_settings
import database.session as db_session

async def main():
    settings = get_settings()

    await db_session.database_init(settings.db)

    if db_session.SessionFactory is None:
        raise RuntimeError("SessionFactory не инициализирован. database_init() не прошёл.")

    redis_client = redis_async.Redis(
        host=settings.redis_settings.host,
        port=settings.redis_settings.port,
        decode_responses=True
    )

    async with Bot(token=settings.bot_settings.token) as bot:
        dp = Dispatcher(bot)

        dp.include_middleware(DatabaseMiddleware())
        dp.include_middleware(UserMiddleware(redis_client=redis_client))
        dp.include_middleware(LoggingMiddleware())
        dp.include_middleware(ThrottlingMiddleware(rate_limit=1.0))

        dp.include_router(create_commands_router())
        dp.include_router(create_callbacks_router())

        await bot.polling(dispatcher=dp)


if __name__ == "__main__":
    asyncio.run(main())
