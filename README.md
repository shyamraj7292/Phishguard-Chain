## PhishGuard Chain

**PhishGuard Chain** is an end-to-end demo project for AI-powered phishing email detection with on-chain provenance for trusted senders.

This repo contains:

- **Backend (FastAPI)**: `/backend` – ingestion + scoring API.
- **Frontend (React + Vite + Tailwind)**: `/frontend` – minimal dashboard to analyze raw emails and see risk/attestation.
- **Smart contracts (Hardhat + Solidity)**: `/contracts` – `TrustedAttestations` contract for registering trusted sending domains.
- **Docker orchestration**: `docker-compose.yml` – run backend and frontend together.

> Note: ML scoring and blockchain integration are stubbed so you can get a working skeleton fast, then gradually plug in a real TensorFlow model and on-chain calls.

---

## High-level architecture

- **Email ingestion & API (FastAPI)**:
  - `POST /api/ingest` – accepts raw RFC822 email, returns `{score, explanation, attestation, received_at}`.
  - `GET /api/attestations/{domain}` – lookup attestation for a sender domain.
  - `POST /api/attestations` – register a new trusted sender (stubbed chain call).
- **ML scoring (stubbed)**:
  - `backend/app/services/ml.py` exposes `score_email(raw_email)` returning a dummy low-risk score.
- **Blockchain layer (stubbed)**:
  - `backend/app/services/blockchain.py` exposes `lookup_attestation(domain)` and `register_attestation(...)`.
  - Real implementation would call the `TrustedAttestations` contract deployed from `/contracts`.
- **Frontend dashboard**:
  - Simple one-page React app where you paste a raw email and see phishing likelihood + attestation status.

---

## Getting started (local, without Docker)

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

FastAPI will be available at `http://localhost:8000` and docs at `http://localhost:8000/docs`.

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The dashboard will run at `http://localhost:5173` (configured to call `http://localhost:8000/api`).

---

## Running with Docker Compose

From the project root:

```bash
docker-compose up --build
```

This will start:

- **Backend**: `http://localhost:8000`
- **Frontend**: `http://localhost:5173`

You can then open the browser, paste a raw email into the UI, and see a dummy phishing score and attestation status.

---

## Contracts (Hardhat + Solidity)

The `contracts` folder contains a minimal implementation of `TrustedAttestations.sol` and Hardhat config.

### Install and test

```bash
cd contracts
npm install
npx hardhat test
```

### Compile and deploy to local Hardhat network

```bash
npx hardhat compile
npx hardhat node          # in one terminal
npx hardhat run scripts/deploy.ts --network localhost  # in another
```

Copy the deployed contract address and later wire it into the backend (via env vars) when you implement real on-chain lookups.

---

## Backend API quick reference

- `GET /health`
  - Returns `{ "status": "ok" }`.

- `POST /api/ingest`
  - Request:
    ```json
    {
      "raw_email": "From: sender@example.com\\nTo: you@example.com\\nSubject: Hello..."
    }
    ```
  - Response (stubbed):
    ```json
    {
      "score": 0.15,
      "explanation": "Baseline heuristic: no obvious phishing indicators detected (stubbed).",
      "attestation": {
        "status": "unverified",
        "tx_hash": null,
        "domain": "unknown.example"
      },
      "received_at": "2025-01-01T00:00:00Z"
    }
    ```

- `GET /api/attestations/{domain}`
  - Returns `null` for now, or an `Attestation` object when wired to the contract.

- `POST /api/attestations`
  - Stub endpoint that returns a fake tx hash.

---

## Next steps / TODO (high level)

- **Email parsing & feature extraction**
  - Properly parse raw email, extract sender domain, headers, URLs, and text.
  - Compute rich features (domain age, SPF/DKIM/DMARC, URL features, NLP features).
- **ML model integration**
  - Replace `score_email` with a real TensorFlow model (or call out to TF Serving).
  - Add explainability (top contributing features / tokens).
- **Blockchain integration**
  - Replace stub blockchain calls with `web3.py` integration to the deployed `TrustedAttestations` contract.
  - Add domain-based lookups and display real tx hashes in the UI.
- **Dashboard enhancements**
  - Add inbox view, quarantine list, and admin panel for managing attestations.

This scaffold gives you a working full-stack skeleton that you can run locally and then gradually evolve into the full PhishGuard Chain vision.
