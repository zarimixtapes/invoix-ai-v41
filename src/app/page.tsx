import Link from "next/link";

import { NavBar } from "@/components/NavBar";

const features = [
  {
    title: "AI-drafted invoices",
    body: "Paste a few rough notes about the work you did — Invoix AI turns them into clean, professional line items in seconds.",
  },
  {
    title: "Automatic payment reminders",
    body: "When an invoice goes overdue, Invoix AI drafts a polite-but-firm follow-up email so you never have to chase a client awkwardly again.",
  },
  {
    title: "One dashboard for cash flow",
    body: "See exactly what's outstanding, what's overdue, and what's coming in — across every client, in one place.",
  },
];

export default function HomePage() {
  return (
    <main>
      <NavBar />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get paid faster, without the awkward follow-ups.
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Invoix AI writes your invoices and chases your late payments for you. Built for
          freelancers and small agencies who'd rather do the work than do the admin.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Start free
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Invoix AI. All rights reserved.
      </footer>
    </main>
  );
}
