"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-black tracking-tight">
          🔥 Resume<span className="text-accent">Roaster</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-zinc-300">
          <Link href="/roast" className="hover:text-white">
            Roast My Resume
          </Link>
          {status === "authenticated" && (
            <Link href="/history" className="hover:text-white">
              History
            </Link>
          )}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="rounded-full border border-white/15 px-4 py-1.5 hover:bg-white/5"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-accent px-4 py-1.5 font-semibold text-ink hover:opacity-90"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
