import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import Reveal from "../../components/public/Reveal";

/* ===== Portrait iPhone frame holding an app screenshot ===== */
function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-mint/25 to-cyan/20 blur-2xl" />
      {/* body */}
      <div className="relative rounded-[2.6rem] bg-ink border-[5px] border-white/15 shadow-2xl overflow-hidden">
        {/* notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 h-5 w-28 rounded-full bg-black" />
        {/* screen */}
        <div className="aspect-[9/19.5] bg-black">
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

/* ===== Step data (text transcribed from the reference designs) ===== */
const steps = [
  {
    n: 1,
    title: "Mulai dari beranda",
    lead: "Buka Imely, tap ikon + di kanan atas beranda.",
    points: [
      ["Tap ikon +", "Ada di pojok kanan atas beranda."],
      ["Langsung jadi", "Gak ada proses ribet, sekali tap form-nya kebuka."],
    ],
    img: "/guide-1.png",
  },
  {
    n: 2,
    title: "Identitas dasar",
    lead: "Lengkapi profil dasar karakter kamu.",
    points: [
      ["Avatar", "Gambar jelas yang nyatu sama vibe karakternya. Ini yang pertama user liat."],
      ["Nama karakter", "Nama yang gampang diinget & nyambung sama karakternya."],
      ["Jenis kelamin", "Pilih sesuai karakter yang kamu bikin."],
      ["Tagline", 'Tulis pakai suara karakternya. Contoh: "Mau cerita apa hari ini?"'],
    ],
    img: "/guide-2.png",
  },
  {
    n: 3,
    title: "Bikin dia hidup",
    lead: "Ini yang nentuin cara karaktermu ngobrol.",
    points: [
      ["Kepribadian", "Sifat & karakternya. Makin spesifik makin hidup."],
      ["Informasi publik", "Info soal karakter yang tampil di profilnya."],
      ["Pembuka percakapan", "Biografi (latar belakang & situasi awal) + pesan pertamanya ke pengguna."],
    ],
    img: "/guide-3.png",
  },
  {
    n: 4,
    title: "Pengaturan lanjutan",
    lead: "Opsional, tapi bikin karaktermu naik level.",
    points: [
      ["NPC", "Karakter tambahan dalam obrolan. Contoh: sahabat, rival."],
      ["Gaya komunikasi", "Contoh: ramah, Gen Z, sastrawi."],
      ["Pedoman & batasan", "Contoh: tolak topik romantis dengan sopan."],
      ["Catatan kreator", "Catatan dari kreator untuk pengguna."],
    ],
    img: "/guide-4.png",
  },
];

/* ===== Review checklist data ===== */
const criteria = [
  {
    name: "Uniqueness — Keunikan",
    lolos: "Kombinasi nama, latar belakang, situasi, dan hubungan dengan user menciptakan profil yang tidak bisa digantikan. Kalau namanya diganti, seluruh logika karakter ikut runtuh.",
    gagal: [
      "Karakter cukup dijelaskan pakai stereotipe, tanpa detail tambahan apapun.",
      "Dua karakter berbeda dalam satu submission punya backstory yang nyaris sama, hanya beda setting.",
      "Tidak ada detail spesifik yang membuat karakter ini terasa berbeda dari 10 karakter lain dengan tipe serupa.",
    ],
  },
  {
    name: "Background — Latar Belakang",
    lolos: "Apa yang terjadi di masa lalu karakter menjelaskan perilaku, cara pandang, dan reaksi mereka di masa sekarang. Kepribadian karakter bisa ditelusuri balik ke akar ceritanya.",
    gagal: [
      "Kepribadian dan backstory tidak nyambung — misalnya karakter \u201cdingin\u201d tapi tidak ada peristiwa di masa lalu yang membentuk sifat itu.",
      "Ada kontradiksi timeline atau logika cerita yang tidak terjelaskan.",
      "Backstory hanya jadi pelengkap, tidak berpengaruh pada cara karakter bersikap di percakapan.",
    ],
  },
  {
    name: "Narrative Depth — Kedalaman Cerita",
    lolos: "Deskripsi karakter menyiratkan lebih dari yang diucapkan secara langsung. Ada subtext, ada bagian yang sengaja belum terungkap, ada pertanyaan yang bikin user penasaran dan ingin menggali sendiri lewat percakapan.",
    gagal: [
      "Seluruh cerita karakter sudah dijelaskan habis di deskripsi — tidak ada lagi yang menarik untuk dieksplorasi.",
      "Tidak ada konflik internal atau ketegangan yang masih menggantung.",
      "Arc karakter bisa diringkas dalam satu kalimat tanpa kehilangan sesuatu yang penting.",
    ],
  },
  {
    name: "Conversation — Gaya Percakapan",
    lolos: "Saat membaca dialog sample tanpa melihat nama karakternya, pembaca tetap bisa mengenali ini siapa — dari pilihan kata, struktur kalimatnya, hal-hal yang tidak karakter ucapkan secara langsung, dan cara mereka menghindar atau membalas dengan bahasa.",
    gagal: [
      "Dialog sample bisa di-paste ke karakter lain dengan mood serupa dan tetap terasa cocok.",
      "Dialog sample kurang dari 3 baris dalam submission.",
      "Gaya bicara terlalu bergantung pada situasi — begitu dilepas dari adegan, ciri khasnya hilang.",
    ],
  },
  {
    name: "Personalization — Personalisasi",
    lolos: "Identitas karakter dan hubungannya dengan user cukup spesifik, sampai user langsung paham harus bersikap seperti apa dari pesan pertama.",
    gagal: [
      "User bisa berperan sebagai siapa saja — peran terbuka penuh, tanpa arahan.",
      "Pesan pembuka tidak memberikan konteks yang cukup untuk user memulai percakapan secara natural.",
      "Karakter tidak punya alasan spesifik untuk berinteraksi dengan user di adegan itu.",
    ],
  },
  {
    name: "Community Standards — Standar Komunitas",
    lolos: "Karakter boleh dark, rumit secara moral, atau mengangkat tema sensitif — selama itu mendukung narasinya dan tidak membahayakan user secara nyata.",
    gagal: [
      "Konten berpotensi membahayakan user secara nyata kalau dipraktikkan di dunia luar.",
      "Karakter dibuat untuk menyerang atau merendahkan kelompok tertentu berdasarkan identitas pribadi mereka.",
      "Karakter berbasis pada orang nyata yang bisa dikenali — baik tokoh publik maupun orang biasa.",
      "Karakter atau user diposisikan sebagai anak di bawah umur dalam konteks romantis atau seksual.",
    ],
  },
  {
    name: "Public Content Standards — Standar Konten Publik",
    lolos: "Semua konten yang tampil ke publik — hashtag, tagline, deskripsi yang kelihatan — pakai bahasa yang sesuai untuk semua kalangan user di app.",
    gagal: [
      "Hashtag mengandung kata kasar, sensitif, atau bermakna seksual.",
      "Tagline pakai bahasa yang melanggar standar komunitas atau aturan platform.",
      "Bagian informasi publik (nama, deskripsi yang tampil, tags) memuat konten yang tidak pantas.",
    ],
    note: "Bagian internal karakter (system prompt, world info, dll) akan direview lebih fleksibel. Pembatasan ini hanya berlaku untuk bagian yang tampil ke semua user secara publik.",
  },
];

function CriterionRow({ c, i }: { c: (typeof criteria)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition"
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint/15 text-mint font-bold text-sm">
          {i + 1}
        </span>
        <span className="flex-1 font-bold">{c.name}</span>
        <span className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 space-y-4">
          <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-mint mb-1.5">✓ Lolos</p>
            <p className="text-sm text-white/80 leading-relaxed">{c.lolos}</p>
          </div>
          <div className="rounded-xl border border-red-400/20 bg-red-500/[0.06] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-300 mb-1.5">✕ Gagal</p>
            <ul className="space-y-1.5">
              {c.gagal.map((g, gi) => (
                <li key={gi} className="text-sm text-white/70 leading-relaxed flex gap-2">
                  <span className="text-red-300/60 shrink-0">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          {c.note && (
            <p className="text-xs text-white/40 italic leading-relaxed">Catatan: {c.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgramKarakter() {
  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/3 h-[45rem] w-[45rem] rounded-full bg-teal/25 blur-[130px] animate-aurora-1" />
          <div className="absolute top-1/3 -right-1/4 h-[35rem] w-[35rem] rounded-full bg-mint/15 blur-[120px] animate-aurora-2" />
        </div>
        <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 sm:pt-28">
          <p className="pub-rise text-mint font-semibold tracking-[0.2em] text-xs uppercase mb-5">Program 01</p>
          <h1 className="pub-rise text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl" style={{ animationDelay: "80ms" }}>
            Kreator <span className="bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">Karakter</span>
          </h1>
          <p className="pub-rise mt-6 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed" style={{ animationDelay: "160ms" }}>
            Desain karakter AI yang terasa hidup. Tiap karakter yang lolos review
            dibayar — dan kalau karaktermu meledak dipakai banyak user, bonusnya
            besar.
          </p>
          <div className="pub-rise mt-9" style={{ animationDelay: "240ms" }}>
            <Link to="/daftar" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-teal px-8 py-4 text-ink font-bold text-lg shadow-2xl shadow-teal/30 hover:-translate-y-0.5 transition-all">
              Daftar jadi kreator →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU DO ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Peranmu</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl">
              Yang kamu lakukan
            </h2>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              {
                t: "Bikin karakter",
                d: "Rancang avatar, kepribadian, dan gaya bicara unik untuk setiap karakter.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                    <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm-7 18a7 7 0 0 1 14 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1Z" />
                  </svg>
                ),
              },
              {
                t: "Bangun cerita & dunianya",
                d: "Tulis lore, latar belakang, dan dialog pembuka supaya karakter langsung terasa hidup di percakapan pertama.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                t: "Tumbuhkan fanbase",
                d: "Sebarkan karaktermu, ajak user pertama untuk mencoba, dan bangun komunitas di sekitar karakter itu.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                    <path d="M3 11l18-8-8 18-2-7-8-3Z" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-mint/30 hover:bg-white/[0.04] transition-all">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/15 text-mint">
                    {c.icon}
                  </span>
                  <h3 className="mt-4 font-bold text-lg text-mint">{c.t}</h3>
                  <p className="mt-2 text-white/60 leading-relaxed text-sm">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO WE LOOK FOR ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-2">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Yang kami cari</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Kami cari kamu yang...
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 space-y-4">
            {[
              "Suka menulis karakter, menyusun dialog, atau membangun dunia cerita — nggak perlu background teknis.",
              "Pernah pakai atau familiar dengan aplikasi AI chat (Character.AI, PolyBuzz, Talkie, dll) — ini jadi nilai plus.",
              "Bisa menyelesaikan minimal 1-3 karakter sesuai timeline yang disepakati.",
              "Bisa mengatur waktu sendiri — kerjanya fleksibel, mengikuti ritme kamu.",
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
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

      {/* ===== WHO WE LOOK FOR ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Pembayaran</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Struktur bayaran</h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-teal/20 blur-3xl" />
                <div className="relative">
                  <p className="text-mint text-sm font-semibold uppercase tracking-wide">Per karakter disetujui</p>
                  <p className="mt-2 text-5xl font-extrabold text-mint">Rp 45.000</p>
                  <p className="mt-3 text-white/60 leading-relaxed">
                    Dibayar untuk tiap karakter yang lolos review dan masuk ke app.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-mint/20 blur-3xl" />
                <div className="relative">
                  <p className="text-mint text-sm font-semibold uppercase tracking-wide">Bonus Breakout</p>
                  <p className="mt-2 text-5xl font-extrabold text-mint">Rp 1.000.000</p>
                  <p className="mt-3 text-white/60 leading-relaxed">
                    Kalau karaktermu mencapai 500.000 pesan dari user. Reward buat
                    karakter yang beneran meledak.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* no earning cap */}
          <Reveal delay={200}>
            <div className="mt-6 relative overflow-hidden rounded-3xl border border-mint/20 bg-gradient-to-r from-mint/[0.08] to-cyan/[0.06] p-8">
              <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-mint/15 blur-3xl" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-mint text-sm font-semibold uppercase tracking-wide">Potensi pendapatan</p>
                  <p className="mt-1 text-5xl font-extrabold bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">Tanpa batas</p>
                </div>
                <p className="text-white/60 font-medium leading-relaxed max-w-xs">
                  Nggak ada batasan jumlah karakter. Makin banyak karakter yang
                  lolos, makin besar penghasilanmu — plus bonus Breakout tiap kali
                  ada yang meledak.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== HOW TO BUILD — 4 step alternating sequence ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Panduan</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Cara bikin karakter</h2>
              <p className="mt-4 text-white/60 text-lg">Empat langkah, dari nol sampai jadi.</p>
            </div>
          </Reveal>

          <div className="space-y-20 sm:space-y-28">
            {steps.map((s, i) => (
              <Reveal key={s.n}>
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 ? "" : ""}`}>
                  {/* phone — alternates side on desktop */}
                  <div className={`${i % 2 ? "lg:order-2" : "lg:order-1"}`}>
                    <PhoneFrame src={s.img} alt={`Langkah ${s.n} — ${s.title}`} />
                  </div>
                  {/* text */}
                  <div className={`${i % 2 ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-teal text-ink font-extrabold text-lg">
                        {s.n}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-mint">Langkah {s.n}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-white/60 text-lg">{s.lead}</p>
                    <div className="mt-6 space-y-4">
                      {s.points.map(([t, d]) => (
                        <div key={t} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                          <div>
                            <p className="font-bold">{t}</p>
                            <p className="text-sm text-white/60 leading-relaxed">{d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEW CRITERIA — accordion ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-10">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Kriteria review</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Checklist evaluasi karakter
              </h2>
              <p className="mt-4 text-white/60 leading-relaxed">
                Tiap karakter dievaluasi dengan 7 kriteria ini sebelum bergabung di
                Imely Creator Program. Tap tiap kriteria untuk lihat detail lolos &
                gagalnya.
              </p>
            </div>
          </Reveal>
          <div className="space-y-3">
            {criteria.map((c, i) => (
              <Reveal key={c.name} delay={i * 40}>
                <CriterionRow c={c} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pt-16 sm:pt-24 pb-28 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cream via-mint/90 to-teal-light p-10 sm:p-16 text-center">
              <div className="pointer-events-none absolute -top-1/3 -right-1/4 h-[30rem] w-[30rem] rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[28rem] w-[28rem] rounded-full bg-teal/30 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-ink">
                  Siap bikin karaktermu?
                </h2>
                <p className="mt-5 text-ink/70 text-lg font-medium">Daftar gratis, mulai berkarya hari ini.</p>
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