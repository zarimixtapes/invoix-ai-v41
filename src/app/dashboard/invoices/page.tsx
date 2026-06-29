import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
};

export default async function InvoicesPage() {
  const userId = (await getCurrentUserId())!;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <Link
          href="/dashboard/invoices/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          New invoice
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const amount = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
                return (
                  <tr key={inv.id} className="cursor-pointer hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link href={`/dashboard/invoices/${inv.id}`}>{inv.number}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inv.client.name}</td>
                    <td className="px-4 py-3 text-gray-600">${amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {inv.dueDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
