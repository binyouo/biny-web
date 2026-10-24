import { Link } from "react-router-dom";
import { useI18n, localePath } from "../i18n";

export function NotFoundPage() {
  const { t, locale } = useI18n();

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pt-28" id="main-content" tabIndex={-1}>
      <div className="text-center">
        <span className="font-mono text-[13px] text-accent">404</span>
        <h1 className="mt-2 text-[30px] font-extrabold tracking-tight">{t.common.notFoundTitle}</h1>
        <Link
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-canvas transition-transform hover:-translate-y-0.5"
          to={localePath("/", locale)}
        >
          {t.common.backHome}
        </Link>
      </div>
    </main>
  );
}
