export type CVType = "ats" | "creative";
export type UILang = "id" | "en";
export type TemplateId =
  | "ats-01"
  | "ats-02"
  | "ats-03"
  | "ats-04"
  | "ats-05"
  | "cr-01"
  | "cr-02"
  | "cr-03"
  | "cr-04"
  | "cr-05";

export type SectionKey =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "organizations"
  | "certificates"
  | "projects"
  | "languages"
  | "achievements";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type PersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  linkedin: string;
  portfolio: string;
  website: string;
};

export type Experience = {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
};

export type Education = {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level?: SkillLevel;
};

export type Organization = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
};

export type Project = {
  id: string;
  name: string;
  role: string;
  description: string;
  tech: string;
  url: string;
};

export type LanguageSkill = {
  id: string;
  language: string;
  proficiency: string;
};

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
};

export type PhotoData = {
  dataUrl: string;
};

export type CVDocument = {
  id: string;
  name: string;
  type: CVType;
  templateId: TemplateId;
  language: UILang;
  personal: PersonalInfo;
  profile: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  organizations: Organization[];
  certificates: Certificate[];
  projects: Project[];
  languages: LanguageSkill[];
  achievements: Achievement[];
  photo?: PhotoData;
  hiddenSections: SectionKey[];
  createdAt: string;
  updatedAt: string;
};

export type TemplateTheme = {
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  paper: string;
  sidebar: string;
  sidebarText: string;
  heading: string;
  font: "serif" | "sans" | "mixed";
  header: "centered" | "left" | "split" | "band";
  nameSize: number;
  compact: boolean;
};

export type CVTemplate = {
  id: TemplateId;
  category: CVType;
  name: string;
  nameId: string;
  layout: "single" | "sidebar" | "timeline" | "branding" | "split" | "bold";
  supportsPhoto: boolean;
  photoPreferred: boolean;
  onePage: boolean;
  sectionOrder: SectionKey[];
  theme: TemplateTheme;
  blurbId: string;
  blurbEn: string;
};
