from sqlalchemy import String, BigInteger, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column

from database.models.base import AlchemyBaseModel


class UserModel(AlchemyBaseModel):
    __tablename__ = "user"
    
    id: Mapped[int] = mapped_column(
        BigInteger(),
        primary_key=True,
    )
    user_id: Mapped[str] = mapped_column(
        Integer(),
        nullable=False
    )
    username: Mapped[bool] = mapped_column(
        String(),
        nullable=True
    )