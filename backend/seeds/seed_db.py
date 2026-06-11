#!/usr/bin/env python3
"""
Database seeder — inserts mock templates if the table is empty.

Usage:
    python seeds/seed_db.py
"""
import os
import sys
import uuid

# Ensure the backend package root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from models.template import Template
from database import Base
from seeds.mock_templates import MOCK_TEMPLATES
from config import get_settings


def get_sync_url(async_url: str) -> str:
    """Convert asyncpg URL to synchronous psycopg2 URL."""
    url = async_url
    url = url.replace("postgresql+asyncpg://", "postgresql://")
    url = url.replace("postgres+asyncpg://", "postgresql://")
    return url


def main() -> None:
    settings = get_settings()
    sync_url = get_sync_url(settings.database_url)

    engine = create_engine(sync_url, echo=False)

    # Create tables if they don't exist yet
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        existing_count = session.query(Template).count()
        if existing_count > 0:
            print(
                f"Database already has {existing_count} templates. "
                "Skipping seed to avoid duplicates."
            )
            print("Tip: truncate the templates table first if you want to re-seed.")
            sys.exit(0)

        inserted = 0
        for t in MOCK_TEMPLATES:
            template = Template(
                id=uuid.uuid4(),
                occasion_slug=t["occasion_slug"],
                title=t["title"],
                style_tags=t.get("style_tags", []),
                colour_palette=t.get("colour_palette", []),
                orientation=t.get("orientation", "portrait"),
                price_inr=t.get("price_inr", 0),
                preview_url=t.get("preview_url"),
                hd_template_url=t.get("hd_template_url"),
                fabric_json=t.get("fabric_json"),
                ai_prompt=t.get("ai_prompt", ""),
                is_active=True,
            )
            session.add(template)
            inserted += 1

        session.commit()
        print(f"Successfully seeded {inserted} templates.")
        print("\nOccasion breakdown:")
        from collections import Counter

        counts = Counter(t["occasion_slug"] for t in MOCK_TEMPLATES)
        for slug, count in sorted(counts.items()):
            print(f"  {slug:<30} {count} template(s)")


if __name__ == "__main__":
    main()
