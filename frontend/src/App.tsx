import { useState } from "react";
import axios from "axios";

interface AttestationInfo {
  status: string;
  tx_hash?: string | null;
  domain?: string | null;
}

interface IngestResponse {
  score: number;
  explanation: string;
  attestation: AttestationInfo;
  received_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

function App() {
  const [rawEmail, setRawEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IngestResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post<IngestResponse>(`${API_BASE}/ingest`, {
        raw_email: rawEmail,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to analyze email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">
            PhishGuard <span className="text-emerald-400">Chain</span>
          </h1>
          <span className="text-xs text-slate-400">
            Real-time phishing detection + on-chain provenance
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row">
        <section className="w-full md:w-1/2">
          <h2 className="mb-2 text-sm font-medium text-slate-300">
            Paste raw email (RFC822)
          </h2>
          <textarea
            className="h-72 w-full rounded-md border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
            placeholder="From: attacker@example.com&#10;To: you@example.com&#10;Subject: Urgent - verify your account&#10;..."
            value={rawEmail}
            onChange={(e) => setRawEmail(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !rawEmail.trim()}
            className="mt-3 inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {loading ? "Analyzing..." : "Analyze email"}
          </button>
          {error && (
            <p className="mt-2 text-xs text-red-400">Error: {error}</p>
          )}
        </section>

        <section className="w-full space-y-3 md:w-1/2">
          <h2 className="text-sm font-medium text-slate-300">
            Result & provenance
          </h2>
          <div className="rounded-md border border-slate-800 bg-slate-900/40 p-4 text-sm">
            {!result && (
              <p className="text-xs text-slate-400">
                No result yet. Paste an email and click{" "}
                <span className="font-medium text-emerald-300">
                  Analyze email
                </span>
                .
              </p>
            )}

            {result && (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Phishing likelihood
                    </p>
                    <p className="text-2xl font-semibold text-emerald-400">
                      {(result.score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Attestation
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        result.attestation.status === "verified"
                          ? "text-emerald-400"
                          : "text-amber-300"
                      }`}
                    >
                      {result.attestation.status.toUpperCase()}
                    </p>
                    {result.attestation.tx_hash && (
                      <p className="mt-1 max-w-xs truncate text-[10px] text-slate-400">
                        Tx: {result.attestation.tx_hash}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Explanation
                  </p>
                  <p className="mt-1 text-xs text-slate-200">
                    {result.explanation}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Received at
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    {new Date(result.received_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


