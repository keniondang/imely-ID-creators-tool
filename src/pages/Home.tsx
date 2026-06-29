import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import UpdateRequestBanner from "../components/UpdateRequestBanner";
import {
  getCreatorStats,
  getAdminStats,
  CreatorStats,
  AdminStats,
  ProgramStats,
} from "../lib/stats";

const rupiah = (n: number) => "Rp " + (n ?? 0).toLocaleString("id-ID");

/* ===== Beranda hero — the dark aurora bridge element ===== */
function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-ink text-white p-7 sm:p-9">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/2 -right-10 h-72 w-72 rounded-full bg-teal/30 blur-[80px] animate-aurora-1" />
        <div className="absolute -bottom-1/2 -left-10 h-64 w-64 rounded-full bg-cyan/20 blur-[80px] animate-aurora-2" />
      </div>
      <h1 className="relative font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="relative mt-2 text-white/70 text-sm sm:text-base max-w-md leading-relaxed">{subtitle}</p>
    </section>
  );
}

/* ===== Program breakdown card ===== */
function ProgramCard({ icon, title, s, accent }: { icon: React.ReactNode; title: string; s: ProgramStats; accent: "teal" | "cyan" }) {
  const cells = [
    { label: "Menunggu", value: s.menunggu, cls: "text-amber-600" },
    { label: "Disetujui", value: s.disetujui, cls: "text-teal-dark" },
    { label: "Ditolak", value: s.ditolak, cls: "text-red-500" },
    { label: "Dibayar", value: s.dibayar, cls: "text-teal-dark" },
  ];
  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent === "teal" ? "bg-teal/10 text-teal-dark" : "bg-cyan/10 text-cyan-dark"}`}>
            {icon}
          </span>
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold leading-none">{s.dikirim}</p>
          <p className="text-[11px] text-muted">dikirim</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cells.map((c) => (
          <div key={c.label} className={`rounded-xl px-2 py-2 text-center ${accent === "teal" ? "bg-teal/5" : "bg-cyan/5"}`}>
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal to-teal-dark text-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <p className="relative text-xs text-white/80">{label}</p>
      <p className="relative text-2xl font-extrabold mt-1">{value}</p>
      {sub && <p className="relative text-xs text-white/70 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatPill({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "alert" }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tone === "alert" ? "bg-amber-50 border-amber-200" : "bg-white border-ink/5"}`}>
      <p className={`text-3xl font-extrabold leading-none ${tone === "alert" ? "text-amber-700" : "text-ink"}`}>{value}</p>
      <p className="text-xs text-muted mt-1.5">{label}</p>
    </div>
  );
}

/* simple inline icons */
const MaskIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M3 5h18v6a9 9 0 0 1-18 0V5Zm5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);
const VideoIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
  </svg>
);

/* ===== Admin: Google Sheet sync ===== */
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
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${sess.session?.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Gagal");
      setMsg(`Tersinkron: ${data.counts.karakter} karakter, ${data.counts.video} video, ${data.counts.kreator} kreator.`);
    } catch (e: any) {
      setErr(e.message ?? "Gagal sinkron.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-bold text-sm">Dokumentasi Google Sheet</p>
        <p className="text-xs text-muted mt-0.5">Tulis ulang seluruh data ke Sheet (Karakter, Video, Kreator).</p>
        {msg && <p className="text-xs text-teal-dark mt-1">{msg}</p>}
        {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
      </div>
      <button
        onClick={sync}
        disabled={busy}
        className="rounded-full bg-gradient-to-r from-mint to-teal px-6 py-2.5 text-ink text-sm font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {busy ? "Menyinkron…" : "Sync ke Sheet"}
      </button>
    </div>
  );
}

/* ===== Creator: support contact card ===== */
function SupportCard() {
  const channels = [
    { label: "Admin (WhatsApp)", value: "+84 0373 485 762 (Keni)", href: "#" },
    { label: "Grup WA Kreator", value: "chat.whatsapp.com/LkvYoznbe3SFCtvb1J1rvK", href: "https://chat.whatsapp.com/LkvYoznbe3SFCtvb1J1rvK" },
    { label: "Discord", value: "discord.gg/dXKGvEWDy", href: "https://discord.gg/dXKGvEWDy" },
  ];
  return (
    <section className="rounded-2xl bg-white border border-ink/5 shadow-sm p-5 space-y-3">
      <div>
        <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase">Bantuan</p>
        <h2 className="font-bold mt-1">Butuh bantuan?</h2>
        <p className="text-xs text-muted mt-0.5">Ada pertanyaan soal pendaftaran, karya, atau pembayaran? Hubungi kami.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {channels.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
            className="rounded-xl border border-ink/10 p-3 hover:border-teal/40 hover:bg-teal/[0.03] transition">
            <p className="text-xs font-semibold text-ink">{c.label}</p>
            <p className="text-[11px] text-muted truncate">{c.value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { profile } = useAuth();
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
        <UpdateRequestBanner />
        <Hero title="Ringkasan Program" subtitle="Pantau kreator, review, dan pembayaran." />

        {!aStats ? (
          <p className="text-sm text-muted">Memuat statistik…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link to="/admin/persetujuan">
                <StatPill label="Menunggu persetujuan akun" value={aStats.pendingAccounts} tone={aStats.pendingAccounts > 0 ? "alert" : "default"} />
              </Link>
              <StatPill label="Kreator aktif" value={aStats.activeCreators} />
              <StatPill label="Jumlah pembayaran" value={aStats.jumlahPembayaran} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProgramCard icon={MaskIcon} title="Karakter" s={aStats.karakter} accent="teal" />
              <ProgramCard icon={VideoIcon} title="Video" s={aStats.video} accent="cyan" />
            </div>

            <MoneyCard label="Total dibayar (program)" value={rupiah(aStats.totalDibayar)} sub={`${aStats.jumlahPembayaran} pembayaran`} />
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
            Akunmu sedang <strong>menunggu review admin</strong>. Kamu sudah bisa melengkapi profil & info
            pembayaran, tapi belum bisa mengirim karya sampai disetujui.
          </p>
        </div>
      )}
      {status === "rejected" && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
          <span className="text-xl leading-none">✕</span>
          <p className="text-sm text-red-700 leading-relaxed">Maaf, pendaftaranmu belum bisa kami terima saat ini.</p>
        </div>
      )}

      <Hero title="Halo, Kreator Imely 👋" subtitle="Ringkasan karyamu ada di bawah. Kirim karya baru lewat tab Kirim." />

      {!cStats ? (
        <p className="text-sm text-muted">Memuat statistik…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProgramCard icon={MaskIcon} title="Karakter" s={cStats.karakter} accent="teal" />
            <ProgramCard icon={VideoIcon} title="Video" s={cStats.video} accent="cyan" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyCard label="Total sudah dibayar" value={rupiah(cStats.totalDibayar)} />
            <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-5">
              <p className="text-xs text-muted">Menunggu pembayaran</p>
              <p className="text-2xl font-extrabold mt-1">{rupiah(cStats.menungguBayar.amount)}</p>
              <p className="text-xs text-muted mt-0.5">{cStats.menungguBayar.count} karya disetujui</p>
            </div>
          </div>
        </>
      )}

      <SupportCard />
    </div>
  );
}