import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CVDocumentView } from "@/components/cv/document";
import { PreviewFrame } from "@/components/cv/preview-frame";
import { CvSwitcher } from "@/components/editor/cv-switcher";
import { EditorForm } from "@/components/editor/form";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { computeCompletion, isReadyToPreview } from "@/lib/cv/completion";
import { getTemplate } from "@/lib/cv/templates";
import { useCv } from "@/hooks/use-cv";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/editor/$cvId")({
  component: EditorPage,
});

function EditorPage() {
  const { cvId } = Route.useParams();
  const { doc, status, persist } = useCv(cvId);
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const completion = doc ? computeCompletion(doc) : 0;
  const ready = doc ? isReadyToPreview(doc) : false;
  const tpl = doc ? getTemplate(doc.templateId) : null;

  const preview = useMemo(() => (doc ? <CVDocumentView doc={doc} /> : null), [doc]);

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center text-muted">
        {t("preparingPreview")}
      </div>
    );
  }

  if (!doc || status === "missing") {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <p className="font-display text-3xl text-navy">{t("emptyCvs")}</p>
          <Button asChild className="mt-4">
            <Link to="/choose-type">{t("ctaCreate")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function goPreview() {
    if (!doc || !ready) return;
    setBusy(true);
    persist(doc);
    await new Promise((r) => setTimeout(r, 250));
    void navigate({ to: "/preview/$cvId", params: { cvId: doc.id } });
  }

  const actions = (
    <>
      <CvSwitcher currentId={doc.id} />
      <Button asChild variant="secondary" size="sm">
        <Link to="/templates" search={{ type: doc.type, cvId: doc.id }}>
          {t("changeTemplate")}
        </Link>
      </Button>
    </>
  );

  const cta = (
    <div className="hidden items-center gap-3 lg:flex">
      <div className="hidden w-28 lg:block">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>{t("completion")}</span>
          <span className="tabular-nums">{completion}%</span>
        </div>
        <Progress value={completion} />
      </div>
      <Button disabled={!ready || busy} onClick={() => void goPreview()}>
        {busy ? t("preparingPreview") : t("ctaCreateArrow")}
      </Button>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader solid trailing={<>{actions}{cta}</>} />
      <div className="border-b border-border bg-bg-elevated px-4 py-2 text-xs text-muted lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>{tpl ? (lang === "id" ? tpl.nameId : tpl.name) : ""}</span>
          <span className="tabular-nums">
            {completion}% · {status === "saving" ? t("saving") : t("saved")}
          </span>
        </div>
      </div>

      <div className="hidden min-h-[calc(100dvh-4.5rem)] lg:grid lg:grid-cols-[minmax(360px,42%)_1fr]">
        <div className="border-r border-border bg-bg-elevated p-5">
          <p className="mb-4 text-xs text-muted">{status === "saving" ? t("saving") : t("saved")}</p>
          <EditorForm doc={doc} onChange={persist} />
        </div>
        <div className="bg-bg p-6">
          <div className="sticky top-20">
            <PreviewFrame>{preview}</PreviewFrame>
            {!ready ? <p className="mx-auto mt-4 max-w-sm text-center text-sm text-muted">{t("notReadyHint")}</p> : null}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="edit" className="px-3 py-3">
          <TabsList className="w-full">
            <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="pt-4">
            <EditorForm doc={doc} onChange={persist} />
          </TabsContent>
          <TabsContent value="preview" className="pt-4">
            <PreviewFrame>{preview}</PreviewFrame>
            {!ready ? <p className="mt-3 text-center text-sm text-muted">{t("notReadyHint")}</p> : null}
          </TabsContent>
        </Tabs>
        <div className="sticky bottom-0 border-t border-border bg-bg-elevated p-3">
          <Button className="w-full" disabled={!ready || busy} onClick={() => void goPreview()}>
            {busy ? t("preparingPreview") : t("ctaCreateArrow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
