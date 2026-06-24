import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import {
  getCreatorStats,
  getAdminStats,
  CreatorStats,
  AdminStats,
  ProgramStats,
} from "../lib/stats";

const rupiah = (n: number) => "Rp " + (n ?? 0).toLocaleString("id-ID");

/* A program breakdown card (Karakter / Video) */
function ProgramCard({
  icon,
  title,
  s,
  accent,
}: {
  icon: string;
  title: string;
  s: ProgramStats;
  accent: "teal" | "cyan";
}) {
  const cells = [
    { label: "Menunggu", value: s.menunggu, cls: "text-amber-600" },
    { label: "Disetujui", value: s.disetujui, cls: "text-teal-dark" },
    { label: "Ditolak", value: s.ditolak, cls: "text-red-500" },
    { label: "Dibayar", value: s.dibayar, cls: "text-teal-dark" },
  ];
  return (
    <div className="rounded-2xl bg-white border border-ink/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold leading-none">{s.dikirim}</p>
          <p className="text-[11px] text-muted">dikirim</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cells.map((c) => (
          <div key={c.label} className={`rounded-xl px-2 py-2 text-center bg-${accent}/5`}>
            <p className={`text-lg font-extrabold leading-none ${c.cls}`}>{c.value}</p>
            <p className="text-[10px] text-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoneyCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-teal to-teal-dark text-white p-5">
      <p className="text-xs text-white/80">{label}</p>
      <p className="text-2xl font-extrabold mt-1">{value}</p>
      {sub && <p className="text-xs text-white/70 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "alert";
}) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "alert" ? "bg-amber-50 border-amber-200" : "bg-white border-ink/5"}`}>
      <p className={`text-3xl font-extrabold leading-none ${tone === "alert" ? "text-amber-700" : "text-ink"}`}>{value}</p>
      <p className="text-xs text-muted mt-1.5">{label}</p>
    </div>
  );
}

/* Admin-only: push all data to the Google Sheet */
function SheetSync() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-sheet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${sess.session?.access_token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Gagal");
      setMsg(
        `Tersinkron: ${data.counts.karakter} karakter, ${data.counts.video} video, ${data.counts.kreator} kreator.`
      );
    } catch (e: any) {
      setErr(e.message ?? "Gagal sinkron.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-ink/5 p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-bold text-sm">Dokumentasi Google Sheet</p>
        <p className="text-xs text-muted mt-0.5">
          Tulis ulang seluruh data ke Sheet (Karakter, Video, Kreator).
        </p>
        {msg && <p className="text-xs text-teal-dark mt-1">{msg}</p>}
        {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
      </div>
      <button
        onClick={sync}
        disabled={busy}
        className="rounded-xl bg-teal px-5 py-2.5 text-white text-sm font-bold hover:bg-teal-dark transition disabled:opacity-50"
      >
        {busy ? "Menyinkron…" : "Sync ke Sheet"}
      </button>
    </div>
  );
}

export default function Home() {
  const { profile, session } = useAuth();
  const isAdmin = profile?.role === "admin";
  const status = profile?.account_status;

  const [cStats, setCStats] = useState<CreatorStats | null>(null);
  const [aStats, setAStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (isAdmin) getAdminStats().then(setAStats);
    else getCreatorStats().then(setCStats);
  }, [isAdmin]);

  /* ----- ADMIN ----- */
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <section className="relative isolate overflow-hidden rounded-3xl bg-ink text-white p-7">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-1/2 -right-10 h-72 w-72 rounded-full bg-teal/30 blur-[80px] animate-aurora-1" />
            <div className="absolute -bottom-1/2 -left-10 h-64 w-64 rounded-full bg-cyan/20 blur-[80px] animate-aurora-2" />
          </div>
          <h1 className="relative text-2xl font-extrabold">Ringkasan Program</h1>
          <p className="relative mt-1 text-white/70 text-sm">Pantau kreator, review, dan pembayaran.</p>
        </section>

        {!aStats ? (
          <p className="text-sm text-muted">Memuat statistik…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link to="/admin/persetujuan">
                <StatPill
                  label="Menunggu persetujuan akun"
                  value={aStats.pendingAccounts}
                  tone={aStats.pendingAccounts > 0 ? "alert" : "default"}
                />
              </Link>
              <StatPill label="Kreator aktif" value={aStats.activeCreators} />
              <StatPill label="Jumlah pembayaran" value={aStats.jumlahPembayaran} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProgramCard icon="🎭" title="Karakter" s={aStats.karakter} accent="teal" />
              <ProgramCard icon="🎬" title="Video" s={aStats.video} accent="cyan" />
            </div>

            <MoneyCard
              label="Total dibayar (program)"
              value={rupiah(aStats.totalDibayar)}
              sub={`${aStats.jumlahPembayaran} pembayaran`}
            />

            <SheetSync />
          </>
        )}
      </div>
    );
  }

  /* ----- CREATOR ----- */
  return (
    <div className="space-y-6">
      {status === "pending" && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <span className="text-xl leading-none">⏳</span>
          <p className="text-sm text-amber-800 leading-relaxed">
            Akunmu sedang <strong>menunggu review admin</strong>. Kamu sudah bisa
            melengkapi profil & info pembayaran, tapi belum bisa mengirim karya
            sampai disetujui.
          </p>
        </div>
      )}
      {status === "rejected" && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
          <span className="text-xl leading-none">✕</span>
          <p className="text-sm text-red-700 leading-relaxed">
            Maaf, pendaftaranmu belum bisa kami terima saat ini.
          </p>
        </div>
      )}

      <section className="relative isolate overflow-hidden rounded-3xl bg-ink text-white p-7">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/2 -right-10 h-72 w-72 rounded-full bg-teal/30 blur-[80px] animate-aurora-1" />
          <div className="absolute -bottom-1/2 -left-10 h-64 w-64 rounded-full bg-cyan/20 blur-[80px] animate-aurora-2" />
        </div>
        <h1 className="relative text-2xl font-extrabold">Halo, Kreator Imely 👋</h1>
        <p className="relative mt-2 text-white/70 text-sm leading-relaxed max-w-md">
          Ringkasan karyamu ada di bawah. Kirim karya baru lewat tab Kirim.
        </p>
      </section>

      {!cStats ? (
        <p className="text-sm text-muted">Memuat statistik…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProgramCard icon="🎭" title="Karakter" s={cStats.karakter} accent="teal" />
            <ProgramCard icon="🎬" title="Video" s={cStats.video} accent="cyan" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyCard label="Total sudah dibayar" value={rupiah(cStats.totalDibayar)} />
            <div className="rounded-2xl bg-white border border-ink/5 p-5">
              <p className="text-xs text-muted">Menunggu pembayaran</p>
              <p className="text-2xl font-extrabold mt-1">{rupiah(cStats.menungguBayar.amount)}</p>
              <p className="text-xs text-muted mt-0.5">{cStats.menungguBayar.count} karya disetujui</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}