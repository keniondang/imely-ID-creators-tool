import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { PublicOnly, RequireAuth, RequireAdmin } from "./components/RouteGuards";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Masuk from "./pages/auth/Masuk";
import Daftar from "./pages/auth/Daftar";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Submission from "./pages/Submission";
import Riwayat from "./pages/Riwayat";
import { AdminApprovals, AdminCharacters, AdminVideos } from "./pages/Admin";
import Confirmed from "./pages/auth/Confirmed";
import LupaPassword from "./pages/auth/LupaPassword";
import AdminSettings from "./pages/AdminSettings";
import ResetPassword from "./pages/auth/ResetPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public-only: logged-in users get bounced to their dashboard */}
          <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
          <Route path="/masuk" element={<PublicOnly><Masuk /></PublicOnly>} />
          <Route path="/daftar" element={<PublicOnly><Daftar /></PublicOnly>} />

          {/* Authenticated creator area */}
          <Route path="/app" element={<RequireAuth><Layout><Home /></Layout></RequireAuth>} />
          <Route path="/profil" element={<RequireAuth><Layout><Profil /></Layout></RequireAuth>} />
          <Route path="/submission" element={<RequireAuth><Layout><Submission /></Layout></RequireAuth>} />
          <Route path="/riwayat" element={<RequireAuth><Layout><Riwayat /></Layout></RequireAuth>} />

          {/* Admin only */}
          <Route path="/admin" element={<RequireAdmin><Layout><AdminApprovals /></Layout></RequireAdmin>} />
          <Route path="/admin/persetujuan" element={<RequireAdmin><Layout><AdminApprovals /></Layout></RequireAdmin>} />
          <Route path="/admin/karakter" element={<RequireAdmin><Layout><AdminCharacters /></Layout></RequireAdmin>} />
          <Route path="/admin/video" element={<RequireAdmin><Layout><AdminVideos /></Layout></RequireAdmin>} />
          <Route path="/admin/pengaturan" element={<RequireAdmin><Layout><AdminSettings /></Layout></RequireAdmin>} />

          {/* Auth email-link landings — NOT PublicOnly (they carry a session) */}
          <Route path="/auth/confirmed" element={<Confirmed />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/lupa-password" element={<PublicOnly><LupaPassword /></PublicOnly>} />

          {/* Fallback → landing (guard decides where logged-in users land) */}
          <Route path="*" element={<PublicOnly><Landing /></PublicOnly>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}