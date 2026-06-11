from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
from config import get_settings

settings = get_settings()


def _get_async_url(url: str) -> str:
    """Ensure URL uses postgresql+asyncpg:// scheme."""
    return (
        url.replace("postgresql://", "postgresql+asyncpg://")
        .replace("postgres://", "postgresql+asyncpg://")
    )


engine = create_async_engine(
    _get_async_url(settings.database_url),
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
