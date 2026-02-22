from __future__ import annotations

from sqlalchemy import text
from sqlmodel import Session

from src.db import engine


def test_theme_table_exists_after_init() -> None:
    with Session(engine) as session:
        rows = session.exec(text("SELECT name FROM sqlite_master WHERE type='table' AND name='theme'")).all()
    assert rows, 'theme table should exist after db initialization'
