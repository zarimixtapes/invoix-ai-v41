import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const clientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().max(200).optional().nullable(),
});

const FREE_CLIENT_LIMIT = 3;

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.plan === "FREE") {
    const count = await prisma.client.count({ where: { userId } });
    if (count >= FREE_CLIENT_LIMIT) {
      return NextResponse.json(
        { error: `Free plan is limited to ${FREE_CLIENT_LIMIT} clients. Upgrade to Pro for unlimited clients.` },
        { status: 403 },
      );
    }
  }

  const client = await prisma.client.create({
    data: { ...parsed.data, userId },
  });
  return NextResponse.json(client, { status: 201 });
}
