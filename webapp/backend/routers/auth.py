from fastapi import APIRouter, HTTPException
from webapp.backend.models.schemas import VerifyReq, VerifyRes
from webapp.backend.security import SecurityService

router = APIRouter(tags=["auth"])


@router.post("/auth/verify", response_model=VerifyRes)
def verify_initdata(body: VerifyReq):
    """
    Эндпоинт для проверки init_data от WebApp.
    """
    try:
        profile, auth_date = SecurityService.verify_init_data(body.init_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    raw_id = str(profile.get("id", "0"))
    user_uuid = SecurityService.generate_user_uuid(raw_id)

    return VerifyRes(
        ok=True,
        user_id=str(user_uuid),
        raw_id=raw_id,
        profile=profile,
        auth_date=auth_date
    )
