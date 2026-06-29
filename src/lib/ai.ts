import Anthropic from "@anthropic-ai/sdk";

type DraftedItem = { description: string; quantity: number; unitPrice: number };

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function mockDraftItems(notes: string): DraftedItem[] {
  return [{ description: notes.trim() || "Professional services rendered", quantity: 1, unitPrice: 100 }];
}

export async function draftInvoiceItems(notes: string): Promise<DraftedItem[]> {
  if (!client) return mockDraftItems(notes);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system:
      "You convert a freelancer's rough work notes into invoice line items. " +
      'Respond with ONLY a JSON array like [{"description": string, "quantity": number, "unitPrice": number}]. No prose, no markdown fences.',
    messages: [{ role: "user", content: notes }],
  });

  const text = message.content.find((block) => block.type === "text")?.text ?? "[]";
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    return mockDraftItems(notes);
  } catch {
    return mockDraftItems(notes);
  }
}

function mockReminderEmail(clientName: string, invoiceNumber: string, amount: number, daysOverdue: number) {
  return (
    `Subject: Friendly reminder — Invoice ${invoiceNumber} is overdue\n\n` +
    `Hi ${clientName},\n\n` +
    `Just a quick note that invoice ${invoiceNumber} for $${amount.toFixed(2)} is now ${daysOverdue} day(s) past due. ` +
    `Could you let me know the status of payment when you get a chance? Happy to resend the invoice or answer any questions.\n\n` +
    `Thanks so much,\n`
  );
}

export async function draftReminderEmail(
  clientName: string,
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
): Promise<string> {
  if (!client) return mockReminderEmail(clientName, invoiceNumber, amount, daysOverdue);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 512,
    system:
      "You write short, polite-but-firm payment reminder emails for freelancers chasing overdue invoices. " +
      "Respond with the email subject and body only, no extra commentary.",
    messages: [
      {
        role: "user",
        content: `Client name: ${clientName}\nInvoice number: ${invoiceNumber}\nAmount due: $${amount.toFixed(2)}\nDays overdue: ${daysOverdue}`,
      },
    ],
  });

  return message.content.find((block) => block.type === "text")?.text ?? mockReminderEmail(clientName, invoiceNumber, amount, daysOverdue);
}
