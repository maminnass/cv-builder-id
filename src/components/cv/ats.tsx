import { contactLine, displayName } from "@/lib/cv/format";
import type { CVDocument, CVTemplate } from "@/lib/cv/types";
import { fontFamily, HeadingBar, Photo, serifStack, StandardSections } from "./shared";

function pad(compact: boolean) {
  return compact ? "16px 22px 20px" : "22px 28px 24px";
}

export function AtsClassic({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div
      className="cv-sheet"
      style={{
        fontFamily: serifStack(),
        color: t.ink,
        padding: pad(false),
        background: t.paper,
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 10 }}>
        {doc.photo?.dataUrl ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Photo src={doc.photo.dataUrl} size={72} radius="4px" />
          </div>
        ) : null}
        <div style={{ fontSize: t.nameSize, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1.15 }}>
          {displayName(doc)}
        </div>
        {doc.personal.title ? (
          <div style={{ fontSize: 12, fontStyle: "italic", color: t.muted, marginTop: 3 }}>{doc.personal.title}</div>
        ) : null}
        <div style={{ fontSize: 10.5, color: t.muted, marginTop: 6 }}>{contacts.join("  ·  ")}</div>
      </header>
      <StandardSections doc={doc} template={template} />
    </div>
  );
}

export function AtsModern({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper, padding: 0 }}>
      <div style={{ height: 6, background: t.accent }} />
      <div style={{ padding: "20px 28px 24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: t.nameSize, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {displayName(doc)}
            </div>
            {doc.personal.title ? (
              <div style={{ color: t.accent, fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{doc.personal.title}</div>
            ) : null}
            <div style={{ fontSize: 10.5, color: t.muted, marginTop: 6, maxWidth: 460 }}>{contacts.join("  ·  ")}</div>
          </div>
          {doc.photo?.dataUrl ? <Photo src={doc.photo.dataUrl} size={78} radius="8px" /> : null}
        </header>
        <StandardSections
          doc={doc}
          template={template}
          heading={(title) => (
            <HeadingBar color={t.heading} underline={false}>
              <span style={{ borderBottom: `2px solid ${t.accent}`, paddingBottom: 2 }}>{title}</span>
            </HeadingBar>
          )}
        />
      </div>
    </div>
  );
}

export function AtsExecutive({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("mixed"), color: t.ink, background: t.paper, padding: "24px 30px" }}>
      <header style={{ display: "flex", gap: 18, alignItems: "flex-end", borderBottom: `2px solid ${t.accent}`, paddingBottom: 12, marginBottom: 10 }}>
        {doc.photo?.dataUrl ? <Photo src={doc.photo.dataUrl} size={84} radius="4px" /> : null}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: serifStack(), fontSize: t.nameSize, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {displayName(doc)}
          </div>
          {doc.personal.title ? (
            <div style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10.5, marginTop: 6, color: t.muted }}>
              {doc.personal.title}
            </div>
          ) : null}
        </div>
      </header>
      <div style={{ fontSize: 10.5, color: t.muted, marginBottom: 8 }}>{contacts.join("  ·  ")}</div>
      <StandardSections doc={doc} template={template} />
    </div>
  );
}

export function AtsFresh({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper, padding: "22px 28px" }}>
      <header style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: t.nameSize, fontWeight: 700, letterSpacing: "-0.02em" }}>{displayName(doc)}</div>
            {doc.personal.title ? (
              <div style={{ color: t.accent, fontWeight: 600, fontSize: 12, marginTop: 2 }}>{doc.personal.title}</div>
            ) : null}
          </div>
          {doc.photo?.dataUrl ? <Photo src={doc.photo.dataUrl} size={70} radius="50%" /> : null}
        </div>
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {contacts.map((c) => (
            <span key={c} style={{ fontSize: 10.5, color: t.muted, background: t.accentSoft, borderRadius: 999, padding: "2px 8px" }}>
              {c}
            </span>
          ))}
        </div>
      </header>
      <StandardSections doc={doc} template={template} />
    </div>
  );
}

export function AtsCompact({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div
      className="cv-sheet"
      style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper, padding: pad(true), fontSize: 10.5 }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: t.nameSize, fontWeight: 700, letterSpacing: "-0.03em" }}>{displayName(doc)}</div>
          {doc.personal.title ? <div style={{ fontSize: 11, color: t.muted }}>{doc.personal.title}</div> : null}
        </div>
        {doc.photo?.dataUrl ? <Photo src={doc.photo.dataUrl} size={56} radius="4px" /> : null}
      </header>
      <div style={{ fontSize: 10, color: t.muted, marginBottom: 6 }}>{contacts.join("  |  ")}</div>
      <StandardSections
        doc={doc}
        template={template}
        heading={(title) => (
          <HeadingBar color={t.heading} size={10} letterSpacing="0.12em">
            {title}
          </HeadingBar>
        )}
      />
    </div>
  );
}
