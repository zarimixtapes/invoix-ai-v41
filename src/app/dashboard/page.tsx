import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export default async function DashboardOverviewPage() {
  const userId = (await getCurrentUserId())!;

  const [clientCount, invoices] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId },
      include: { items: true },
    }),
  ]);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === "SENT" || inv.status === "OVERDUE")
    .reduce(
      (sum, inv) => sum + inv.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0),
      0,
    );

  const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;
  const paidCount = invoices.filter((inv) => inv.status === "PAID").length;

  const stats = [
    { label: "Clients", value: clientCount },
    { label: "Total invoices", value: invoices.length },
    { label: "Outstanding", value: `$${totalOutstanding.toFixed(2)}` },
    { label: "Overdue", value: overdueCount },
    { label: "Paid", value: paidCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {invoices.length === 0 && (
        <p className="mt-8 text-sm text-gray-500">
          No invoices yet. Head to the Invoices tab to create your first one.
        </p>
      )}
    </div>
  );
}
