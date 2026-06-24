import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Confirmed() {
  const [state, setState] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    // After the email link, Supabase sets the session from the URL.
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? "ok" : "error");
    });
  }, []);

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-ink text-white flex flex-col items-center justify-center px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-teal/30 blur-[120px] animate-aurora-1" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora-2" />
      </div>

      <div className="w-full max-w-sm space-y-6 text-center">
        <Link to="/" className="animate-rise flex items-center gap-2 justify-center">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-teal text-ink font-extrabold">i</span>
          <span className="font-extrabold tracking-tight text-lg">Imely <span className="text-mint">Creator</span></span>
        </Link>

        <div className="animate-rise rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-7 space-y-3">
          {state === "checking" && <p className="text-sm text-white/70">Memeriksa…</p>}

          {state === "ok" && (
            <>
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-2xl">✓</div>
              <h1 className="text-xl font-extrabold">Email terkonfirmasi!</h1>
              <p className="text-sm text-white/70 leading-relaxed">
                Akunmu aktif untuk login. Tim kami akan meninjau pendaftaranmu
                sebelum kamu bisa mengirim karya.
              </p>
              <Link to="/app" className="inline-block mt-1 rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-ink font-bold hover:-translate-y-0.5 transition-all">
                Masuk ke dashboard →
              </Link>
            </>
          )}

          {state === "error" && (
            <>
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-2xl">!</div>
              <h1 className="text-xl font-extrabold">Link tidak valid</h1>
              <p className="text-sm text-white/70 leading-relaxed">
                Link konfirmasi mungkin sudah kedaluwarsa atau sudah dipakai.
                Coba masuk, atau minta link baru.
              </p>
              <Link to="/masuk" className="inline-block mt-1 text-sm font-semibold text-mint hover:underline">
                Ke halaman Masuk →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}