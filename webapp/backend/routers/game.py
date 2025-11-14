from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["game"])


# Входящая модель (ПОЧЕМУ У ТЕБЯ БЫЛА ОШИБКА 422)
# Потому что FastAPI пытался распарсить её из query/form, а приходил JSON.
class User(BaseModel):
    user_id: int


# Модель ответа
class StartRes(BaseModel):
    success: bool
    message: str


# ---------- старт игры ----------
@router.post("/start-game", response_model=StartRes)
async def start_game(user: User):
    print("Получен user_id:", user.user_id)

    if not user.user_id:
        return StartRes(success=False, message="user_id пуст")

    # Здесь может быть создание игрока в БД
    return StartRes(success=True, message="Пользователь зарегистрирован")
