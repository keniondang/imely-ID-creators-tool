import { useAuth } from "../lib/AuthContext";

export default function UpdateRequestBanner() {
  const { profile } = useAuth();
  if (!profile?.update_requested) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
      <span className="text-xl leading-none">📝</span>
      <div className="text-sm text-amber-800 leading-relaxed">
        <p className="font-semibold">Admin meminta kamu memperbarui info</p>
        {profile.update_request_note && <p className="mt-0.5">{profile.update_request_note}</p>}
        <p className="mt-1 text-xs text-amber-700">
          Perbarui datamu di halaman Profil, lalu tim kami akan meninjau ulang.
        </p>
      </div>
    </div>
  );
}