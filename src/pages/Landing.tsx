import { Link } from "react-router-dom";

function Placeholder({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-teal/50 bg-teal/5 p-4">
      <span className="inline-block text-[11px] font-bold uppercase tracking-wide text-teal-dark mb-1">
        ⚠ ISI: {label}
      </span>
      <div className="text-sm text-muted">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-full flex flex-col bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-ink/5">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-white font-extrabold text-sm">
              i
            </span>
            <span className="font-extrabold tracking-tight">
              Imely <span className="text-teal">Creator</span>
            </span>
          </div>
          <Link
            to="/masuk"
            className="text-sm font-semibold text-ink hover:text-teal transition"
          >
            Masuk
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 pt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Jadi Kreator Imely.
            <br />
            <span className="text-teal-dark">Berkarya, dapat penghasilan.</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Bikin karakter AI atau konten TikTok untuk Imely. Karyamu disetujui,
            kamu dibayar. Transparan, ada bonus, dan dikelola langsung oleh tim
            kami.
          </p>
          <div className="flex flex-col items-center gap-2 pt-2">
            <Link
              to="/daftar"
              className="inline-flex items-center justify-center rounded-xl bg-teal px-8 py-3.5 text-white font-bold shadow-sm hover:bg-teal-dark transition w-full sm:w-auto"
            >
              Daftar Sekarang
            </Link>
            <Link to="/masuk" className="text-sm text-muted hover:text-ink">
              Sudah punya akun? <span className="font-semibold underline">Masuk</span>
            </Link>
          </div>
        </section>

        {/* Company profile — trust building */}
        <Section title="Tentang Imely">
          <Placeholder label="Deskripsi Imely (apa aplikasinya)">
            Jelaskan singkat apa itu Imely — aplikasi AI companion / character
            chat. (Isi dengan deskripsi resmi.)
          </Placeholder>
        </Section>

        <Section title="Track Record">
          <Placeholder label="Aplikasi viral sebelumnya — HARUS FAKTUAL, jangan dikarang">
            Sebutkan aplikasi sukses/viral sebelumnya dari tim yang sama (jika
            ada). Kosongkan jika tidak ada — jangan mengklaim yang tidak benar.
          </Placeholder>
        </Section>

        <Section title="Lokasi">
          <Placeholder label="Based in / lokasi tim">
            Mis. "Berbasis di [kota/negara]".
          </Placeholder>
        </Section>

        <Section title="Visi & Misi">
          <Placeholder label="Visi & misi Imely">
            Isi dengan visi & misi resmi.
          </Placeholder>
        </Section>

        <Section title="Tim & Kontak Program">
          <Placeholder label="Nama, peran, bio singkat admin/PIC program">
            Orang sungguhan yang mengelola program ini (nama, peran, foto
            opsional) — ini membangun kepercayaan kreator.
          </Placeholder>
        </Section>

        {/* Program overview */}
        <Section title="Program Kreator">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 border border-ink/5 space-y-2">
              <h3 className="font-bold">Kreator Karakter</h3>
              <p className="text-sm text-muted leading-relaxed">
                Desain karakter AI untuk Imely. Bayaran tetap{" "}
                <strong className="text-ink">Rp 45.000</strong> per karakter
                yang disetujui, plus bonus Breakout{" "}
                <strong className="text-ink">Rp 1.000.000</strong> kalau
                karaktermu tembus 500.000 pesan dari pengguna.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-ink/5 space-y-2">
              <h3 className="font-bold">Kreator Konten</h3>
              <p className="text-sm text-muted leading-relaxed">
                Bikin video TikTok promosi Imely. Bayaran dasar{" "}
                <strong className="text-ink">Rp 40.000</strong> per video
                disetujui, plus bonus{" "}
                <strong className="text-ink">Rp 20.000</strong> tiap 3.000 views
                (maks Rp 200.000 per video).
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-ink/[0.03] p-5 border border-ink/5 mt-2">
            <h3 className="font-bold text-sm">Cara Pembayaran</h3>
            <p className="text-sm text-muted leading-relaxed mt-1">
              Kirim karyamu lewat tool ini. Tim kami review, lalu jumlah
              pembayaran dihitung dan dikonfirmasi. Kamu bisa pantau status tiap
              karya dan penghasilanmu langsung di dashboard. Pembayaran via
              transfer bank atau e-wallet (GoPay/OVO/DANA).
            </p>
          </div>
        </Section>

        {/* Footer CTA */}
        <section className="text-center space-y-4 rounded-2xl bg-gradient-to-br from-teal to-teal-dark text-white p-8">
          <h2 className="text-xl font-extrabold">Siap mulai berkarya?</h2>
          <Link
            to="/daftar"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-teal-dark font-bold shadow-sm hover:bg-cream transition w-full sm:w-auto"
          >
            Daftar Sekarang
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted space-y-2 text-center">
          <p className="font-semibold text-ink">Imely Creator Program</p>
          <p>
            Kontak:{" "}
            <Placeholder label="Discord program (inline)">
              Link/username Discord
            </Placeholder>
          </p>
          {/* Re-added the missing `<a` here */}
          <a
            href="https://imely.ai"
            target="_blank"
            rel="noreferrer"
            className="text-teal-dark font-semibold hover:underline"
          >
            imely.ai
          </a>
        </div>
      </footer>
    </div>
  );
}