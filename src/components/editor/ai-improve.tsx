import { Sparkles } from "lucide-react";
import { useState } from "react";
import { improveText } from "@/lib/cv/ai";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export function AiImprove({
  section,
  text,
  context,
  onApply,
}: {
  section: string;
  text: string;
  context?: Record<string, string>;
  onApply: (next: string) => void;
}) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [improved, setImproved] = useState("");
  const [alts, setAlts] = useState<string[]>([]);
  const [choice, setChoice] = useState("");

  async function run() {
    if (!text.trim()) {
      toast(t("aiNeedText"));
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const res = await improveText({
        data: { section, text, context, language: lang },
      });
      if (!res.ok) {
        toast.error(t("aiUnavailable"));
        setOpen(false);
        return;
      }
      setImproved(res.improved);
      setAlts(res.alternatives);
      setChoice(res.improved);
    } catch {
      toast.error(t("aiUnavailable"));
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => void run()} disabled={loading}>
        <Sparkles className="size-3.5" />
        {loading ? t("aiWorking") : t("improveAi")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("improveAi")}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-sm text-muted">{t("aiWorking")}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium tracking-wide text-muted uppercase">{t("original")}</p>
                <p className="rounded-md bg-bg p-3 text-sm">{text}</p>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
                  {t("improved")}
                </span>
                <textarea
                  className="min-h-28 w-full rounded-sm border border-primary/40 bg-bg-elevated p-3 text-sm"
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                />
              </label>
              {alts.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">{t("alternatives")}</p>
                  {alts.map((alt) => (
                    <button
                      key={alt}
                      type="button"
                      onClick={() => setChoice(alt)}
                      className="block w-full rounded-md border border-border bg-bg p-3 text-left text-sm hover:border-primary"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  {t("aiKeep")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onApply(choice);
                    setOpen(false);
                  }}
                >
                  {t("aiUse")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
