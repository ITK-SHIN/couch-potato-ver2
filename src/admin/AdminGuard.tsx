import { Navigate, Outlet } from "react-router";
import { PageLoader } from "../components/PageLoader";
import { useAdminAuth } from "../context/AdminAuthContext";

export function AdminGuard() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <PageLoader
        message="관리자 확인 중"
        subMessage="로그인 상태를 불러오고 있습니다"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
