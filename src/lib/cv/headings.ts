import type { SectionKey, UILang } from "./types";

export const SECTION_HEADINGS: Record<UILang, Record<SectionKey, string>> = {
  id: {
    profile: "Profil",
    experience: "Pengalaman Kerja",
    education: "Pendidikan",
    skills: "Keahlian",
    organizations: "Organisasi",
    certificates: "Sertifikat",
    projects: "Proyek",
    languages: "Bahasa",
    achievements: "Pencapaian",
  },
  en: {
    profile: "Profile",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    organizations: "Organizations",
    certificates: "Certificates",
    projects: "Projects",
    languages: "Languages",
    achievements: "Achievements",
  },
};

export const CONTACT_LABELS: Record<UILang, { phone: string; email: string; web: string }> = {
  id: { phone: "Telepon", email: "Email", web: "Web" },
  en: { phone: "Phone", email: "Email", web: "Web" },
};
