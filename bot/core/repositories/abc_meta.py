from abc import ABC, abstractmethod
from typing import Generic, TypeVar

M = TypeVar("M")      # входящая модель (Pydantic)
ExtM = TypeVar("ExtM")  # исходящая модель (Pydantic)
K = TypeVar("K")      # ключ (user_id, id, username — зависит от репо)


class RepoMeta(ABC, Generic[M, ExtM, K]):
    @abstractmethod
    async def create(self, instance: M) -> ExtM:
        """
        Создать новую запись.
        """
        pass

    @abstractmethod
    async def delete(self, key: K) -> None:
        """
        Удалить запись по ключу.
        """
        pass

    @abstractmethod
    async def get(self, key: K) -> ExtM | None:
        """
        Получить запись по ключу.
        """
        pass

    @abstractmethod
    async def update(self, instance: M) -> ExtM:
        """
        Обновить существующую запись.
        Ключ для обновления берётся из instance.
        """
        pass
