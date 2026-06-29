import { NextResponse } from "next/server";
import { z } from "zod";

import { draftInvoiceItems } from "@/lib/ai";
import { getCurrentUserId } from "@/lib/session";

const draftSchema = z.object({ notes: z.string().min(1).max(2000) });

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const items = await draftInvoiceItems(parsed.data.notes);
  return NextResponse.json({ items });
}
