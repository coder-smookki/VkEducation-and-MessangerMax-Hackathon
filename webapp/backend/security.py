import hmac
import hashlib
import json
import uuid
from urllib.parse import parse_qsl, unquote_plus
from typing import Dict, Any, Tuple

from .config import get_settings

class SecurityService:
    @staticmethod
    def verify_init_data(init_data: str) -> Tuple[Dict[str, Any], int]:
        settings = get_settings()
        
        # 1) Decode
        decoded = unquote_plus(init_data)
        pairs = dict(parse_qsl(decoded, keep_blank_values=True))

        recv_hash = pairs.pop("hash", None)
        if not recv_hash:
            raise ValueError("hash is missing in init_data")

        # 2) Prepare data_check_string
        items = [f"{k}={pairs[k]}" for k in sorted(pairs.keys())]
        data_check_string = "\n".join(items)

        # 3) secret_key = HMAC_SHA256(key=BotToken, msg="WebAppData")
        secret_key = hmac.new(
            settings.BOT_TOKEN.encode("utf-8"), 
            b"WebAppData", 
            hashlib.sha256
        ).digest()

        # 4) sign = hex(HMAC_SHA256(key=secret_key, msg=data_check_string))
        sign = hmac.new(
            secret_key, 
            data_check_string.encode("utf-8"), 
            hashlib.sha256
        ).hexdigest()

        if sign != recv_hash:
            raise ValueError("InitData signature invalid")

        # 5) Profile + auth_date
        try:
            profile = json.loads(pairs.get("user", "{}"))
        except Exception:
            profile = {}
        auth_date = int(pairs.get("auth_date", "0") or 0)

        return profile, auth_date

    @staticmethod
    def generate_user_uuid(raw_id: str) -> str:
        return str(uuid.uuid5(uuid.NAMESPACE_URL, f"max:{raw_id}"))