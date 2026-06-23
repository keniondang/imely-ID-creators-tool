import { Link } from "react-router-dom";

export default function Daftar() {
  return (
    <div className="min-h-full bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-white font-extrabold text-sm">
            i
          </span>
          <span className="font-extrabold tracking-tight">Imely Creator</span>
        </Link>
        <div className="rounded-2xl bg-white p-6 border border-ink/5 text-center space-y-2">
          <h1 className="text-xl font-extrabold">Daftar</h1>
          <p className="text-sm text-muted">Form pendaftaran dibangun di Phase 2.</p>
        </div>
        <p className="text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link to="/masuk" className="font-semibold text-teal hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}