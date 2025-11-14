from .routers.auth import router as auth_router
from .routers.game import router as game_router

all_routers = [auth_router, game_router]