import { Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import Reveal from "../../components/public/Reveal";

const values = [
  {
    t: "Kreator dihargai",
    d: "Karya yang bagus pantas dibayar dengan adil dan transparan. Nggak ada syarat tersembunyi.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    t: "Cerita yang hidup",
    d: "Kami percaya karakter terbaik lahir dari kreator yang punya suara dan imajinasi sendiri.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    t: "Dibangun bareng",
    d: "Program ini tumbuh dari masukan komunitas. Kreator bukan cuma kontributor, tapi partner.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 19a5 5 0 0 0-4-4.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const team = [
  { name: "Nama Tim", role: "Peran / jabatan", bio: "Bio singkat anggota tim ini." },
  { name: "Nama Tim", role: "Peran / jabatan", bio: "Bio singkat anggota tim ini." },
  { name: "Nama Tim", role: "Peran / jabatan", bio: "Bio singkat anggota tim ini." },
];

export default function Tentang() {
  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/2 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-teal/20 blur-[130px] animate-aurora-1" />
          <div className="absolute top-1/3 -right-1/4 h-[35rem] w-[35rem] rounded-full bg-cyan/15 blur-[120px] animate-aurora-2" />
        </div>
        <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 sm:pt-28">
          <p className="pub-rise text-mint font-semibold tracking-[0.2em] text-xs uppercase mb-5">Tentang</p>
          <h1 className="pub-rise text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl" style={{ animationDelay: "80ms" }}>
            Membangun masa depan{" "}
            <span className="bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">AI companion</span>{" "}
            bareng kreator Indonesia.
          </h1>
          <p className="pub-rise mt-6 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed" style={{ animationDelay: "160ms" }}>
            Imely adalah aplikasi AI companion tempat siapa pun bisa ngobrol dengan
            karakter AI yang terasa hidup. Program kreator ini dibuat supaya orang
            di balik karakter-karakter itu dihargai.
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Tentang Imely</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Apa itu Imely</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 text-white/70 leading-relaxed text-lg">
              <p>
                Imely adalah platform AI companion yang menghubungkan pengguna
                dengan ribuan karakter AI — dari teman ngobrol santai sampai
                karakter dengan cerita dan dunia yang dalam.
              </p>
              <p>
                Tiap karakter dibuat oleh kreator. Lewat Imely Creator Program,
                kami mengundang penulis, pencerita, dan kreator konten di Indonesia
                untuk ikut membangun ekosistem ini — dan mendapat penghasilan dari
                karya mereka.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Kenapa Imely</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Yang kami percaya</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-mint/30 hover:bg-white/[0.04] transition-all">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/15 text-mint">
                    {v.icon}
                  </span>
                  <h3 className="mt-4 font-bold text-lg">{v.t}</h3>
                  <p className="mt-2 text-white/60 leading-relaxed text-sm">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRACK RECORD ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Track record</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pengalaman tim</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 sm:p-8">
              <p className="text-white/70 leading-relaxed text-lg">
                Tulis di sini rekam jejak tim dan produk sebelumnya — aplikasi yang
                pernah dibangun, jumlah pengguna, atau pencapaian relevan. Pastikan
                semua yang ditulis akurat dan bisa diverifikasi.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Lokasi</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Di mana kami</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch">
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

      {/* ===== TEAM ===== */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-mint font-semibold tracking-widest text-xs uppercase mb-3">Tim</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Orang di balik program</h2>
              <p className="mt-4 text-white/60">Tim yang ngurus review, pembayaran, dan komunitas kreator.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {team.map((m, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center hover:border-mint/30 hover:bg-white/[0.04] transition-all">
                  {/* photo placeholder — swap for <img src=... /> */}
                  <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-teal to-cyan-dark flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-10 w-10 fill-white/80" aria-hidden="true">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6Z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-bold text-lg">{m.name}</h3>
                  <p className="text-sm text-mint font-semibold">{m.role}</p>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
                  Jadi bagian dari Imely.
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