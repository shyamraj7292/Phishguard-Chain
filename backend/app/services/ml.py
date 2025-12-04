from __future__ import annotations

from dataclasses import dataclass


@dataclass
class MLScoreResult:
    score: float
    explanation: str


def score_email(raw_email: str) -> MLScoreResult:
    """
    Stub ML scoring function.

    In a real implementation this would:
    - Parse the email
    - Extract text & metadata features
    - Call a TensorFlow model (local or TF Serving)
    - Return a probability score and explanation
    """
    # TODO: replace with real model call
    # For now, return a dummy low-risk score.
    return MLScoreResult(
        score=0.15,
        explanation="Baseline heuristic: no obvious phishing indicators detected (stubbed).",
    )


