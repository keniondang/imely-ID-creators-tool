export type Settings = {
  character_fixed_fee: number;
  breakout_bonus: number;
  breakout_message_milestone: number;
  video_base_fee: number;
  video_per_view_bonus: number;
  video_per_view_interval: number;
  video_cap: number;
};

// Video: base + floor(views / interval) * perViewBonus, capped.
export function calcVideo(viewCount: number, s: Settings): number {
  const bonus =
    Math.floor(viewCount / s.video_per_view_interval) * s.video_per_view_bonus;
  return Math.min(s.video_base_fee + bonus, s.video_cap);
}

// Character: fixed fee, plus breakout bonus only when admin-verified.
export function calcCharacter(breakoutAchieved: boolean, s: Settings): number {
  return s.character_fixed_fee + (breakoutAchieved ? s.breakout_bonus : 0);
}

export const rupiah = (n: number) =>
  "Rp " + (n ?? 0).toLocaleString("id-ID");