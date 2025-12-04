from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.email import (
    AttestationCreateRequest,
    Attestation,
)
from app.services.blockchain import lookup_attestation, register_attestation


router = APIRouter(prefix="/attestations", tags=["attestations"])


@router.get("/{domain}", response_model=Attestation | None)
async def get_attestation(domain: str) -> Attestation | None:
    """
    Look up on-chain attestation information for a sender domain.
    """
    result = lookup_attestation(domain)
    if not result.exists:
        return None

    # In this stub we only know the tx hash and domain.
    return Attestation(
        domain=result.domain or domain,
        org_name=result.org_name or "Unknown Org",
        entity_address="0x0",
        tx_hash=result.tx_hash or "",
        created_at=datetime.now(timezone.utc),
    )


@router.post("", response_model=Attestation)
async def create_attestation(payload: AttestationCreateRequest) -> Attestation:
    """
    Register a new trusted sender attestation on-chain (stubbed).

    In production this would likely be behind admin authentication and use a server-held key
    or delegate the transaction to a front-end wallet integration.
    """
    tx_hash = register_attestation(
        domain=payload.domain,
        org_name=payload.org_name,
        entity_address=payload.entity_address,
        signature=payload.signature,
    )

    return Attestation(
        domain=payload.domain,
        org_name=payload.org_name,
        entity_address=payload.entity_address,
        tx_hash=tx_hash,
        created_at=datetime.now(timezone.utc),
    )


