import { AuthForm } from "@/components/auth-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 md:px-8">
      <section className="mb-10 border-b border-[#333] pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
          Daily Logger
        </p>
        <h1 className="text-5xl font-bold uppercase tracking-wide text-[#f0ece4] md:text-7xl">
          Iron <span className="text-[#c84b2f]">Check-In</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#b8b1a8] md:text-base">
          A minimalist daily check-in app for athletes. Log today&apos;s numbers, recovery, and
          habits in under 60 seconds.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <AuthForm />

        <section className="rounded-xl border border-[#3a3a3a] bg-[#202020] p-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
            How it works
          </p>
          <ol className="space-y-3 text-sm text-[#d4cfc6]">
            <li>1. Enter your email and open the magic link.</li>
            <li>2. You&apos;ll land on your protected dashboard.</li>
            <li>3. Submit one check-in per day and review history below.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
