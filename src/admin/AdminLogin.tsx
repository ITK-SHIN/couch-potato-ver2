import { useState } from "react";
import { useNavigate } from "react-router";
import { useAdminAuth } from "../context/AdminAuthContext";
import { canUseLocalPasswordAuth } from "../lib/adminAuthPolicy";
import { isSupabaseConfigured } from "../lib/supabase";
import { AdminField, AdminInput } from "./components/AdminField";

export function AdminLogin() {
  const { loginWithPassword, loginWithEmail, useSupabaseAuth, authBlocked } =
    useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (useSupabaseAuth) {
      const msg = await loginWithEmail(email, password);
      if (msg) setError(msg);
      else navigate("/admin", { replace: true });
    } else {
      const ok = await loginWithPassword(password);
      if (ok) navigate("/admin", { replace: true });
      else setError("비밀번호가 올바르지 않습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <h1 className="brand-wordmark text-3xl text-foreground text-center mb-2">
          COUCHPOTATO
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">사이트 관리 로그인</p>

        {authBlocked ? (
          <p className="text-sm text-destructive leading-relaxed">
            배포 환경에 Supabase URL·anon 키가 설정되지 않았습니다. Vercel Environment
            Variables에 <code className="text-xs">VITE_SUPABASE_URL</code>,{" "}
            <code className="text-xs">VITE_SUPABASE_ANON_KEY</code>를 추가한 뒤
            재배포하세요.
          </p>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {useSupabaseAuth ? (
            <>
              <AdminField label="이메일">
                <AdminInput
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </AdminField>
              <AdminField label="비밀번호">
                <AdminInput
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </AdminField>
            </>
          ) : (
            <AdminField label="관리자 비밀번호" hint="환경변수 VITE_ADMIN_PASSWORD (미설정 시 기본값 사용)">
              <AdminInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </AdminField>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        )}

        {!authBlocked && !isSupabaseConfigured && canUseLocalPasswordAuth() && (
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            현재 이 브라우저에만 저장됩니다. 여러 기기에서 수정하려면 CMS_SETUP.md대로 Supabase를 연결하세요.
          </p>
        )}

        <a href="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary">
          ← 사이트로 돌아가기
        </a>
      </div>
    </div>
  );
}
