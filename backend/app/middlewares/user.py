from maxbot.middleware import BaseMiddleware
from database.models.user import User
from database.session import AsyncSessionLocal
from ..utils.redis_client import redis

class UserMiddleware(BaseMiddleware):
    async def __call__(self, handler, ctx):

        user_id = ctx.user.user_id
        redis_key = f"user:{user_id}"

        # Проверяем кэш Redis
        user_data = await redis.hgetall(redis_key)

        if not user_data:
            # Если нет — идем в БД
            async with AsyncSessionLocal() as session:
                user = await session.scalar(
                    User.__table__.select().where(User.user_id == user_id)
                )
                if not user:
                    user = User(
                        user_id=user_id,
                        username=ctx.user.name
                    )
                    session.add(user)
                    await session.commit()

                # Кладем в Redis хэш
                await redis.hset(
                    redis_key,
                    mapping={
                        "user_id": str(user.user_id),
                        "username": user.username or ""
                    }
                )
        else:
            # Если есть в кэше, можно использовать user_data
            pass

        # Отслеживание вызовов
        await redis.incr(f"user:{user_id}:calls")

        return await handler(ctx)
