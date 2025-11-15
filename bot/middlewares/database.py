from maxbot.middleware import BaseMiddleware
import database.session as db_session

class DatabaseMiddleware(BaseMiddleware):
    """
    Middleware для передачи сессии SQLAlchemy в ctx.
    """
    async def __call__(self, handler, ctx):
        if db_session.SessionFactory is None:
            raise RuntimeError(
                "SessionFactory не инициализирован. Call database_init() before running the bot."
            )

        async with db_session.SessionFactory() as session:
            ctx.session = session  # передаём сессию в ctx
            return await handler(ctx)
