from sqlalchemy import String, BigInteger, Integer
from sqlalchemy.orm import Mapped, mapped_column

from database.models.base import AlchemyBaseModel


class Progress(AlchemyBaseModel):
    __tablename__ = "progress"
    
    id: Mapped[int] = mapped_column(
        BigInteger(),
        primary_key=True,
    )
    user_id: Mapped[str] = mapped_column(
        Integer(),
        nullable=False
    )
    person: Mapped[str] = mapped_column(
        String(),
        nullable=True
    )