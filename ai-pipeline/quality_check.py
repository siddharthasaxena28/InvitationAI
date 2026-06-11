#!/usr/bin/env python3
"""
Template quality checker.

Validates Fabric.js canvas JSON structure and produces a quality report.

Usage:
    python quality_check.py --template-id <uuid>
    python quality_check.py --fabric-json '{"version":"5.5.2","objects":[...]}'
    python quality_check.py --all   # check all DB templates
"""
import argparse
import json
import sys
import os
from typing import Optional

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))


# ── Heuristic quality checks ─────────────────────────────────────────────────

def check_fabric_json(fabric_json: dict) -> dict:
    """
    Run structural and heuristic quality checks on a Fabric.js canvas JSON.
    Returns a QualityCheckResponse-compatible dict.
    """
    objects = fabric_json.get("objects", [])
    background = fabric_json.get("background", "")

    # Object type census
    type_counts = {}
    for obj in objects:
        t = obj.get("type", "unknown")
        type_counts[t] = type_counts.get(t, 0) + 1

    text_types = {"text", "textbox", "i-text"}
    text_count = sum(type_counts.get(t, 0) for t in text_types)
    has_background_rect = type_counts.get("rect", 0) > 0
    has_image = type_counts.get("image", 0) > 0
    total_objects = len(objects)

    # ── Visual appeal (1-10) ──────────────────────────────────────────────
    visual_appeal = 5
    if has_image:
        visual_appeal += 2
    if has_background_rect:
        visual_appeal += 1
    if background and background != "#FFFFFF":
        visual_appeal += 1
    if total_objects >= 5:
        visual_appeal += 1
    visual_appeal = min(10, max(1, visual_appeal))

    # ── Readability (1-10) ────────────────────────────────────────────────
    readability = 8
    if text_count == 0:
        readability = 1
    elif text_count > 8:
        readability -= 2  # too many text layers
    # Check font sizes in text objects
    font_sizes = [
        obj.get("fontSize", 24)
        for obj in objects
        if obj.get("type") in text_types
    ]
    if font_sizes:
        min_fs = min(font_sizes)
        if min_fs < 14:
            readability -= 2  # text too small
        max_fs = max(font_sizes)
        if max_fs < 24:
            readability -= 1  # even headline too small
    readability = min(10, max(1, readability))

    # ── Cultural accuracy (1-10) — structural check only ─────────────────
    # (Full cultural check requires Claude API; heuristic here)
    cultural_accuracy = 7
    if has_image:
        cultural_accuracy = 8  # image suggests proper customisation
    cultural_accuracy = min(10, max(1, cultural_accuracy))

    # ── Occasion fit (1-10) ───────────────────────────────────────────────
    occasion_fit = 6
    if text_count >= 2:
        occasion_fit += 1
    if text_count >= 4:
        occasion_fit += 1  # has details + RSVP layers
    if has_image or has_background_rect:
        occasion_fit += 1
    if total_objects >= 5:
        occasion_fit += 1
    occasion_fit = min(10, max(1, occasion_fit))

    # ── Improvement suggestion ────────────────────────────────────────────
    suggestion: Optional[str] = None
    issues = []

    if text_count == 0:
        issues.append("No text layers — add headline, date, venue, and RSVP text.")
    elif text_count == 1:
        issues.append("Only one text layer — add event details and RSVP information.")

    if not has_background_rect and not background:
        issues.append("No background — add a background colour or image.")

    if font_sizes and min(font_sizes) < 14:
        issues.append(
            f"Smallest font size is {min(font_sizes)}px — increase to at least 16px "
            "for print legibility."
        )

    if text_count > 8:
        issues.append(
            f"Too many text layers ({text_count}) — consolidate to improve readability."
        )

    if not has_image:
        issues.append(
            "No background image — adding a decorative background image will improve "
            "visual appeal."
        )

    if issues:
        suggestion = issues[0]  # surface the most important issue

    return {
        "visual_appeal": visual_appeal,
        "readability": readability,
        "cultural_accuracy": cultural_accuracy,
        "occasion_fit": occasion_fit,
        "improvement_suggestion": suggestion,
        "_debug": {
            "total_objects": total_objects,
            "text_count": text_count,
            "has_background_rect": has_background_rect,
            "has_image": has_image,
            "type_counts": type_counts,
            "all_issues": issues,
        },
    }


def print_report(template_id: str, fabric_json: dict) -> None:
    """Print a formatted quality report for a single template."""
    result = check_fabric_json(fabric_json)
    debug = result.pop("_debug", {})

    print(f"\n{'='*60}")
    print(f"Quality Report — Template: {template_id}")
    print(f"{'='*60}")
    print(f"  Visual Appeal:      {result['visual_appeal']:>2}/10")
    print(f"  Readability:        {result['readability']:>2}/10")
    print(f"  Cultural Accuracy:  {result['cultural_accuracy']:>2}/10")
    print(f"  Occasion Fit:       {result['occasion_fit']:>2}/10")

    avg = (
        result["visual_appeal"]
        + result["readability"]
        + result["cultural_accuracy"]
        + result["occasion_fit"]
    ) / 4
    print(f"  {'─'*30}")
    print(f"  Average Score:      {avg:>4.1f}/10")

    print(f"\n  Objects: {debug.get('total_objects', 0)} total")
    for obj_type, count in debug.get("type_counts", {}).items():
        print(f"    {obj_type:<15} ×{count}")

    if result["improvement_suggestion"]:
        print(f"\n  Suggestion:\n  → {result['improvement_suggestion']}")

    if len(debug.get("all_issues", [])) > 1:
        print("\n  Additional issues:")
        for issue in debug["all_issues"][1:]:
            print(f"    • {issue}")

    print()


def check_all_from_db() -> None:
    """Load all templates from DB and run quality checks."""
    import asyncio

    async def _run():
        from sqlalchemy import select
        from database import AsyncSessionLocal
        from models.template import Template

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Template).where(Template.is_active == True))
            templates = result.scalars().all()

        if not templates:
            print("No templates found in the database.")
            return

        print(f"Checking {len(templates)} templates...\n")
        low_quality = []

        for t in templates:
            if not t.fabric_json:
                print(f"  SKIP  {t.id} — no fabric_json")
                continue

            result = check_fabric_json(t.fabric_json)
            avg = (
                result["visual_appeal"]
                + result["readability"]
                + result["cultural_accuracy"]
                + result["occasion_fit"]
            ) / 4

            status = "OK  " if avg >= 6 else "WARN"
            print(
                f"  [{status}] {str(t.id)[:8]}…  {t.occasion_slug:<30}  "
                f"avg={avg:.1f}  '{t.title[:30]}'"
            )
            if avg < 6:
                low_quality.append((t, avg))

        if low_quality:
            print(f"\n{len(low_quality)} low-quality templates (avg < 6):")
            for t, avg in low_quality:
                print(f"  - {t.id}  {t.occasion_slug}  (avg={avg:.1f})")
                result = check_fabric_json(t.fabric_json)
                if result["improvement_suggestion"]:
                    print(f"    Suggestion: {result['improvement_suggestion']}")

    asyncio.run(_run())


def main() -> None:
    parser = argparse.ArgumentParser(
        description="InviteAI template quality checker.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--template-id",
        help="UUID of a template in the database to check.",
    )
    group.add_argument(
        "--fabric-json",
        help="Inline Fabric.js JSON string to check.",
    )
    group.add_argument(
        "--all",
        action="store_true",
        help="Check all active templates in the database.",
    )
    args = parser.parse_args()

    if args.all:
        check_all_from_db()

    elif args.fabric_json:
        try:
            fabric = json.loads(args.fabric_json)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}")
            sys.exit(1)
        print_report("(inline)", fabric)

    elif args.template_id:
        import asyncio

        async def _fetch_and_check():
            from sqlalchemy import select
            from database import AsyncSessionLocal
            from models.template import Template
            import uuid

            try:
                tid = uuid.UUID(args.template_id)
            except ValueError:
                print(f"Invalid UUID: {args.template_id}")
                sys.exit(1)

            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(Template).where(Template.id == tid)
                )
                template = result.scalar_one_or_none()

            if not template:
                print(f"Template not found: {args.template_id}")
                sys.exit(1)

            if not template.fabric_json:
                print(f"Template {args.template_id} has no fabric_json.")
                sys.exit(1)

            print_report(args.template_id, template.fabric_json)

        asyncio.run(_fetch_and_check())


if __name__ == "__main__":
    main()
