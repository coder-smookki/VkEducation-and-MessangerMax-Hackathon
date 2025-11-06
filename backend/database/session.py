from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from database.settings import get_db_settings

# Получаем настройки БД
db_settings = get_db_settings()

# Создаём движок
engine = create_async_engine(db_settings.url, future=True)

# Фабрика сессий
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)
