from maxbot.max_types import InlineKeyboardMarkup, InlineKeyboardButton

def main_menu_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="ℹ️ Справка", payload="help")]
        ]
    )

def help_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Вернуться в меню", payload="menu")]
        ]
    )