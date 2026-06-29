import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import UpdateRequestBanner from "../components/UpdateRequestBanner";

const input =
  "w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-transparent transition";
const label = "text-sm font-medium text-ink/80";
const primaryBtn =
  "rounded-full bg-gradient-to-r from-mint to-teal px-6 py-2.5 text-ink font-bold shadow-lg shadow-teal/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryBtn =
  "rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-muted hover:text-ink hover:bg-ink/5 transition disabled:opacity-50";

function initials(name?: string): string {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/* ---- icons ---- */
const UserIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6Z" />
  </svg>
);
const CardIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
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

/* Read-only field display */
function Field({ label: l, value, full = false }: { label: string; value?: string | null; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs text-muted">{l}</p>
      <p className="text-sm font-medium text-ink mt-0.5 break-words">
        {value ? value : <span className="text-ink/30">—</span>}
      </p>
    </div>
  );
}

function LinkField({ label: l, value, full = false }: { label: string; value?: string | null; full?: boolean }) {
  const href = value
    ? /^https?:\/\//i.test(value) ? value : `https://${value}`
    : null;
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs text-muted">{l}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal-dark mt-0.5 break-words hover:underline block">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-ink/30 mt-0.5">—</p>
      )}
    </div>
  );
}

function SectionCard({
  icon,
  title,
  desc,
  editing,
  onEdit,
  elevated = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  editing?: boolean;
  onEdit?: () => void;
  elevated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl p-6 space-y-4 ${elevated ? "bg-white border border-teal/20 shadow-md shadow-teal/5" : "bg-white border border-ink/5 shadow-sm"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-teal/15 text-teal-dark">
            {icon}
          </div>
          <div>
            <h2 className="font-bold leading-tight">{title}</h2>
            {desc && <p className="text-xs text-muted mt-0.5">{desc}</p>}
          </div>
        </div>
        {onEdit && !editing && (
          <button onClick={onEdit} className="text-sm font-semibold text-teal-dark hover:underline shrink-0">
            Edit
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export default function Profil() {
  const { profile, session } = useAuth();
  const active = profile?.account_status === "active";
  const status = profile?.account_status;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // saved = source of truth; draft = what's being edited
  const [saved, setSaved] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);

  const [editProfile, setEditProfile] = useState(false);
  const [editBanking, setEditBanking] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("creators").select("*").single();
      setSaved(data);
      setDraft(data);
      setLoading(false);
    })();
  }, []);

  const set = (k: string, v: any) => setDraft((p: any) => ({ ...p, [k]: v }));

  function startProfile() {
    setDraft(saved);
    setEditProfile(true);
    setMsg(null);
    setErr(null);
  }
  function cancelProfile() {
    setDraft(saved);
    setEditProfile(false);
  }
  function startBanking() {
    setDraft(saved);
    setEditBanking(true);
    setMsg(null);
    setErr(null);
  }
  function cancelBanking() {
    setDraft(saved);
    setEditBanking(false);
  }

  async function saveProfile() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const { error } = await supabase.rpc("save_creator_profile", {
      p_nama_lengkap: draft.nama_lengkap,
      p_nomor_wa: draft.nomor_wa,
      p_tanggal_lahir: draft.tanggal_lahir,
      p_link_tiktok: draft.link_tiktok,
      p_link_facebook: draft.link_facebook || null,
      p_link_instagram: draft.link_instagram || null,
      p_username_discord: draft.username_discord,
      p_program_karakter: draft.program_karakter,
      p_program_konten: draft.program_konten,
      p_under_18: draft.under_18_flag,
    });
    setSaving(false);
    if (error) return setErr(error.message);
    setSaved(draft);
    setEditProfile(false);
    setMsg("Profil tersimpan.");
  }

  async function saveBanking() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const payload =
      draft.cashout_method === "bank"
        ? {
            cashout_method: "bank",
            bank_name: draft.bank_name,
            bank_account_number: draft.bank_account_number,
            bank_account_holder: draft.bank_account_holder,
            ewallet_type: null, ewallet_number: null, ewallet_holder: null,
          }
        : {
            cashout_method: "ewallet",
            ewallet_type: draft.ewallet_type,
            ewallet_number: draft.ewallet_number,
            ewallet_holder: draft.ewallet_holder,
            bank_name: null, bank_account_number: null, bank_account_holder: null,
          };
    const { error } = await supabase.from("creators").update(payload).eq("id", draft.id);
    setSaving(false);
    if (error) return setErr(error.message);
    const merged = { ...draft, ...payload };
    setSaved(merged);
    setDraft(merged);
    setEditBanking(false);
    setMsg("Info pembayaran tersimpan.");
  }

  if (loading) return <p className="text-sm text-muted">Memuat profil…</p>;
  if (!saved) return <p className="text-sm text-muted">Profil tidak ditemukan.</p>;

  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: "Aktif", cls: "bg-teal/15 text-mint border-mint/30" },
    pending: { label: "Menunggu review", cls: "bg-amber-400/15 text-amber-200 border-amber-300/30" },
    rejected: { label: "Ditolak", cls: "bg-red-400/15 text-red-200 border-red-300/30" },
    inactive: { label: "Nonaktif", cls: "bg-white/10 text-white/60 border-white/20" },
  };
  const st = statusMap[status ?? ""] ?? statusMap.pending;

  const programLabel =
    [saved.program_karakter && "Karakter", saved.program_konten && "Konten"].filter(Boolean).join(", ") || "—";

  const bankingSummary = () => {
    if (saved.cashout_method === "bank") {
      return saved.bank_account_number
        ? { method: "Bank", lines: [saved.bank_name, saved.bank_account_number, saved.bank_account_holder] }
        : null;
    }
    if (saved.cashout_method === "ewallet") {
      return saved.ewallet_number
        ? { method: saved.ewallet_type?.toUpperCase(), lines: [saved.ewallet_number, saved.ewallet_holder] }
        : null;
    }
    return null;
  };
  const bank = bankingSummary();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Aurora identity header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-ink text-white p-7">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/2 -right-10 h-72 w-72 rounded-full bg-teal/30 blur-[80px] animate-aurora-1" />
          <div className="absolute -bottom-1/2 -left-10 h-64 w-64 rounded-full bg-cyan/20 blur-[80px] animate-aurora-2" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-teal text-ink font-extrabold text-2xl">
            {initials(saved.nama_lengkap)}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold truncate">{saved.nama_lengkap || "Lengkapi namamu"}</h1>
            <p className="text-sm text-white/60 truncate">{session?.user.email}</p>
            <span className={`inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide rounded-full border px-2.5 py-0.5 ${st.cls}`}>
              {st.label}
            </span>
          </div>
        </div>
      </section>
      <UpdateRequestBanner />

      {msg && <p className="text-sm text-teal-dark bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">{msg}</p>}
      {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

      {/* DATA DIRI + SOSIAL (one editable section) */}
      <SectionCard
        icon={UserIcon}
        title="Data diri & sosial"
        desc="Informasi dasar, kontak, tautan & program."
        editing={editProfile}
        onEdit={startProfile}
      >
        {!editProfile ? (
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Nama lengkap" value={saved.nama_lengkap} />
            <Field label="Nomor WhatsApp" value={saved.nomor_wa} />
            <Field label="Tanggal lahir" value={saved.tanggal_lahir} />
            <Field label="Username Discord" value={saved.username_discord} />
            <LinkField label="TikTok" value={saved.link_tiktok} />
            <LinkField label="Facebook" value={saved.link_facebook} />
            <LinkField label="Instagram" value={saved.link_instagram} />
            <Field label="Program" value={programLabel} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={label}>Nama lengkap</label>
                <input className={input} value={draft.nama_lengkap || ""} onChange={(e) => set("nama_lengkap", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Nomor WhatsApp</label>
                <input className={input} value={draft.nomor_wa || ""} onChange={(e) => set("nomor_wa", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Tanggal lahir</label>
                <input type="date" className={input} value={draft.tanggal_lahir || ""} onChange={(e) => set("tanggal_lahir", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Username Discord</label>
                <input className={input} value={draft.username_discord || ""} onChange={(e) => set("username_discord", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Link TikTok</label>
                <input className={input} value={draft.link_tiktok || ""} onChange={(e) => set("link_tiktok", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Link Facebook <span className="text-muted font-normal">(opsional)</span></label>
                <input className={input} value={draft.link_facebook || ""} onChange={(e) => set("link_facebook", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className={label}>Link Instagram <span className="text-muted font-normal">(opsional)</span></label>
                <input className={input} value={draft.link_instagram || ""} onChange={(e) => set("link_instagram", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Program</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => set("program_karakter", !draft.program_karakter)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${draft.program_karakter ? "border-teal bg-teal/10 text-teal-dark" : "border-ink/15 text-muted hover:border-ink/30"}`}>
                  {MaskIcon} Karakter
                </button>
                <button type="button" onClick={() => set("program_konten", !draft.program_konten)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${draft.program_konten ? "border-cyan-dark bg-cyan/10 text-cyan-dark" : "border-ink/15 text-muted hover:border-ink/30"}`}>
                  {VideoIcon} Konten
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className={primaryBtn}>
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
              <button onClick={cancelProfile} disabled={saving} className={secondaryBtn}>
                Batal
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* PEMBAYARAN */}
      <SectionCard
        icon={CardIcon}
        title="Info pembayaran"
        desc="Ke mana kami mengirim penghasilanmu."
        elevated
        editing={editBanking}
        onEdit={active ? startBanking : undefined}
      >
        {!active ? (
          <div className="rounded-2xl bg-cream/70 border border-dashed border-ink/15 p-6 text-center space-y-2">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">🔒</div>
            <p className="text-sm font-semibold">Terbuka setelah akun disetujui</p>
            <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
              Demi keamanan, info rekening / e-wallet baru bisa diisi setelah akunmu disetujui admin.
            </p>
          </div>
        ) : !editBanking ? (
          <div className="space-y-3">
            <p className="text-xs text-muted bg-cream/60 rounded-lg px-3 py-2">
              🔐 Data pembayaranmu hanya terlihat oleh admin program, tidak oleh kreator lain.
            </p>
            {bank ? (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Metode" value={bank.method} />
                {saved.cashout_method === "bank" ? (
                  <>
                    <Field label="Nama bank" value={saved.bank_name} />
                    <Field label="Nomor rekening" value={saved.bank_account_number} />
                    <Field label="Atas nama" value={saved.bank_account_holder} />
                  </>
                ) : (
                  <>
                    <Field label="Nomor e-wallet" value={saved.ewallet_number} />
                    <Field label="Atas nama" value={saved.ewallet_holder} />
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                Belum ada info pembayaran. Klik <strong>Edit</strong> untuk mengisinya — ini wajib sebelum kamu bisa mengirim karya.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted bg-cream/60 rounded-lg px-3 py-2">
              🔐 Data pembayaranmu hanya terlihat oleh admin program.
            </p>
            <div className="space-y-2">
              <label className={label}>Metode pencairan</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => set("cashout_method", "bank")}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${draft.cashout_method === "bank" ? "border-teal bg-teal/10 text-teal-dark" : "border-ink/15 text-muted hover:border-ink/30"}`}>
                  🏦 Bank
                </button>
                <button type="button" onClick={() => set("cashout_method", "ewallet")}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${draft.cashout_method === "ewallet" ? "border-teal bg-teal/10 text-teal-dark" : "border-ink/15 text-muted hover:border-ink/30"}`}>
                  📱 E-wallet
                </button>
              </div>
            </div>

            {draft.cashout_method === "bank" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={label}>Nama bank</label>
                  <input className={input} value={draft.bank_name || ""} onChange={(e) => set("bank_name", e.target.value)} placeholder="BCA / Mandiri / BRI…" />
                </div>
                <div className="space-y-1.5">
                  <label className={label}>Nomor rekening</label>
                  <input className={input} value={draft.bank_account_number || ""} onChange={(e) => set("bank_account_number", e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className={label}>Nama pemilik rekening</label>
                  <input className={input} value={draft.bank_account_holder || ""} onChange={(e) => set("bank_account_holder", e.target.value)} />
                </div>
              </div>
            )}

            {draft.cashout_method === "ewallet" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={label}>Jenis e-wallet</label>
                  <select className={input} value={draft.ewallet_type || ""} onChange={(e) => set("ewallet_type", e.target.value)}>
                    <option value="">Pilih…</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={label}>Nomor e-wallet</label>
                  <input className={input} value={draft.ewallet_number || ""} onChange={(e) => set("ewallet_number", e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className={label}>Nama pemilik</label>
                  <input className={input} value={draft.ewallet_holder || ""} onChange={(e) => set("ewallet_holder", e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={saveBanking} disabled={saving || !draft.cashout_method} className={primaryBtn}>
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
              <button onClick={cancelBanking} disabled={saving} className={secondaryBtn}>
                Batal
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}