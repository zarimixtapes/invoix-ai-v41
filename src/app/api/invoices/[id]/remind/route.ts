import { NextResponse } from "next/server";

import { draftReminderEmail } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, items: true },
  });
  if (!invoice || invoice.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const amount = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const daysOverdue = Math.max(
    0,
    Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const email = await draftReminderEmail(invoice.client.name, invoice.number, amount, daysOverdue);
  return NextResponse.json({ email });
}
