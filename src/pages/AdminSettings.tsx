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

export default function AdminSettings() {
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("program_settings").select("*").eq("id", 1).single().then(({ data }) => {
      setS(data);
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: string) => {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    setS((p: any) => ({ ...p, [k]: isNaN(n) ? 0 : n }));
  };

  async function save() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const patch: any = { updated_at: new Date().toISOString() };
    fields.forEach((f) => (patch[f.key] = s[f.key]));
    const { error } = await supabase.from("program_settings").update(patch).eq("id", 1);
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Tarif tersimpan. Perhitungan baru akan memakai nilai ini.");
  }

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;
  if (!s) return <p className="text-sm text-muted">Pengaturan tidak ditemukan.</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-teal-dark">Pengaturan tarif</h1>
        <p className="text-sm text-muted mt-1">
          Ubah tarif & bonus program. Nilai ini dipakai untuk menghitung saran
          pembayaran. Submission lama yang sudah final tidak berubah.
        </p>
      </div>

      {msg && <p className="text-sm text-teal-dark bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">{msg}</p>}
      {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

      <div className="rounded-2xl bg-white border border-ink/5 p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-sm font-semibold text-ink">{f.label}</label>
            <div className="relative">
              {moneyFields.has(f.key) && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">Rp</span>
              )}
              <input
                inputMode="numeric"
                value={Number(s[f.key]).toLocaleString("id-ID")}
                onChange={(e) => set(f.key, e.target.value)}
                className={`w-full rounded-xl border border-ink/15 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 ${
                  moneyFields.has(f.key) ? "pl-10 pr-3.5" : "px-3.5"
                }`}
              />
            </div>
            <p className="text-xs text-muted">{f.help}</p>
          </div>
        ))}

        <button onClick={save} disabled={saving}
          className="rounded-xl bg-teal px-5 py-2.5 text-white font-bold hover:bg-teal-dark transition disabled:opacity-50">
          {saving ? "Menyimpan…" : "Simpan tarif"}
        </button>
      </div>

      {/* Live example using current values */}
      <div className="rounded-2xl bg-ink/[0.03] border border-ink/5 p-5 text-sm">
        <p className="font-semibold mb-2">Contoh perhitungan video</p>
        <p className="text-muted leading-relaxed">
          9.000 views = fee dasar Rp {Number(s.video_base_fee).toLocaleString("id-ID")} +{" "}
          {Math.floor(9000 / s.video_per_view_interval)} ×{" "}
          Rp {Number(s.video_per_view_bonus).toLocaleString("id-ID")} ={" "}
          <strong className="text-ink">
            Rp {Math.min(
              s.video_base_fee + Math.floor(9000 / s.video_per_view_interval) * s.video_per_view_bonus,
              s.video_cap
            ).toLocaleString("id-ID")}
          </strong>
          {" "}(batas Rp {Number(s.video_cap).toLocaleString("id-ID")})
        </p>
      </div>
    </div>
  );
}