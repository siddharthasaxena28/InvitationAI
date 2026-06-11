import asyncio
import os
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# Import Base and all models so Alembic autogenerate sees them
from database import Base  # noqa: F401
import models  # noqa: F401 — registers all 4 models with Base.metadata

config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    """
    Resolve the database URL, preferring the DATABASE_URL env var.
    Ensures the URL uses the postgresql+asyncpg:// scheme.
    """
    url = os.environ.get(
        "DATABASE_URL",
        config.get_main_option("sqlalchemy.url", ""),
    )
    # Normalise to asyncpg scheme
    url = url.replace("postgresql://", "postgresql+asyncpg://")
    url = url.replace("postgres://", "postgresql+asyncpg://")
    # Avoid double-replacing if already correct
    url = url.replace("postgresql+asyncpg+asyncpg://", "postgresql+asyncpg://")
    return url


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    This does not require a live DB connection — SQL is emitted to stdout.
    """
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations using an async engine (asyncpg)."""
    engine = create_async_engine(get_url(), echo=False)
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
