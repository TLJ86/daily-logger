import type { CheckIn } from "@/types/check-in";

type TrendChartsProps = {
  checkIns: CheckIn[];
};

export function TrendCharts({ checkIns }: TrendChartsProps) {
  const sorted = [...checkIns].sort((a, b) => a.check_in_date.localeCompare(b.check_in_date));
  const lastTen = sorted.slice(-10);

  if (!lastTen.length) {
    return (
      <div className="rounded-xl border border-[#3a3a3a] bg-[#222] p-6 text-[#b8b1a8]">
        Add a few check-ins to unlock your trend charts.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MiniLineChart
        title="Weight"
        color="#c84b2f"
        unit="kg"
        values={lastTen.map((x) => Number(x.weight))}
        labels={lastTen.map((x) => x.check_in_date)}
      />
      <MiniLineChart
        title="Mood"
        color="#7a9e3b"
        unit=""
        values={lastTen.map((x) => x.mood)}
        labels={lastTen.map((x) => x.check_in_date)}
      />
      <MiniLineChart
        title="Energy"
        color="#3b7a9e"
        unit=""
        values={lastTen.map((x) => x.energy)}
        labels={lastTen.map((x) => x.check_in_date)}
      />
    </div>
  );
}

function MiniLineChart({
  title,
  color,
  values,
  labels,
  unit,
}: {
  title: string;
  color: string;
  values: number[];
  labels: string[];
  unit: string;
}) {
  const width = 280;
  const height = 120;
  const padding = 16;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const latest = values[values.length - 1];
  const first = values[0];
  const delta = latest - first;
  const deltaPrefix = delta > 0 ? "+" : "";

  return (
    <article className="rounded-xl border border-[#3a3a3a] bg-[#222] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#9f978c]">{title} trend</p>
      <p className="mt-1 text-2xl font-semibold text-[#f0ece4]">
        {latest}
        {unit ? ` ${unit}` : ""}
      </p>
      <p className="mb-3 text-xs text-[#b8b1a8]">
        Last {values.length} entries: {deltaPrefix}
        {delta.toFixed(1)}
        {unit ? ` ${unit}` : ""}
      </p>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[120px] w-full">
        <polyline fill="none" stroke="#333" strokeWidth="1" points={`${padding},${height - padding} ${width - padding},${height - padding}`} />
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
      </svg>

      <p className="mt-2 text-[11px] text-[#888]">
        {labels[0]} to {labels[labels.length - 1]}
      </p>
    </article>
  );
}
