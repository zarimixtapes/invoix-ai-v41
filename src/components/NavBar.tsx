import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Invoix <span className="text-brand-600">AI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/pricing" className="hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-gray-900">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
