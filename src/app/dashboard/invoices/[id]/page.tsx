import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { InvoiceDetailClient } from "./InvoiceDetailClient";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const userId = (await getCurrentUserId())!;

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, items: true },
  });

  if (!invoice || invoice.userId !== userId) {
    notFound();
  }

  type Status = "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  return (
    <InvoiceDetailClient
      invoice={{
        ...invoice,
        status: invoice.status as Status,
        dueDate: invoice.dueDate.toISOString(),
      }}
    />
  );
}
