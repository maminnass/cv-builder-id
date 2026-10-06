import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-border bg-bg-elevated p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => setLang("id")}
        className={cn(
          "h-8 rounded-full px-3",
          lang === "id" ? "bg-navy text-navy-fg" : "text-muted hover:text-fg",
        )}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "h-8 rounded-full px-3",
          lang === "en" ? "bg-navy text-navy-fg" : "text-muted hover:text-fg",
        )}
      >
        EN
      </button>
    </div>
  );
}
