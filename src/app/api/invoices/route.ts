import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const itemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1),
  dueDate: z.string().min(1),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(itemSchema).min(1),
});

const FREE_MONTHLY_INVOICE_LIMIT = 5;

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: parsed.data.clientId } });
  if (!client || client.userId !== userId) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.plan === "FREE") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const count = await prisma.invoice.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });
    if (count >= FREE_MONTHLY_INVOICE_LIMIT) {
      return NextResponse.json(
        {
          error: `Free plan is limited to ${FREE_MONTHLY_INVOICE_LIMIT} invoices per month. Upgrade to Pro for unlimited invoices.`,
        },
        { status: 403 },
      );
    }
  }

  const invoiceCount = await prisma.invoice.count({ where: { userId } });
  const number = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      number,
      userId,
      clientId: parsed.data.clientId,
      dueDate: new Date(parsed.data.dueDate),
      notes: parsed.data.notes ?? null,
      items: { create: parsed.data.items },
    },
    include: { client: true, items: true },
  });

  return NextResponse.json(invoice, { status: 201 });
}
