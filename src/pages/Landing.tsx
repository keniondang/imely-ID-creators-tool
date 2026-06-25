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
            <Reveal>
              <Link to="/programs/karakter" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-teal-dark p-8 sm:p-10 transition-transform group-hover:-translate-y-1">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <span className="text-5xl">🎭</span>
                    <h3 className="mt-5 text-2xl font-extrabold">Kreator Karakter</h3>
                    <p className="mt-2 text-white/70 leading-relaxed max-w-sm">
                      Desain karakter AI. Bayaran per karakter disetujui plus bonus Breakout Rp 1.000.000.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1 font-bold text-mint">
                      Pelajari & lihat panduan
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <Link to="/programs/konten" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-cyan to-cyan-dark p-8 sm:p-10 transition-transform group-hover:-translate-y-1">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <span className="text-5xl">🎬</span>
                    <h3 className="mt-5 text-2xl font-extrabold">Kreator Konten</h3>
                    <p className="mt-2 text-white/80 leading-relaxed max-w-sm">
                      Bikin video TikTok promosi Imely. Bayaran per video plus bonus views hingga Rp 200.000.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1 font-bold text-ink">
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
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-6">
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
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal via-teal-dark to-cyan-dark p-10 sm:p-16 text-center">
              <div className="pointer-events-none absolute -top-1/3 -right-1/4 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[30rem] w-[30rem] rounded-full bg-ink/20 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Siap mengubah karyamu jadi penghasilan?
                </h2>
                <p className="mt-5 text-white/80 text-lg">Daftar gratis. Review cepat. Mulai hari ini.</p>
                <Link
                  to="/daftar"
                  className="mt-9 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-teal-dark font-bold text-lg shadow-2xl hover:-translate-y-0.5 transition-all"
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