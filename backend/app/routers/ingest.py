from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.email import EmailIngestRequest, IngestResponse, AttestationInfo
from app.services.ml import score_email
from app.services.blockchain import lookup_attestation


router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("", response_model=IngestResponse)
async def ingest_email(payload: EmailIngestRequest) -> IngestResponse:
    """
    Ingest a raw email, score it for phishing risk, and enrich with on-chain attestation info.
    """
    ml_result = score_email(payload.raw_email)

    # In a real implementation we'd parse the email to extract the sender domain.
    # For now, treat the entire email as unknown-domain and skip real parsing.
    domain = "unknown.example"
    att = lookup_attestation(domain)

    if att.exists:
        attestation = AttestationInfo(
            status="verified",
            tx_hash=att.tx_hash,
            domain=att.domain or domain,
        )
    else:
        attestation = AttestationInfo(
            status="unverified",
            tx_hash=None,
            domain=domain,
        )

    return IngestResponse(
        score=ml_result.score,
        explanation=ml_result.explanation,
        attestation=attestation,
        received_at=datetime.now(timezone.utc),
    )


