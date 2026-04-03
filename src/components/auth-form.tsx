"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    setMessage("Check your inbox for a magic login link.");
    setIsLoading(false);
  }

  return (
    <section className="w-full rounded-xl border border-[#3a3a3a] bg-[#222] p-6 shadow-lg shadow-black/20">
      <h2 className="mb-2 text-2xl tracking-wide text-[#f0ece4]">Email Login</h2>
      <p className="mb-6 text-sm text-[#b8b1a8]">
        Enter your email and we&apos;ll send you a secure magic link.
      </p>

      <form className="space-y-4" onSubmit={handleEmailLogin}>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-[#444] bg-[#1a1a1a] px-4 py-3 text-[#f0ece4] outline-none transition focus:border-[#c84b2f]"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-[#c84b2f] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#a33a21] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
