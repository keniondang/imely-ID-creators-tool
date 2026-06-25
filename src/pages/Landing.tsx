import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

/* Reveal-on-scroll hook */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in-view");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Trust/profile placeholder — styled as an intentional card, not a TODO box */
function ProfileCard({
  n,
  icon,
  title,
  label,
  children,
}: {
  n: string;
  icon: string;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative h-full rounded-3xl bg-white p-6 border border-ink/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden">
      <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-teal/5 group-hover:bg-teal/10 transition-colors" />
      <div className="relative flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-teal/15 text-xl">
          {icon}
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold text-teal-dark/60">
            {n}
          </span>
          <h3 className="font-bold leading-tight">{title}</h3>
        </div>
      </div>
      <div className="relative mt-4 rounded-xl border border-dashed border-teal/40 bg-teal/[0.04] p-3">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-teal-dark mb-1">
          ⚠ ISI: {label}
        </span>
        <p className="text-sm text-muted leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-full flex flex-col bg-cream overflow-x-hidden">
      {/* ============ HERO ============ */}
      <div className="relative isolate overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-teal/30 blur-[120px] animate-aurora-1" />
          <div className="absolute top-1/4 -right-1/4 h-[44rem] w-[44rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora-2" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[40rem] w-[40rem] rounded-full bg-mint/20 blur-[120px] animate-aurora-1" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <header className="relative z-10">
          <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size={32} variant="light" />
            </div>
            <Link
              to="/masuk"
              className="text-sm font-semibold text-white/80 hover:text-white transition"
            >
              Masuk
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl px-5 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="grid items-center gap-12 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p
                className="animate-rise text-mint font-semibold tracking-wide text-sm mb-4"
                style={{ animationDelay: "0ms" }}
              >
                Program Kreator Resmi Imely · Indonesia
              </p>
              <h1
                className="animate-rise text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight"
                style={{ animationDelay: "90ms" }}
              >
                Berkarya untuk Imely.
                <br />
                <span className="bg-gradient-to-r from-mint via-teal-light to-cyan bg-clip-text text-transparent">
                  Dibayar nyata.
                </span>
              </h1>
              <p
                className="animate-rise mt-6 text-white/70 text-base sm:text-lg max-w-md leading-relaxed"
                style={{ animationDelay: "180ms" }}
              >
                Bikin karakter AI atau konten TikTok. Karyamu disetujui, kamu
                dibayar — transparan, ada bonus, dikelola langsung oleh tim kami.
              </p>
              <div
                className="animate-rise mt-8 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ animationDelay: "270ms" }}
              >
                <Link
                  to="/daftar"
                  className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-mint to-teal px-8 py-4 text-ink font-bold shadow-lg shadow-teal/30 hover:shadow-xl hover:shadow-teal/40 hover:-translate-y-0.5 transition-all"
                >
                  Daftar Sekarang
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  to="/masuk"
                  className="text-sm text-white/60 hover:text-white text-center sm:text-left"
                >
                  Sudah punya akun?{" "}
                  <span className="font-semibold underline underline-offset-2">
                    Masuk
                  </span>
                </Link>
              </div>
            </div>

            <div
              className="animate-rise hidden sm:block"
              style={{ animationDelay: "360ms" }}
            >
              <div className="relative mx-auto w-64">
                <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-mint/40 to-cyan/30 blur-2xl" />
                <div className="animate-float rounded-[2.5rem] bg-gradient-to-br from-teal to-cyan p-8 shadow-2xl">
                  <div className="aspect-square rounded-[2rem] bg-ink/90 flex items-center justify-center">
                    <span className="text-7xl font-extrabold text-mint select-none">
                      i
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 h-12 sm:h-16">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,100 L1440,100 L1440,40 Q720,100 0,40 Z" fill="#F0FBF9" />
          </svg>
        </div>
      </div>

      {/* ============ LIGHT BODY ============ */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-5 py-16 sm:py-20 space-y-20">
        {/* Program overview — colored gradient cards */}
        <section className="space-y-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Dua cara berpenghasilan
              </h2>
              <p className="mt-3 text-muted">
                Ikut salah satu, atau dua-duanya. Bayaran jelas di depan, bonus
                kalau karyamu nge-hit.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Character — teal gradient */}
            <Reveal delay={0}>
              <div className="group relative h-full rounded-3xl bg-gradient-to-br from-teal to-teal-dark text-white p-7 shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur text-2xl mb-4">
                    🎭
                  </div>
                  <h3 className="text-2xl font-extrabold">Kreator Karakter</h3>
                  <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
                    Desain karakter AI untuk Imely.
                  </p>
                  <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur p-4 space-y-3">
                    <div>
                      <p className="text-xs text-white/70">Per karakter disetujui</p>
                      <p className="text-3xl font-extrabold leading-none mt-0.5">
                        Rp 45.000
                      </p>
                    </div>
                    <div className="border-t border-white/15 pt-3">
                      <p className="text-xs text-white/70">Bonus Breakout</p>
                      <p className="text-xl font-extrabold text-mint leading-none mt-0.5">
                        Rp 1.000.000
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-white/70">
                    Bonus cair saat karaktermu tembus 500.000 pesan pengguna.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Content — cyan gradient */}
            <Reveal delay={120}>
              <div className="group relative h-full rounded-3xl bg-gradient-to-br from-cyan to-cyan-dark text-white p-7 shadow-lg shadow-cyan/20 hover:shadow-xl hover:shadow-cyan/30 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur text-2xl mb-4">
                    🎬
                  </div>
                  <h3 className="text-2xl font-extrabold">Kreator Konten</h3>
                  <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
                    Bikin video TikTok promosi Imely.
                  </p>
                  <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur p-4 space-y-3">
                    <div>
                      <p className="text-xs text-white/70">Per video disetujui</p>
                      <p className="text-3xl font-extrabold leading-none mt-0.5">
                        Rp 40.000
                      </p>
                    </div>
                    <div className="border-t border-white/15 pt-3">
                      <p className="text-xs text-white/70">Bonus tiap 3.000 views</p>
                      <p className="text-xl font-extrabold text-ink leading-none mt-0.5">
                        +Rp 20.000
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-white/70">
                    Bonus views maksimal Rp 200.000 per video.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* How payment works */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink text-white p-7 sm:p-10">
              {/* ambient glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[36rem] rounded-full bg-teal/20 blur-[90px]" />
              <div className="relative">
                <p className="text-mint font-semibold tracking-wide text-xs uppercase">
                  Alur pembayaran
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  Dari karya ke saldo, tiga langkah.
                </h3>

                <div className="relative mt-9">
                  {/* connecting line (desktop horizontal / mobile vertical) */}
                  <div className="pointer-events-none absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-mint via-teal to-cyan sm:left-0 sm:right-0 sm:top-7 sm:bottom-auto sm:h-px sm:w-full sm:bg-gradient-to-r" />
                  <div className="pay-line pointer-events-none absolute left-7 top-7 w-px bg-mint sm:left-0 sm:top-7 sm:h-px sm:w-full" />

                  <div className="relative grid gap-8 sm:grid-cols-3 sm:gap-5">
                    {[
                      ["📤", "Kirim", "Upload karyamu lewat tool ini."],
                      ["🔍", "Review", "Tim kami cek & hitung bayaranmu."],
                      ["💸", "Cair", "Pantau status & terima via bank / e-wallet."],
                    ].map(([icon, t, d], i) => (
                      <div
                        key={t as string}
                        className="pay-step relative flex sm:block items-start gap-4"
                        style={{ ["--d" as string]: `${i * 180 + 200}ms` }}
                      >
                        <div className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-cyan-dark text-2xl shadow-lg shadow-teal/30 ring-4 ring-ink">
                          {icon}
                        </div>
                        <div className="sm:mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-mint font-extrabold text-sm">
                              0{i + 1}
                            </span>
                            <p className="font-bold text-lg">{t}</p>
                          </div>
                          <p className="mt-1 text-sm text-white/60 leading-relaxed">
                            {d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Company profile — styled profile cards */}
        <section className="space-y-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Tentang program ini
              </h2>
              <p className="mt-3 text-muted">
                Dikelola oleh tim sungguhan. Berikut profil singkatnya.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <ProfileCard
                n="01"
                icon="✨"
                title="Tentang Imely"
                label="Deskripsi Imely (apa aplikasinya)"
              >
                Jelaskan singkat apa itu Imely — aplikasi AI companion /
                character chat. (Isi dengan deskripsi resmi.)
              </ProfileCard>
            </Reveal>
            <Reveal delay={80}>
              <ProfileCard
                n="02"
                icon="🚀"
                title="Track Record"
                label="Aplikasi viral sebelumnya — HARUS FAKTUAL"
              >
                Sebutkan aplikasi sukses/viral sebelumnya dari tim yang sama
                (jika ada). Kosongkan jika tidak ada — jangan mengklaim yang
                tidak benar.
              </ProfileCard>
            </Reveal>
            <Reveal>
              <ProfileCard
                n="03"
                icon="📍"
                title="Lokasi"
                label="Based in / lokasi tim"
              >
                Mis. "Berbasis di [kota/negara]".
              </ProfileCard>
            </Reveal>
            <Reveal delay={80}>
              <ProfileCard
                n="04"
                icon="🎯"
                title="Visi & Misi"
                label="Visi & misi Imely"
              >
                Isi dengan visi & misi resmi.
              </ProfileCard>
            </Reveal>
            <div className="sm:col-span-2">
              <Reveal>
                <ProfileCard
                  n="05"
                  icon="👤"
                  title="Tim & Kontak Program"
                  label="Nama, peran, bio singkat admin/PIC program"
                >
                  Orang sungguhan yang mengelola program ini (nama, peran, foto
                  opsional) — ini membangun kepercayaan kreator.
                </ProfileCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-cyan-dark text-white p-10 text-center">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-2xl sm:text-3xl font-extrabold">
              Siap mulai berkarya?
            </h2>
            <p className="relative mt-2 text-white/80 text-sm">
              Daftar gratis. Review cepat. Mulai dapat penghasilan.
            </p>
            <Link
              to="/daftar"
              className="relative mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-teal-dark font-bold shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Daftar Sekarang →
            </Link>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex items-center gap-2">
              <Logo variant="dark" />
            </div>

            {/* Social icon row — fills wrap cleanly on mobile.
                Replace each href="#" with the real link. */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a href="#" target="_blank" rel="noreferrer" title="ISI: TikTok Imely"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-ink/10 px-3.5 py-2 text-sm font-semibold text-ink hover:border-teal/40 hover:text-teal-dark transition">
                🎵 TikTok
              </a>
              <a href="#" target="_blank" rel="noreferrer" title="ISI: Instagram Imely"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-ink/10 px-3.5 py-2 text-sm font-semibold text-ink hover:border-teal/40 hover:text-teal-dark transition">
                📸 Instagram
              </a>
              <a href="#" target="_blank" rel="noreferrer" title="ISI: Facebook Imely"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-ink/10 px-3.5 py-2 text-sm font-semibold text-ink hover:border-teal/40 hover:text-teal-dark transition">
                👍 Facebook
              </a>
              <a href="#" target="_blank" rel="noreferrer" title="ISI: Discord komunitas"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-ink/10 px-3.5 py-2 text-sm font-semibold text-ink hover:border-teal/40 hover:text-teal-dark transition">
                💬 Discord
              </a>
            </div>

            <a href="https://imely.ai" target="_blank" rel="noreferrer"
              className="text-teal-dark font-semibold hover:underline text-sm">
              imely.ai
            </a>

            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              ⚠ Ganti href="#" tiap ikon dengan link asli sebelum publish
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}