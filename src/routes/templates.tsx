import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CVDocumentView } from "@/components/cv/document";
import { PreviewFrame } from "@/components/cv/preview-frame";
import { saveCV, getCV } from "@/lib/cv/db";
import { createEmptyCV } from "@/lib/cv/factory";
import { previewCV } from "@/lib/cv/sample";
import { TEMPLATES } from "@/lib/cv/templates";
import type { CVType, TemplateId } from "@/lib/cv/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Search = { type?: CVType; cvId?: string };

export const Route = createFileRoute("/templates")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    type: search.type === "creative" ? "creative" : search.type === "ats" ? "ats" : undefined,
    cvId: typeof search.cvId === "string" ? search.cvId : undefined,
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { type, cvId } = Route.useSearch();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const filter = type ?? "ats";
  const list = TEMPLATES.filter((tpl) => tpl.category === filter);

  async function choose(id: TemplateId, category: CVType) {
    if (cvId) {
      const existing = await getCV(cvId);
      if (existing) {
        await saveCV({ ...existing, templateId: id, type: category });
        void navigate({ to: "/editor/$cvId", params: { cvId } });
        return;
      }
    }
    const doc = createEmptyCV({ type: category, templateId: id, language: lang });
    await saveCV(doc);
    void navigate({ to: "/editor/$cvId", params: { cvId: doc.id } });
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-navy">{t("chooseTemplate")}</h1>
            <p className="mt-2 text-muted">{t("chooseTypeSub")}</p>
          </div>
          <div className="inline-flex rounded-md border border-border bg-bg-elevated p-1">
            <Link
              to="/templates"
              search={{ type: "ats", cvId }}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium",
                filter === "ats" ? "bg-primary text-primary-fg" : "text-muted",
              )}
            >
              {t("ats")}
            </Link>
            <Link
              to="/templates"
              search={{ type: "creative", cvId }}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium",
                filter === "creative" ? "bg-primary text-primary-fg" : "text-muted",
              )}
            >
              {t("creative")}
            </Link>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((tpl) => (
            <article key={tpl.id} className="overflow-hidden rounded-xl border border-border bg-bg-elevated">
              <div className="bg-bg px-4 pt-4">
                <PreviewFrame>
                  <CVDocumentView doc={previewCV(tpl.id)} />
                </PreviewFrame>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{lang === "id" ? tpl.nameId : tpl.name}</h2>
                  <div className="flex gap-1">
                    {tpl.photoPreferred ? <Badge>{t("photo")}</Badge> : <Badge>{t("optional")}</Badge>}
                  </div>
                </div>
                <p className="text-sm text-muted">{lang === "id" ? tpl.blurbId : tpl.blurbEn}</p>
                <Button className="w-full" onClick={() => void choose(tpl.id, tpl.category)}>
                  {cvId ? t("changeTemplate") : t("useTemplate")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
