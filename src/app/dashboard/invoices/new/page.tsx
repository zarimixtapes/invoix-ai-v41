"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = { id: string; name: string };
type Item = { description: string; quantity: number; unitPrice: number };

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [drafting, setDrafting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  function updateItem(index: number, patch: Partial<Item>) {
    setItems((its) => its.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((its) => [...its, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    setItems((its) => its.filter((_, i) => i !== index));
  }

  async function handleAiDraft() {
    if (!notes.trim()) return;
    setDrafting(true);
    setError(null);
    const res = await fetch("/api/ai/draft-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setDrafting(false);
    if (!res.ok) {
      setError("Could not draft items");
      return;
    }
    const data = await res.json();
    setItems(data.items);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, dueDate, notes, items }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create invoice");
      return;
    }

    const invoice = await res.json();
    router.push(`/dashboard/invoices/${invoice.id}`);
  }

  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900">New invoice</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select a client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due date</label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rough notes (optional) — let AI draft your line items
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. 10 hours of frontend dev at $75/hr, plus a one-off $200 setup fee"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleAiDraft}
            disabled={drafting || !notes.trim()}
            className="mt-2 rounded-md border border-brand-600 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50"
          >
            {drafting ? "Drafting…" : "✨ AI draft line items"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Line items</label>
          <div className="mt-2 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  required
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  type="number"
                  min={0}
                  step="any"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  type="number"
                  min={0}
                  step="any"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-xs font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            + Add line item
          </button>
        </div>

        <p className="text-sm text-gray-700">
          Total: <span className="font-semibold">${total.toFixed(2)}</span>
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create invoice"}
        </button>
      </form>
    </div>
  );
}
