import { Link, useNavigate } from "@tanstack/react-router";
import { Copy, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCV, duplicateCV, listCVs, saveCV } from "@/lib/cv/db";
import { createEmptyCV } from "@/lib/cv/factory";
import type { CVDocument } from "@/lib/cv/types";
import { useI18n } from "@/lib/i18n";
import { getTemplate } from "@/lib/cv/templates";

export function CvSwitcher({ currentId }: { currentId: string }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CVDocument[]>([]);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function refresh() {
    setItems(await listCVs());
  }

  useEffect(() => {
    if (open) void refresh();
  }, [open]);

  return (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <FolderOpen className="size-4" />
        <span className="hidden sm:inline">{t("cvSwitcher")}</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("switcherTitle")}</DialogTitle>
          </DialogHeader>
          <Button
            type="button"
            onClick={async () => {
              const doc = createEmptyCV({ type: "ats", templateId: "ats-01", language: lang });
              await saveCV(doc);
              setOpen(false);
              void navigate({ to: "/editor/$cvId", params: { cvId: doc.id } });
            }}
          >
            <Plus className="size-4" />
            {t("newCv")}
          </Button>
          <ul className="mt-4 space-y-2">
            {items.length === 0 ? <li className="text-sm text-muted">{t("emptyCvs")}</li> : null}
            {items.map((item) => {
              const tpl = getTemplate(item.templateId);
              return (
                <li key={item.id} className="rounded-md border border-border bg-bg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {item.name || t("untitled")}
                        {item.id === currentId ? (
                          <span className="ml-2 text-xs font-normal text-primary">●</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted">
                        {item.personal.fullName || "—"} · {lang === "id" ? tpl.nameId : tpl.name}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link to="/editor/$cvId" params={{ cvId: item.id }} onClick={() => setOpen(false)}>
                          <FolderOpen className="size-4" />
                          <span className="sr-only">{t("openCv")}</span>
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setRenameId(item.id);
                          setRenameValue(item.name);
                        }}
                      >
                        <span className="sr-only">{t("rename")}</span>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={async () => {
                          const copy = await duplicateCV(item);
                          await refresh();
                          void navigate({ to: "/editor/$cvId", params: { cvId: copy.id } });
                          setOpen(false);
                        }}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {renameId === item.id ? (
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await saveCV({ ...item, name: renameValue.trim() || item.name });
                        setRenameId(null);
                        await refresh();
                      }}
                    >
                      <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                      <Button type="submit" size="sm">
                        {t("save")}
                      </Button>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
          <AlertDialogDescription>{t("confirmDelete")}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteId) return;
                await deleteCV(deleteId);
                setDeleteId(null);
                await refresh();
                if (deleteId === currentId) {
                  const rest = await listCVs();
                  if (rest[0]) {
                    void navigate({ to: "/editor/$cvId", params: { cvId: rest[0].id } });
                  } else {
                    void navigate({ to: "/" });
                  }
                }
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
