import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Masuk from "./pages/auth/Masuk";
import Daftar from "./pages/auth/Daftar";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Submission from "./pages/Submission";
import Admin from "./pages/Admin";

function Gated({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/daftar" element={<Daftar />} />

        {/* Gated (Phase 2 adds the auth redirect; reachable now for testing) */}
        <Route path="/app" element={<Gated><Home /></Gated>} />
        <Route path="/profil" element={<Gated><Profil /></Gated>} />
        <Route path="/submission" element={<Gated><Submission /></Gated>} />
        <Route path="/admin" element={<Gated><Admin /></Gated>} />

        {/* Fallback → landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}