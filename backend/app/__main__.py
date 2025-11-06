import asyncio
from maxbot import Bot, Dispatcher

from .middlewares.user import UserMiddleware
from .handlers.start import create_commands_router
from .callbacks.start import create_callbacks_router
from .config import get_settings

async def main():
    settings = get_settings()
    async with Bot(token=settings.bot_settings.token) as bot:
        dp = Dispatcher(bot)

        # Middleware — регистрация пользователей в БД
        dp.include_middleware(UserMiddleware())

        # Роутеры
        dp.include_router(create_commands_router())
        dp.include_router(create_callbacks_router())


        # Запуск бота
        await bot.polling(dispatcher=dp)

if __name__ == "__main__":
    asyncio.run(main())