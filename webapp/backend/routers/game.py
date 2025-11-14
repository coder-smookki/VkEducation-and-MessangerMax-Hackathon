# webapp/backend/routers/start_game.py
from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import database_init
from database.repositories.user import UserAlchemyRepo
from bot.core.models.user import User

router = APIRouter(tags=["start-game"])

@router.post("/start-game")
async def start_game(
    user_id: str = Form(...),
    session: AsyncSession = Depends(database_init)
):
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id пуст")

    repo = UserAlchemyRepo(session)

    existing = await repo.get(int(user_id))
    if existing:
        return {"success": True, "message": "Пользователь уже существует", "user_id": user_id}

    new_user = User(id=None, user_id=int(user_id), username=None)
    await repo.create(new_user)

    return {"success": True, "message": "Пользователь создан", "user_id": user_id}
