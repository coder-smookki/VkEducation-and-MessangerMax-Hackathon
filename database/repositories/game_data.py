from sqlalchemy import select
from database.repositories.base import BaseAlchemyRepo
from database.models.game_data import GlowModel, GoalsTasksModel, ProgressModel
import json

class GlowRepo(BaseAlchemyRepo):
    async def save(self, user_id: str, character_id: str, halo_from: str, halo_to: str, ts: int):
        obj = GlowModel(
            user_id=user_id,
            character_id=character_id,
            halo_from=halo_from,
            halo_to=halo_to,
            ts=ts
        )
        self.session.add(obj)
        await self.session.commit()
        return obj

    async def get_latest(self, user_id: str, character_id: str):
        q = (
            select(GlowModel)
            .where(GlowModel.user_id == user_id, GlowModel.character_id == character_id)
            .order_by(GlowModel.ts.desc())
        )
        obj = await self.session.scalar(q)
        return obj


class GoalsTasksRepo(BaseAlchemyRepo):
    async def save(self, user_id: str, character_id: str, data: dict, ts: int):
        obj = GoalsTasksModel(
            user_id=user_id,
            character_id=character_id,
            json_data=json.dumps(data),
            ts=ts
        )
        self.session.add(obj)
        await self.session.commit()
        return obj

    async def get_latest(self, user_id: str, character_id: str):
        q = (
            select(GoalsTasksModel)
            .where(GoalsTasksModel.user_id == user_id, GoalsTasksModel.character_id == character_id)
            .order_by(GoalsTasksModel.ts.desc())
        )
        obj = await self.session.scalar(q)
        if obj is None:
            return None
        return json.loads(obj.json_data)


class ProgressRepo(BaseAlchemyRepo):
    async def save(self, user_id: str, character_id: str, xp: int, ts: int):
        obj = ProgressModel(
            user_id=user_id,
            character_id=character_id,
            xp=xp,
            ts=ts
        )
        self.session.add(obj)
        await self.session.commit()
        return obj

    async def get_latest(self, user_id: str, character_id: str):
        q = (
            select(ProgressModel)
            .where(ProgressModel.user_id == user_id, ProgressModel.character_id == character_id)
            .order_by(ProgressModel.ts.desc())
        )
        return await self.session.scalar(q)
