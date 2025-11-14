from maxbot.middleware import BaseMiddleware
from database.models.user import UserModel

class UserMiddleware(BaseMiddleware):
    def __init__(self, redis_client):
        super().__init__()  # обязательно вызвать конструктор родителя
        self.redis = redis_client

    async def __call__(self, handler, ctx):
        session = ctx.session
        user_id = ctx.user.user_id
        redis_key = f"user:{user_id}"

        user_data = await self.redis.hgetall(redis_key)

        if not user_data:
            # Получаем пользователя из базы
            user = await session.scalar(
                UserModel.__table__.select().where(UserModel.user_id == user_id)
            )

            if not user:
                user = UserModel(
                    user_id=user_id,
                    username=ctx.user.name
                )
                session.add(user)
                await session.commit()

            # Сохраняем в Redis
            await self.redis.hset(
                redis_key,
                mapping={
                    "user_id": str(user.user_id),
                    "username": user.username or "",
                }
            )

        # Счётчик вызовов
        await self.redis.incr(f"user:{user_id}:calls")

        return await handler(ctx)
