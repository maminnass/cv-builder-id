import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CVDocumentView } from "@/components/cv/document";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { A4_HEIGHT_PX } from "@/lib/cv/constants";
import { exportDocx, exportPdf } from "@/lib/cv/export";
import { useCv } from "@/hooks/use-cv";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/preview/$cvId")({
  component: PreviewPage,
});

function PreviewPage() {
  const { cvId } = Route.useParams();
  const { doc, status } = useCv(cvId);
  const { t } = useI18n();
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);
  const [zoom, setZoom] = useState(0.92);

  useEffect(() => {
    if (!doc) return;
    const id = window.setTimeout(() => {
      const el = sheetRef.current?.querySelector(".cv-sheet") as HTMLElement | null;
      if (el) setOverflow(el.scrollHeight > A4_HEIGHT_PX + 8);
      setReady(true);
    }, 80);
    return () => window.clearTimeout(id);
  }, [doc]);

  async function handle(kind: "pdf" | "docx") {
    if (!doc) return;
    const root = sheetRef.current?.querySelector(".cv-sheet") as HTMLElement | null;
    if (!root) return;
    setBusy(kind);
    try {
      if (kind === "pdf") await exportPdf(root, doc.personal.fullName);
      else await exportDocx(doc);
      void navigate({ to: "/download", search: { cvId: doc.id, format: kind } });
    } catch {
      toast.error(t("exportFail"));
    } finally {
      setBusy(null);
    }
  }

  if (status === "loading") {
    return <div className="grid min-h-dvh place-items-center text-muted">{t("preparingPreview")}</div>;
  }
  if (!doc) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Button asChild>
          <Link to="/">{t("back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader
        solid
        trailing={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/editor/$cvId" params={{ cvId: doc.id }}>
                {t("backEdit")}
              </Link>
            </Button>
            <Button size="sm" disabled={!ready || Boolean(busy)} onClick={() => void handle("pdf")}>
              {busy === "pdf" ? t("preparingPreview") : t("downloadPdf")}
            </Button>
            <Button size="sm" variant="navy" disabled={!ready || Boolean(busy)} onClick={() => void handle("docx")}>
              {busy === "docx" ? t("preparingPreview") : t("downloadDocx")}
            </Button>
          </div>
        }
      />
      <main className="px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl text-navy">{t("finalPreview")}</h1>
          <p className="mt-1 text-sm text-muted">{t("finalPreviewSub")}</p>
          {overflow ? (
            <p className="mt-3 rounded-md border border-danger/30 bg-danger/8 px-3 py-2 text-sm text-danger">
              {t("pageWarning")}
            </p>
          ) : null}
          <div className="mt-4 flex gap-2">
            {[0.7, 0.92, 1].map((z) => (
              <Button key={z} size="sm" variant={zoom === z ? "default" : "secondary"} onClick={() => setZoom(z)}>
                {Math.round(z * 100)}%
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-auto pb-10">
          <div
            ref={sheetRef}
            className="mx-auto"
            style={{ width: 794 * zoom, height: 1123 * zoom }}
          >
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <CVDocumentView doc={doc} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
