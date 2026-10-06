import { contactLine, dateRange, displayName, isSectionVisible } from "@/lib/cv/format";
import { SECTION_HEADINGS } from "@/lib/cv/headings";
import type { CVDocument, CVTemplate, SectionKey } from "@/lib/cv/types";
import {
  Body,
  ExperienceBlock,
  fontFamily,
  HeadingBar,
  Photo,
  renderSectionBody,
  serifStack,
  SkillsLine,
  StandardSections,
} from "./shared";

function SideLabel({ children, color }: { children: string; color: string }) {
  return (
    <div
      style={{
        color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        margin: "14px 0 6px",
      }}
    >
      {children}
    </div>
  );
}

export function CreativeSidebar({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const labels = SECTION_HEADINGS[doc.language];
  const p = doc.personal;
  const sideKeys: SectionKey[] = ["skills", "languages", "certificates"];
  const mainSkip: SectionKey[] = sideKeys;
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper, display: "flex" }}>
      <aside style={{ width: 236, background: t.sidebar, color: t.sidebarText, padding: "26px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Photo
            src={doc.photo?.dataUrl}
            size={118}
            radius="50%"
            border={`3px solid ${t.sidebarText}`}
          />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{displayName(doc)}</div>
        {p.title ? <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 6 }}>{p.title}</div> : null}
        <SideLabel color={t.sidebarText}>{doc.language === "id" ? "Kontak" : "Contact"}</SideLabel>
        <div style={{ fontSize: 10.5, lineHeight: 1.55, opacity: 0.92 }}>
          {[p.email, p.phone, [p.city, p.country].filter(Boolean).join(", "), p.linkedin, p.portfolio, p.website]
            .filter(Boolean)
            .map((line) => (
              <div key={line}>{line}</div>
            ))}
        </div>
        {sideKeys.map((key) => {
          if (!isSectionVisible(doc, key)) return null;
          return (
            <div key={key}>
              <SideLabel color={t.sidebarText}>{labels[key]}</SideLabel>
              <div style={{ color: t.sidebarText, fontSize: 10.5, lineHeight: 1.5 }}>
                {key === "skills" ? (
                  <div>
                    {doc.skills
                      .filter((s) => s.name.trim())
                      .map((s) => (
                        <div key={s.id} style={{ marginBottom: 4 }}>
                          {s.name}
                        </div>
                      ))}
                  </div>
                ) : (
                  renderSectionBody(key, doc, template)
                )}
              </div>
            </div>
          );
        })}
      </aside>
      <main style={{ flex: 1, padding: "26px 24px 24px" }}>
        <StandardSections doc={doc} template={template} skip={mainSkip} />
      </main>
    </div>
  );
}

export function CreativeTimeline({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  const labels = SECTION_HEADINGS[doc.language];
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper, padding: "22px 28px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: t.nameSize, fontWeight: 700, letterSpacing: "-0.03em" }}>{displayName(doc)}</div>
          {doc.personal.title ? (
            <div style={{ color: t.accent, fontWeight: 600, marginTop: 3 }}>{doc.personal.title}</div>
          ) : null}
          <div style={{ fontSize: 10.5, color: t.muted, marginTop: 6 }}>{contacts.join("  ·  ")}</div>
        </div>
        {doc.photo?.dataUrl ? <Photo src={doc.photo.dataUrl} size={76} radius="50%" /> : null}
      </header>
      {isSectionVisible(doc, "profile") ? (
        <>
          <HeadingBar color={t.heading}>{labels.profile}</HeadingBar>
          <Body color={t.ink}>{doc.profile}</Body>
        </>
      ) : null}
      {isSectionVisible(doc, "experience") ? (
        <>
          <HeadingBar color={t.heading}>{labels.experience}</HeadingBar>
          <div style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 14, marginLeft: 4 }}>
            {doc.experiences
              .filter((e) => e.position || e.company)
              .map((item) => (
                <div key={item.id} style={{ position: "relative", marginBottom: 12 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: -19,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: t.accent,
                    }}
                  />
                  <div style={{ fontWeight: 700, fontSize: 12 }}>
                    {item.position} {item.company ? `· ${item.company}` : ""}
                  </div>
                  <div style={{ fontSize: 10.5, color: t.muted }}>
                    {[item.location, dateRange(item.startDate, item.endDate, item.current, doc.language)]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  {item.description ? <Body color={t.ink}>{item.description}</Body> : null}
                </div>
              ))}
          </div>
        </>
      ) : null}
      <StandardSections doc={doc} template={template} skip={["profile", "experience"]} />
    </div>
  );
}

export function CreativeBranding({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("mixed"), color: t.ink, background: t.paper }}>
      <div style={{ background: t.accent, color: "#fff", padding: "22px 28px 18px", display: "flex", gap: 18, alignItems: "center" }}>
        {doc.photo?.dataUrl ? (
          <Photo src={doc.photo.dataUrl} size={96} radius="12px" border="2px solid rgba(255,255,255,0.6)" />
        ) : (
          <Photo size={96} radius="12px" />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: serifStack(), fontSize: t.nameSize, lineHeight: 1.05, fontWeight: 600 }}>
            {displayName(doc)}
          </div>
          {doc.personal.title ? (
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.92 }}>{doc.personal.title}</div>
          ) : null}
          <div style={{ marginTop: 8, fontSize: 10.5, opacity: 0.88 }}>{contacts.join("  ·  ")}</div>
        </div>
      </div>
      <div style={{ padding: "16px 28px 24px" }}>
        <StandardSections doc={doc} template={template} />
      </div>
    </div>
  );
}

export function CreativeElegant({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const contacts = contactLine(doc);
  const labels = SECTION_HEADINGS[doc.language];
  const left: SectionKey[] = ["skills", "languages", "certificates", "organizations"];
  return (
    <div
      className="cv-sheet"
      style={{ fontFamily: serifStack(), color: t.ink, background: t.paper, padding: "32px 34px" }}
    >
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        {doc.photo?.dataUrl ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Photo src={doc.photo.dataUrl} size={80} radius="50%" />
          </div>
        ) : null}
        <div style={{ fontSize: t.nameSize, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {displayName(doc)}
        </div>
        {doc.personal.title ? (
          <div style={{ fontStyle: "italic", color: t.muted, marginTop: 6 }}>{doc.personal.title}</div>
        ) : null}
        <div style={{ width: 64, height: 1, background: t.heading, margin: "12px auto" }} />
        <div style={{ fontSize: 10.5, color: t.muted }}>{contacts.join("   ·   ")}</div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 28 }}>
        <div>
          {left.map((key) => {
            if (!isSectionVisible(doc, key)) return null;
            return (
              <section key={key}>
                <HeadingBar color={t.heading} letterSpacing="0.18em">
                  {labels[key]}
                </HeadingBar>
                {renderSectionBody(key, doc, template)}
              </section>
            );
          })}
        </div>
        <div>
          <StandardSections doc={doc} template={template} skip={left} />
        </div>
      </div>
    </div>
  );
}

export function CreativeBold({ doc, template }: { doc: CVDocument; template: CVTemplate }) {
  const t = template.theme;
  const p = doc.personal;
  const contacts = contactLine(doc);
  return (
    <div className="cv-sheet" style={{ fontFamily: fontFamily("sans"), color: t.ink, background: t.paper }}>
      <header
        style={{
          background: t.sidebar,
          color: t.sidebarText,
          padding: "26px 28px 22px",
          display: "flex",
          gap: 18,
          alignItems: "center",
        }}
      >
        {doc.photo?.dataUrl ? (
          <Photo src={doc.photo.dataUrl} size={108} radius="8px" />
        ) : (
          <Photo size={108} radius="8px" />
        )}
        <div>
          <div style={{ fontSize: t.nameSize, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            {displayName(doc)}
          </div>
          {p.title ? (
            <div
              style={{
                marginTop: 8,
                display: "inline-block",
                background: "#1D4ED8",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 8px",
              }}
            >
              {p.title}
            </div>
          ) : null}
          <div style={{ marginTop: 10, fontSize: 11, opacity: 0.9 }}>{contacts.join("  ·  ")}</div>
        </div>
      </header>
      <div style={{ padding: "16px 28px 24px" }}>
        {isSectionVisible(doc, "skills") ? (
          <div style={{ background: t.accentSoft, padding: "8px 12px", marginBottom: 8 }}>
            <SkillsLine doc={doc} color={t.ink} />
          </div>
        ) : null}
        <StandardSections doc={doc} template={template} skip={["skills"]} />
      </div>
    </div>
  );
}
