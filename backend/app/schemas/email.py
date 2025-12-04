from datetime import datetime

from pydantic import BaseModel, HttpUrl, Field


class EmailIngestRequest(BaseModel):
    raw_email: str = Field(..., description="Full RFC822 raw email message")


class AttestationInfo(BaseModel):
    status: str
    tx_hash: str | None = None
    domain: str | None = None


class IngestResponse(BaseModel):
    score: float
    explanation: str
    attestation: AttestationInfo
    received_at: datetime


class AttestationCreateRequest(BaseModel):
    domain: str
    org_name: str
    entity_address: str
    signature: str


class Attestation(BaseModel):
    domain: str
    org_name: str
    entity_address: str
    tx_hash: str
    created_at: datetime


