"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="text-sm text-zinc-400">
        Sign in with Google to save your roasts and revisit them later.
      </p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/roast" })}
        className="w-full rounded-full bg-accent px-6 py-3 font-bold text-ink hover:opacity-90"
      >
        Continue with Google
      </button>
    </div>
  );
}
