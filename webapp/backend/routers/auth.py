# webapp/backend/routers/auth.py

from fastapi import APIRouter, HTTPException
from urllib.parse import unquote_plus, parse_qsl
import hmac
import hashlib
import json
import uuid

from webapp.backend.models.schemas import VerifyReq, VerifyRes
from webapp.backend.security import BOT_TOKEN

router = APIRouter(tags=["auth"])


@router.post("/auth/verify", response_model=VerifyRes)
def verify_initdata(body: VerifyReq):
    if not BOT_TOKEN:
        raise HTTPException(status_code=500, detail="BOT_TOKEN is not set")

    # 1) раскодировать init_data
    decoded = unquote_plus(body.init_data)
    pairs = dict(parse_qsl(decoded, keep_blank_values=True))

    recv_hash = pairs.pop("hash", None)
    if not recv_hash:
        raise HTTPException(status_code=400, detail="hash is missing in init_data")

    # 2) подготовка data_check_string: сортировка ключей + '\n'
    items = [f"{k}={pairs[k]}" for k in sorted(pairs.keys())]
    data_check_string = "\n".join(items)

    # 3) secret_key = HMAC_SHA256(key=BOT_TOKEN, msg="WebAppData")
    secret_key = hmac.new(BOT_TOKEN.encode("utf-8"), b"WebAppData", hashlib.sha256).digest()

    # 4) sign = HMAC_SHA256(key=secret_key, msg=data_check_string)
    sign = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()

    if sign != recv_hash:
        raise HTTPException(status_code=401, detail="InitData signature invalid")

    # 5) профиль + auth_date
    try:
        profile = json.loads(pairs.get("user", "{}"))
    except Exception:
        profile = {}

    auth_date = int(pairs.get("auth_date", "0") or 0)

    # 6) стабильный UUID для приложения
    raw_id = str(profile.get("id", "0"))
    user_uuid = uuid.uuid5(uuid.NAMESPACE_URL, f"max:{raw_id}")

    return VerifyRes(
        ok=True,
        user_id=str(user_uuid),
        raw_id=raw_id,
        profile=profile,
        auth_date=auth_date
    )
