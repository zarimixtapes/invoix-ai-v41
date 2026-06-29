import type { Metadata } from "next";

import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoix AI — Invoicing that chases payments for you",
  description:
    "AI-assisted invoicing for freelancers and small agencies. Draft invoices in seconds and let Invoix AI follow up on late payments automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
