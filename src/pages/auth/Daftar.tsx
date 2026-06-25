import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { isUnder18 } from "../../lib/age";
import { stashPendingProfile } from "../../lib/pendingProfile";
import Logo from "../../components/Logo";

type Form = {
  email: string;
  password: string;
  nama_lengkap: string;
  nomor_wa: string;
  tanggal_lahir: string;
  link_tiktok: string;
  link_facebook: string;
  link_instagram: string;
  username_discord: string;
  program_karakter: boolean;
  program_konten: boolean;
};

const empty: Form = {
  email: "",
  password: "",
  nama_lengkap: "",
  nomor_wa: "",
  tanggal_lahir: "",
  link_tiktok: "",
  link_facebook: "",
  link_instagram: "",
  username_discord: "",
  program_karakter: false,
  program_konten: false,
};

const inputCls =
  "w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-transparent transition";
const labelCls = "text-sm font-medium text-white/80";

export default function Daftar() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>(empty);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  const set = (k: keyof Form, v: string | boolean) =>
    setF((prev) => ({ ...prev, [k]: v }));

  function validateStep(): string | null {
    if (step === 1) {
      if (!f.email) return "Email wajib diisi.";
      if (f.password.length < 6) return "Password minimal 6 karakter.";
    }
    if (step === 2) {
      if (!f.nama_lengkap.trim()) return "Nama lengkap wajib diisi.";
      if (!f.nomor_wa.trim()) return "Nomor WA wajib diisi.";
      if (!f.tanggal_lahir) return "Tanggal lahir wajib diisi.";
    }
    if (step === 3) {
      if (!f.link_tiktok.trim()) return "Link TikTok wajib diisi.";
      if (!f.username_discord.trim()) return "Username Discord wajib diisi.";
      if (!f.program_karakter && !f.program_konten)
        return "Pilih minimal satu program.";
    }
    return null;
  }

  async function next() {
    const v = validateStep();
    if (v) return setErr(v);
    setErr(null);

    // Step 1: check email availability before advancing (on-Lanjut only).
    if (step === 1) {
      setCheckingEmail(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email: f.email }),
          }
        );

        if (res.status === 429) {
          setCheckingEmail(false);
          return setErr("Terlalu banyak percobaan. Coba lagi sebentar lagi.");
        }

        const data = await res.json();
        setCheckingEmail(false);

        if (data.error) {
          // Don't hard-block on a server hiccup — let them proceed; submit still guards.
          setStep((s) => s + 1);
          return;
        }
        if (data.exists) {
          return setErr(
            "Email ini sudah terdaftar. Coba masuk, atau pakai email lain."
          );
        }
        setStep((s) => s + 1);
      } catch {
        // Network error: fail open to the next step; final submit still catches dupes.
        setCheckingEmail(false);
        setStep((s) => s + 1);
      }
      return;
    }

    setStep((s) => s + 1);
  }

  function back() {
    setErr(null);
    setStep((s) => s - 1);
  }

  async function submit() {
    const v = validateStep();
    if (v) return setErr(v);
    setErr(null);
    setLoading(true);

    const under18 = isUnder18(f.tanggal_lahir);

    // 1) create the auth user
    const { data, error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirmed`,
      },
    });
    if (error) {
      setLoading(false);
      return setErr(error.message);
    }

    // Safety net: an already-registered confirmed email returns an empty
    // identities array even though signUp() doesn't error.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setLoading(false);
      setStep(1);
      return setErr("Email ini sudah terdaftar. Coba masuk, atau pakai email lain.");
    }

    const profilePayload = {
      nama_lengkap: f.nama_lengkap,
      nomor_wa: f.nomor_wa,
      tanggal_lahir: f.tanggal_lahir,
      link_tiktok: f.link_tiktok,
      link_facebook: f.link_facebook,
      link_instagram: f.link_instagram,
      username_discord: f.username_discord,
      program_karakter: f.program_karakter,
      program_konten: f.program_konten,
      under_18: under18,
    };

    // 2) try to write profile now (works if a session exists immediately)
    let wrote = false;
    if (data.session) {
      const { error: rpcErr } = await supabase.rpc("save_creator_profile", {
        p_nama_lengkap: profilePayload.nama_lengkap,
        p_nomor_wa: profilePayload.nomor_wa,
        p_tanggal_lahir: profilePayload.tanggal_lahir,
        p_link_tiktok: profilePayload.link_tiktok,
        p_link_facebook: profilePayload.link_facebook || null,
        p_link_instagram: profilePayload.link_instagram || null,
        p_username_discord: profilePayload.username_discord,
        p_program_karakter: profilePayload.program_karakter,
        p_program_konten: profilePayload.program_konten,
        p_under_18: profilePayload.under_18,
      });
      wrote = !rpcErr;
    }

    // 3) if no session yet (email confirmation pending), stash for first login
    if (!wrote) stashPendingProfile(profilePayload);

    setLoading(false);
    setDone(true);
  }

  async function resend() {
    setResendMsg(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: f.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirmed` },
    });
    setResendMsg(error ? error.message : "Email konfirmasi dikirim ulang.");
  }

  const progress = (step / 3) * 100;

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-ink text-white flex flex-col items-center justify-center px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-teal/30 blur-[120px] animate-aurora-1" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora-2" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="animate-rise flex items-center gap-2 justify-center">
          <Logo size={32} variant="light" />
        </Link>


        {done ? (
          <div className="animate-rise rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 text-center space-y-3">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-2xl">
              ✉️
            </div>
            <h1 className="text-xl font-extrabold">Cek emailmu</h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Kami sudah kirim link konfirmasi ke{" "}
              <strong className="text-white">{f.email}</strong>. Klik link itu,
              lalu masuk — profilmu langsung tersimpan.
            </p>
            <Link
              to="/masuk"
              className="inline-block mt-1 text-sm font-semibold text-mint hover:underline"
            >
              Ke halaman Masuk →
            </Link>
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={resend}
                className="text-sm text-white/60 hover:text-white"
              >
                Tidak menerima email?{" "}
                <span className="font-semibold underline">Kirim ulang</span>
              </button>
              {resendMsg && <p className="text-xs text-mint mt-1.5">{resendMsg}</p>}
            </div>
          </div>
        ) : (
          <div className="animate-rise rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 space-y-5 shadow-2xl">
            {/* progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>Langkah {step} dari 3</span>
                <span>
                  {step === 1
                    ? "Akun"
                    : step === 2
                    ? "Data diri"
                    : "Sosial & program"}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={f.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                    placeholder="kamu@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Password</label>
                  <input
                    type="password"
                    value={f.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={inputCls}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Nama lengkap</label>
                  <input
                    value={f.nama_lengkap}
                    onChange={(e) => set("nama_lengkap", e.target.value)}
                    className={inputCls}
                    placeholder="Nama sesuai rekening nanti"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Nomor WhatsApp</label>
                  <input
                    value={f.nomor_wa}
                    onChange={(e) => set("nomor_wa", e.target.value)}
                    className={inputCls}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Tanggal lahir</label>
                  <input
                    type="date"
                    value={f.tanggal_lahir}
                    onChange={(e) => set("tanggal_lahir", e.target.value)}
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                  <p className="text-xs text-white/40">
                    Program ini untuk usia 18+.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Link TikTok</label>
                  <input
                    value={f.link_tiktok}
                    onChange={(e) => set("link_tiktok", e.target.value)}
                    className={inputCls}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Facebook{" "}
                      <span className="text-white/40 font-normal">(opsional)</span>
                    </label>
                    <input
                      value={f.link_facebook}
                      onChange={(e) => set("link_facebook", e.target.value)}
                      className={inputCls}
                      placeholder="Link FB"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Instagram{" "}
                      <span className="text-white/40 font-normal">(opsional)</span>
                    </label>
                    <input
                      value={f.link_instagram}
                      onChange={(e) => set("link_instagram", e.target.value)}
                      className={inputCls}
                      placeholder="Link IG"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Username Discord</label>
                  <input
                    value={f.username_discord}
                    onChange={(e) => set("username_discord", e.target.value)}
                    className={inputCls}
                    placeholder="username#0000 atau @username"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Program yang diikuti</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => set("program_karakter", !f.program_karakter)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition text-left ${
                        f.program_karakter
                          ? "border-mint bg-mint/15 text-white"
                          : "border-white/15 bg-white/5 text-white/60 hover:border-white/30"
                      }`}
                    >
                      🎭 Karakter
                    </button>
                    <button
                      type="button"
                      onClick={() => set("program_konten", !f.program_konten)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition text-left ${
                        f.program_konten
                          ? "border-cyan bg-cyan/15 text-white"
                          : "border-white/15 bg-white/5 text-white/60 hover:border-white/30"
                      }`}
                    >
                      🎬 Konten
                    </button>
                  </div>
                  <p className="text-xs text-white/40">
                    Bisa pilih dua-duanya. Info pembayaran diisi nanti setelah
                    akun disetujui.
                  </p>
                </div>
              </div>
            )}

            {err && (
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {err}
              </p>
            )}

            {/* nav buttons */}
            <div className="flex gap-3 pt-1">
              {step > 1 && (
                <button
                  onClick={back}
                  disabled={loading || checkingEmail}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5 transition disabled:opacity-40"
                >
                  Kembali
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={next}
                  disabled={checkingEmail}
                  className="flex-1 rounded-xl bg-gradient-to-r from-mint to-teal px-4 py-3 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:hover:translate-y-0"
                >
                  Lanjut →
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-mint to-teal px-4 py-3 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {loading ? "Memproses…" : "Selesai & Daftar"}
                </button>
              )}
            </div>
          </div>
        )}

        {!done && (
          <p className="animate-rise text-center text-sm text-white/60">
            Sudah punya akun?{" "}
            <Link to="/masuk" className="font-semibold text-mint hover:underline">
              Masuk
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}