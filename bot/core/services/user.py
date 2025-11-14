from bot.core.models.user import User
from bot.core.repositories.user import UserRepo


class UserService:
    def __init__(self, user_repo: UserRepo) -> None:
        self.user_repo = user_repo

    async def get(self, user_id: int) -> User | None:
        return await self.user_repo.get(user_id)

    async def create(self, instance: User) -> User:
        return await self.user_repo.create(instance)

    async def update(self, instance: User) -> User:
        """
        Обновляем пользователя.
        Ключ (user_id) берётся из instance.user_id.
        """
        return await self.user_repo.update(instance)
