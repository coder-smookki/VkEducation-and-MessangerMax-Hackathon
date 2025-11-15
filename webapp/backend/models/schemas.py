from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

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