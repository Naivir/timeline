from __future__ import annotations

from pathlib import Path
import sqlite3

from sqlalchemy import text

from src.db import _ensure_memory_columns


def test_adds_vertical_ratio_column_for_existing_memory_table(tmp_path: Path) -> None:
    db_file = tmp_path / 'legacy.db'
    connection = sqlite3.connect(db_file)
    connection.execute(
        '''
        CREATE TABLE memory (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            anchor_type TEXT,
            timestamp TEXT,
            range_start TEXT,
            range_end TEXT,
            title TEXT,
            description TEXT,
            category TEXT,
            created_at TEXT,
            updated_at TEXT
        )
        '''
    )
    connection.commit()
    connection.close()

    # Build a one-off SQLAlchemy engine against the legacy DB and monkeypatch module engine.
    from sqlmodel import create_engine
    from src import db as db_module

    legacy_engine = create_engine(f'sqlite:///{db_file}', connect_args={'check_same_thread': False})
    original_engine = db_module.engine
    db_module.engine = legacy_engine
    try:
        _ensure_memory_columns()
        with legacy_engine.begin() as conn:
            columns = conn.execute(text("PRAGMA table_info('memory')")).fetchall()
            names = {str(row[1]) for row in columns}
            assert 'vertical_ratio' in names
            assert 'tags_json' in names

            conn.execute(
                text(
                    '''
                    INSERT INTO memory
                    (id, session_id, anchor_type, timestamp, range_start, range_end, title, description, category, vertical_ratio, created_at, updated_at)
                    VALUES
                    ('m1', 'timeline-main', 'point', '2026-01-01T00:00:00Z', NULL, NULL, 'Legacy', NULL, 'note', 0.25, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
                    '''
                )
            )
    finally:
        db_module.engine = original_engine
