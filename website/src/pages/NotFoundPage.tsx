import { Link } from "react-router-dom";
import { useI18n, localePath } from "../i18n";

export function NotFoundPage() {
  const { t, locale } = useI18n();

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pt-28" id="main-content" tabIndex={-1}>
      <div className="text-center">
        <span className="font-mono text-[13px] text-ink-3">404</span>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">{t.common.notFoundTitle}</h1>
        <Link
          className="mt-6 inline-flex h-10 items-center rounded-xl bg-ink px-5 text-[14px] font-medium text-canvas transition-opacity hover:opacity-90"
          to={localePath("/", locale)}
        >
          {t.common.backHome}
        </Link>
      </div>
    </main>
  );
}
