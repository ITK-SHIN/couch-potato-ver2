type PageLoaderProps = {
  message?: string;
  subMessage?: string;
};

export function PageLoader({
  message = "불러오는 중",
  subMessage = "잠시만 기다려 주세요",
}: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,480px)] h-[min(90vw,480px)] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <p
          className="text-primary text-xs tracking-[0.35em] uppercase mb-6 animate-pulse"
        >
          Video Production Studio
        </p>

        <h1 className="brand-wordmark hero-title text-foreground mb-10 text-[clamp(2.5rem,8vw,4rem)]">
          COUCHPOTATO
        </h1>

        {/* Spinner ring */}
        <div className="relative w-14 h-14 mb-8">
          <div
            className="absolute inset-0 rounded-full border-2 border-border"
            aria-hidden
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
            style={{ animationDuration: "0.9s" }}
            aria-hidden
          />
          <div
            className="absolute inset-2 rounded-full border border-primary/20"
            aria-hidden
          />
        </div>

        {/* Progress bar */}
        <div className="w-48 h-px bg-border mb-6 overflow-hidden rounded-full">
          <div className="h-full bg-primary origin-left animate-loader-bar" />
        </div>

        <p className="text-foreground text-sm font-medium mb-1">{message}</p>
        <p className="text-muted-foreground text-xs tracking-wide">{subMessage}</p>
      </div>
    </div>
  );
}
