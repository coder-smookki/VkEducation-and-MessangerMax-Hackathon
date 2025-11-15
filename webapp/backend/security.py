import os
import hmac
import hashlib
import json
import uuid
from urllib.parse import parse_qsl, unquote_plus
from typing import Dict, Any, Tuple


BOT_TOKEN = os.getenv("BOT_TOKEN")  # читаем токен из окружения


class SecurityService:
    @staticmethod
    def verify_init_data(init_data: str) -> Tuple[Dict[str, Any], int]:
        """
        Проверяет подпись init_data от WebApp.
        Возвращает:
            profile: словарь с данными пользователя
            auth_date: время аутентификации
        """
        if not BOT_TOKEN:
            raise ValueError("BOT_TOKEN is not set in environment variables")

        # 1) Раскодировать init_data
        decoded = unquote_plus(init_data)
        pairs = dict(parse_qsl(decoded, keep_blank_values=True))

        recv_hash = pairs.pop("hash", None)
        if not recv_hash:
            raise ValueError("hash is missing in init_data")

        # 2) Формируем data_check_string
        items = [f"{k}={pairs[k]}" for k in sorted(pairs.keys())]
        data_check_string = "\n".join(items)

        # 3) Генерируем secret_key из BOT_TOKEN
        secret_key = hmac.new(
            BOT_TOKEN.encode("utf-8"),
            b"WebAppData",
            hashlib.sha256
        ).digest()

        # 4) Создаём подпись и сравниваем
        sign = hmac.new(
            secret_key,
            data_check_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if sign != recv_hash:
            raise ValueError("InitData signature invalid")

        # 5) Распарсим профиль и auth_date
        try:
            profile = json.loads(pairs.get("user", "{}"))
        except Exception:
            profile = {}

        auth_date = int(pairs.get("auth_date", "0") or 0)

        return profile, auth_date

    @staticmethod
    def generate_user_uuid(raw_id: str) -> str:
        """
        Генерирует стабильный UUID для пользователя по raw_id.
        """
        return str(uuid.uuid5(uuid.NAMESPACE_URL, f"max:{raw_id}"))
