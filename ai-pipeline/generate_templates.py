#!/usr/bin/env python3
"""
Batch template generation script.

Dispatches Celery tasks to generate AI-designed templates for one or all occasions.

Usage:
    python generate_templates.py --occasion birthday-kids --count 5
    python generate_templates.py --occasion all --count 3
    python generate_templates.py --list-occasions
"""
import argparse
import sys
import os

# Make the backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

OCCASIONS = [
    "birthday-kids",
    "birthday-adult",
    "birthday-milestone",
    "wedding",
    "engagement",
    "mehendi",
    "sangeet",
    "baby-shower",
    "naming-ceremony",
    "diwali",
    "ganesh-chaturthi",
    "holi",
    "eid",
    "christmas",
    "office-party",
    "farewell",
    "promotion",
    "dinner-party",
    "lunch-party",
    "brunch",
    "cocktail-party",
    "graduation",
    "anniversary",
    "retirement",
    "housewarming",
    "pool-party",
    "new-year",
    "valentines-day",
]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate AI-powered invitation templates via Celery tasks.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--occasion",
        default="all",
        help="Occasion slug (e.g. 'birthday-kids') or 'all' to generate for every occasion.",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=5,
        help="Number of templates to generate per occasion (max 10 per task).",
    )
    parser.add_argument(
        "--list-occasions",
        action="store_true",
        help="Print all supported occasion slugs and exit.",
    )
    args = parser.parse_args()

    if args.list_occasions:
        print("Supported occasion slugs:")
        for slug in OCCASIONS:
            print(f"  {slug}")
        sys.exit(0)

    if args.occasion != "all" and args.occasion not in OCCASIONS:
        print(
            f"Error: Unknown occasion '{args.occasion}'.\n"
            "Run with --list-occasions to see valid slugs."
        )
        sys.exit(1)

    try:
        from workers.tasks import generate_template_batch_task
    except ImportError as e:
        print(
            f"Import error: {e}\n"
            "Make sure you are running this script from within the project root "
            "and that the backend dependencies are installed."
        )
        sys.exit(1)

    occasions_to_process = (
        OCCASIONS if args.occasion == "all" else [args.occasion]
    )
    count = min(args.count, 10)

    print(
        f"Dispatching generation tasks for {len(occasions_to_process)} occasion(s), "
        f"{count} template(s) each."
    )
    print("-" * 60)

    task_ids = []
    for occ in occasions_to_process:
        task = generate_template_batch_task.delay(occ, count)
        task_ids.append((occ, task.id))
        print(f"  {occ:<30} → task_id: {task.id}")

    print("-" * 60)
    print(f"Dispatched {len(task_ids)} task(s).")
    print(
        "\nMonitor progress at: http://localhost:5555 (Flower)\n"
        "Or check task status via: GET /api/render/status/<task_id>"
    )


if __name__ == "__main__":
    main()
