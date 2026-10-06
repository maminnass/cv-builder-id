import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Languages, Monitor, Shield, Wand2 } from "lucide-react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { CVDocumentView } from "@/components/cv/document";
import { PreviewFrame } from "@/components/cv/preview-frame";
import { previewCV } from "@/lib/cv/sample";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useI18n();
  const benefits = [
    { icon: FileText, title: t("benefitTemplates"), body: t("benefitTemplatesSub") },
    { icon: Monitor, title: t("benefitPreview"), body: t("benefitPreviewSub") },
    { icon: Shield, title: t("benefitExport"), body: t("benefitExportSub") },
    { icon: Languages, title: t("benefitNoLogin"), body: t("benefitNoLoginSub") },
    { icon: Wand2, title: t("benefitAi"), body: t("benefitAiSub") },
  ];
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="mb-4 text-sm font-medium tracking-[0.18em] text-primary uppercase">
              {t("appName")}
            </p>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-navy sm:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">{t("heroSub")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/choose-type">
                  {t("ctaCreate")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/templates">{t("ctaTemplates")}</Link>
              </Button>
            </div>
            <p className="mt-6 max-w-lg text-sm text-subtle">{t("localNotice")}</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-navy/5" />
            <PreviewFrame>
              <CVDocumentView doc={previewCV("ats-02")} />
            </PreviewFrame>
          </div>
        </section>

        <section className="border-y border-border bg-bg-elevated/70">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-bg p-4">
                <item.icon className="mb-3 size-5 text-primary" />
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl text-navy">{t("howItWorks")}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step} className="rounded-lg border border-border bg-bg-elevated p-5">
                <span className="font-display text-3xl text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-sm font-medium">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
