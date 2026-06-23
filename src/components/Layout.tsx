import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Beranda" },
  { to: "/profil", label: "Profil" },
  { to: "/submission", label: "Karya" },
  { to: "/admin", label: "Admin" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-full flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-ink/5">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-white font-extrabold text-sm">
              i
            </span>
            <span className="font-extrabold tracking-tight">
              Imely <span className="text-teal">Creator</span>
            </span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname === item.to
                    ? "bg-teal text-white"
                    : "text-muted hover:text-ink hover:bg-ink/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-cream/95 backdrop-blur border-t border-ink/10">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium ${
                  active ? "text-teal" : "text-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mb-1 ${
                    active ? "bg-teal" : "bg-transparent"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}