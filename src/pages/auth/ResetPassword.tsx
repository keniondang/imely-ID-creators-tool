import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Logo from "../../components/Logo";


export default function ResetPassword() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Arriving from the recovery link establishes a session.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
  }, []);

  async function submit() {
    setErr(null);
    if (pw.length < 6) return setErr("Password minimal 6 karakter.");
    if (pw !== pw2) return setErr("Password tidak cocok.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(error.message);
    setDone(true);
    setTimeout(() => nav("/app"), 1500);
  }

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-ink text-white flex flex-col items-center justify-center px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-teal/30 blur-[120px] animate-aurora-1" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora-2" />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="animate-rise flex items-center gap-2 justify-center">
          <Logo size={32} variant="light" />
        </Link>

        <div className="rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 space-y-5 shadow-2xl">
          {done ? (
            <div className="text-center space-y-2">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-2xl">✓</div>
              <h1 className="text-xl font-extrabold">Password diperbarui</h1>
              <p className="text-sm text-white/70">Mengarahkan ke dashboard…</p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-2">
              <h1 className="text-xl font-extrabold">Link tidak valid</h1>
              <p className="text-sm text-white/70">Link reset mungkin sudah kedaluwarsa. Minta yang baru.</p>
              <Link to="/auth/lupa-password" className="inline-block text-sm font-semibold text-mint hover:underline">Minta link baru →</Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-extrabold">Password baru</h1>
                <p className="mt-1 text-sm text-white/60">Buat password baru untuk akunmu.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Password baru</label>
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-mint/50 transition"
                  placeholder="Minimal 6 karakter" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Ulangi password</label>
                <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-mint/50 transition"
                  placeholder="Ulangi password baru" />
              </div>
              {err && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{err}</p>}
              <button onClick={submit} disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-mint to-teal px-4 py-3 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-40">
                {busy ? "Menyimpan…" : "Simpan password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}