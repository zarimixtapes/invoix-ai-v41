"use client";

import { useState } from "react";

export function BillingActions({ plan }: { plan: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(path: string) {
    setLoading(true);
    setError(null);
    const res = await fetch(path, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      {plan === "FREE" ? (
        <button
          onClick={() => go("/api/stripe/checkout")}
          disabled={loading}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Upgrade to Pro"}
        </button>
      ) : (
        <button
          onClick={() => go("/api/stripe/portal")}
          disabled={loading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Manage billing"}
        </button>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
