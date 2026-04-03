"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (mode === "signup") {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      setMessage("Account created. You can now sign in with your password.");
      setIsLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    setIsLoading(false);
  }

  return (
    <section className="w-full rounded-xl border border-[#3a3a3a] bg-[#222] p-6 shadow-lg shadow-black/20">
      <h2 className="mb-2 text-2xl tracking-wide text-[#f0ece4]">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      <p className="mb-6 text-sm text-[#b8b1a8]">
        Use your email and password to access your dashboard quickly.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-md border border-[#444] bg-[#1a1a1a] px-4 py-3 text-[#f0ece4] outline-none transition focus:border-[#c84b2f]"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-[#c84b2f] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#a33a21] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Working..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((prev) => (prev === "login" ? "signup" : "login"));
          setMessage("");
          setError("");
        }}
        className="mt-4 text-sm text-[#b8b1a8] underline hover:text-[#f0ece4]"
      >
        {mode === "login"
          ? "Need an account? Create one"
          : "Already have an account? Sign in"}
      </button>

      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
