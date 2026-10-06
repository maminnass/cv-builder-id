import { useCallback, useEffect, useRef, useState } from "react";
import { AUTOSAVE_MS } from "@/lib/cv/constants";
import { getCV, saveCV } from "@/lib/cv/db";
import type { CVDocument } from "@/lib/cv/types";

export function useCv(cvId: string) {
  const [doc, setDoc] = useState<CVDocument | null>(null);
  const [status, setStatus] = useState<"loading" | "saving" | "saved" | "missing">("loading");
  const timer = useRef<number | null>(null);
  const latest = useRef<CVDocument | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    void getCV(cvId)
      .then((found) => {
        if (cancelled) return;
        if (!found) {
          setDoc(null);
          setStatus("missing");
          return;
        }
        latest.current = found;
        setDoc(found);
        setStatus("saved");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [cvId]);

  const persist = useCallback((next: CVDocument) => {
    latest.current = next;
    setDoc(next);
    setStatus("saving");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void saveCV(next)
        .then((saved) => {
          latest.current = saved;
          setDoc(saved);
          setStatus("saved");
        })
        .catch(() => {
          setStatus("saved");
        });
    }, AUTOSAVE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (latest.current) void saveCV(latest.current);
    };
  }, []);

  return { doc, status, persist, setDoc };
}
