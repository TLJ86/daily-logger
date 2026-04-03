import type { CheckIn } from "@/types/check-in";

type CheckInListProps = {
  checkIns: CheckIn[];
  onEdit: (checkIn: CheckIn) => void;
  onDelete: (checkIn: CheckIn) => Promise<void>;
};

export function CheckInList({ checkIns, onEdit, onDelete }: CheckInListProps) {
  if (!checkIns.length) {
    return (
      <div className="rounded-xl border border-[#3a3a3a] bg-[#222] p-6 text-[#b8b1a8]">
        No check-ins yet. Submit your first one above.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {checkIns.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-[#3a3a3a] bg-[#222] p-5 shadow-lg shadow-black/10"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#333] pb-3">
            <h3 className="font-semibold text-[#f0ece4]">{item.check_in_date}</h3>
            <p className="text-sm text-[#9f978c]">{new Date(item.created_at).toLocaleString()}</p>
          </div>

          <div className="grid gap-3 text-sm text-[#d4cfc6] md:grid-cols-3">
            <Stat label="Weight" value={`${item.weight} kg`} />
            <Stat label="Steps" value={item.steps.toLocaleString()} />
            <Stat label="Mood / Energy" value={`${item.mood} / ${item.energy}`} />
            <Stat label="Training" value={item.training_done ? "Yes" : "No"} />
            <Stat label="Protein" value={item.protein_hit ? "Hit" : "Missed"} />
            <Stat label="Creatine" value={item.creatine_hit ? "Hit" : "Missed"} />
          </div>

          {item.notes ? <p className="mt-4 text-sm text-[#b8b1a8]">{item.notes}</p> : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-md border border-[#555] px-3 py-1.5 text-xs uppercase tracking-wider text-[#f0ece4] hover:border-[#c84b2f]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-md border border-red-800 px-3 py-1.5 text-xs uppercase tracking-wider text-red-300 hover:bg-red-950/40"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#1b1b1b] px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#888]">{label}</p>
      <p className="mt-1 text-[#f0ece4]">{value}</p>
    </div>
  );
}
