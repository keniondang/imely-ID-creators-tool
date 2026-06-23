export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-teal to-teal-dark text-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">
          Selamat datang di Program Kreator Imely
        </h1>
        <p className="mt-2 text-white/90 text-sm leading-relaxed">
          Bikin karakter AI, bikin konten TikTok, dapat penghasilan. Daftar,
          kirim karyamu, pantau statusnya di sini.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 border border-ink/5">
          <h2 className="font-bold">Kreator Karakter</h2>
          <p className="mt-1 text-sm text-muted">
            Desain karakter AI. Dapat bayaran per karakter yang disetujui plus
            bonus Breakout.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-ink/5">
          <h2 className="font-bold">Kreator Konten</h2>
          <p className="mt-1 text-sm text-muted">
            Bikin video TikTok promosi Imely. Dapat bayaran per video plus bonus
            views.
          </p>
        </div>
      </section>

      <p className="text-xs text-muted">Phase 1 skeleton — placeholder.</p>
    </div>
  );
}