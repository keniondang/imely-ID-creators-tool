const map: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu review", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Disetujui", cls: "bg-teal/10 text-teal-dark border-teal/20" },
  rejected: { label: "Ditolak", cls: "bg-red-50 text-red-700 border-red-200" },
  unpaid: { label: "Belum dibayar", cls: "bg-ink/5 text-muted border-ink/10" },
  paid: { label: "Sudah dibayar", cls: "bg-teal/10 text-teal-dark border-teal/20" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = map[status] ?? { label: status, cls: "bg-ink/5 text-muted border-ink/10" };
  return (
    <span className={`inline-block text-xs font-semibold rounded-full border px-2.5 py-1 ${s.cls}`}>
      {s.label}
    </span>
  );
}