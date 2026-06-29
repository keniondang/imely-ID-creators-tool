type Status = string;

/* One consistent pill style; color-coded by status meaning. */
const styles: Record<string, string> = {
  // submission review states
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  menunggu: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-teal/10 text-teal-dark border-teal/20",
  disetujui: "bg-teal/10 text-teal-dark border-teal/20",
  rejected: "bg-red-50 text-red-600 border-red-200",
  ditolak: "bg-red-50 text-red-600 border-red-200",
  // payment states
  unpaid: "bg-ink/5 text-muted border-ink/10",
  belum: "bg-ink/5 text-muted border-ink/10",
  paid: "bg-teal/10 text-teal-dark border-teal/20",
  dibayar: "bg-teal/10 text-teal-dark border-teal/20",
  // account states
  active: "bg-teal/10 text-teal-dark border-teal/20",
  aktif: "bg-teal/10 text-teal-dark border-teal/20",
  inactive: "bg-ink/5 text-muted border-ink/10",
};

const labels: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  unpaid: "Belum dibayar",
  paid: "Dibayar",
  active: "Aktif",
  inactive: "Nonaktif",
};

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const key = status?.toLowerCase?.() ?? "";
  const cls = styles[key] ?? "bg-ink/5 text-muted border-ink/10";
  const text = label ?? labels[key] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {text}
    </span>
  );
}