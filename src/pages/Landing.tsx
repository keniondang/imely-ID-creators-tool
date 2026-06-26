import { Link } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import Reveal from "../components/public/Reveal";
import { useCountUp } from "../components/public/useCountUp";

function Stat({ target, prefix = "", suffix = "", label }: { target: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="text-center">
      <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span ref={ref}>{prefix}{value.toLocaleString("id-ID")}{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-white/50">{label}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden min-h-[88vh] flex items-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/2 h-[55rem] w-[55rem] -translate-x-1/2 rounded-full bg-teal/25 blur-[140px] animate-aurora-1" />
          <div className="absolute top-1/4 -right-1/4 h-[40rem] w-[40rem] rounded-full bg-cyan/15 blur-[130px] animate-aurora-2" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[45rem] w-[45rem] rounded-full bg-mint/12 blur-[130px] animate-aurora-1" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="mx-auto max-w-6xl px-5 py-24 w-full">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div className="max-w-3xl">
              <p className="pub-rise text-mint font-semibold tracking-[0.2em] text-xs uppercase mb-6" style={{ animationDelay: "0ms" }}>
                Program Kreator Resmi Imely · Indonesia
              </p>
              <h1 className="pub-rise text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight" style={{ animationDelay: "90ms" }}>
                Berkarya untuk Imely.
                <br />
                <span className="bg-gradient-to-r from-mint via-teal-light to-cyan bg-clip-text text-transparent">
                  Dapat penghasilan nyata.
                </span>
              </h1>
              <p className="pub-rise mt-7 text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed" style={{ animationDelay: "180ms" }}>
                Bikin karakter AI atau konten TikTok. Disetujui, dibayar,
                transparan — dikelola langsung oleh tim kami.
              </p>
              <div className="pub-rise mt-9 flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: "270ms" }}>
                <Link
                  to="/daftar"
                  className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-mint to-teal px-8 py-4 text-ink font-bold text-lg shadow-2xl shadow-teal/30 hover:shadow-teal/50 hover:-translate-y-0.5 transition-all"
                >
                  Daftar sekarang
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link to="/programs/karakter" className="text-white/60 hover:text-white transition font-semibold text-center">
                  Lihat programnya →
                </Link>
              </div>
            </div>

            {/* floating logo visual */}
            <div className="pub-rise hidden lg:flex justify-center" style={{ animationDelay: "340ms" }}>
              <div className="relative w-64">
                <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-mint/40 to-cyan/30 blur-3xl" />
                <div className="animate-float rounded-[2.5rem] bg-gradient-to-br from-teal to-cyan p-8 shadow-2xl">
                    <img src="/logo.png" alt="Imely" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-5 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          <Stat target={2} label="cara berpenghasilan" />
          <div className="sm:border-x border-white/10">
            <Stat target={1000000} prefix="Rp " label="bonus Breakout per karakter" />
          </div>
          <Stat target={100} suffix="%" label="transparan & dikelola tim" />
        </div>
      </section>

      {/* ===== PROGRAMS TEASER ===== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Programs</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Dua cara berpenghasilan</h2>
              <p className="mt-4 text-white/60 text-lg">Ikut salah satu, atau dua-duanya.</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Karakter */}
            <Reveal>
              <Link to="/programs/karakter" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 transition-all duration-300 group-hover:border-mint/40 group-hover:bg-white/[0.05] group-hover:-translate-y-1">
                  <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-teal/20 blur-3xl transition-opacity duration-300 group-hover:opacity-150" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-ink">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                          <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm-7 18a7 7 0 0 1 14 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1Z" />
                        </svg>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-mint/70">Program 01</span>
                    </div>
                    <h3 className="mt-6 text-2xl font-extrabold">Kreator Karakter</h3>
                    <p className="mt-3 text-white/60 leading-relaxed max-w-sm">
                      Desain karakter AI yang terasa hidup. Tiap karakter yang lolos
                      review dibayar, plus bonus Breakout untuk yang meledak.
                    </p>
                    <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-3">
                      <div>
                        <p className="text-2xl font-extrabold text-mint">Rp 45rb</p>
                        <p className="text-xs text-white/50">per karakter</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-mint">Rp 1jt</p>
                        <p className="text-xs text-white/50">bonus Breakout</p>
                      </div>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1 font-bold text-mint">
                      Pelajari & lihat panduan
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* Konten */}
            <Reveal delay={120}>
              <Link to="/programs/konten" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 transition-all duration-300 group-hover:border-cyan/40 group-hover:bg-white/[0.05] group-hover:-translate-y-1">
                  <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan/20 blur-3xl transition-opacity duration-300 group-hover:opacity-150" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-cyan-dark text-ink">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
                        </svg>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-cyan/70">Program 02</span>
                    </div>
                    <h3 className="mt-6 text-2xl font-extrabold">Kreator Konten</h3>
                    <p className="mt-3 text-white/60 leading-relaxed max-w-sm">
                      Bikin video TikTok yang mengenalkan Imely dengan gayamu sendiri.
                      Dibayar per video, plus bonus dari jumlah views.
                    </p>
                    <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-3">
                      <div>
                        <p className="text-2xl font-extrabold text-cyan">Rp 40rb</p>
                        <p className="text-xs text-white/50">per video</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-cyan">Rp 3jt</p>
                        <p className="text-xs text-white/50">potensi total</p>
                      </div>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1 font-bold text-cyan">
                      Pelajari programnya
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ABOUT + CONTACT TEASER ===== */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="max-w-2xl mb-10">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Kenalan dulu</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cari tahu lebih lanjut</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <Link to="/tentang" className="group block h-full">
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Tentang</p>
                <h3 className="text-2xl font-extrabold">Dikelola tim sungguhan</h3>
                <p className="mt-2 text-white/60 leading-relaxed">
                  Kenali siapa di balik program ini, visi misi kami, dan track record Imely.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-bold text-mint">
                  Tentang kami <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Link to="/kontak" className="group block h-full">
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Kontak</p>
                <h3 className="text-2xl font-extrabold">Ada pertanyaan?</h3>
                <p className="mt-2 text-white/60 leading-relaxed">
                  Hubungi tim kami lewat WhatsApp, grup, atau Discord. Kami bantu.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-bold text-mint">
                  Hubungi kami <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cream via-mint/90 to-teal-light p-10 sm:p-16 text-center">
              <div className="pointer-events-none absolute -top-1/3 -right-1/4 h-[30rem] w-[30rem] rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan/30 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-ink">
                  Siap mengubah karyamu jadi penghasilan?
                </h2>
                <p className="mt-5 text-ink/70 text-lg font-medium">Daftar gratis. Review cepat. Mulai hari ini.</p>
                <Link
                  to="/daftar"
                  className="mt-9 inline-flex items-center justify-center rounded-full bg-ink px-10 py-4 text-white font-bold text-lg shadow-2xl shadow-ink/30 hover:-translate-y-0.5 hover:bg-ink/90 transition-all"
                >
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