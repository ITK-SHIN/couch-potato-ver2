import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PageLoader } from "../components/PageLoader";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { SiteContentProvider } from "../context/SiteContentContext";
import { AdminGuard } from "../admin/AdminGuard";
import { PublicSite } from "../pages/PublicSite";

const AdminLogin = lazy(() =>
  import("../admin/AdminLogin").then((m) => ({ default: m.AdminLogin }))
);
const AdminPanel = lazy(() =>
  import("../admin/AdminPanel").then((m) => ({ default: m.AdminPanel }))
);

function AdminRouteFallback() {
  return (
    <PageLoader message="관리자 화면 로딩 중" subMessage="잠시만 기다려 주세요" />
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminRouteFallback />}>
                  <AdminLogin />
                </Suspense>
              }
            />
            <Route path="/admin" element={<AdminGuard />}>
              <Route
                index
                element={
                  <Suspense fallback={<AdminRouteFallback />}>
                    <AdminPanel />
                  </Suspense>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </SiteContentProvider>
  );
}
