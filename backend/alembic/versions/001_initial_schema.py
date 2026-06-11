"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-06-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── users ────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("email", sa.String(200), unique=True, nullable=False),
        sa.Column("name", sa.String(200), nullable=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("hashed_password", sa.String(200), nullable=True),
        sa.Column(
            "preferred_language",
            sa.String(10),
            server_default="en",
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ── templates ────────────────────────────────────────────────────────────
    op.create_table(
        "templates",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("occasion_slug", sa.String(100), nullable=False),
        sa.Column("title", sa.String(200), nullable=True),
        sa.Column(
            "style_tags",
            postgresql.ARRAY(sa.String),
            server_default="{}",
            nullable=True,
        ),
        sa.Column(
            "colour_palette",
            postgresql.ARRAY(sa.String),
            server_default="{}",
            nullable=True,
        ),
        sa.Column(
            "orientation",
            sa.String(20),
            server_default="portrait",
            nullable=False,
        ),
        sa.Column(
            "price_inr",
            sa.Integer,
            server_default="0",
            nullable=False,
        ),
        sa.Column("preview_url", sa.Text, nullable=True),
        sa.Column("hd_template_url", sa.Text, nullable=True),
        sa.Column("fabric_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("ai_prompt", sa.Text, nullable=True),
        sa.Column(
            "is_active",
            sa.Boolean,
            server_default="true",
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index(
        "ix_templates_occasion_slug", "templates", ["occasion_slug"]
    )
    op.create_index("ix_templates_is_active", "templates", ["is_active"])

    # ── orders ───────────────────────────────────────────────────────────────
    op.create_table(
        "orders",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "template_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("templates.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("razorpay_order_id", sa.String(100), nullable=True),
        sa.Column("razorpay_payment_id", sa.String(100), nullable=True),
        sa.Column(
            "amount_inr",
            sa.Integer,
            server_default="0",
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(20),
            server_default="pending",
            nullable=False,
        ),
        sa.Column(
            "download_token",
            sa.String(64),
            unique=True,
            nullable=True,
        ),
        sa.Column(
            "customisation_json",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column("email", sa.String(200), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index(
        "ix_orders_download_token", "orders", ["download_token"], unique=True
    )
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index(
        "ix_orders_razorpay_order_id", "orders", ["razorpay_order_id"]
    )

    # ── rsvp_responses ───────────────────────────────────────────────────────
    op.create_table(
        "rsvp_responses",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "order_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("orders.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("guest_email", sa.String(200), nullable=False),
        sa.Column("response", sa.String(10), nullable=False),
        sa.Column(
            "responded_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index(
        "ix_rsvp_responses_order_id", "rsvp_responses", ["order_id"]
    )


def downgrade() -> None:
    op.drop_table("rsvp_responses")
    op.drop_table("orders")
    op.drop_table("templates")
    op.drop_table("users")
