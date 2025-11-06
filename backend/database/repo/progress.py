from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from database.models import Progress
from database.exceptions import NotFoundException


class ProgressRepo:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def set(self, user_id: int, person: str | None = None) -> None:
        """
        Создать или обновить прогресс пользователя.
        """
        progress = await self.session.scalar(select(Progress).where(Progress.user_id == user_id))
        if progress:
            # Обновляем person, если передан
            if person is not None:
                progress.person = person
        else:
            progress = Progress(
                user_id=user_id,
                person=person
            )
            self.session.add(progress)

        await self.session.commit()

    async def get(self, user_id: int) -> Progress:
        """
        Получить прогресс по user_id.
        """
        progress = await self.session.scalar(select(Progress).where(Progress.user_id == user_id))
        if progress is None:
            raise NotFoundException(f"Progress for user_id {user_id} not found")
        return progress

    async def update_person(self, user_id: int, new_person: str) -> None:
        """
        Обновить поле person у пользователя.
        """
        result = await self.session.execute(
            update(Progress)
            .where(Progress.user_id == user_id)
            .values(person=new_person)
        )
        if result.rowcount == 0:
            raise NotFoundException(f"Progress for user_id {user_id} not found")
        await self.session.commit()

    async def get_all(self) -> list[Progress]:
        """
        Получить все записи прогресса.
        """
        result = await self.session.scalars(select(Progress))
        return list(result)
