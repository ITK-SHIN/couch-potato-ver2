/** GA4 measurement ID (예: G-XXXXXXXX) */
export function getGaMeasurementId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return id || undefined;
}

export function injectGa4(measurementId: string): void {
  if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  loader.setAttribute("data-ga-id", measurementId);
  document.head.appendChild(loader);

  const inline = document.createElement("script");
  inline.setAttribute("data-ga-id", measurementId);
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(inline);
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number>
): void {
  const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof g === "function") {
    g("event", name, params);
  }
}
