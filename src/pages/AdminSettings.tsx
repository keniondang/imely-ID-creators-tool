import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const fields: { key: string; label: string; help: string }[] = [
  { key: "character_fixed_fee", label: "Fee per karakter disetujui", help: "Bayaran tetap tiap karakter yang disetujui." },
  { key: "breakout_bonus", label: "Bonus Breakout", help: "Bonus saat karakter tembus milestone pesan." },
  { key: "breakout_message_milestone", label: "Milestone pesan Breakout", help: "Jumlah pesan pengguna untuk memicu Breakout." },
  { key: "video_base_fee", label: "Fee dasar video", help: "Bayaran dasar tiap video yang disetujui." },
  { key: "video_per_view_bonus", label: "Bonus per interval views", help: "Tambahan bayaran tiap kelipatan views." },
  { key: "video_per_view_interval", label: "Interval views", help: "Tiap berapa views bonus diberikan." },
  { key: "video_cap", label: "Batas maksimal video", help: "Bayaran maksimal per video." },
];

const moneyFields = new Set([
  "character_fixed_fee",
  "breakout_bonus",
  "video_base_fee",
  "video_per_view_bonus",
  "video_cap",
]);

const primaryBtn =
  "rounded-full bg-gradient-to-r from-mint to-teal px-6 py-2.5 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryBtn =
  "rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-muted hover:text-ink hover:bg-ink/5 transition disabled:opacity-50";

function fmtValue(key: string, val: number): string {
  const n = Number(val).toLocaleString("id-ID");
  return moneyFields.has(key) ? `Rp ${n}` : n;
}

export default function AdminSettings() {
  // saved = source of truth; draft = what's being edited
  const [saved, setSaved] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("program_settings").select("*").eq("id", 1).single().then(({ data }) => {
      setSaved(data);
      setDraft(data);
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: string) => {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    setDraft((p: any) => ({ ...p, [k]: isNaN(n) ? 0 : n }));
  };

  function startEdit() {
    setDraft(saved);
    setEditing(true);
    setMsg(null);
    setErr(null);
  }
  function cancelEdit() {
    setDraft(saved);
    setEditing(false);
    setErr(null);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const patch: any = { updated_at: new Date().toISOString() };
    fields.forEach((f) => (patch[f.key] = draft[f.key]));
    const { error } = await supabase.from("program_settings").update(patch).eq("id", 1);
    setSaving(false);
    if (error) return setErr(error.message);
    setSaved(draft);
    setEditing(false);
  }

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;
  if (!saved) return <p className="text-sm text-muted">Pengaturan tidak ditemukan.</p>;

  // which values to show in the live example (draft while editing, saved otherwise)
  const live = editing ? draft : saved;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase mb-1">Pengaturan</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Pengaturan tarif</h1>
        <p className="text-sm text-muted mt-1">
          Ubah tarif & bonus program. Nilai ini dipakai untuk menghitung saran
          pembayaran. 
        </p>
      </div>

      {msg && <p className="text-sm text-teal-dark bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">{msg}</p>}
      {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

      <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Tarif & bonus</h2>
          {!editing && (
            <button onClick={startEdit} className="text-sm font-semibold text-teal-dark hover:underline shrink-0">
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          /* ---- VIEW MODE (locked) ---- */
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <p className="text-xs text-muted">{f.label}</p>
                <p className="text-lg font-extrabold text-ink mt-0.5">{fmtValue(f.key, saved[f.key])}</p>
                <p className="text-[11px] text-muted mt-0.5">{f.help}</p>
              </div>
            ))}
          </div>
        ) : (
          /* ---- EDIT MODE ---- */
          <div className="space-y-5">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-sm font-semibold text-ink">{f.label}</label>
                <div className="relative">
                  {moneyFields.has(f.key) && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">Rp</span>
                  )}
                  <input
                    inputMode="numeric"
                    value={Number(draft[f.key]).toLocaleString("id-ID")}
                    onChange={(e) => set(f.key, e.target.value)}
                    className={`w-full rounded-xl border border-ink/15 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 ${
                      moneyFields.has(f.key) ? "pl-10 pr-3.5" : "px-3.5"
                    }`}
                  />
                </div>
                <p className="text-xs text-muted">{f.help}</p>
              </div>
            ))}

            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className={primaryBtn}>
                {saving ? "Menyimpan…" : "Simpan tarif"}
              </button>
              <button onClick={cancelEdit} disabled={saving} className={secondaryBtn}>
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live example — uses draft while editing, saved otherwise */}
      <div className="rounded-2xl bg-ink/[0.03] border border-ink/5 p-5 text-sm">
        <p className="font-semibold mb-2">Contoh perhitungan video</p>
        <p className="text-muted leading-relaxed">
          9.000 views = fee dasar Rp {Number(live.video_base_fee).toLocaleString("id-ID")} +{" "}
          {Math.floor(9000 / live.video_per_view_interval)} ×{" "}
          Rp {Number(live.video_per_view_bonus).toLocaleString("id-ID")} ={" "}
          <strong className="text-ink">
            Rp {Math.min(
              live.video_base_fee + Math.floor(9000 / live.video_per_view_interval) * live.video_per_view_bonus,
              live.video_cap
            ).toLocaleString("id-ID")}
          </strong>
          {" "}(batas Rp {Number(live.video_cap).toLocaleString("id-ID")})
        </p>
      </div>
    </div>
  );
}