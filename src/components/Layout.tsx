import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Logo from "./Logo";

const creatorNav = [
  { to: "/app", label: "Beranda" },
  { to: "/profil", label: "Profil" },
  { to: "/submission", label: "Kirim Karya"},
  { to: "/riwayat", label: "Riwayat" },
];

function initials(name?: string, email?: string): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  }
  return (email?.[0] || "?").toUpperCase();
}

function AccountMenu() {
  const { profile, session, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-mint to-teal text-ink font-extrabold text-sm hover:opacity-90 transition"
        aria-label="Akun"
      >
        {initials(undefined, session?.user.email)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-ink/10 shadow-lg overflow-hidden z-40">
          <div className="p-4 border-b border-ink/5">
            <p className="text-sm font-bold text-ink truncate">{session?.user.email}</p>
            <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 border ${
              isAdmin
                ? "bg-teal/10 text-teal-dark border-teal/20"
                : "bg-ink/5 text-muted border-ink/10"
            }`}>
              {isAdmin ? "Admin" : "Kreator"}
            </span>
          </div>
          <button
            onClick={() => { setOpen(false); signOut(); }}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

const navLink = (active: boolean) =>
  `px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
    active
      ? "bg-gradient-to-r from-mint to-teal text-ink shadow-sm shadow-teal/30"
      : "text-muted hover:text-ink hover:bg-ink/5"
  }`;

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [reviewOpen, setReviewOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setReviewOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const reviewActive = pathname === "/admin/karakter" || pathname === "/admin/video";

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-ink/5">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <Logo variant="dark" />
          </Link>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1">
                <Link to="/app" className={navLink(pathname === "/app")}>Beranda</Link>
                <Link to="/admin/persetujuan" className={navLink(pathname === "/admin/persetujuan")}>
                  Akun kreator
                </Link>
                <div className="relative" ref={ddRef}>
                  <button
                    onClick={() => setReviewOpen((o) => !o)}
                    className={`${navLink(reviewActive)} flex items-center gap-1`}>
                    Review
                    <span className={`text-xs transition-transform ${reviewOpen ? "rotate-180" : ""}`}>▾</span>
                  </button>
                  {reviewOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-ink/10 shadow-lg overflow-hidden z-40">
                      <Link to="/admin/karakter" onClick={() => setReviewOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5 ${pathname === "/admin/karakter" ? "text-teal-dark font-semibold" : "text-ink"}`}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M3 5h18v6a9 9 0 0 1-18 0V5Zm5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                        </svg>
                        Review karakter
                      </Link>
                      <Link to="/admin/video" onClick={() => setReviewOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5 ${pathname === "/admin/video" ? "text-teal-dark font-semibold" : "text-ink"}`}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
                        </svg>
                        Review video
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/admin/pengaturan" className={navLink(pathname === "/admin/pengaturan")}>
                  Pengaturan
                </Link>
              </nav>
              <div className="pl-3 border-l border-ink/10">
                <AccountMenu />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <nav className="hidden sm:flex items-center gap-1">
                {creatorNav.map((item) => (
                  <Link key={item.to} to={item.to} className={navLink(pathname === item.to)}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <AccountMenu />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      {!isAdmin && (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-cream/95 backdrop-blur border-t border-ink/10">
          <div className="grid grid-cols-4">
            {creatorNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium ${active ? "text-teal" : "text-muted"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full mb-1 ${active ? "bg-teal" : "bg-transparent"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}