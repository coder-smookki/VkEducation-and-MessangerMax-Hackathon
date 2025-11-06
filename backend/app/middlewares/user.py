from maxbot.middleware import BaseMiddleware
from database.models.user import User
from database.session import AsyncSessionLocal

class UserMiddleware(BaseMiddleware):
    async def __call__(self, handler, ctx):
        async with AsyncSessionLocal() as session:
            user = await session.scalar(
                User.__table__.select().where(User.user_id == ctx.user.user_id)
            )
            if not user:
                user = User(
                    user_id=ctx.user.user_id,
                    username=ctx.user.name
                )
                session.add(user)
                await session.commit()

        return await handler(ctx)
