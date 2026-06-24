import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-ink text-white flex flex-col items-center justify-center px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-teal/30 blur-[120px] animate-aurora-1" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora-2" />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="animate-rise flex items-center gap-2 justify-center">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-teal text-ink font-extrabold">i</span>
          <span className="font-extrabold tracking-tight text-lg">Imely <span className="text-mint">Creator</span></span>
        </Link>

        {sent ? (
          <div className="animate-rise rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 text-center space-y-3">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-2xl">✉️</div>
            <h1 className="text-xl font-extrabold">Cek emailmu</h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Kalau email <strong className="text-white">{email}</strong> terdaftar,
              kami sudah kirim link reset password ke sana.
            </p>
            <Link to="/masuk" className="inline-block mt-1 text-sm font-semibold text-mint hover:underline">Ke halaman Masuk →</Link>
          </div>
        ) : (
          <div className="animate-rise rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 space-y-5 shadow-2xl">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">Lupa password</h1>
              <p className="mt-1 text-sm text-white/60">Masukkan emailmu, kami kirim link reset.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-transparent transition"
                placeholder="kamu@email.com" />
            </div>
            {err && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{err}</p>}
            <button onClick={submit} disabled={busy || !email}
              className="w-full rounded-xl bg-gradient-to-r from-mint to-teal px-4 py-3 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0">
              {busy ? "Mengirim…" : "Kirim link reset"}
            </button>
          </div>
        )}

        {!sent && (
          <p className="animate-rise text-center text-sm text-white/60">
            Ingat passwordmu?{" "}
            <Link to="/masuk" className="font-semibold text-mint hover:underline">Masuk</Link>
          </p>
        )}
      </div>
    </div>
  );
}