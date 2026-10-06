import type { CVDocument, TemplateId } from "./types";

function filled(value: string | undefined | null) {
  return Boolean(value && value.trim().length > 0);
}

function countFilled<T>(items: T[], pred: (item: T) => boolean) {
  return items.filter(pred).length;
}

export function computeCompletion(doc: CVDocument): number {
  const fresh =
    doc.templateId === "ats-04" ||
    countFilled(doc.experiences, (e) => filled(e.position) && filled(e.company)) === 0;

  const personalW = 20;
  const profileW = 15;
  const experienceW = fresh ? 12 : 25;
  const educationW = fresh ? 22 : 15;
  const skillsW = 10;
  const supportingW = 18;
  const projectBonusW = fresh ? 13 : 0;
  const totalW =
    personalW + profileW + experienceW + educationW + skillsW + supportingW + projectBonusW;

  let personal = 0;
  if (filled(doc.personal.fullName)) personal += 8;
  if (filled(doc.personal.email) || filled(doc.personal.phone)) personal += 6;
  if (filled(doc.personal.title)) personal += 3;
  if (filled(doc.personal.city) || filled(doc.personal.linkedin) || filled(doc.personal.website))
    personal += 3;
  personal = Math.min(personalW, personal);

  const profile = doc.profile.trim().length >= 40 ? profileW : doc.profile.trim().length >= 12 ? 8 : 0;

  const expCount = countFilled(
    doc.experiences,
    (e) => filled(e.position) && filled(e.company) && e.description.trim().length >= 20,
  );
  const experience = expCount === 0 ? 0 : Math.min(experienceW, 10 + expCount * 8);

  const eduCount = countFilled(
    doc.education,
    (e) => filled(e.institution) && (filled(e.degree) || filled(e.field)),
  );
  const education = eduCount === 0 ? 0 : Math.min(educationW, 10 + eduCount * 6);

  const skillCount = countFilled(doc.skills, (s) => filled(s.name));
  const skills = skillCount >= 5 ? skillsW : skillCount >= 3 ? 7 : skillCount >= 1 ? 4 : 0;

  let supporting = 0;
  if (countFilled(doc.organizations, (o) => filled(o.name)) > 0) supporting += 4;
  if (countFilled(doc.certificates, (c) => filled(c.name)) > 0) supporting += 4;
  if (countFilled(doc.languages, (l) => filled(l.language)) > 0) supporting += 3;
  if (countFilled(doc.achievements, (a) => filled(a.title)) > 0) supporting += 4;
  if (countFilled(doc.projects, (p) => filled(p.name)) > 0) supporting += 4;
  if (doc.photo?.dataUrl) supporting += 3;
  supporting = Math.min(supportingW, supporting);

  const projectCount = countFilled(doc.projects, (p) => filled(p.name) && filled(p.description));
  const projects = projectBonusW
    ? projectCount === 0
      ? 0
      : Math.min(projectBonusW, 6 + projectCount * 4)
    : 0;

  const raw = personal + profile + experience + education + skills + supporting + projects;
  return Math.max(0, Math.min(100, Math.round((raw / totalW) * 100)));
}

export function isReadyToPreview(doc: CVDocument) {
  const hasName = filled(doc.personal.fullName);
  const hasContact = filled(doc.personal.email) || filled(doc.personal.phone);
  return hasName && hasContact && computeCompletion(doc) >= 35;
}

export function isFreshGraduateTemplate(id: TemplateId) {
  return id === "ats-04";
}
