import asyncio
import redis.asyncio as redis_async
from maxbot import Bot, Dispatcher
from maxbot.middleware import LoggingMiddleware, ThrottlingMiddleware

from bot.middlewares.user import UserMiddleware
from bot.middlewares.database import DatabaseMiddleware
from bot.handlers.start import create_commands_router
from bot.callbacks.start import create_callbacks_router
from bot.config import get_settings
import database.session as db_session  # важно импортировать модуль целиком

async def main():
    # ---------------------------
    # Настройки
    # ---------------------------
    settings = get_settings()

    # ---------------------------
    # Инициализация базы данных
    # ---------------------------
    await db_session.database_init(settings.db)

    if db_session.SessionFactory is None:
        raise RuntimeError("SessionFactory не инициализирован. database_init() не прошёл.")

    # ---------------------------
    # Инициализация Redis
    # ---------------------------
    redis_client = redis_async.Redis(
        host=settings.redis_settings.host,
        port=settings.redis_settings.port,
        decode_responses=True
    )

    # ---------------------------
    # Создаём бот
    # ---------------------------
    async with Bot(token=settings.bot_settings.token) as bot:
        dp = Dispatcher(bot)

        # ---------------------------
        # Регистрируем middleware
        # Порядок важен: Database -> User -> Logging -> Throttling
        # ---------------------------
        dp.include_middleware(DatabaseMiddleware())
        dp.include_middleware(UserMiddleware(redis_client=redis_client))
        dp.include_middleware(LoggingMiddleware())
        dp.include_middleware(ThrottlingMiddleware(rate_limit=1.0))

        # ---------------------------
        # Роутеры
        # ---------------------------
        dp.include_router(create_commands_router())
        dp.include_router(create_callbacks_router())

        # ---------------------------
        # Запуск polling
        # ---------------------------
        await bot.polling(dispatcher=dp)


if __name__ == "__main__":
    asyncio.run(main())
