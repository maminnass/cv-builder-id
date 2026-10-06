import { getTemplate } from "@/lib/cv/templates";
import type { CVDocument, TemplateId } from "@/lib/cv/types";
import {
  AtsClassic,
  AtsCompact,
  AtsExecutive,
  AtsFresh,
  AtsModern,
} from "./ats";
import {
  CreativeBold,
  CreativeBranding,
  CreativeElegant,
  CreativeSidebar,
  CreativeTimeline,
} from "./creative";

export function CVDocumentView({
  doc,
  templateId,
}: {
  doc: CVDocument;
  templateId?: TemplateId;
}) {
  const id = templateId ?? doc.templateId;
  const template = getTemplate(id);
  switch (id) {
    case "ats-01":
      return <AtsClassic doc={doc} template={template} />;
    case "ats-02":
      return <AtsModern doc={doc} template={template} />;
    case "ats-03":
      return <AtsExecutive doc={doc} template={template} />;
    case "ats-04":
      return <AtsFresh doc={doc} template={template} />;
    case "ats-05":
      return <AtsCompact doc={doc} template={template} />;
    case "cr-01":
      return <CreativeSidebar doc={doc} template={template} />;
    case "cr-02":
      return <CreativeTimeline doc={doc} template={template} />;
    case "cr-03":
      return <CreativeBranding doc={doc} template={template} />;
    case "cr-04":
      return <CreativeElegant doc={doc} template={template} />;
    case "cr-05":
      return <CreativeBold doc={doc} template={template} />;
    default:
      return <AtsClassic doc={doc} template={template} />;
  }
}
