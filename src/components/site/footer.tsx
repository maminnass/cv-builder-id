import { Link } from "@tanstack/react-router";
import { COPYRIGHT } from "@/lib/cv/constants";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{COPYRIGHT}</p>
        <nav className="flex gap-4">
          <Link to="/privacy" className="hover:text-fg">
            {t("privacy")}
          </Link>
          <Link to="/terms" className="hover:text-fg">
            {t("terms")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
