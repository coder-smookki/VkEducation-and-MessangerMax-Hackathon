from sqlalchemy import URL
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from database.models.base import AlchemyBaseModel
from database.settings import DBSettings

__all__ = (
    "AlchemyBaseModel",
    "database_init",
)


SessionFactory: async_sessionmaker[AsyncSession] | None = None


async def database_init(db_settings):
    global SessionFactory
    print("Initializing database...")

    from sqlalchemy import URL
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

    database_url = URL.create(
        drivername="postgresql+asyncpg",
        username=db_settings.user,
        password=db_settings.password,
        host=db_settings.host,
        port=db_settings.host_port,
        database=db_settings.db,
    )

    engine = create_async_engine(database_url, echo=True)

    # Проверка соединения
    try:
        async with engine.begin() as conn:
            await conn.run_sync(lambda conn: print("DB connection OK"))
    except Exception as e:
        print("Ошибка соединения с БД:", e)
        raise

    SessionFactory = async_sessionmaker(bind=engine, expire_on_commit=False)
    print("SessionFactory создана")
