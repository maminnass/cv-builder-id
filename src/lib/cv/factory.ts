import { uid } from "@/lib/utils";
import type {
  CVDocument,
  CVType,
  Education,
  Experience,
  PersonalInfo,
  Skill,
  TemplateId,
  UILang,
} from "./types";

export const emptyPersonal = (): PersonalInfo => ({
  fullName: "",
  title: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Indonesia",
  linkedin: "",
  portfolio: "",
  website: "",
});

export const emptyExperience = (): Experience => ({
  id: uid(),
  position: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: [],
});

export const emptyEducation = (): Education => ({
  id: uid(),
  degree: "",
  field: "",
  institution: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const emptySkill = (): Skill => ({
  id: uid(),
  name: "",
  category: "",
});

export function createEmptyCV(input: {
  type: CVType;
  templateId: TemplateId;
  language?: UILang;
}): CVDocument {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: input.language === "en" ? "Untitled CV" : "CV Baru",
    type: input.type,
    templateId: input.templateId,
    language: input.language ?? "id",
    personal: emptyPersonal(),
    profile: "",
    experiences: [emptyExperience()],
    education: [emptyEducation()],
    skills: [emptySkill(), emptySkill(), emptySkill()],
    organizations: [],
    certificates: [],
    projects: [],
    languages: [],
    achievements: [],
    hiddenSections: [],
    createdAt: now,
    updatedAt: now,
  };
}
