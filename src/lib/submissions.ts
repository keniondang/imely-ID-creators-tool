import { supabase } from "./supabase";

export async function submitCharacter(
  creatorId: string,
  character_name: string,
  character_link: string,
  breakout_claimed: boolean
) {
  return supabase.from("character_submissions").insert({
    creator_id: creatorId,
    character_name,
    character_link,
    breakout_claimed,
  });
}

export async function submitVideo(
  creatorId: string,
  tiktok_link: string,
  view_count: number,
  analytics_screenshot: string | null
) {
  return supabase.from("video_submissions").insert({
    creator_id: creatorId,
    tiktok_link,
    view_count,
    analytics_screenshot, // now just a pasted URL string
  });
}

export async function myCharacterSubmissions() {
  return supabase
    .from("character_submissions")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function myVideoSubmissions() {
  return supabase
    .from("video_submissions")
    .select("*")
    .order("created_at", { ascending: false });
}

// Admin uploads a payment proof into the creator's folder.
export async function uploadPaymentProof(
  creatorId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${creatorId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("payment-proofs")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function signedProofUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

// True if creator has enough banking info filled to be paid.
export function hasPaymentInfo(c: any): boolean {
  if (!c) return false;
  if (c.cashout_method === "bank")
    return !!(c.bank_name && c.bank_account_number && c.bank_account_holder);
  if (c.cashout_method === "ewallet")
    return !!(c.ewallet_type && c.ewallet_number && c.ewallet_holder);
  return false;
}