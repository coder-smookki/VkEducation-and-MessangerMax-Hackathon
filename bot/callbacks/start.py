from maxbot import Router, F, Context
from ..keyboards.menus import help_keyboard, main_menu_keyboard

def create_callbacks_router():
    router = Router()

    @router.callback_query_handler(F.payload == "help")
    async def show_help(ctx: Context):
        await ctx.answer_callback("ℹ️ Открываю справку...")

        # Удаляем старое сообщение с кнопкой
        if ctx.message_id:
            await ctx.delete_message(message_id=ctx.message_id)

        # Отправляем новое сообщение с кнопкой "Вернуться в меню"
        await ctx.reply(
            "📘 Это раздел справки.\n\nЗдесь могла бы быть ваша информация.",
            reply_markup=help_keyboard()
        )

    @router.callback_query_handler(F.payload == "menu")
    async def back_to_menu(ctx: Context):
        await ctx.answer_callback("↩️ Возвращаюсь в меню...")

        # Удаляем старое сообщение с кнопкой
        if ctx.message_id:
            await ctx.delete_message(message_id=ctx.message_id)

        # Отправляем новое сообщение с главным меню
        await ctx.reply(
            "👋 Главное меню. Выберите действие:",
            reply_markup=main_menu_keyboard()
        )

    return router
