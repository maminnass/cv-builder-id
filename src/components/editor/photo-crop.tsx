import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cropToJpeg, loadImage, validatePhotoFile } from "@/lib/cv/photo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PhotoField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<"square" | "portrait">("square");
  const [offset, setOffset] = useState({ x: 0.5, y: 0.5 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    return () => {
      if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    };
  }, [src]);

  async function onFile(file: File) {
    const issue = validatePhotoFile(file);
    if (issue === "size") {
      setError(t("photoTooLarge"));
      return;
    }
    if (issue === "type") {
      setError(t("photoType"));
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setSrc(url);
    setZoom(1.1);
    setOffset({ x: 0.5, y: 0.5 });
    setOpen(true);
  }

  async function apply() {
    if (!src) return;
    const img = await loadImage(src);
    const dataUrl = await cropToJpeg(img, { x: offset.x, y: offset.y, zoom, aspect });
    onChange(dataUrl);
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="size-16 overflow-hidden rounded-md border border-border bg-border/50">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            {t("uploadPhoto")}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
              {t("removePhoto")}
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFile(file);
          e.target.value = "";
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cropPhoto")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className={cn(
                "relative mx-auto overflow-hidden bg-navy/10",
                aspect === "square" ? "h-64 w-64" : "h-72 w-56",
              )}
              onPointerDown={(e) => {
                (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
              }}
              onPointerMove={(e) => {
                if (!drag.current) return;
                const dx = (e.clientX - drag.current.x) / 220;
                const dy = (e.clientY - drag.current.y) / 220;
                setOffset({
                  x: Math.min(1, Math.max(0, drag.current.ox - dx)),
                  y: Math.min(1, Math.max(0, drag.current.oy - dy)),
                });
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: `scale(${zoom}) translate(${(0.5 - offset.x) * 40}%, ${(0.5 - offset.y) * 40}%)`,
                  }}
                />
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={aspect === "square" ? "default" : "secondary"}
                onClick={() => setAspect("square")}
              >
                {t("aspectSquare")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={aspect === "portrait" ? "default" : "secondary"}
                onClick={() => setAspect("portrait")}
              >
                {t("aspectPortrait")}
              </Button>
            </div>
            <label className="block text-sm">
              {t("zoom")}
              <input
                type="range"
                min={1}
                max={2.4}
                step={0.02}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="button" onClick={() => void apply()}>
                {t("usePhoto")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
