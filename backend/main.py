# server.py
import os, hmac, hashlib, json, uuid
from urllib.parse import parse_qsl, unquote_plus
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BOT_TOKEN = os.getenv("BOT_TOKEN")  # ОБЯЗАТЕЛЬНО: export BOT_TOKEN="токен_бота_из_MAX"

# ---------- схемы ----------
class VerifyReq(BaseModel):
    init_data: str = Field(..., description="window.WebApp.InitData (URL-encoded querystring)")

class VerifyRes(BaseModel):
    ok: bool
    user_id: str            # стабильный UUID, выдаём фронту для использования
    raw_id: Optional[str]   # исходный numeric id из профиля MAX (можно игнорить на фронте)
    profile: Dict[str, Any]
    auth_date: int

class User(BaseModel):
    user_id: str

class StartRes(BaseModel):
    success: bool
    message: str

# ---------- валидация InitData ----------
@app.post("/api/auth/verify", response_model=VerifyRes)
def verify_initdata(body: VerifyReq):
    if not BOT_TOKEN:
        raise HTTPException(status_code=500, detail="BOT_TOKEN is not set")

    # 1) раскодировать
    decoded = unquote_plus(body.init_data)
    pairs = dict(parse_qsl(decoded, keep_blank_values=True))

    recv_hash = pairs.pop("hash", None)
    if not recv_hash:
        raise HTTPException(status_code=400, detail="hash is missing in init_data")

    # 2) подготовить data_check_string: сортировка + '\n'
    items = [f"{k}={pairs[k]}" for k in sorted(pairs.keys())]
    data_check_string = "\n".join(items)

    # 3) secret_key = HMAC_SHA256(key=BotToken, msg="WebAppData")
    secret_key = hmac.new(BOT_TOKEN.encode("utf-8"), b"WebAppData", hashlib.sha256).digest()

    # 4) sign = hex(HMAC_SHA256(key=secret_key, msg=data_check_string))
    sign = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()

    if sign != recv_hash:
        raise HTTPException(status_code=401, detail="InitData signature invalid")

    # 5) профиль + auth_date
    try:
        profile = json.loads(pairs.get("user", "{}"))
    except Exception:
        profile = {}
    auth_date = int(pairs.get("auth_date", "0") or 0)

    # 6) стабильный UUID для приложения (чтобы удобно хранить/ссылаться)
    raw_id = str(profile.get("id", "0"))
    user_uuid = uuid.uuid5(uuid.NAMESPACE_URL, f"max:{raw_id}")

    return VerifyRes(
        ok=True,
        user_id=str(user_uuid),
        raw_id=raw_id,
        profile=profile,
        auth_date=auth_date
    )

# ---------- старт игры ----------
@app.post("/api/start-game", response_model=StartRes)
async def start_game(user: User):
    # тут можно создать игрока в БД, выдать дефолтные данные и т.п.
    # для dev принимаем любого user_id
    print("Получен user_id:", user.user_id)
    if not user.user_id:
        return StartRes(success=False, message="user_id пуст")
    return StartRes(success=True, message="Пользователь зарегистрирован")