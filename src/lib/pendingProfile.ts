const KEY = "imely_pending_profile";

export type PendingProfile = {
  nama_lengkap: string;
  nomor_wa: string;
  tanggal_lahir: string;
  link_tiktok: string;
  link_facebook: string;
  link_instagram: string;
  username_discord: string;
  program_karakter: boolean;
  program_konten: boolean;
  under_18: boolean;
};

export function stashPendingProfile(p: PendingProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
export function readPendingProfile(): PendingProfile | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as PendingProfile) : null;
}
export function clearPendingProfile() {
  localStorage.removeItem(KEY);
}

export async function flushPendingProfile(
  supabase: any
): Promise<void> {
  const p = readPendingProfile();
  if (!p) return;
  const { error } = await supabase.rpc("save_creator_profile", {
    p_nama_lengkap: p.nama_lengkap,
    p_nomor_wa: p.nomor_wa,
    p_tanggal_lahir: p.tanggal_lahir,
    p_link_tiktok: p.link_tiktok,
    p_link_facebook: p.link_facebook || null,
    p_link_instagram: p.link_instagram || null,
    p_username_discord: p.username_discord,
    p_program_karakter: p.program_karakter,
    p_program_konten: p.program_konten,
    p_under_18: p.under_18,
  });
  if (!error) clearPendingProfile();
}