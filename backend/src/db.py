from __future__ import annotations

from collections.abc import Generator
import os
from pathlib import Path

from sqlalchemy import text
from sqlmodel import Session, SQLModel, create_engine

# Import models so SQLModel metadata includes required tables.
from src.models.memory import Memory, TimelineSession  # noqa: F401
from src.models.memory_deletion import MemoryDeletionRecord  # noqa: F401
from src.models.theme import Theme  # noqa: F401

db_path_env = os.getenv('TIMELINE_DB_PATH')
if db_path_env:
    DB_PATH = Path(db_path_env).expanduser().resolve()
else:
    DB_PATH = Path(__file__).resolve().parents[1] / 'timeline.db'
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
DATABASE_URL = f'sqlite:///{DB_PATH}'

engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})


def _ensure_memory_columns() -> None:
    with engine.begin() as connection:
        columns = connection.execute(text("PRAGMA table_info('memory')")).fetchall()
        if not columns:
            return
        names = {str(row[1]) for row in columns}
        if 'vertical_ratio' in names:
            pass
        else:
            connection.execute(
                text("ALTER TABLE memory ADD COLUMN vertical_ratio FLOAT NOT NULL DEFAULT 0.3")
            )
        if 'tags_json' in names:
            return
        connection.execute(
            text("ALTER TABLE memory ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]'")
        )


def _ensure_theme_columns() -> None:
    with engine.begin() as connection:
        columns = connection.execute(text("PRAGMA table_info('theme')")).fetchall()
        if not columns:
            return
        names = {str(row[1]) for row in columns}
        if 'top_px' not in names:
            connection.execute(text("ALTER TABLE theme ADD COLUMN top_px FLOAT NOT NULL DEFAULT 120"))
        if 'bottom_px' not in names:
            connection.execute(text("ALTER TABLE theme ADD COLUMN bottom_px FLOAT NOT NULL DEFAULT 216"))
        if 'abbreviated_title' not in names:
            connection.execute(text("ALTER TABLE theme ADD COLUMN abbreviated_title TEXT"))


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    _ensure_memory_columns()
    _ensure_theme_columns()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
