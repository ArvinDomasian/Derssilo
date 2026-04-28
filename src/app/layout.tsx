import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dressilo",
  description: "Dressilo e-commerce app"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="mx-auto my-4 w-full max-w-[1400px] rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 bg-white px-5 py-4">
              <nav className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-900">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">D</span>
                    DRESSILO
                  </Link>
                  <div className="hidden items-center gap-5 text-sm text-slate-500 md:flex">
                    <Link href="/" className="border-b-2 border-emerald-600 pb-1 font-medium text-slate-900">
                      Shop
                    </Link>
                    <Link href="/checkout" className="hover:text-slate-900">
                      Checkout
                    </Link>
                    <Link href="/messages" className="hover:text-slate-900">
                      Messages
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <SignedOut>
                    <SignInButton>
                      <button className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-700 hover:bg-slate-50">
                        Sign in
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </nav>
            </header>
            <main className="px-4 py-4 md:px-6 md:py-6">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
