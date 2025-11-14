# webapp/backend/routers/game_data.py
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import json

from database.session import database_init
from database.repositories.game_data import GlowRepo, GoalsTasksRepo, ProgressRepo

router = APIRouter(prefix="/api", tags=["game-data-db"])

# =============================
# Glow — save JSON
# =============================
@router.post("/save-glow")
async def save_glow(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    character_id: str = Form(...),
    session: AsyncSession = Depends(database_init)
):
    try:
        raw = await file.read()
        data = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    repo = GlowRepo(session)
    await repo.save(
        user_id=user_id,
        character_id=character_id,
        halo_from=data.get("haloFrom"),
        halo_to=data.get("haloTo"),
        ts=data.get("ts")
    )
    return {"ok": True}

@router.get("/get-glow")
async def get_glow(user_id: str, character_id: str, session: AsyncSession = Depends(database_init)):
    repo = GlowRepo(session)
    obj = await repo.get_latest(user_id, character_id)
    if not obj:
        return {}
    return {"haloFrom": obj.halo_from, "haloTo": obj.halo_to}


# =============================
# Goals & Tasks — save / get
# =============================
@router.post("/upload-goals-tasks")
async def upload_goals_tasks(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    character_id: str = Form(...),
    session: AsyncSession = Depends(database_init)
):
    try:
        raw = await file.read()
        data = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    repo = GoalsTasksRepo(session)
    await repo.save(user_id=user_id, character_id=character_id, data=data, ts=data.get("ts"))

    return {"ok": True}

@router.get("/get-goals-tasks")
async def get_goals_tasks(user_id: str, character_id: str, session: AsyncSession = Depends(database_init)):
    repo = GoalsTasksRepo(session)
    data = await repo.get_latest(user_id, character_id)
    if not data:
        return {"goals": [], "tasks": []}
    return data


# =============================
# XP Progress — save / get
# =============================
@router.post("/set-progress")
async def set_progress(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    character_id: str = Form(...),
    session: AsyncSession = Depends(database_init)
):
    try:
        raw = await file.read()
        data = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Bad JSON")

    xp = int(data.get("xp", 0))

    repo = ProgressRepo(session)
    await repo.save(user_id=user_id, character_id=character_id, xp=xp, ts=data.get("ts"))

    return {"ok": True}

@router.get("/get-progress")
async def get_progress(user_id: str, character_id: str, session: AsyncSession = Depends(database_init)):
    repo = ProgressRepo(session)
    obj = await repo.get_latest(user_id, character_id)
    if not obj:
        return {"xp": 0}
    return {"xp": obj.xp}
