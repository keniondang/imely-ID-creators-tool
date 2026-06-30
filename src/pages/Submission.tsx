import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { submitCharacter, submitVideo, hasPaymentInfo } from "../lib/submissions";

const input =
  "w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-transparent transition";
const label = "text-sm font-medium text-ink/80";
const primaryBtn =
  "rounded-full bg-gradient-to-r from-mint to-teal px-6 py-2.5 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0";

function externalUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "#";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

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

const MaskIconSm = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M3 5h18v6a9 9 0 0 1-18 0V5Zm5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);
const VideoIconSm = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
  </svg>
);

const tabCls = (active: boolean) =>
  `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
    active
      ? "bg-gradient-to-r from-mint to-teal text-ink shadow-sm shadow-teal/30"
      : "bg-white border border-ink/10 text-muted hover:text-ink"
  }`;

export default function Submission() {
  const { session, profile } = useAuth();
  const active = profile?.account_status === "active";
  const uid = session?.user.id;

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"karakter" | "video">("karakter");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [cName, setCName] = useState("");
  const [cLink, setCLink] = useState("");
  const [cBreakout, setCBreakout] = useState(false);
  const [cBusy, setCBusy] = useState(false);

  const [vLink, setVLink] = useState("");
  const [vViews, setVViews] = useState("");
  const [vShot, setVShot] = useState("");
  const [vBusy, setVBusy] = useState(false);

  async function load() {
    const { data: cr } = await supabase.from("creators").select("*").single();
    setCreator(cr);
    if (!cr?.program_karakter && cr?.program_konten) setTab("video");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCharacter() {
    setErr(null);
    setMsg(null);
    if (!cName.trim() || !cLink.trim()) return setErr("Nama & link karakter wajib diisi.");
    setCBusy(true);
    const { error } = await submitCharacter(uid!, cName.trim(), externalUrl(cLink), cBreakout);
    setCBusy(false);
    if (error) return setErr(error.message);
    setCName("");
    setCLink("");
    setCBreakout(false);
    setMsg("Karakter berhasil dikirim. Lihat statusnya di tab Riwayat.");
  }

  async function handleVideo() {
    setErr(null);
    setMsg(null);
    if (!vLink.trim()) return setErr("Link TikTok wajib diisi.");
    const views = parseInt(vViews, 10);
    if (isNaN(views) || views < 0) return setErr("Jumlah views tidak valid.");
    setVBusy(true);
    const { error } = await submitVideo(
      uid!,
      externalUrl(vLink),
      views,
      vShot.trim() ? externalUrl(vShot) : null
    );
    setVBusy(false);
    if (error) return setErr(error.message);
    setVLink("");
    setVViews("");
    setVShot("");
    setMsg("Video berhasil dikirim. Lihat statusnya di tab Riwayat.");
  }

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;

  const inKarakter = creator?.program_karakter;
  const inKonten = creator?.program_konten;
  const paymentReady = hasPaymentInfo(creator);
  const canSubmit = active && paymentReady;

  // Which form to show: respect tab only when in both programs.
  const showKarakter = inKarakter && (tab === "karakter" || !inKonten);
  const showVideo = inKonten && (tab === "video" || !inKarakter);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase mb-1">Kirim</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Kirim Karya</h1>
      </div>

      {!active && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <span className="text-xl leading-none">🔒</span>
          <p className="text-sm text-amber-800 leading-relaxed">
            Kamu bisa mengirim karya setelah akun disetujui admin. Sambil
            menunggu, pastikan profil & info pembayaranmu lengkap.
          </p>
        </div>
      )}

      {active && !paymentReady && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <span className="text-xl leading-none">💳</span>
          <div className="text-sm text-amber-800 leading-relaxed">
            <p className="font-semibold">Lengkapi info pembayaran dulu</p>
            <p className="mt-0.5">
              Kamu belum bisa mengirim karya sampai info rekening / e-wallet
              diisi, supaya kami bisa membayarmu.
            </p>
            <Link
              to="/profil"
              className="inline-block mt-2 rounded-full bg-amber-600 text-white px-4 py-2 text-xs font-bold hover:bg-amber-700 transition"
            >
              Isi info pembayaran →
            </Link>
          </div>
        </div>
      )}

      {msg && (
        <p className="text-sm text-teal-dark bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">{msg}</p>
      )}
      {err && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>
      )}

      {/* Tabs — only when creator is in both programs */}
      {inKarakter && inKonten && (
        <div className="flex gap-2">
          <button className={tabCls(tab === "karakter")} onClick={() => { setTab("karakter"); setMsg(null); setErr(null); }}>
            {MaskIconSm} Karakter
          </button>
          <button className={tabCls(tab === "video")} onClick={() => { setTab("video"); setMsg(null); setErr(null); }}>
            {VideoIconSm} Video
          </button>
        </div>
      )}

      {/* CHARACTER */}
      {showKarakter && (
        <section className="rounded-2xl bg-white border border-ink/5 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal-dark">
              {MaskIcon}
            </span>
            <h2 className="font-bold">Kirim Karakter</h2>
          </div>
          {canSubmit ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className={label}>Nama karakter</label>
                <input className={input} value={cName} onChange={(e) => setCName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Link karakter</label>
                <input className={input} value={cLink} onChange={(e) => setCLink(e.target.value)} placeholder="Link ke karakter di Imely" />
              </div>

              <button
                type="button"
                onClick={() => setCBreakout((b) => !b)}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  cBreakout ? "border-teal bg-teal/5" : "border-ink/15 hover:border-ink/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                      cBreakout ? "border-teal bg-teal text-white" : "border-ink/25"
                    }`}
                  >
                    {cBreakout && "✓"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Karakter ini sudah tembus 500.000 pesan (klaim Breakout)
                    </p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">
                      Centang kalau karaktermu sudah mencapai 500.000 pesan dari
                      pengguna. Admin akan verifikasi sebelum bonus Rp 1.000.000
                      dibayarkan.
                    </p>
                  </div>
                </div>
              </button>

              <button onClick={handleCharacter} disabled={cBusy} className={primaryBtn}>
                {cBusy ? "Mengirim…" : "Kirim karakter"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Form terbuka setelah akun aktif & info pembayaran lengkap.</p>
          )}
        </section>
      )}

      {/* VIDEO */}
      {showVideo && (
        <section className="rounded-2xl bg-white border border-ink/5 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 text-cyan-dark">
              {VideoIcon}
            </span>
            <h2 className="font-bold">Kirim Video</h2>
          </div>
          {canSubmit ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className={label}>Link TikTok</label>
                <input className={input} value={vLink} onChange={(e) => setVLink(e.target.value)} placeholder="https://tiktok.com/@.../video/..." />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Jumlah views (saat submit)</label>
                <input className={input} type="number" value={vViews} onChange={(e) => setVViews(e.target.value)} placeholder="mis. 9000" />
              </div>
              <div className="space-y-1.5">
                <label className={label}>
                  Link screenshot analytics{" "}
                  <span className="text-muted font-normal">(opsional)</span>
                </label>
                <input className={input} value={vShot} onChange={(e) => setVShot(e.target.value)} placeholder="Link gambar (Drive, imgur, dll.)" />
              </div>
              <button onClick={handleVideo} disabled={vBusy} className={primaryBtn}>
                {vBusy ? "Mengirim…" : "Kirim video"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Form terbuka setelah akun aktif & info pembayaran lengkap.</p>
          )}
        </section>
      )}

      {!inKarakter && !inKonten && (
        <p className="text-sm text-muted">
          Kamu belum terdaftar di program manapun. Atur di halaman Profil.
        </p>
      )}
    </div>
  );
}