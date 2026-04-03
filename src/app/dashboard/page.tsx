"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { CheckInForm } from "@/components/check-in-form";
import { CheckInList } from "@/components/check-in-list";
import { TrendCharts } from "@/components/trend-charts";
import { supabase } from "@/lib/supabase";
import type { CheckIn, CheckInInsert } from "@/types/check-in";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingCheckIn, setEditingCheckIn] = useState<CheckIn | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const userId = session?.user.id;

  async function loadCheckIns(currentUserId: string) {
    const { data, error: listError } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", currentUserId)
      .order("check_in_date", { ascending: false });

    if (listError) {
      setError(listError.message);
      return;
    }

    setCheckIns((data as CheckIn[]) ?? []);
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(currentSession);

      if (!currentSession?.user) {
        router.replace("/");
        setIsLoading(false);
        return;
      }

      await loadCheckIns(currentSession.user.id);
      setIsLoading(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        router.replace("/");
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const alreadyCheckedInToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return checkIns.some((item) => item.check_in_date === today);
  }, [checkIns]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmitCheckIn(payload: CheckInInsert) {
    if (!userId) return;

    setError("");
    setIsSubmitting(true);

    const duplicate = checkIns.find((item) => item.check_in_date === payload.check_in_date);
    if (duplicate) {
      setError("You already submitted a check-in for that date.");
      setToast({ type: "error", text: "You already have a check-in for that date." });
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("check_ins").insert({
      ...payload,
      user_id: userId,
    });

    if (insertError) {
      setError(insertError.message);
      setToast({ type: "error", text: "Could not save check-in." });
      setIsSubmitting(false);
      return;
    }

    await loadCheckIns(userId);
    setToast({ type: "success", text: "Check-in saved." });
    setIsSubmitting(false);
  }

  async function handleUpdateCheckIn(payload: CheckInInsert) {
    if (!userId || !editingCheckIn) return;
    setError("");
    setIsSubmitting(true);

    const { error: updateError } = await supabase
      .from("check_ins")
      .update(payload)
      .eq("id", editingCheckIn.id)
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
      setToast({ type: "error", text: "Could not update check-in." });
      setIsSubmitting(false);
      return;
    }

    setEditingCheckIn(null);
    await loadCheckIns(userId);
    setToast({ type: "success", text: "Check-in updated." });
    setIsSubmitting(false);
  }

  async function handleDeleteCheckIn(checkIn: CheckIn) {
    if (!userId) return;
    const confirmed = window.confirm(
      `Delete check-in for ${checkIn.check_in_date}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setError("");
    const { error: deleteError } = await supabase
      .from("check_ins")
      .delete()
      .eq("id", checkIn.id)
      .eq("user_id", userId);

    if (deleteError) {
      setError(deleteError.message);
      setToast({ type: "error", text: "Could not delete check-in." });
      return;
    }

    if (editingCheckIn?.id === checkIn.id) {
      setEditingCheckIn(null);
    }
    await loadCheckIns(userId);
    setToast({ type: "success", text: "Check-in deleted." });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-14 text-[#b8b1a8] md:px-8">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 md:px-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#333] pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#f0ece4] md:text-4xl">
            Daily Check-In
          </h1>
          <p className="mt-2 text-sm text-[#b8b1a8]">{session?.user.email}</p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-[#555] px-4 py-2 text-sm text-[#f0ece4] transition hover:border-[#c84b2f] hover:text-[#c84b2f]"
        >
          Sign out
        </button>
      </section>

      {alreadyCheckedInToday ? (
        <p className="mb-5 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          You&apos;ve already checked in today. Nice consistency.
        </p>
      ) : null}

      {error ? (
        <p className="mb-5 rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {toast ? (
        <p
          className={`mb-5 rounded-md px-4 py-3 text-sm ${
            toast.type === "success"
              ? "border border-emerald-800 bg-emerald-950/40 text-emerald-300"
              : "border border-red-800 bg-red-950/40 text-red-300"
          }`}
        >
          {toast.text}
        </p>
      ) : null}

      <section className="space-y-6">
        {editingCheckIn ? (
          <div>
            <h2 className="mb-3 text-xl text-[#f0ece4]">Edit Check-In</h2>
            <CheckInForm
              onSubmitCheckIn={handleUpdateCheckIn}
              isSubmitting={isSubmitting}
              submitLabel="Update Check-In"
              initialValues={{
                check_in_date: editingCheckIn.check_in_date,
                weight: Number(editingCheckIn.weight),
                training_done: editingCheckIn.training_done,
                protein_hit: editingCheckIn.protein_hit,
                creatine_hit: editingCheckIn.creatine_hit,
                steps: editingCheckIn.steps,
                mood: editingCheckIn.mood,
                energy: editingCheckIn.energy,
                notes: editingCheckIn.notes ?? "",
              }}
              onCancel={() => setEditingCheckIn(null)}
            />
          </div>
        ) : (
          <CheckInForm onSubmitCheckIn={handleSubmitCheckIn} isSubmitting={isSubmitting} />
        )}

        <div>
          <h2 className="mb-4 text-xl text-[#f0ece4]">Trends</h2>
          <TrendCharts checkIns={checkIns} />
        </div>

        <div>
          <h2 className="mb-4 text-xl text-[#f0ece4]">Previous Check-Ins</h2>
          <CheckInList
            checkIns={checkIns}
            onEdit={(checkIn) => setEditingCheckIn(checkIn)}
            onDelete={handleDeleteCheckIn}
          />
        </div>
      </section>
    </main>
  );
}
