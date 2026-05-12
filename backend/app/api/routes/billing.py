from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.services.billing_service import simulate_billing_kpis

router = APIRouter(prefix="/api", tags=["billing"])


class BillingRequest(BaseModel):
    # Optional: if provided, backend uses this allocation data.
    # If omitted, backend runs optimizer internally.
    hourly_allocations: list[dict[str, Any]] | None = None


@router.post("/billing")
def calculate_billing(payload: BillingRequest | None = None) -> dict:
    allocations = payload.hourly_allocations if payload else None
    return simulate_billing_kpis(hourly_allocations=allocations)
