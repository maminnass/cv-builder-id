import type { CSSProperties, ReactNode } from "react";
import { dateRange, isSectionVisible, stripUrl } from "@/lib/cv/format";
import { SECTION_HEADINGS } from "@/lib/cv/headings";
import type { CVDocument, CVTemplate, SectionKey } from "@/lib/cv/types";

export function fontFamily(kind: CVTemplate["theme"]["font"]) {
  if (kind === "serif") return `"Source Serif 4", Georgia, "Times New Roman", serif`;
  if (kind === "mixed") return `"Source Sans 3", "Segoe UI", Helvetica, Arial, sans-serif`;
  return `"Source Sans 3", "Segoe UI", Helvetica, Arial, sans-serif`;
}

export function serifStack() {
  return `"Source Serif 4", Georgia, "Times New Roman", serif`;
}

export function Photo({
  src,
  size,
  radius = "8px",
  border,
}: {
  src?: string;
  size: number;
  radius?: string;
  border?: string;
}) {
  const style: CSSProperties = {
    width: size,
    height: size,
    objectFit: "cover",
    borderRadius: radius,
    border,
    background: "#EEF1F4",
    flexShrink: 0,
  };
  if (!src) {
    return <div style={style} />;
  }
  return <img src={src} alt="" style={style} />;
}

export function HeadingBar({
  children,
  color,
  underline = true,
  smallCaps = true,
  size = 11,
  letterSpacing = "0.14em",
}: {
  children: ReactNode;
  color: string;
  underline?: boolean;
  smallCaps?: boolean;
  size?: number;
  letterSpacing?: string;
}) {
  return (
    <div
      style={{
        color,
        fontSize: size,
        fontWeight: 700,
        letterSpacing,
        textTransform: smallCaps ? "uppercase" : "none",
        borderBottom: underline ? `1.5px solid ${color}` : "none",
        paddingBottom: 3,
        margin: "12px 0 8px",
      }}
    >
      {children}
    </div>
  );
}

export function Body({ children, color, size = 11, compact }: { children: ReactNode; color: string; size?: number; compact?: boolean }) {
  return (
    <div style={{ color, fontSize: size, lineHeight: compact ? 1.35 : 1.45, margin: 0 }}>{children}</div>
  );
}

export function Meta({ children, color }: { children: ReactNode; color: string }) {
  return <div style={{ color, fontSize: 10.5, marginTop: 1 }}>{children}</div>;
}

export function ItemTitle({
  left,
  right,
  ink,
  muted,
}: {
  left: ReactNode;
  right?: ReactNode;
  ink: string;
  muted: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
      <div style={{ color: ink, fontWeight: 700, fontSize: 12 }}>{left}</div>
      {right ? <div style={{ color: muted, fontSize: 10.5, whiteSpace: "nowrap" }}>{right}</div> : null}
    </div>
  );
}

export function Bullets({ items, color, compact }: { items: string[]; color: string; compact?: boolean }) {
  const clean = items.map((x) => x.trim()).filter(Boolean);
  if (!clean.length) return null;
  return (
    <ul style={{ margin: "3px 0 0", paddingLeft: 16, color, fontSize: compact ? 10.5 : 11, lineHeight: compact ? 1.35 : 1.45 }}>
      {clean.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ExperienceBlock({
  doc,
  template,
}: {
  doc: CVDocument;
  template: CVTemplate;
}) {
  const { ink, muted } = template.theme;
  return (
    <>
      {doc.experiences
        .filter((e) => e.position.trim() || e.company.trim())
        .map((item) => (
          <div key={item.id} style={{ marginBottom: template.theme.compact ? 7 : 10 }}>
            <ItemTitle
              left={
                <>
                  {item.position}
                  {item.company ? <span style={{ fontWeight: 500 }}> · {item.company}</span> : null}
                </>
              }
              right={dateRange(item.startDate, item.endDate, item.current, doc.language)}
              ink={ink}
              muted={muted}
            />
            {item.location ? <Meta color={muted}>{item.location}</Meta> : null}
            {item.description ? <Body color={ink} compact={template.theme.compact}>{item.description}</Body> : null}
            <Bullets items={item.achievements} color={ink} compact={template.theme.compact} />
          </div>
        ))}
    </>
  );
}

export function EducationBlock({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const { ink, muted } = template.theme;
  return (
    <>
      {doc.education
        .filter((e) => e.institution.trim() || e.degree.trim() || e.field.trim())
        .map((item) => {
          const title = [item.degree, item.field].filter(Boolean).join(" ");
          return (
            <div key={item.id} style={{ marginBottom: 8 }}>
              <ItemTitle
                left={
                  <>
                    {title || item.institution}
                    {title ? <span style={{ fontWeight: 500 }}> · {item.institution}</span> : null}
                  </>
                }
                right={dateRange(item.startDate, item.endDate, false, doc.language)}
                ink={ink}
                muted={muted}
              />
              {item.location ? <Meta color={muted}>{item.location}</Meta> : null}
              {item.description ? <Body color={ink} compact={template.theme.compact}>{item.description}</Body> : null}
            </div>
          );
        })}
    </>
  );
}

export function SkillsLine({ doc, color, divider = "  ·  " }: { doc: CVDocument; color: string; divider?: string }) {
  const names = doc.skills.map((s) => s.name.trim()).filter(Boolean);
  if (!names.length) return null;
  return <Body color={color}>{names.join(divider)}</Body>;
}

export function GenericList({
  items,
  template,
}: {
  items: Array<{ id: string; title: string; meta?: string; dates?: string; body?: string }>;
  template: CVTemplate;
}) {
  const { ink, muted } = template.theme;
  return (
    <>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 8 }}>
          <ItemTitle left={item.title} right={item.dates} ink={ink} muted={muted} />
          {item.meta ? <Meta color={muted}>{item.meta}</Meta> : null}
          {item.body ? <Body color={ink} compact={template.theme.compact}>{item.body}</Body> : null}
        </div>
      ))}
    </>
  );
}

export function renderSectionBody(key: SectionKey, doc: CVDocument, template: CVTemplate) {
  if (!isSectionVisible(doc, key)) return null;
  const { ink, muted } = template.theme;
  switch (key) {
    case "profile":
      return <Body color={ink}>{doc.profile}</Body>;
    case "experience":
      return <ExperienceBlock doc={doc} template={template} />;
    case "education":
      return <EducationBlock doc={doc} template={template} />;
    case "skills":
      return <SkillsLine doc={doc} color={ink} />;
    case "organizations":
      return (
        <GenericList
          template={template}
          items={doc.organizations
            .filter((o) => o.name.trim())
            .map((o) => ({
              id: o.id,
              title: o.role ? `${o.name} · ${o.role}` : o.name,
              dates: dateRange(o.startDate, o.endDate, false, doc.language),
              body: o.description,
            }))}
        />
      );
    case "certificates":
      return (
        <GenericList
          template={template}
          items={doc.certificates
            .filter((c) => c.name.trim())
            .map((c) => ({
              id: c.id,
              title: c.name,
              meta: [c.issuer, c.date, c.credentialId].filter(Boolean).join(" · "),
              body: c.url ? stripUrl(c.url) : "",
            }))}
        />
      );
    case "projects":
      return (
        <GenericList
          template={template}
          items={doc.projects
            .filter((p) => p.name.trim())
            .map((p) => ({
              id: p.id,
              title: p.role ? `${p.name} · ${p.role}` : p.name,
              meta: [p.tech, p.url ? stripUrl(p.url) : ""].filter(Boolean).join(" · "),
              body: p.description,
            }))}
        />
      );
    case "languages":
      return (
        <Body color={ink}>
          {doc.languages
            .filter((l) => l.language.trim())
            .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
            .join("  ·  ")}
        </Body>
      );
    case "achievements":
      return (
        <GenericList
          template={template}
          items={doc.achievements
            .filter((a) => a.title.trim())
            .map((a) => ({
              id: a.id,
              title: a.title,
              meta: [a.issuer, a.date].filter(Boolean).join(" · "),
              body: a.description,
            }))}
        />
      );
    default:
      return null;
  }
}

export function StandardSections({
  doc,
  template,
  heading,
  skip = [],
}: {
  doc: CVDocument;
  template: CVTemplate;
  heading?: (title: string, key: SectionKey) => ReactNode;
  skip?: SectionKey[];
}) {
  const labels = SECTION_HEADINGS[doc.language];
  return (
    <>
      {template.sectionOrder.map((key) => {
        if (skip.includes(key)) return null;
        if (!isSectionVisible(doc, key)) return null;
        return (
          <section key={key}>
            {heading ? (
              heading(labels[key], key)
            ) : (
              <HeadingBar color={template.theme.heading}>{labels[key]}</HeadingBar>
            )}
            {renderSectionBody(key, doc, template)}
          </section>
        );
      })}
    </>
  );
}
