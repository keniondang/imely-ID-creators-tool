import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  myCharacterSubmissions,
  myVideoSubmissions,
  signedProofUrl,
} from "../lib/submissions";
import StatusBadge from "../components/StatusBadge";

function externalUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "#";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProofLink({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    signedProofUrl(path).then(setUrl);
  }, [path]);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-dark hover:underline"
    >
      🧾 Lihat bukti pembayaran
    </a>
  );
}

type Filters = {
  q: string;
  status: "all" | "pending" | "approved" | "rejected";
  sort: "newest" | "oldest";
};

function Toolbar({
  filters,
  setFilters,
  count,
  placeholder,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  count: number;
  placeholder: string;
}) {
  const statuses: Filters["status"][] = ["all", "pending", "approved", "rejected"];
  const statusLabel: Record<string, string> = {
    all: "Semua",
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
  };
  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          placeholder={placeholder}
          className="flex-1 min-w-[180px] rounded-xl border border-ink/15 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
        <button
          onClick={() =>
            setFilters({ ...filters, sort: filters.sort === "newest" ? "oldest" : "newest" })
          }
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-muted hover:text-ink hover:bg-ink/5 transition whitespace-nowrap"
        >
          {filters.sort === "newest" ? "↓ Terbaru" : "↑ Terlama"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilters({ ...filters, status: s })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filters.status === s
                ? "bg-gradient-to-r from-mint to-teal text-ink shadow-sm shadow-teal/30"
                : "bg-cream/60 text-muted hover:text-ink"
            }`}
          >
            {statusLabel[s]}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">{count} hasil</span>
      </div>
    </div>
  );
}

function applyFilters(rows: any[], f: Filters, kind: "karakter" | "video"): any[] {
  let out = rows;
  if (f.status !== "all") out = out.filter((r) => r.status === f.status);
  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    out = out.filter((r) => {
      if (kind === "karakter") {
        return (
          (r.character_name || "").toLowerCase().includes(q) ||
          (r.character_link || "").toLowerCase().includes(q)
        );
      }
      return (r.tiktok_link || "").toLowerCase().includes(q);
    });
  }
  out = [...out].sort((a, b) => {
    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return f.sort === "newest" ? db - da : da - db;
  });
  return out;
}

/* ---------- ROWS ---------- */
function CharRow({ c }: { c: any }) {
  const [open, setOpen] = useState(false);
  const hasDetail = c.review_notes || c.final_amount != null || c.payment_proof;
  return (
    <div className="rounded-xl border border-ink/5 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink/[0.02] transition"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{c.character_name}</p>
            {c.breakout_claimed && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-teal-dark bg-teal/10 border border-teal/20 rounded-full px-2 py-0.5">
                Breakout
              </span>
            )}
          </div>
          <p className="text-xs text-muted">{fmtDate(c.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={c.status} />
          {c.payment_status && c.payment_status !== "unpaid" && (
            <StatusBadge status={c.payment_status} />
          )}
          {hasDetail && (
            <span className={`text-muted text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
          )}
        </div>
      </button>
      {open && hasDetail && (
        <div className="px-4 pb-3 space-y-2 border-t border-ink/5 pt-3">
          <a href={externalUrl(c.character_link)} target="_blank" rel="noreferrer" className="text-xs text-teal-dark hover:underline truncate block">
            {c.character_link}
          </a>
          {c.final_amount != null && (
            <p className="text-sm font-bold text-teal-dark">
              Rp {Number(c.final_amount).toLocaleString("id-ID")}
            </p>
          )}
          {c.review_notes && (
            <p className="text-xs text-ink/70 bg-cream/60 border border-ink/5 rounded-lg px-3 py-2">
              <span className="font-semibold">Catatan admin:</span> {c.review_notes}
            </p>
          )}
          {c.payment_proof && <ProofLink path={c.payment_proof} />}
        </div>
      )}
    </div>
  );
}

function VideoRow({ v }: { v: any }) {
  const [open, setOpen] = useState(false);
  const hasDetail = v.review_notes || v.final_amount != null || v.payment_proof || v.analytics_screenshot;
  return (
    <div className="rounded-xl border border-ink/5 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink/[0.02] transition"
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{v.tiktok_link}</p>
          <p className="text-xs text-muted">
            {v.view_count.toLocaleString("id-ID")} views · {fmtDate(v.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={v.status} />
          {v.payment_status && v.payment_status !== "unpaid" && (
            <StatusBadge status={v.payment_status} />
          )}
          {hasDetail && (
            <span className={`text-muted text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
          )}
        </div>
      </button>
      {open && hasDetail && (
        <div className="px-4 pb-3 space-y-2 border-t border-ink/5 pt-3">
          <a href={externalUrl(v.tiktok_link)} target="_blank" rel="noreferrer" className="text-xs text-teal-dark hover:underline truncate block">
            {v.tiktok_link}
          </a>
          {v.analytics_screenshot && (
            <a href={externalUrl(v.analytics_screenshot)} target="_blank" rel="noreferrer" className="text-xs text-teal-dark hover:underline block">
              Lihat screenshot
            </a>
          )}
          {v.final_amount != null && (
            <p className="text-sm font-bold text-teal-dark">
              Rp {Number(v.final_amount).toLocaleString("id-ID")}
            </p>
          )}
          {v.review_notes && (
            <p className="text-xs text-ink/70 bg-cream/60 border border-ink/5 rounded-lg px-3 py-2">
              <span className="font-semibold">Catatan admin:</span> {v.review_notes}
            </p>
          )}
          {v.payment_proof && <ProofLink path={v.payment_proof} />}
        </div>
      )}
    </div>
  );
}

const tabCls = (active: boolean) =>
  `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
    active
      ? "bg-gradient-to-r from-mint to-teal text-ink shadow-sm shadow-teal/30"
      : "bg-white border border-ink/10 text-muted hover:text-ink"
  }`;

const MaskIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M3 5h18v6a9 9 0 0 1-18 0V5Zm5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);
const VideoIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z" />
  </svg>
);

export default function Riwayat() {
  const [creator, setCreator] = useState<any>(null);
  const [chars, setChars] = useState<any[]>([]);
  const [vids, setVids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"karakter" | "video">("karakter");
  const [filters, setFilters] = useState<Filters>({ q: "", status: "all", sort: "newest" });

  useEffect(() => {
    (async () => {
      const { data: cr } = await supabase.from("creators").select("*").single();
      setCreator(cr);
      const { data: c } = await myCharacterSubmissions();
      const { data: v } = await myVideoSubmissions();
      setChars(c ?? []);
      setVids(v ?? []);
      if (!cr?.program_karakter && cr?.program_konten) setTab("video");
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;

  const inKarakter = creator?.program_karakter;
  const inKonten = creator?.program_konten;

  if (!inKarakter && !inKonten) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase mb-1">Riwayat</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Riwayat</h1>
        </div>
        <p className="text-sm text-muted">Kamu belum terdaftar di program manapun.</p>
      </div>
    );
  }

  const showKarakter = inKarakter && (tab === "karakter" || !inKonten);
  const showVideo = inKonten && (tab === "video" || !inKarakter);

  const filteredChars = applyFilters(chars, filters, "karakter");
  const filteredVids = applyFilters(vids, filters, "video");
  const activeCount = showKarakter ? filteredChars.length : filteredVids.length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase mb-1">Karyamu</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Riwayat</h1>
      </div>

      {inKarakter && inKonten && (
        <div className="flex gap-2">
          <button className={tabCls(tab === "karakter")} onClick={() => setTab("karakter")}>
            {MaskIcon} Karakter Saya
          </button>
          <button className={tabCls(tab === "video")} onClick={() => setTab("video")}>
            {VideoIcon} Video Saya
          </button>
        </div>
      )}

      <Toolbar
        filters={filters}
        setFilters={setFilters}
        count={activeCount}
        placeholder={showKarakter ? "Cari nama / link karakter…" : "Cari link video…"}
      />

      {showKarakter && (
        <div className="space-y-2">
          {chars.length === 0 ? (
            <p className="text-sm text-muted">Belum ada karakter dikirim.</p>
          ) : filteredChars.length === 0 ? (
            <p className="text-sm text-muted">Tidak ada yang cocok dengan filter.</p>
          ) : (
            filteredChars.map((c) => <CharRow key={c.id} c={c} />)
          )}
        </div>
      )}

      {showVideo && (
        <div className="space-y-2">
          {vids.length === 0 ? (
            <p className="text-sm text-muted">Belum ada video dikirim.</p>
          ) : filteredVids.length === 0 ? (
            <p className="text-sm text-muted">Tidak ada yang cocok dengan filter.</p>
          ) : (
            filteredVids.map((v) => <VideoRow key={v.id} v={v} />)
          )}
        </div>
      )}
    </div>
  );
}