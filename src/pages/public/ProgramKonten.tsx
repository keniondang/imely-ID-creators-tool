import { Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import Reveal from "../../components/public/Reveal";

const prohibitions = [
  "Mengandung kata kasar, umpatan, atau gambar dan suara yang menampilkan kekerasan, konten seksual, atau horor.",
  "Berisi diskriminasi, hate speech, atau ujaran kebencian berdasarkan daerah, suku, kewarganegaraan, agama, gender, orientasi seksual, atau disabilitas.",
  "Mempromosikan perilaku berbahaya, self-harm, atau bunuh diri.",
  "Menempatkan karakter atau user sebagai anak di bawah umur dalam konteks romantis atau seksual.",
  "Memuat informasi yang salah soal imely, soal individu atau organisasi lain, atau memutarbalikkan sejarah.",
  "Menggunakan gambar orang nyata yang bisa dikenali (tokoh publik maupun orang biasa) sebagai materi konten.",
  "Menjelekkan, menyerang, atau membuat perbandingan negatif terhadap aplikasi kompetitor.",
  "Menggunakan view, like, komentar, share, atau follower yang dibeli lewat bot atau jasa berbayar.",
];

const joinReqs = [
  "Creator harus berusia 18 tahun ke atas.",
  "Saat mendaftar, kamu otomatis menyatakan sudah membaca dan menyetujui seluruh guidelines ini.",
  "Kalau ada perubahan ketentuan, kami akan informasikan minimal 3 hari sebelumnya lewat Discord. Ketentuan baru hanya berlaku untuk video yang diposting setelah tanggal berlakunya.",
  "Saat ini program hanya berlaku untuk video yang diposting di TikTok.",
];

const responsibilities = [
  "Dengan bergabung di program, kamu memberikan imely hak non-eksklusif untuk repost, edit, dan menggunakan videomu di channel marketing resmi imely.",
  "Kamu bertanggung jawab sendiri atas pelaporan dan pembayaran pajak penghasilan pribadi sesuai peraturan perpajakan Indonesia atas penghasilan yang kamu terima dari program ini.",
];

export default function ProgramKonten() {
  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/3 h-[45rem] w-[45rem] rounded-full bg-cyan/25 blur-[130px] animate-aurora-1" />
          <div className="absolute top-1/3 -right-1/4 h-[35rem] w-[35rem] rounded-full bg-teal/15 blur-[120px] animate-aurora-2" />
        </div>
        <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 sm:pt-28">
          <p className="pub-rise text-cyan font-semibold tracking-[0.2em] text-xs uppercase mb-5">Program 02</p>
          <h1 className="pub-rise text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl" style={{ animationDelay: "80ms" }}>
            Kreator <span className="bg-gradient-to-r from-cyan to-mint bg-clip-text text-transparent">Konten</span>
          </h1>
          <p className="pub-rise mt-6 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed" style={{ animationDelay: "160ms" }}>
            Bikin video TikTok yang mengenalkan Imely dengan gaya kreatifmu
            sendiri. Tiap video yang lolos review dibayar, plus bonus views.
          </p>
          <div className="pub-rise mt-9" style={{ animationDelay: "240ms" }}>
            <Link to="/daftar" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-teal px-8 py-4 text-ink font-bold text-lg shadow-2xl shadow-cyan/30 hover:-translate-y-0.5 transition-all">
              Daftar jadi kreator →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU DO ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
              <p className="text-cyan font-semibold tracking-widest text-xs uppercase mb-3">Peranmu</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Yang kamu lakukan</h2>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              ["🎬", "Bikin video TikTok", "Review dan kenalkan Imely dengan gaya kreatifmu sendiri — bebas, tanpa skrip yang mengikat."],
              ["🎮", "Coba app & kasih feedback", "Akses awal ke aplikasi sambil bantu kami menyempurnakan produk."],
              ["🌱", "Bangun komunitas", "Ajak penggemar AI chat masuk ke dunia Imely sejak hari pertama."],
            ].map(([icon, t, d], i) => (
              <Reveal key={t} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-cyan/30 hover:bg-white/[0.04] transition-all">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="mt-4 font-bold text-lg text-cyan">{t}</h3>
                  <p className="mt-2 text-white/60 leading-relaxed text-sm">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO WE LOOK FOR ===== */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-2">
              <p className="text-cyan font-semibold tracking-widest text-xs uppercase mb-3">Yang kami cari</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Kami cari kamu yang...</h2>
            </div>
          </Reveal>
          <div className="mt-10 space-y-4">
            {[
              "Pernah pakai atau punya minat kuat pada aplikasi AI chat (Character.AI, Talkie, Joyland, dll).",
              "Punya channel TikTok di niche AI, teknologi, roleplay, app review, atau storytelling.",
              "Punya selera estetika dan kemampuan bercerita yang menarik untuk ditonton.",
              "Bukan soal jumlah follower — kami lebih melihat kualitas kontennya.",
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="3" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-white/80 leading-relaxed">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAYMENT STRUCTURE ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-cyan font-semibold tracking-widest text-xs uppercase mb-3">Pembayaran</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Struktur bayaran</h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan to-cyan-dark p-8 h-full text-ink">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <p className="text-ink/70 text-sm font-semibold uppercase tracking-wide">Per video disetujui</p>
                <p className="mt-2 text-5xl font-extrabold">Rp 40.000</p>
                <p className="mt-3 text-ink/70 leading-relaxed">
                  Dibayar untuk tiap video yang lolos review.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-dark to-ink border border-cyan/20 p-8 h-full">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan/15 blur-2xl" />
                <p className="text-cyan text-sm font-semibold uppercase tracking-wide">Bonus views</p>
                <p className="mt-2 text-5xl font-extrabold text-cyan">+Rp 20.000</p>
                <p className="mt-3 text-white/70 leading-relaxed">
                  Setiap kelipatan 3.000 views, hingga maksimal Rp 200.000 per
                  video. Makin banyak yang nonton, makin gede bayaranmu.
                </p>
              </div>
            </Reveal>
          </div>

          {/* total earning potential */}
          <Reveal delay={200}>
            <div className="mt-6 relative overflow-hidden rounded-3xl bg-gradient-to-r from-mint to-cyan p-8 text-ink">
              <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/25 blur-2xl" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-ink/70 text-sm font-semibold uppercase tracking-wide">Total potensi pendapatan</p>
                  <p className="mt-1 text-5xl font-extrabold">Hingga Rp 3.600.000</p>
                </div>
                <p className="text-ink/80 font-medium leading-relaxed max-w-xs">
                  Maksimal 15 video per kreator dalam program ini — masing-masing
                  bisa sampai Rp 200.000 + Rp 40.000 per video disetujui.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CONTENT GUIDELINES ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
              <p className="text-cyan font-semibold tracking-widest text-xs uppercase">Content Guidelines</p>
              <span className="text-xs text-white/40">Update: 11/05/2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Standar konten Social Content Creator
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Standar ini berlaku untuk semua konten yang dibuat creator dalam
              program Social Content Creator Imely — video TikTok yang me-review
              app, mengenalkan char (karakter AI di Imely), atau berbagi
              pengalaman pakai app. Hanya video yang memenuhi standar ini yang bisa
              lanjut ke proses pembayaran.
            </p>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Untuk alur submit, review, dan pembayaran lebih lengkap, lihat
              dokumen terpisah di{" "}
              <a href="https://imely-content.vercel.app" target="_blank" rel="noreferrer" className="text-cyan font-semibold hover:underline">
                imely-content.vercel.app
              </a>
              .
            </p>
          </Reveal>

          {/* 1. Join requirements */}
          <Reveal>
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/15 text-cyan font-bold text-sm">1</span>
                <h3 className="text-xl font-bold">Syarat bergabung</h3>
              </div>
              <ul className="space-y-3">
                {joinReqs.map((r, i) => (
                  <li key={i} className="flex gap-3 text-white/75 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* 2. Video standards */}
          <Reveal>
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/15 text-cyan font-bold text-sm">2</span>
                <h3 className="text-xl font-bold">Standar konten video</h3>
              </div>
              <p className="text-white/75 leading-relaxed mb-5">
                Video harus <strong className="text-white">SFW (Safe for Work)</strong> — aman untuk semua
                kalangan dan tidak melanggar standar komunitas TikTok. Secara
                spesifik, video tidak boleh:
              </p>
              <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.05] p-5">
                <ul className="space-y-3">
                  {prohibitions.map((p, i) => (
                    <li key={i} className="flex gap-3 text-white/75 leading-relaxed text-sm">
                      <span className="text-red-300/70 shrink-0 mt-0.5">✕</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* callout: 18+ char */}
              <div className="mt-5 rounded-2xl border border-mint/20 bg-mint/[0.05] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-mint mb-2">Catatan tentang char 18+</p>
                <p className="text-sm text-white/75 leading-relaxed">
                  Kamu boleh mempromosikan char dengan konten 18+ yang ada di app,
                  tapi video itu sendiri dan semua bagian yang tampil publik
                  (avatar, nama, deskripsi, caption, hashtag) harus tetap SFW.
                  Anggap saja seperti trailer film 18+ — boleh mengenalkan bahwa
                  char ini ada dan menarik, tapi tidak menampilkan detail NSFW-nya.
                </p>
              </div>

              {/* callout: engagement verification */}
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">Soal verifikasi engagement</p>
                <p className="text-sm text-white/75 leading-relaxed">
                  Saat kamu submit video, Imely akan memeriksa screenshot analytics
                  yang kamu kirim. Kalau ada yang janggal — misalnya lonjakan view
                  yang tidak wajar, atau rasio engagement yang aneh — Imely berhak
                  mengeluarkan video dari proses review tanpa perlu memberikan bukti
                  tambahan.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 3. Responsibilities */}
          <Reveal>
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/15 text-cyan font-bold text-sm">3</span>
                <h3 className="text-xl font-bold">Tanggung jawab setelah pembayaran</h3>
              </div>
              <ul className="space-y-3">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-3 text-white/75 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-white/50 leading-relaxed">
                Pertanyaan apapun bisa kamu sampaikan ke tim lewat Discord di{" "}
                <span className="text-cyan font-semibold">#chat-dengan-tim-imely</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan via-teal-dark to-ink p-10 sm:p-16 text-center">
              <div className="pointer-events-none absolute -top-1/3 -right-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan/15 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Siap bikin konten Imely?
                </h2>
                <p className="mt-5 text-white/80 text-lg">Daftar gratis, mulai berkarya hari ini.</p>
                <Link to="/daftar" className="mt-9 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-teal-dark font-bold text-lg shadow-2xl hover:-translate-y-0.5 transition-all">
                  Daftar sekarang →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  );
}