from maxbot import Router, F, Context
from ..keyboards.menus import main_menu_keyboard

def create_commands_router():
    router = Router()

    @router.message_handler(F.command == "start")
    async def start_handler(ctx: Context):
        # Пользователь уже зарегистрирован через UserMiddleware
        await ctx.reply(
            "👋 Привет! Добро пожаловать в бота.\nВыберите действие:",
            reply_markup=main_menu_keyboard()
        )

    return router