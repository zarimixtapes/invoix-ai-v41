"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Invoice = {
  id: string;
  number: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  dueDate: string;
  notes: string | null;
  client: { name: string; email: string; company: string | null };
  items: { id: string; description: string; quantity: number; unitPrice: number }[];
};

const statuses = ["DRAFT", "SENT", "PAID", "OVERDUE"] as const;

export function InvoiceDetailClient({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [status, setStatus] = useState(invoice.status);
  const [updating, setUpdating] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [reminding, setReminding] = useState(false);

  const total = invoice.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  async function handleStatusChange(newStatus: (typeof statuses)[number]) {
    setUpdating(true);
    setStatus(newStatus);
    await fetch(`/api/invoices/${invoice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    router.refresh();
  }

  async function handleRemind() {
    setReminding(true);
    const res = await fetch(`/api/invoices/${invoice.id}/remind`, { method: "POST" });
    const data = await res.json();
    setReminder(data.email);
    setReminding(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{invoice.number}</h1>
        <select
          value={status}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value as (typeof statuses)[number])}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Billed to</p>
        <p className="font-medium text-gray-900">{invoice.client.name}</p>
        <p className="text-sm text-gray-600">{invoice.client.email}</p>

        <table className="mt-6 w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item.description}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">${item.unitPrice.toFixed(2)}</td>
                <td className="py-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end text-sm font-semibold text-gray-900">
          Total: ${total.toFixed(2)}
        </div>
      </div>

      {(status === "OVERDUE" || status === "SENT") && (
        <div className="mt-6">
          <button
            onClick={handleRemind}
            disabled={reminding}
            className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50"
          >
            {reminding ? "Drafting…" : "✨ Draft payment reminder email"}
          </button>
          {reminder && (
            <pre className="mt-3 whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
              {reminder}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
