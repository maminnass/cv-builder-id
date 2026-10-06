import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { APP_NAME } from "@/lib/cv/constants";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

export function SiteHeader({
  trailing,
  solid = false,
}: {
  trailing?: ReactNode;
  solid?: boolean;
}) {
  const { t } = useI18n();
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 backdrop-blur-md",
        solid ? "bg-bg-elevated" : "bg-bg/85",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5 text-fg no-underline">
          <span className="flex size-8 items-center justify-center rounded-sm bg-navy text-navy-fg">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <rect x="6" y="4" width="12" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 9h6M9 12.5h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-xl leading-none tracking-tight">{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-2">
          {trailing}
          <LanguageSwitcher />
          <span className="sr-only">{t("language")}</span>
        </div>
      </div>
    </header>
  );
}
