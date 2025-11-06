from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from database.models import User
from database.exceptions import NotFoundException


class UserRepo:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def set(self, user_id: int, username: str | None = None) -> None:
        """
        Создать или обновить пользователя.
        """
        user = await self.session.scalar(select(User).where(User.user_id == user_id))
        if user:
            # Обновляем username, если он передан
            if username is not None:
                user.username = username
        else:
            user = User(
                user_id=user_id,
                username=username
            )
            self.session.add(user)

        await self.session.commit()

    async def get(self, user_id: int) -> User:
        """
        Получить пользователя по user_id.
        """
        user = await self.session.scalar(select(User).where(User.user_id == user_id))
        if user is None:
            raise NotFoundException(f"User with id {user_id} not found")
        return user

    async def update_username(self, user_id: int, new_username: str) -> None:
        """
        Обновить username пользователя.
        """
        result = await self.session.execute(
            update(User)
            .where(User.user_id == user_id)
            .values(username=new_username)
        )
        if result.rowcount == 0:
            raise NotFoundException(f"User with id {user_id} not found")
        await self.session.commit()

    async def get_all(self) -> list[User]:
        """
        Получить всех пользователей.
        """
        result = await self.session.scalars(select(User))
        return list(result)
