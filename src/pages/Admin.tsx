import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { calcVideo, calcCharacter, rupiah, Settings } from "../lib/payments";
import { uploadPaymentProof, signedProofUrl } from "../lib/submissions";
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

/* shared button styles */
const primaryBtn =
  "rounded-full bg-gradient-to-r from-mint to-teal px-5 py-2.5 text-ink text-sm font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0";
const dangerBtn =
  "rounded-full border border-red-200 text-red-700 px-5 py-2.5 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50";
const ghostBtn =
  "rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-muted hover:text-ink hover:bg-ink/5 transition disabled:opacity-50";

/* page heading with eyebrow */
function PageHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-teal-dark font-semibold tracking-widest text-xs uppercase mb-1">{eyebrow}</p>
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
    </div>
  );
}

function initials(name?: string): string {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    supabase
      .from("program_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => setSettings(data as Settings));
  }, []);
  return settings;
}

/* ---------------- BANK INFO BLOCK ---------------- */
function PayoutInfo({ c }: { c: any }) {
  if (!c) return null;
  const has =
    c.cashout_method === "bank"
      ? c.bank_name && c.bank_account_number && c.bank_account_holder
      : c.cashout_method === "ewallet"
      ? c.ewallet_type && c.ewallet_number && c.ewallet_holder
      : false;

  if (!has) {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
        ⚠ Kreator belum mengisi info pembayaran.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-ink/[0.03] border border-ink/5 px-3 py-2 text-xs space-y-0.5">
      <p className="font-semibold text-ink/70 uppercase tracking-wide text-[10px]">
        Info pembayaran
      </p>
      {c.cashout_method === "bank" ? (
        <>
          <p><span className="text-muted">Bank:</span> {c.bank_name}</p>
          <p><span className="text-muted">No. rekening:</span> {c.bank_account_number}</p>
          <p><span className="text-muted">Atas nama:</span> {c.bank_account_holder}</p>
        </>
      ) : (
        <>
          <p><span className="text-muted">E-wallet:</span> {c.ewallet_type?.toUpperCase()}</p>
          <p><span className="text-muted">Nomor:</span> {c.ewallet_number}</p>
          <p><span className="text-muted">Atas nama:</span> {c.ewallet_holder}</p>
        </>
      )}
    </div>
  );
}

/* ---------------- FULL PROFILE BLOCK (shared) ---------------- */
function ProfileDetail({ c, joined }: { c: any; joined?: string }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <p className="text-muted">WhatsApp</p>
          <p className="font-medium text-ink">{c?.nomor_wa || "—"}</p>
        </div>
        <div>
          <p className="text-muted">Discord</p>
          <p className="font-medium text-ink truncate">{c?.username_discord || "—"}</p>
        </div>
        <div>
          <p className="text-muted">Tanggal lahir</p>
          <p className="font-medium text-ink">{c?.tanggal_lahir || "—"}</p>
        </div>
        <div>
          <p className="text-muted">Program</p>
          <p className="font-medium text-ink">
            {[c?.program_karakter && "Karakter", c?.program_konten && "Konten"].filter(Boolean).join(", ") || "—"}
          </p>
        </div>
        {joined && (
          <div>
            <p className="text-muted">Bergabung</p>
            <p className="font-medium text-ink">{fmtDate(joined)}</p>
          </div>
        )}
      </div>

      {/* Social links */}
      <div className="flex flex-wrap gap-2">
        {c?.link_tiktok && (
          <a href={externalUrl(c.link_tiktok)} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-teal-dark bg-teal/5 border border-teal/15 rounded-lg px-2.5 py-1 hover:bg-teal/10">
            TikTok ↗
          </a>
        )}
        {c?.link_instagram && (
          <a href={externalUrl(c.link_instagram)} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-teal-dark bg-teal/5 border border-teal/15 rounded-lg px-2.5 py-1 hover:bg-teal/10">
            Instagram ↗
          </a>
        )}
        {c?.link_facebook && (
          <a href={externalUrl(c.link_facebook)} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-teal-dark bg-teal/5 border border-teal/15 rounded-lg px-2.5 py-1 hover:bg-teal/10">
            Facebook ↗
          </a>
        )}
      </div>

      {/* Banking */}
      <PayoutInfo c={c} />
    </div>
  );
}

/* ---------------- PAYMENT PROOF (admin upload + view) ---------------- */
function PaymentProof({
  table,
  row,
  reload,
}: {
  table: "character_submissions" | "video_submissions";
  row: any;
  reload: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (row.payment_proof) signedProofUrl(row.payment_proof).then(setUrl);
    else setUrl(null);
  }, [row.payment_proof]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [file]);

  async function send() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const path = await uploadPaymentProof(row.creator_id, file);
      const { error } = await supabase.from(table).update({ payment_proof: path }).eq("id", row.id);
      if (error) throw error;
      setFile(null);
      reload();
    } catch (e: any) {
      setErr(e.message ?? "Gagal mengunggah bukti.");
    } finally {
      setBusy(false);
    }
  }

  if (row.payment_proof) {
    return (
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-ink/70">Bukti pembayaran</p>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-dark hover:underline">
            🧾 Lihat bukti terkirim
          </a>
        ) : (
          <p className="text-xs text-muted">Memuat bukti…</p>
        )}
        <p className="text-[11px] text-muted">Sudah terkirim & terkunci.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-ink/70">Bukti pembayaran</p>

      {!file ? (
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-teal file:px-3 file:py-1.5 file:text-white file:font-semibold hover:file:bg-teal-dark disabled:opacity-50"
        />
      ) : (
        <div className="space-y-2">
          {preview && (
            <img src={preview} alt="preview"
              className="max-h-40 rounded-lg border border-ink/10 object-contain" />
          )}
          <p className="text-xs text-muted truncate">{file.name}</p>
          <div className="flex gap-2">
            <button onClick={send} disabled={busy}
              className="rounded-full bg-gradient-to-r from-mint to-teal px-4 py-1.5 text-ink text-xs font-bold shadow-sm shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
              {busy ? "Mengirim…" : "Kirim bukti"}
            </button>
            <button onClick={() => setFile(null)} disabled={busy}
              className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-semibold text-muted hover:text-ink transition disabled:opacity-50">
              Ganti
            </button>
          </div>
          <p className="text-[11px] text-amber-700">Belum terkirim. Tekan "Kirim bukti" untuk mengunci.</p>
        </div>
      )}

      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}

/* ---------------- ROUTED SECTION WRAPPERS ---------------- */
export function AdminApprovals() {
  return (
    <div className="space-y-6">
      <PageHead eyebrow="Admin" title="Akun Kreator" />
      <Approvals />
    </div>
  );
}

export function AdminCharacters() {
  const settings = useSettings();
  return (
    <div className="space-y-6">
      <PageHead eyebrow="Review" title="Review karakter" />
      {settings ? <Characters settings={settings} /> : <p className="text-sm text-muted">Memuat…</p>}
    </div>
  );
}

export function AdminVideos() {
  const settings = useSettings();
  return (
    <div className="space-y-6">
      <PageHead eyebrow="Review" title="Review video" />
      {settings ? <Videos settings={settings} /> : <p className="text-sm text-muted">Memuat…</p>}
    </div>
  );
}

/* ---------------- ACCOUNT APPROVALS ---------------- */
type AcctFilters = {
  q: string;
  status: "all" | "pending" | "active" | "rejected" | "inactive";
  sort: "newest" | "oldest" | "name";
};

function AcctToolbar({
  filters,
  setFilters,
  count,
}: {
  filters: AcctFilters;
  setFilters: (f: AcctFilters) => void;
  count: number;
}) {
  const statuses: AcctFilters["status"][] = ["all", "pending", "active", "rejected", "inactive"];
  const statusLabel: Record<string, string> = {
    all: "Semua",
    pending: "Menunggu",
    active: "Aktif",
    rejected: "Ditolak",
    inactive: "Nonaktif",
  };
  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          placeholder="Cari nama kreator…"
          className="flex-1 min-w-[180px] rounded-xl border border-ink/15 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as AcctFilters["sort"] })}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-muted hover:text-ink transition bg-white"
        >
          <option value="newest">↓ Terbaru</option>
          <option value="oldest">↑ Terlama</option>
          <option value="name">A–Z nama</option>
        </select>
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

function applyAcctFilters(rows: any[], f: AcctFilters): any[] {
  let out = rows;
  if (f.status !== "all") out = out.filter((r) => r.account_status === f.status);
  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    out = out.filter((r) => (r.creators?.nama_lengkap || "").toLowerCase().includes(q));
  }
  out = [...out].sort((a, b) => {
    if (f.sort === "name") {
      return (a.creators?.nama_lengkap || "").localeCompare(b.creators?.nama_lengkap || "");
    }
    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return f.sort === "newest" ? db - da : da - db;
  });
  return out;
}

function Approvals() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AcctFilters>({ q: "", status: "all", sort: "newest" });

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, role, account_status, created_at, update_requested, update_request_note, creators(nama_lengkap, nomor_wa, tanggal_lahir, under_18_flag, program_karakter, program_konten, username_discord, link_tiktok, link_instagram, link_facebook, cashout_method, bank_name, bank_account_number, bank_account_holder, ewallet_type, ewallet_number, ewallet_holder)"
      )
      .eq("role", "creator")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, account_status: string) {
    await supabase.from("profiles").update({ account_status }).eq("id", id);
    load();
  }

  async function requestUpdate(id: string) {
    const note = window.prompt("Apa yang perlu diperbaiki kreator? (catatan ini akan dilihat kreator)");
    if (note === null) return;
    if (!note.trim()) return;
    await supabase
      .from("profiles")
      .update({ update_requested: true, update_request_note: note.trim() })
      .eq("id", id);
    load();
  }

  async function clearUpdateRequest(id: string) {
    await supabase
      .from("profiles")
      .update({ update_requested: false, update_request_note: null })
      .eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;

  const pending = rows.filter((r) => r.account_status === "pending");
  const filteredAll = applyAcctFilters(rows, filters);

  return (
    <div className="space-y-8">
      {/* PENDING — full-detail cards with actions */}
      <section>
        <h2 className="font-bold mb-3 flex items-center gap-2">
          Menunggu persetujuan
          <span className="text-xs font-bold text-teal-dark bg-teal/10 border border-teal/20 rounded-full px-2.5 py-0.5">
            {pending.length}
          </span>
        </h2>
        {pending.length === 0 && <p className="text-sm text-muted">Tidak ada yang menunggu.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {pending.map((r) => {
            const c = r.creators;
            return (
              <div
                key={r.id}
                className={`rounded-2xl bg-white border shadow-sm p-5 space-y-4 ${
                  c?.under_18_flag ? "border-red-200 ring-1 ring-red-100" : "border-ink/5"
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-ink font-extrabold">
                    {initials(c?.nama_lengkap)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold truncate">{c?.nama_lengkap || "(tanpa nama)"}</p>
                      {c?.under_18_flag && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                          ⚠ Di bawah 18
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">Bergabung {fmtDate(r.created_at)}</p>
                  </div>
                </div>

                {/* Full profile detail */}
                <ProfileDetail c={c} />

                {/* Update-request status */}
                {r.update_requested && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start justify-between gap-2">
                    <span>
                      <span className="font-semibold">Update diminta:</span> {r.update_request_note}
                    </span>
                    <button
                      onClick={() => clearUpdateRequest(r.id)}
                      className="shrink-0 font-semibold text-amber-700 hover:underline whitespace-nowrap"
                    >
                      Tandai selesai
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setStatus(r.id, "active")}
                    className="flex-1 rounded-full bg-gradient-to-r from-mint to-teal px-4 py-2.5 text-ink text-sm font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => requestUpdate(r.id)}
                    className="flex-1 rounded-full border border-amber-300 text-amber-700 px-4 py-2.5 text-sm font-semibold hover:bg-amber-50 transition"
                  >
                    Minta update
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "rejected")}
                    className="flex-1 rounded-full border border-red-200 text-red-700 px-4 py-2.5 text-sm font-semibold hover:bg-red-50 transition"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ALL ACCOUNTS — searchable / filterable / expandable */}
      <section className="space-y-4">
        <h2 className="font-bold">Semua akun</h2>
        <AcctToolbar filters={filters} setFilters={setFilters} count={filteredAll.length} />
        {filteredAll.length === 0 ? (
          <p className="text-sm text-muted">Tidak ada akun yang cocok.</p>
        ) : (
          <div className="space-y-2">
            {filteredAll.map((r) => (
              <AccountRow
                key={r.id}
                r={r}
                onStatus={setStatus}
                onRequestUpdate={requestUpdate}
                onClearRequest={clearUpdateRequest}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AccountRow({
  r,
  onStatus,
  onRequestUpdate,
  onClearRequest,
}: {
  r: any;
  onStatus: (id: string, s: string) => void;
  onRequestUpdate: (id: string) => void;
  onClearRequest: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const c = r.creators;
  const isPending = r.account_status === "pending";

  return (
    <div className="rounded-xl border border-ink/5 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink/[0.02] transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink/60 font-bold text-sm">
            {initials(c?.nama_lengkap)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{c?.nama_lengkap || "(tanpa nama)"}</p>
              {r.update_requested && (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                  Update diminta
                </span>
              )}
            </div>
            <p className="text-xs text-muted">Bergabung {fmtDate(r.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={r.account_status} />
          <span className={`text-muted text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-ink/5 pt-3">
          <ProfileDetail c={c} />

          {r.update_requested && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start justify-between gap-2">
              <span>
                <span className="font-semibold">Update diminta:</span> {r.update_request_note}
              </span>
              <button
                onClick={() => onClearRequest(r.id)}
                className="shrink-0 font-semibold text-amber-700 hover:underline whitespace-nowrap"
              >
                Tandai selesai
              </button>
            </div>
          )}

          {/* Actions vary by status */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isPending ? (
              <>
                <button onClick={() => onStatus(r.id, "active")} className={primaryBtn}>Setujui</button>
                <button onClick={() => onRequestUpdate(r.id)}
                  className="rounded-full border border-amber-300 text-amber-700 px-5 py-2.5 text-sm font-semibold hover:bg-amber-50 transition">
                  Minta update
                </button>
                <button onClick={() => onStatus(r.id, "rejected")} className={dangerBtn}>Tolak</button>
              </>
            ) : (
              <>
                {r.account_status !== "active" && (
                  <button onClick={() => onStatus(r.id, "active")} className={primaryBtn}>Aktifkan</button>
                )}
                {r.account_status !== "inactive" && (
                  <button onClick={() => onStatus(r.id, "inactive")} className={ghostBtn}>Nonaktifkan</button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- REVIEW TOOLBAR ---------------- */
type ReviewFilters = {
  q: string;
  status: "all" | "pending" | "approved" | "rejected";
  sort: "newest" | "oldest";
};

function ReviewToolbar({
  filters,
  setFilters,
  count,
}: {
  filters: ReviewFilters;
  setFilters: (f: ReviewFilters) => void;
  count: number;
}) {
  const statuses: ReviewFilters["status"][] = ["all", "pending", "approved", "rejected"];
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
          placeholder="Cari nama kreator…"
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
      <div className="flex flex-wrap gap-1.5">
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
        <span className="ml-auto self-center text-xs text-muted">{count} hasil</span>
      </div>
    </div>
  );
}

function applyFilters(rows: any[], f: ReviewFilters): any[] {
  let out = rows;
  if (f.status !== "all") out = out.filter((r) => r.status === f.status);
  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    out = out.filter((r) => (r.nama_lengkap || "").toLowerCase().includes(q));
  }
  out = [...out].sort((a, b) => {
    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return f.sort === "newest" ? db - da : da - db;
  });
  return out;
}

/* ---------------- CHARACTER REVIEW ---------------- */
function Characters({ settings }: { settings: Settings }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({ q: "", status: "all", sort: "newest" });

  async function load() {
    const { data } = await supabase
      .from("admin_character_view")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;
  const filtered = applyFilters(rows, filters);

  return (
    <div className="space-y-4">
      <ReviewToolbar filters={filters} setFilters={setFilters} count={filtered.length} />
      {rows.length === 0 ? (
        <p className="text-sm text-muted">Belum ada karakter dikirim.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">Tidak ada yang cocok dengan filter.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <CharacterCard key={r.id} r={r} settings={settings} reload={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterCard({ r, settings, reload }: { r: any; settings: Settings; reload: () => void }) {
  const [open, setOpen] = useState(r.status === "pending");
  const [notes, setNotes] = useState(r.review_notes || "");
  const [breakout, setBreakout] = useState<boolean>(r.breakout_achieved);
  const [finalAmt, setFinalAmt] = useState<string>(r.final_amount != null ? String(r.final_amount) : "");
  const [busy, setBusy] = useState(false);

  const suggested = calcCharacter(breakout, settings);

  async function review(status: "approved" | "rejected") {
    setBusy(true);
    await supabase
      .from("character_submissions")
      .update({ status, review_notes: notes, breakout_achieved: breakout, calculated_amount: calcCharacter(breakout, settings) })
      .eq("id", r.id);
    setBusy(false);
    reload();
  }

  async function savePayment(payment_status?: string) {
    setBusy(true);
    const patch: any = { final_amount: finalAmt === "" ? suggested : parseInt(finalAmt, 10) };
    if (payment_status) {
      patch.payment_status = payment_status;
      patch.paid_date = payment_status === "paid" ? new Date().toISOString().slice(0, 10) : null;
    }
    await supabase.from("character_submissions").update(patch).eq("id", r.id);
    setBusy(false);
    reload();
  }

  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-ink/[0.02] transition"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold truncate">{r.character_name}</p>
            {r.breakout_claimed && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                Klaim Breakout
              </span>
            )}
          </div>
          <p className="text-xs text-muted">{r.nama_lengkap} · {fmtDate(r.created_at)}</p>
          <a
            href={externalUrl(r.character_link)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-teal-dark hover:underline truncate block"
          >
            {r.character_link}
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={r.status} />
          {r.status !== "pending" && r.payment_status && r.payment_status !== "unpaid" && (
            <StatusBadge status={r.payment_status} />
          )}
          <span className={`text-muted text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-ink/5 pt-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan review (akan dilihat kreator)"
            className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            rows={2}
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={breakout} onChange={(e) => setBreakout(e.target.checked)} className="accent-teal" />
            Verifikasi Breakout tercapai (500.000 pesan)
            {r.breakout_claimed && !breakout && (
              <span className="text-xs text-amber-700">— kreator klaim, belum diverifikasi</span>
            )}
          </label>

          {r.status === "pending" ? (
            <div className="flex gap-2">
              <button onClick={() => review("approved")} disabled={busy} className={primaryBtn}>
                Setujui
              </button>
              <button onClick={() => review("rejected")} disabled={busy} className={dangerBtn}>
                Tolak
              </button>
            </div>
          ) : (
            r.status === "approved" && (
              <div className="rounded-xl bg-cream/60 p-4 space-y-3">
                <PayoutInfo c={r} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Saran auto-hitung</span>
                  <span className="font-bold">{rupiah(suggested)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">Final</span>
                  <input type="number" value={finalAmt} onChange={(e) => setFinalAmt(e.target.value)} placeholder={String(suggested)}
                    className="w-36 rounded-lg border border-ink/15 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
                  <button onClick={() => savePayment()} disabled={busy} className="text-sm font-semibold text-teal-dark hover:underline">
                    Simpan
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={r.payment_status} />
                  <div className="flex gap-2">
                    <button onClick={() => savePayment("pending")} disabled={busy} className="text-xs font-semibold text-amber-700 hover:underline">Tandai diproses</button>
                    <button onClick={() => savePayment("paid")} disabled={busy} className="text-xs font-semibold text-teal-dark hover:underline">Tandai dibayar</button>
                  </div>
                </div>
                {r.payment_status === "paid" && (
                  <PaymentProof table="character_submissions" row={r} reload={reload} />
                )}
              </div>
            )
          )}

          {r.status === "rejected" && (
            <div className="flex gap-2">
              <button onClick={() => review("rejected")} disabled={busy} className={ghostBtn}>
                Simpan catatan
              </button>
              <button onClick={() => review("approved")} disabled={busy} className={primaryBtn}>
                Ubah jadi setujui
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- VIDEO REVIEW ---------------- */
function Videos({ settings }: { settings: Settings }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({ q: "", status: "all", sort: "newest" });

  async function load() {
    const { data } = await supabase
      .from("admin_video_view")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-sm text-muted">Memuat…</p>;
  const filtered = applyFilters(rows, filters);

  return (
    <div className="space-y-4">
      <ReviewToolbar filters={filters} setFilters={setFilters} count={filtered.length} />
      {rows.length === 0 ? (
        <p className="text-sm text-muted">Belum ada video dikirim.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">Tidak ada yang cocok dengan filter.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <VideoCard key={r.id} r={r} settings={settings} reload={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ r, settings, reload }: { r: any; settings: Settings; reload: () => void }) {
  const [open, setOpen] = useState(r.status === "pending");
  const [notes, setNotes] = useState(r.review_notes || "");
  const [finalAmt, setFinalAmt] = useState<string>(r.final_amount != null ? String(r.final_amount) : "");
  const [busy, setBusy] = useState(false);

  const suggested = calcVideo(r.view_count, settings);

  async function review(status: "approved" | "rejected") {
    setBusy(true);
    await supabase
      .from("video_submissions")
      .update({ status, review_notes: notes, calculated_amount: calcVideo(r.view_count, settings) })
      .eq("id", r.id);
    setBusy(false);
    reload();
  }

  async function savePayment(payment_status?: string) {
    setBusy(true);
    const patch: any = { final_amount: finalAmt === "" ? suggested : parseInt(finalAmt, 10) };
    if (payment_status) {
      patch.payment_status = payment_status;
      patch.paid_date = payment_status === "paid" ? new Date().toISOString().slice(0, 10) : null;
    }
    await supabase.from("video_submissions").update(patch).eq("id", r.id);
    setBusy(false);
    reload();
  }

  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-ink/[0.02] transition"
      >
        <div className="min-w-0">
          <a
            href={externalUrl(r.tiktok_link)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-bold text-teal-dark hover:underline truncate block"
          >
            {r.tiktok_link}
          </a>
          <p className="text-xs text-muted">
            {r.nama_lengkap} · {r.view_count.toLocaleString("id-ID")} views · {fmtDate(r.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={r.status} />
          {r.status !== "pending" && r.payment_status && r.payment_status !== "unpaid" && (
            <StatusBadge status={r.payment_status} />
          )}
          <span className={`text-muted text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-ink/5 pt-3">
          {r.analytics_screenshot && (
            <a href={externalUrl(r.analytics_screenshot)} target="_blank" rel="noreferrer" className="text-xs text-teal-dark hover:underline">
              Lihat screenshot analytics
            </a>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan review (akan dilihat kreator). Mis. lonjakan views mencurigakan."
            className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            rows={2}
          />

          {r.status === "pending" ? (
            <div className="flex gap-2">
              <button onClick={() => review("approved")} disabled={busy} className={primaryBtn}>
                Setujui
              </button>
              <button onClick={() => review("rejected")} disabled={busy} className={dangerBtn}>
                Tolak
              </button>
            </div>
          ) : (
            r.status === "approved" && (
              <div className="rounded-xl bg-cream/60 p-4 space-y-3">
                <PayoutInfo c={r} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Saran auto-hitung</span>
                  <span className="font-bold">{rupiah(suggested)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">Final</span>
                  <input type="number" value={finalAmt} onChange={(e) => setFinalAmt(e.target.value)} placeholder={String(suggested)}
                    className="w-36 rounded-lg border border-ink/15 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
                  <button onClick={() => savePayment()} disabled={busy} className="text-sm font-semibold text-teal-dark hover:underline">
                    Simpan
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={r.payment_status} />
                  <div className="flex gap-2">
                    <button onClick={() => savePayment("pending")} disabled={busy} className="text-xs font-semibold text-amber-700 hover:underline">Tandai diproses</button>
                    <button onClick={() => savePayment("paid")} disabled={busy} className="text-xs font-semibold text-teal-dark hover:underline">Tandai dibayar</button>
                  </div>
                </div>
                {r.payment_status === "paid" && (
                  <PaymentProof table="video_submissions" row={r} reload={reload} />
                )}
              </div>
            )
          )}

          {r.status === "rejected" && (
            <div className="flex gap-2">
              <button onClick={() => review("rejected")} disabled={busy} className={ghostBtn}>
                Simpan catatan
              </button>
              <button onClick={() => review("approved")} disabled={busy} className={primaryBtn}>
                Ubah jadi setujui
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}