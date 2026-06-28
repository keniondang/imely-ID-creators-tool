import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import Reveal from "../../components/public/Reveal";

/* Contact channels — replace each href="#" and the "ISI:" values with real info */
const channels = [
  {
    label: "WhatsApp Admin",
    value: "ISI: nomor / link WA admin",
    desc: "Buat pertanyaan langsung soal pendaftaran, karya, atau pembayaran.",
    href: "#",
    accent: "mint",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.5 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.7 1.7c.1.1.1.3 0 .5l-.3.4-.3.3c-.1.1-.2.3-.1.5.1.2.5.9 1.2 1.5.8.7 1.5 1 1.7 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.1 1.1Z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    value: "ISI: link Discord",
    desc: "Channel resmi program. Tanya tim di #chat-dengan-tim-imely.",
    href: "#",
    accent: "cyan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M20.32 4.57A19.8 19.8 0 0 0 15.45 3a13.7 13.7 0 0 0-.62 1.28 18.3 18.3 0 0 0-5.66 0A13.6 13.6 0 0 0 8.54 3 19.74 19.74 0 0 0 3.67 4.57C.58 9.2-.26 13.7.16 18.14a19.95 19.95 0 0 0 6.05 3.06c.49-.66.92-1.37 1.29-2.11-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4a14.27 14.27 0 0 0 12.16 0c.16.14.33.27.5.4-.64.39-1.32.72-2.03.99.37.74.8 1.45 1.29 2.11a19.9 19.9 0 0 0 6.05-3.06c.5-5.18-.84-9.64-3.51-13.57ZM8.02 15.41c-1.18 0-2.15-1.08-2.15-2.41s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.41-2.15 2.41Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.41s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.94 2.41-2.15 2.41Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "ISI: alamat email",
    desc: "Buat urusan resmi, kerja sama, atau pertanyaan panjang.",
    href: "#",
    accent: "cyan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Website",
    value: "imely.ai",
    desc: "Kunjungi aplikasi utama Imely dan pelajari lebih lanjut.",
    href: "https://imely.ai",
    accent: "mint",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    value: "ISI: @username",
    desc: "Update, karakter baru, dan konten terbaru dari Imely.",
    href: "#",
    accent: "mint",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3c-1.36 0-2.83-.91-3.24-1.48z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    value: "ISI: @username",
    desc: "Behind the scenes dan highlight komunitas kreator.",
    href: "#",
    accent: "cyan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/* FAQ — DRAFT answers; review & correct timelines/payment details */
const faqs = [
  {
    q: "Berapa lama proses review karya?",
    a: "ISI/REVIEW: Tim kami biasanya meninjau karya dalam beberapa hari kerja setelah disubmit. Kamu bisa pantau statusnya langsung di dashboard.",
  },
  {
    q: "Kapan pembayaran dicairkan?",
    a: "ISI/REVIEW: Pembayaran diproses setelah karyamu disetujui. Pencairan dilakukan ke rekening bank atau e-wallet yang kamu daftarkan di profil.",
  },
  {
    q: "Apakah harus berusia 18 tahun ke atas?",
    a: "Ya. Program ini khusus untuk creator berusia 18 tahun ke atas.",
  },
  {
    q: "Bisa ikut dua program sekaligus?",
    a: "Bisa. Kamu boleh ikut program Karakter, Konten, atau dua-duanya sekaligus. Pilih saat mendaftar dan bisa diatur lagi nanti.",
  },
  {
    q: "Apakah perlu background teknis untuk jadi kreator karakter?",
    a: "Nggak. Yang penting kamu suka menulis karakter, menyusun dialog, dan membangun cerita. Nggak perlu skill coding atau desain teknis.",
  },
  {
    q: "Gimana cara gabungnya?",
    a: "Tinggal daftar lewat tombol Daftar, lengkapi profil, dan tunggu akunmu disetujui tim. Setelah aktif, kamu langsung bisa mulai mengirim karya.",
  },
];

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition"
      >
        <span className="flex-1 font-bold">{q}</span>
        <span className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <p className="text-sm text-white/70 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Kontak() {
  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/2 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-teal/20 blur-[130px] animate-aurora-1" />
          <div className="absolute top-1/3 -right-1/4 h-[35rem] w-[35rem] rounded-full bg-cyan/15 blur-[120px] animate-aurora-2" />
        </div>
        <div className="mx-auto max-w-6xl px-5 pt-24 pb-28 sm:pt-28 sm:pb-32">
          <p className="pub-rise text-mint font-semibold tracking-[0.2em] text-xs uppercase mb-5">Kontak</p>
          <h1 className="pub-rise text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl" style={{ animationDelay: "80ms" }}>
            Ada pertanyaan?{" "}
            <span className="bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">Kami siap bantu.</span>
          </h1>
          <p className="pub-rise mt-6 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed" style={{ animationDelay: "160ms" }}>
            Pilih channel yang paling nyaman buat kamu. Tim kami biasanya balas
            di jam kerja.
          </p>
        </div>
      </section>
      {/* ===== CHANNELS ===== */}
            <section className="py-16 sm:py-24 border-t border-white/10">
              <div className="mx-auto max-w-6xl px-5">
                <Reveal>
                  <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Ikuti kami</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tetap terhubung</h2>
                </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block h-full relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1"
                >
                  <div className={`pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full blur-3xl ${c.accent === "mint" ? "bg-mint/15" : "bg-cyan/15"}`} />
                  <div className="relative">
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${c.accent === "mint" ? "bg-mint/15 text-mint" : "bg-cyan/15 text-cyan"}`}>
                      {c.icon}
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{c.label}</h3>
                    <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{c.desc}</p>
                    <p className={`mt-4 text-sm font-semibold ${c.accent === "mint" ? "text-mint" : "text-cyan"}`}>
                      {c.value}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pertanyaan yang sering ditanya</h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <FaqRow q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION / MAP ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Lokasi</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Di mana kami</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch">
              {/* address card */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 flex flex-col justify-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/15 text-mint">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <h3 className="mt-5 text-xl font-bold">Alamat</h3>
                <p className="mt-2 text-white/70 leading-relaxed">
                  A2 1908 Golden King Building, 15 Nguyen Luong Bang, Tan My Ward,
                  Ho Chi Minh City, Vietnam
                </p>
              </div>

              {/* map embed pointing at the real address */}
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] min-h-[280px]">
                <iframe
                  title="Lokasi Imely"
                  src="https://www.google.com/maps?q=A2%201908%20Golden%20King%20Building%2C%2015%20Nguyen%20Luong%20Bang%2C%20Tan%20My%20Ward%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam&output=embed"
                  className="w-full h-full min-h-[280px]"
                  style={{ border: 0, filter: "grayscale(0.3) contrast(1.05)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cream via-mint/90 to-teal-light p-10 sm:p-16 text-center">
              <div className="pointer-events-none absolute -top-1/3 -right-1/4 h-[30rem] w-[30rem] rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[28rem] w-[28rem] rounded-full bg-teal/30 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-ink">
                  Mau langsung gabung?
                </h2>
                <p className="mt-5 text-ink/70 text-lg font-medium">Daftar gratis dan mulai berkarya hari ini.</p>
                <Link to="/daftar" className="mt-9 inline-flex items-center justify-center rounded-full bg-ink px-10 py-4 text-white font-bold text-lg shadow-2xl shadow-ink/30 hover:-translate-y-0.5 hover:bg-ink/90 transition-all">
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