import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dressilo",
  description: "Dressilo e-commerce app"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  const dbUser = userId
    ? await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { role: true }
      })
    : null;

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-lg font-bold">
                Dressilo
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/">Shop</Link>
                <Link href="/checkout">Checkout</Link>
                <Link href="/messages">Messages</Link>
                {dbUser?.role === "ADMIN" && (
                  <SignedIn>
                    <Link href="/admin/users">Admin Users</Link>
                  </SignedIn>
                )}
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
