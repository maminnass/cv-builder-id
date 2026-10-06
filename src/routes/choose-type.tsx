import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Columns2, LayoutTemplate } from "lucide-react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/choose-type")({ component: ChooseType });

function ChooseType() {
  const { t } = useI18n();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{t("appName")}</p>
        <h1 className="mt-3 font-display text-4xl text-navy sm:text-5xl">{t("chooseTypeTitle")}</h1>
        <p className="mt-3 max-w-2xl text-muted">{t("chooseTypeSub")}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            to="/templates"
            search={{ type: "ats" }}
            className="group rounded-xl border border-border bg-bg-elevated p-6 no-underline transition-colors hover:border-primary"
          >
            <LayoutTemplate className="size-6 text-primary" />
            <h2 className="mt-4 font-display text-3xl text-navy">{t("atsTitle")}</h2>
            <p className="mt-3 text-sm text-muted">{t("atsBody")}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              {t("ats")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/templates"
            search={{ type: "creative" }}
            className="group rounded-xl border border-border bg-navy p-6 text-navy-fg no-underline transition-opacity hover:opacity-95"
          >
            <Columns2 className="size-6" />
            <h2 className="mt-4 font-display text-3xl">{t("creativeTitle")}</h2>
            <p className="mt-3 text-sm text-navy-fg/80">{t("creativeBody")}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              {t("creative")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
