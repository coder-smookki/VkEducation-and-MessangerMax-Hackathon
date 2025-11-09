from redis.asyncio import Redis
from ..config import get_settings

settings = get_settings()

redis = Redis(
    host=settings.redis_settings.host,
    port=settings.redis_settings.port,
    db=0,
    decode_responses=True
)