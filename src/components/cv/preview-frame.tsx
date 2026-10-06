import { useEffect, useRef, useState, type ReactNode } from "react";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/cv/constants";
import { cn } from "@/lib/utils";

export function PreviewFrame({
  children,
  className,
  maxWidth,
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const update = () => {
      const cap = maxWidth ?? el.clientWidth;
      setScale(Math.max(0.28, Math.min(1, cap / A4_WIDTH_PX)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxWidth]);

  return (
    <div ref={hostRef} className={cn("w-full", className)}>
      <div
        className="relative mx-auto overflow-hidden"
        style={{ width: A4_WIDTH_PX * scale, height: A4_HEIGHT_PX * scale }}
      >
        <div
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="overflow-hidden rounded-[2px] shadow-[0_24px_60px_-28px_rgba(15,39,68,0.45)] ring-1 ring-navy/15">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
