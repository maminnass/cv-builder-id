import type { CVDocument, SectionKey, UILang } from "./types";

const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(value: string, lang: UILang) {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!y) return value;
  const months = lang === "id" ? monthsId : monthsEn;
  const mi = Math.max(0, Math.min(11, (Number(m) || 1) - 1));
  return `${months[mi]} ${y}`;
}

export function dateRange(start: string, end: string, current: boolean, lang: UILang) {
  const a = formatMonth(start, lang);
  const b = current ? (lang === "id" ? "Sekarang" : "Present") : formatMonth(end, lang);
  if (!a && !b) return "";
  if (a && b) return `${a} – ${b}`;
  return a || b;
}

export function contactLine(doc: CVDocument) {
  const p = doc.personal;
  return [
    p.email,
    p.phone,
    [p.city, p.country].filter(Boolean).join(", "),
    p.linkedin,
    p.portfolio,
    p.website,
  ].filter((x) => x && x.trim());
}

export function isSectionVisible(doc: CVDocument, key: SectionKey) {
  if (doc.hiddenSections.includes(key)) return false;
  switch (key) {
    case "profile":
      return Boolean(doc.profile.trim());
    case "experience":
      return doc.experiences.some((e) => e.position.trim() || e.company.trim());
    case "education":
      return doc.education.some((e) => e.institution.trim() || e.degree.trim() || e.field.trim());
    case "skills":
      return doc.skills.some((s) => s.name.trim());
    case "organizations":
      return doc.organizations.some((o) => o.name.trim());
    case "certificates":
      return doc.certificates.some((c) => c.name.trim());
    case "projects":
      return doc.projects.some((p) => p.name.trim());
    case "languages":
      return doc.languages.some((l) => l.language.trim());
    case "achievements":
      return doc.achievements.some((a) => a.title.trim());
  }
}

export function displayName(doc: CVDocument) {
  return doc.personal.fullName.trim() || (doc.language === "en" ? "Your Name" : "Nama Anda");
}

export function stripUrl(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
