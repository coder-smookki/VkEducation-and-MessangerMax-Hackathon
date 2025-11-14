from fastapi import APIRouter, HTTPException

from webapp.backend.models.schemas import VerifyReq, VerifyRes
from webapp.backend.security import SecurityService

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/verify", response_model=VerifyRes)
def verify_initdata(body: VerifyReq):
    try:
        profile, auth_date = SecurityService.verify_init_data(body.init_data)
        
        raw_id = str(profile.get("id", "0"))
        user_uuid = SecurityService.generate_user_uuid(raw_id)

        return VerifyRes(
            ok=True,
            user_id=user_uuid,
            raw_id=raw_id,
            profile=profile,
            auth_date=auth_date
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")