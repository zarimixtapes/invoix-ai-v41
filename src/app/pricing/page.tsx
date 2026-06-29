import Link from "next/link";

import { NavBar } from "@/components/NavBar";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For trying things out.",
    features: ["Up to 3 clients", "Up to 5 invoices / month", "Manual invoice creation"],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For freelancers who invoice regularly.",
    features: [
      "Unlimited clients & invoices",
      "AI-drafted invoice line items",
      "AI-drafted payment reminders",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/signup",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h1>
        <p className="mt-4 text-gray-600">Start free. Upgrade when you need the AI features.</p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-6 pb-24 sm:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-8 ${
              tier.highlighted
                ? "border-brand-600 bg-brand-50 shadow-md"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">{tier.name}</h2>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
              {tier.period && <span className="text-sm text-gray-500">{tier.period}</span>}
            </p>
            <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-brand-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className={`mt-8 block rounded-md px-4 py-2 text-center text-sm font-medium ${
                tier.highlighted
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
