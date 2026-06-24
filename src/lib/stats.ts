import { supabase } from "./supabase";

export type ProgramStats = {
  dikirim: number;
  menunggu: number;
  disetujui: number;
  ditolak: number;
  dibayar: number;
};

function tally(rows: any[]): ProgramStats {
  return {
    dikirim: rows.length,
    menunggu: rows.filter((r) => r.status === "pending").length,
    disetujui: rows.filter((r) => r.status === "approved").length,
    ditolak: rows.filter((r) => r.status === "rejected").length,
    dibayar: rows.filter((r) => r.payment_status === "paid").length,
  };
}

export type CreatorStats = {
  karakter: ProgramStats;
  video: ProgramStats;
  totalDibayar: number; // Rp sum of paid final_amount
  menungguBayar: { count: number; amount: number }; // approved, not yet paid
};

export async function getCreatorStats(): Promise<CreatorStats> {
  // RLS scopes these to the logged-in creator automatically.
  const { data: chars } = await supabase.from("character_submissions").select("*");
  const { data: vids } = await supabase.from("video_submissions").select("*");
  const c = chars ?? [];
  const v = vids ?? [];
  const all = [...c, ...v];

  const totalDibayar = all
    .filter((r) => r.payment_status === "paid")
    .reduce((s, r) => s + (r.final_amount ?? 0), 0);

  const menungguRows = all.filter(
    (r) => r.status === "approved" && r.payment_status !== "paid"
  );
  const menungguBayar = {
    count: menungguRows.length,
    amount: menungguRows.reduce((s, r) => s + (r.final_amount ?? r.calculated_amount ?? 0), 0),
  };

  return {
    karakter: tally(c),
    video: tally(v),
    totalDibayar,
    menungguBayar,
  };
}

export type AdminStats = {
  pendingAccounts: number;
  activeCreators: number;
  karakter: ProgramStats;
  video: ProgramStats;
  totalDibayar: number;
  jumlahPembayaran: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("account_status, role")
    .eq("role", "creator");
  const { data: chars } = await supabase.from("character_submissions").select("*");
  const { data: vids } = await supabase.from("video_submissions").select("*");

  const p = profiles ?? [];
  const c = chars ?? [];
  const v = vids ?? [];
  const all = [...c, ...v];
  const paid = all.filter((r) => r.payment_status === "paid");

  return {
    pendingAccounts: p.filter((x) => x.account_status === "pending").length,
    activeCreators: p.filter((x) => x.account_status === "active").length,
    karakter: tally(c),
    video: tally(v),
    totalDibayar: paid.reduce((s, r) => s + (r.final_amount ?? 0), 0),
    jumlahPembayaran: paid.length,
  };
}