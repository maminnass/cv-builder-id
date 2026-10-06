import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Heart } from "lucide-react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { SAWERIA_URL } from "@/lib/cv/constants";
import { useI18n } from "@/lib/i18n";

type Search = { cvId?: string; format?: string };

export const Route = createFileRoute("/download")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    cvId: typeof search.cvId === "string" ? search.cvId : undefined,
    format: typeof search.format === "string" ? search.format : undefined,
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { cvId } = Route.useSearch();
  const { t } = useI18n();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <h1 className="mt-4 font-display text-4xl text-navy">{t("successTitle")}</h1>
        <p className="mt-3 text-muted">{t("successSub")}</p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <Button asChild size="lg">
            <a href={SAWERIA_URL} target="_blank" rel="noreferrer">
              <Heart className="size-4" />
              {t("supportSaweria")}
            </a>
          </Button>
          {cvId ? (
            <Button asChild size="lg" variant="secondary">
              <Link to="/preview/$cvId" params={{ cvId }}>
                {t("downloadAgain")}
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to="/">{t("back")}</Link>
            </Button>
          )}
          {cvId ? (
            <Button asChild variant="ghost">
              <Link to="/editor/$cvId" params={{ cvId }}>
                {t("backEdit")}
              </Link>
            </Button>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
