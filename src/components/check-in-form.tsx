"use client";

import { FormEvent, useState } from "react";
import type { CheckInInsert } from "@/types/check-in";

type CheckInFormProps = {
  onSubmitCheckIn: (payload: CheckInInsert) => Promise<void>;
  isSubmitting: boolean;
};

type CheckInDraft = Omit<CheckInInsert, "user_id">;

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

const initialDraft: CheckInDraft = {
  check_in_date: todayIsoDate(),
  weight: 0,
  training_done: false,
  protein_hit: false,
  creatine_hit: false,
  steps: 0,
  mood: 5,
  energy: 5,
  notes: "",
};

export function CheckInForm({ onSubmitCheckIn, isSubmitting }: CheckInFormProps) {
  const [draft, setDraft] = useState<CheckInDraft>(initialDraft);

  function setField<K extends keyof CheckInDraft>(key: K, value: CheckInDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmitCheckIn({
      ...draft,
      notes: draft.notes?.trim() || null,
    });
    setDraft((prev) => ({ ...initialDraft, check_in_date: prev.check_in_date }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-[#3a3a3a] bg-[#222] p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Check-In Date">
          <input
            type="date"
            required
            value={draft.check_in_date}
            onChange={(event) => setField("check_in_date", event.target.value)}
            className="input"
          />
        </Field>

        <Field label="Weight (kg)">
          <input
            type="number"
            step="0.1"
            min="0"
            required
            value={draft.weight || ""}
            onChange={(event) => setField("weight", Number(event.target.value))}
            className="input"
          />
        </Field>

        <Field label="Steps">
          <input
            type="number"
            min="0"
            required
            value={draft.steps || ""}
            onChange={(event) => setField("steps", Number(event.target.value))}
            className="input"
          />
        </Field>

        <Field label="Mood (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            required
            value={draft.mood}
            onChange={(event) => setField("mood", Number(event.target.value))}
            className="input"
          />
        </Field>

        <Field label="Energy (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            required
            value={draft.energy}
            onChange={(event) => setField("energy", Number(event.target.value))}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Toggle
          checked={draft.training_done}
          onChange={(checked) => setField("training_done", checked)}
          label="Training Done"
        />
        <Toggle
          checked={draft.protein_hit}
          onChange={(checked) => setField("protein_hit", checked)}
          label="Protein Hit"
        />
        <Toggle
          checked={draft.creatine_hit}
          onChange={(checked) => setField("creatine_hit", checked)}
          label="Creatine Hit"
        />
      </div>

      <Field label="Notes">
        <textarea
          rows={4}
          value={draft.notes ?? ""}
          onChange={(event) => setField("notes", event.target.value)}
          className="input resize-y"
          placeholder="How did today feel?"
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#c84b2f] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#a33a21] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Daily Check-In"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-xs uppercase tracking-[0.2em] text-[#c84b2f]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#c84b2f]"
      />
      <span className="text-sm text-[#e3ddd3]">{label}</span>
    </label>
  );
}
