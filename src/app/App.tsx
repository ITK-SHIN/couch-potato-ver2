import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { SiteContentProvider } from "../context/SiteContentContext";
import { AdminGuard } from "../admin/AdminGuard";
import { AdminLogin } from "../admin/AdminLogin";
import { AdminPanel } from "../admin/AdminPanel";
import { PublicSite } from "../pages/PublicSite";

export default function App() {
  return (
    <SiteContentProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </SiteContentProvider>
  );
}
