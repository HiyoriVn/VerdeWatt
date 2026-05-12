"""Lightweight runtime config helpers for VerdeWatt backend."""

from __future__ import annotations

import os


def parse_cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "")
    if raw_origins.strip():
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.156.244:5173",
    ]
