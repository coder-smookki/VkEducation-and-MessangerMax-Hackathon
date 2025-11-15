from typing import Optional

from sqlalchemy import delete, select

from bot.core.models.user import User
from bot.core.repositories.user import UserRepo
from database.models.user import UserModel
from database.repositories.base import BaseAlchemyRepo


class UserAlchemyRepo(UserRepo, BaseAlchemyRepo):

    async def create(self, instance: User) -> User:
        """
        Создание пользователя в базе данных.
        """

        user = UserModel(
            user_id=instance.user_id,
            username=instance.username,
        )

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)

        return self._to_domain_model(user)

    async def delete(self, user_id: int) -> None:
        """
        Удаление пользователя по user_id.
        """

        query = delete(UserModel).where(UserModel.user_id == user_id)
        await self.session.execute(query)
        await self.session.commit()

    async def get(self, user_id: int) -> Optional[User]:
        """
        Получение пользователя по user_id.
        """

        query = select(UserModel).where(UserModel.user_id == user_id)
        model = await self.session.scalar(query)

        if model is None:
            return None

        return self._to_domain_model(model)

    async def update(self, instance: User) -> User:
        """
        Обновление данных пользователя.
        """

        query = select(UserModel).where(UserModel.user_id == instance.user_id)
        current_model = await self.session.scalar(query)

        if current_model is None:
            raise ValueError(f"User with user_id {instance.user_id} not found")

        # Обновляем поля
        update_data = instance.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(current_model, key, value)

        await self.session.commit()
        await self.session.refresh(current_model)

        return self._to_domain_model(current_model)

    async def get_by_username(self, username: str) -> Optional[User]:
        """
        Получение пользователя по username.
        """

        query = select(UserModel).where(UserModel.username == username)
        model = await self.session.scalar(query)

        if model is None:
            return None

        return self._to_domain_model(model)

    def _to_domain_model(self, model: UserModel) -> User:
        """
        Преобразование модели БД в доменную модель.
        """

        return User(
            id=model.id,
            user_id=model.user_id,
            username=model.username,
        )
