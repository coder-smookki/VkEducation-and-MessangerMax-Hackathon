from fastapi import APIRouter

from webapp.backend.models.schemas import User, StartRes

router = APIRouter(prefix="/api", tags=["game"])

@router.post("/start-game", response_model=StartRes)
async def start_game(user: User):
    # тут можно создать игрока в БД, выдать дефолтные данные и т.п.
    # для dev принимаем любого user_id
    print("Получен user_id:", user.user_id)
    if not user.user_id:
        return StartRes(success=False, message="user_id пуст")
    return StartRes(success=True, message="Пользователь зарегистрирован")