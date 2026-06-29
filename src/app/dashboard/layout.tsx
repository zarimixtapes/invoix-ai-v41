import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/session";
import { SignOutButton } from "@/components/SignOutButton";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6">
        <Link href="/" className="block px-2 text-lg font-bold text-gray-900">
          Invoix <span className="text-brand-600">AI</span>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-3">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 px-8 py-8">{children}</main>
    </div>
  );
}
