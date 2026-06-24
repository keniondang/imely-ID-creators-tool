import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Build a Google OAuth access token from the service account key.
async function getAccessToken(): Promise<string> {
  const email = Deno.env.get("GOOGLE_CLIENT_EMAIL");
  const keyRaw = Deno.env.get("GOOGLE_PRIVATE_KEY");
  if (!email || !keyRaw) {
    throw new Error(
      `Missing Google secrets — email:${!!email} key:${!!keyRaw}.`
    );
  }

  // Normalize: handle both literal "\n" and real newlines.
  const normalized = keyRaw.replace(/\\n/g, "\n");

  // Strip header/footer and ALL whitespace (spaces, tabs, newlines).
  const pem = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\s\r\n]+/g, "")
    .trim();

  let der: Uint8Array;
  try {
    der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  } catch (_e) {
    throw new Error(
      `Base64 decode failed. Key length after cleanup: ${pem.length}. ` +
      `First 20 chars: ${pem.slice(0, 20)}. ` +
      `Likely the private_key was pasted incomplete or with wrong characters.`
    );
  }

  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const jwt = await create(
    { alg: "RS256", typ: "JWT" },
    {
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: getNumericDate(3600),
      iat: getNumericDate(0),
    },
    key
  );

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get Google token: " + JSON.stringify(data));
  return data.access_token;
}

async function writeTab(token: string, sheetId: string, tab: string, rows: any[][]) {
  // Clear the tab, then write fresh values (full overwrite).
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}:clear`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}!A1?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: rows }),
    }
  );
}

// Ensure the three tabs exist (creates any that are missing).
async function ensureTabs(token: string, sheetId: string, names: string[]) {
  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((r) => r.json());
  const existing = (meta.sheets ?? []).map((s: any) => s.properties.title);
  const toCreate = names.filter((n) => !existing.includes(n));
  if (toCreate.length === 0) return;
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: toCreate.map((title) => ({ addSheet: { properties: { title } } })),
      }),
    }
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")!;

    // Verify the caller is an authenticated admin.
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(url, serviceKey);
    const { data: prof } = await admin.from("profiles").select("role").eq("id", userData.user.id).single();
    if (prof?.role !== "admin") {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull all data (service role bypasses RLS server-side).
    const { data: chars } = await admin.from("admin_character_view").select("*");
    const { data: vids } = await admin.from("admin_video_view").select("*");
    const { data: creators } = await admin
      .from("creators")
      .select("*, profiles(account_status)");

    const fmt = (v: any) => (v == null ? "" : String(v));

    const charRows = [
      ["Tanggal", "Kreator", "Nama Karakter", "Link", "Status", "Klaim Breakout", "Breakout Verified", "Calculated", "Final", "Payment Status", "Paid Date", "Catatan"],
      ...(chars ?? []).map((r: any) => [
        fmt(r.created_at), fmt(r.nama_lengkap), fmt(r.character_name), fmt(r.character_link),
        fmt(r.status), r.breakout_claimed ? "Ya" : "Tidak", r.breakout_achieved ? "Ya" : "Tidak",
        fmt(r.calculated_amount), fmt(r.final_amount), fmt(r.payment_status), fmt(r.paid_date), fmt(r.review_notes),
      ]),
    ];

    const vidRows = [
      ["Tanggal", "Kreator", "Link TikTok", "Views", "Status", "Calculated", "Final", "Payment Status", "Paid Date", "Catatan"],
      ...(vids ?? []).map((r: any) => [
        fmt(r.created_at), fmt(r.nama_lengkap), fmt(r.tiktok_link), fmt(r.view_count),
        fmt(r.status), fmt(r.calculated_amount), fmt(r.final_amount), fmt(r.payment_status), fmt(r.paid_date), fmt(r.review_notes),
      ]),
    ];

    const creatorRows = [
      ["Nama", "WA", "Tanggal Lahir", "Status Akun", "Program", "Discord", "TikTok", "Metode", "Bank/E-wallet", "Nomor", "Atas Nama"],
      ...(creators ?? []).map((r: any) => [
        fmt(r.nama_lengkap), fmt(r.nomor_wa), fmt(r.tanggal_lahir), fmt(r.profiles?.account_status),
        [r.program_karakter && "Karakter", r.program_konten && "Konten"].filter(Boolean).join(", "),
        fmt(r.username_discord), fmt(r.link_tiktok), fmt(r.cashout_method),
        fmt(r.cashout_method === "bank" ? r.bank_name : r.ewallet_type),
        fmt(r.cashout_method === "bank" ? r.bank_account_number : r.ewallet_number),
        fmt(r.cashout_method === "bank" ? r.bank_account_holder : r.ewallet_holder),
      ]),
    ];

    const token = await getAccessToken();
    await ensureTabs(token, sheetId, ["Karakter", "Video", "Kreator"]);
    await writeTab(token, sheetId, "Karakter", charRows);
    await writeTab(token, sheetId, "Video", vidRows);
    await writeTab(token, sheetId, "Kreator", creatorRows);

    return new Response(
      JSON.stringify({ ok: true, counts: { karakter: charRows.length - 1, video: vidRows.length - 1, kreator: creatorRows.length - 1 } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "sync_failed", detail: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});