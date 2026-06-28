import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/tentang", label: "Tentang" },
  { to: "/kontak", label: "Kontak" },
];

const programLinks = [
  {
    to: "/programs/karakter",
    label: "Kreator Karakter",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm-7 18a7 7 0 0 1 14 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1Z" />
      </svg>
    ),
  },
  {
    to: "/programs/konten",
    label: "Kreator Konten",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
      </svg>
    ),
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [progOpen, setProgOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (progRef.current && !progRef.current.contains(e.target as Node)) setProgOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // nav background solidifies on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProgOpen(false);
  }, [pathname]);

  const progActive = pathname.startsWith("/programs");
  const linkCls = (active: boolean) =>
    `text-sm font-semibold transition ${active ? "text-mint" : "text-white/70 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-ink text-white flex flex-col">
      {/* NAV */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-ink/80 backdrop-blur border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Imely" className="h-8 w-8 rounded-lg" />
            <span className="font-extrabold tracking-tight">
              Imely <span className="text-mint">Creator</span>
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className={linkCls(pathname === "/")}>Beranda</Link>

            {/* Programs dropdown */}
            <div className="relative" ref={progRef}>
              <button
                onClick={() => setProgOpen((o) => !o)}
                className={`flex items-center gap-1 ${linkCls(progActive)}`}
              >
                Programs
                <span className={`text-xs transition-transform ${progOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {progOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl bg-ink border border-white/10 shadow-2xl overflow-hidden">
                  {programLinks.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition ${
                        pathname === p.to ? "text-mint" : "text-white/80"
                      }`}
                    >
                      <span className="text-white/70">{p.icon}</span>
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/tentang" className={linkCls(pathname === "/tentang")}>Tentang</Link>
            <Link to="/kontak" className={linkCls(pathname === "/kontak")}>Kontak</Link>

            <Link
              to="/masuk"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-ink transition-colors"
            >
              Masuk
            </Link>
          </nav>

          {/* mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
            aria-label="Menu"
          >
            <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-ink/95 backdrop-blur">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to}
                  className={`block py-2.5 font-semibold ${pathname === l.to ? "text-mint" : "text-white/80"}`}>
                  {l.label}
                </Link>
              ))}
              <p className="pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-white/40">Programs</p>
              {programLinks.map((p) => (
                <Link key={p.to} to={p.to}
                  className={`flex items-center gap-2 py-2.5 ${pathname === p.to ? "text-mint" : "text-white/80"}`}>
                  <span className="text-white/70">{p.icon}</span>
                </Link>
              ))}
              <Link to="/masuk"
                className="mt-3 block text-center rounded-full border border-white/20 px-5 py-2.5 font-bold text-white">
                Masuk
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-ink border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
            <div className="space-y-3 max-w-xs">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Imely" className="h-8 w-8 rounded-lg" />
                <span className="font-extrabold">Imely <span className="text-mint">Creator</span></span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Program kreator resmi Imely untuk Indonesia. Berkarya, dapat penghasilan.
              </p>
              <a href="https://imely.ai" target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold text-mint hover:underline">
                imely.ai ↗
              </a>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-2">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Menu</p>
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="block text-sm text-white/70 hover:text-white">{l.label}</Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Programs</p>
                {programLinks.map((p) => (
                  <Link key={p.to} to={p.to} className="block text-sm text-white/70 hover:text-white">{p.label}</Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">Ikuti kami</p>
              <div className="flex items-center gap-3">
                {[
                  ["TikTok", "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3c-1.36 0-2.83-.91-3.24-1.48z", "fill"],
                  ["Instagram", "", "ig"],
                  ["Discord", "M20.32 4.57A19.8 19.8 0 0 0 15.45 3a13.7 13.7 0 0 0-.62 1.28 18.3 18.3 0 0 0-5.66 0A13.6 13.6 0 0 0 8.54 3 19.74 19.74 0 0 0 3.67 4.57C.58 9.2-.26 13.7.16 18.14a19.95 19.95 0 0 0 6.05 3.06c.49-.66.92-1.37 1.29-2.11-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4a14.27 14.27 0 0 0 12.16 0c.16.14.33.27.5.4-.64.39-1.32.72-2.03.99.37.74.8 1.45 1.29 2.11a19.9 19.9 0 0 0 6.05-3.06c.5-5.18-.84-9.64-3.51-13.57zM8.02 15.41c-1.18 0-2.15-1.08-2.15-2.41s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.41-2.15 2.41zm7.96 0c-1.18 0-2.15-1.08-2.15-2.41s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.94 2.41-2.15 2.41z", "fill"],
                ].map(([label, path, mode]) => (
                  <a key={label} href="#" target="_blank" rel="noreferrer" aria-label={`${label} Imely`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white hover:text-ink transition-colors">
                    {mode === "ig" ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                        <path d={path as string} />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/40">
            <p>© {new Date().getFullYear()} Imely Creator Program</p>
            <p>Dikelola untuk pasar Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>
    </div>
  );
}