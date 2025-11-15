from abc import ABC

from bot.core.models.user import User
from bot.core.repositories.abc_meta import RepoMeta


class UserRepo(RepoMeta[User, User, int], ABC):
    """
    Репозиторий для работы с пользователями.
    Ключ доступа — user_id (int).
    """
    pass
