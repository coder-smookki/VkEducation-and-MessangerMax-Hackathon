# database/models/game_data.py
from sqlalchemy import String, Integer, BigInteger
from sqlalchemy.orm import Mapped, mapped_column
from database.models.base import AlchemyBaseModel

# Glow stored per user+character
class GlowModel(AlchemyBaseModel):
    __tablename__ = "glow"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    character_id: Mapped[str] = mapped_column(String, nullable=False)
    halo_from: Mapped[str] = mapped_column(String, nullable=False)
    halo_to: Mapped[str] = mapped_column(String, nullable=False)
    ts: Mapped[int] = mapped_column(BigInteger, nullable=False)

# Goals & Tasks JSON
class GoalsTasksModel(AlchemyBaseModel):
    __tablename__ = "goals_tasks"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    character_id: Mapped[str] = mapped_column(String, nullable=False)
    json_data: Mapped[str] = mapped_column(String, nullable=False)  # stored JSON string
    ts: Mapped[int] = mapped_column(BigInteger, nullable=False)

# Progress
class ProgressModel(AlchemyBaseModel):
    __tablename__ = "progress"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    character_id: Mapped[str] = mapped_column(String, nullable=False)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    ts: Mapped[int] = mapped_column(BigInteger, nullable=False)
