import type { ReactNode } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { AiImprove } from "./ai-improve";
import { PhotoField } from "./photo-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyEducation,
  emptyExperience,
  emptySkill,
} from "@/lib/cv/factory";
import { uid } from "@/lib/utils";
import type {
  Achievement,
  Certificate,
  CVDocument,
  LanguageSkill,
  Organization,
  Project,
  SectionKey,
} from "@/lib/cv/types";
import { useI18n } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  section,
  hidden,
  onToggle,
  extra,
  children,
}: {
  title: string;
  section: SectionKey | "personal";
  hidden?: boolean;
  onToggle?: () => void;
  extra?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section className="rounded-lg border border-border bg-bg-elevated p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {extra}
          {section !== "personal" && onToggle ? (
            <Button type="button" size="sm" variant="ghost" onClick={onToggle}>
              {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              <span className="hidden sm:inline">{hidden ? t("showSection") : t("hideSection")}</span>
            </Button>
          ) : null}
        </div>
      </div>
      <div className={hidden ? "pointer-events-none opacity-45" : ""}>{children}</div>
    </section>
  );
}

export function EditorForm({
  doc,
  onChange,
}: {
  doc: CVDocument;
  onChange: (next: CVDocument) => void;
}) {
  const { t } = useI18n();
  const p = doc.personal;
  const hidden = (key: SectionKey) => doc.hiddenSections.includes(key);
  const toggle = (key: SectionKey) => {
    const next = hidden(key)
      ? doc.hiddenSections.filter((k) => k !== key)
      : [...doc.hiddenSections, key];
    onChange({ ...doc, hiddenSections: next });
  };

  return (
    <div className="space-y-4 pb-28">
      <SectionCard title={t("personal")} section="personal">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("fullName")}>
            <Input
              value={p.fullName}
              onChange={(e) => onChange({ ...doc, personal: { ...p, fullName: e.target.value } })}
            />
          </Field>
          <Field label={t("jobTitle")}>
            <Input
              value={p.title}
              onChange={(e) => onChange({ ...doc, personal: { ...p, title: e.target.value } })}
            />
          </Field>
          <Field label={t("email")}>
            <Input
              type="email"
              value={p.email}
              onChange={(e) => onChange({ ...doc, personal: { ...p, email: e.target.value } })}
            />
          </Field>
          <Field label={t("phone")}>
            <Input
              value={p.phone}
              onChange={(e) => onChange({ ...doc, personal: { ...p, phone: e.target.value } })}
            />
          </Field>
          <Field label={t("city")}>
            <Input
              value={p.city}
              onChange={(e) => onChange({ ...doc, personal: { ...p, city: e.target.value } })}
            />
          </Field>
          <Field label={t("country")}>
            <Input
              value={p.country}
              onChange={(e) => onChange({ ...doc, personal: { ...p, country: e.target.value } })}
            />
          </Field>
          <Field label={t("address")}>
            <Input
              value={p.address}
              onChange={(e) => onChange({ ...doc, personal: { ...p, address: e.target.value } })}
            />
          </Field>
          <Field label={t("linkedin")}>
            <Input
              value={p.linkedin}
              onChange={(e) => onChange({ ...doc, personal: { ...p, linkedin: e.target.value } })}
            />
          </Field>
          <Field label={t("portfolio")}>
            <Input
              value={p.portfolio}
              onChange={(e) => onChange({ ...doc, personal: { ...p, portfolio: e.target.value } })}
            />
          </Field>
          <Field label={t("website")}>
            <Input
              value={p.website}
              onChange={(e) => onChange({ ...doc, personal: { ...p, website: e.target.value } })}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Label className="mb-2">{t("photo")}</Label>
          <PhotoField
            value={doc.photo?.dataUrl}
            onChange={(dataUrl) => onChange({ ...doc, photo: dataUrl ? { dataUrl } : undefined })}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label={t("docLanguage")}>
            <select
              className="h-11 w-full rounded-sm border border-border bg-bg-elevated px-3 text-sm"
              value={doc.language}
              onChange={(e) => onChange({ ...doc, language: e.target.value === "en" ? "en" : "id" })}
            >
              <option value="id">Indonesia</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label={t("cvName")}>
            <Input
              value={doc.name}
              onChange={(e) => onChange({ ...doc, name: e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title={t("profile")}
        section="profile"
        hidden={hidden("profile")}
        onToggle={() => toggle("profile")}
        extra={
          <AiImprove
            section="profile"
            text={doc.profile}
            onApply={(profile) => onChange({ ...doc, profile })}
          />
        }
      >
        <Textarea
          value={doc.profile}
          onChange={(e) => onChange({ ...doc, profile: e.target.value })}
          rows={5}
        />
      </SectionCard>

      <RepeatSection
        title={t("experience")}
        section="experience"
        hidden={hidden("experience")}
        onToggle={() => toggle("experience")}
        onAdd={() => onChange({ ...doc, experiences: [...doc.experiences, emptyExperience()] })}
      >
        {doc.experiences.map((item, index) => (
          <div key={item.id} className="space-y-3 rounded-md border border-border p-3">
            <div className="flex justify-end">
              <IconRemove
                onClick={() =>
                  onChange({ ...doc, experiences: doc.experiences.filter((x) => x.id !== item.id) })
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("position")}>
                <Input
                  value={item.position}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, position: e.target.value };
                    onChange({ ...doc, experiences });
                  }}
                />
              </Field>
              <Field label={t("company")}>
                <Input
                  value={item.company}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, company: e.target.value };
                    onChange({ ...doc, experiences });
                  }}
                />
              </Field>
              <Field label={t("location")}>
                <Input
                  value={item.location}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, location: e.target.value };
                    onChange({ ...doc, experiences });
                  }}
                />
              </Field>
              <Field label={t("startDate")}>
                <Input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, startDate: e.target.value };
                    onChange({ ...doc, experiences });
                  }}
                />
              </Field>
              <Field label={t("endDate")}>
                <Input
                  type="month"
                  disabled={item.current}
                  value={item.endDate}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, endDate: e.target.value };
                    onChange({ ...doc, experiences });
                  }}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(e) => {
                    const experiences = [...doc.experiences];
                    experiences[index] = { ...item, current: e.target.checked };
                    onChange({ ...doc, experiences });
                  }}
                />
                {t("current")}
              </label>
            </div>
            <Field label={t("description")}>
              <Textarea
                value={item.description}
                onChange={(e) => {
                  const experiences = [...doc.experiences];
                  experiences[index] = { ...item, description: e.target.value };
                  onChange({ ...doc, experiences });
                }}
              />
            </Field>
            <AiImprove
              section="experience"
              text={item.description}
              context={{ position: item.position, company: item.company }}
              onApply={(description) => {
                const experiences = [...doc.experiences];
                experiences[index] = { ...item, description };
                onChange({ ...doc, experiences });
              }}
            />
            <Field label={t("achievementsHint")}>
              <Textarea
                value={item.achievements.join("\n")}
                onChange={(e) => {
                  const experiences = [...doc.experiences];
                  experiences[index] = {
                    ...item,
                    achievements: e.target.value.split("\n"),
                  };
                  onChange({ ...doc, experiences });
                }}
              />
            </Field>
          </div>
        ))}
      </RepeatSection>

      <RepeatSection
        title={t("education")}
        section="education"
        hidden={hidden("education")}
        onToggle={() => toggle("education")}
        onAdd={() => onChange({ ...doc, education: [...doc.education, emptyEducation()] })}
      >
        {doc.education.map((item, index) => (
          <div key={item.id} className="space-y-3 rounded-md border border-border p-3">
            <div className="flex justify-end">
              <IconRemove
                onClick={() => onChange({ ...doc, education: doc.education.filter((x) => x.id !== item.id) })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("degree")}>
                <Input
                  value={item.degree}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, degree: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
              <Field label={t("field")}>
                <Input
                  value={item.field}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, field: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
              <Field label={t("institution")}>
                <Input
                  value={item.institution}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, institution: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
              <Field label={t("location")}>
                <Input
                  value={item.location}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, location: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
              <Field label={t("startDate")}>
                <Input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, startDate: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
              <Field label={t("endDate")}>
                <Input
                  type="month"
                  value={item.endDate}
                  onChange={(e) => {
                    const education = [...doc.education];
                    education[index] = { ...item, endDate: e.target.value };
                    onChange({ ...doc, education });
                  }}
                />
              </Field>
            </div>
            <Field label={t("description")}>
              <Textarea
                value={item.description}
                onChange={(e) => {
                  const education = [...doc.education];
                  education[index] = { ...item, description: e.target.value };
                  onChange({ ...doc, education });
                }}
              />
            </Field>
            <AiImprove
              section="education"
              text={item.description}
              context={{ institution: item.institution, field: item.field }}
              onApply={(description) => {
                const education = [...doc.education];
                education[index] = { ...item, description };
                onChange({ ...doc, education });
              }}
            />
          </div>
        ))}
      </RepeatSection>

      <RepeatSection
        title={t("skills")}
        section="skills"
        hidden={hidden("skills")}
        onToggle={() => toggle("skills")}
        onAdd={() => onChange({ ...doc, skills: [...doc.skills, emptySkill()] })}
      >
        {doc.skills.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              placeholder={t("skillName")}
              value={item.name}
              onChange={(e) => {
                const skills = [...doc.skills];
                skills[index] = { ...item, name: e.target.value };
                onChange({ ...doc, skills });
              }}
            />
            <Input
              placeholder={t("category")}
              value={item.category}
              onChange={(e) => {
                const skills = [...doc.skills];
                skills[index] = { ...item, category: e.target.value };
                onChange({ ...doc, skills });
              }}
            />
            <IconRemove onClick={() => onChange({ ...doc, skills: doc.skills.filter((x) => x.id !== item.id) })} />
          </div>
        ))}
      </RepeatSection>

      <SimpleList
        titleKey="organizations"
        hidden={hidden("organizations")}
        onToggle={() => toggle("organizations")}
        onAdd={() =>
          onChange({
            ...doc,
            organizations: [
              ...doc.organizations,
              { id: uid(), name: "", role: "", startDate: "", endDate: "", description: "" } satisfies Organization,
            ],
          })
        }
      >
        {doc.organizations.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex justify-end">
              <IconRemove
                onClick={() =>
                  onChange({ ...doc, organizations: doc.organizations.filter((x) => x.id !== item.id) })
                }
              />
            </div>
            <Input
              placeholder={t("orgName")}
              value={item.name}
              onChange={(e) => {
                const organizations = [...doc.organizations];
                organizations[index] = { ...item, name: e.target.value };
                onChange({ ...doc, organizations });
              }}
            />
            <Input
              placeholder={t("role")}
              value={item.role}
              onChange={(e) => {
                const organizations = [...doc.organizations];
                organizations[index] = { ...item, role: e.target.value };
                onChange({ ...doc, organizations });
              }}
            />
            <Textarea
              placeholder={t("description")}
              value={item.description}
              onChange={(e) => {
                const organizations = [...doc.organizations];
                organizations[index] = { ...item, description: e.target.value };
                onChange({ ...doc, organizations });
              }}
            />
          </div>
        ))}
      </SimpleList>

      <SimpleList
        titleKey="certificates"
        hidden={hidden("certificates")}
        onToggle={() => toggle("certificates")}
        onAdd={() =>
          onChange({
            ...doc,
            certificates: [
              ...doc.certificates,
              { id: uid(), name: "", issuer: "", date: "", credentialId: "", url: "" } satisfies Certificate,
            ],
          })
        }
      >
        {doc.certificates.map((item, index) => (
          <div key={item.id} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-end">
              <IconRemove
                onClick={() =>
                  onChange({ ...doc, certificates: doc.certificates.filter((x) => x.id !== item.id) })
                }
              />
            </div>
            <Input
              placeholder={t("certName")}
              value={item.name}
              onChange={(e) => {
                const certificates = [...doc.certificates];
                certificates[index] = { ...item, name: e.target.value };
                onChange({ ...doc, certificates });
              }}
            />
            <Input
              placeholder={t("issuer")}
              value={item.issuer}
              onChange={(e) => {
                const certificates = [...doc.certificates];
                certificates[index] = { ...item, issuer: e.target.value };
                onChange({ ...doc, certificates });
              }}
            />
            <Input
              type="month"
              value={item.date}
              onChange={(e) => {
                const certificates = [...doc.certificates];
                certificates[index] = { ...item, date: e.target.value };
                onChange({ ...doc, certificates });
              }}
            />
            <Input
              placeholder={t("url")}
              value={item.url}
              onChange={(e) => {
                const certificates = [...doc.certificates];
                certificates[index] = { ...item, url: e.target.value };
                onChange({ ...doc, certificates });
              }}
            />
          </div>
        ))}
      </SimpleList>

      <SimpleList
        titleKey="projects"
        hidden={hidden("projects")}
        onToggle={() => toggle("projects")}
        onAdd={() =>
          onChange({
            ...doc,
            projects: [
              ...doc.projects,
              { id: uid(), name: "", role: "", description: "", tech: "", url: "" } satisfies Project,
            ],
          })
        }
      >
        {doc.projects.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex justify-end">
              <IconRemove onClick={() => onChange({ ...doc, projects: doc.projects.filter((x) => x.id !== item.id) })} />
            </div>
            <Input
              placeholder={t("projectName")}
              value={item.name}
              onChange={(e) => {
                const projects = [...doc.projects];
                projects[index] = { ...item, name: e.target.value };
                onChange({ ...doc, projects });
              }}
            />
            <Textarea
              placeholder={t("description")}
              value={item.description}
              onChange={(e) => {
                const projects = [...doc.projects];
                projects[index] = { ...item, description: e.target.value };
                onChange({ ...doc, projects });
              }}
            />
            <AiImprove
              section="projects"
              text={item.description}
              context={{ name: item.name }}
              onApply={(description) => {
                const projects = [...doc.projects];
                projects[index] = { ...item, description };
                onChange({ ...doc, projects });
              }}
            />
            <Input
              placeholder={t("tech")}
              value={item.tech}
              onChange={(e) => {
                const projects = [...doc.projects];
                projects[index] = { ...item, tech: e.target.value };
                onChange({ ...doc, projects });
              }}
            />
          </div>
        ))}
      </SimpleList>

      <SimpleList
        titleKey="languages"
        hidden={hidden("languages")}
        onToggle={() => toggle("languages")}
        onAdd={() =>
          onChange({
            ...doc,
            languages: [
              ...doc.languages,
              { id: uid(), language: "", proficiency: "" } satisfies LanguageSkill,
            ],
          })
        }
      >
        {doc.languages.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              placeholder={t("languageName")}
              value={item.language}
              onChange={(e) => {
                const languages = [...doc.languages];
                languages[index] = { ...item, language: e.target.value };
                onChange({ ...doc, languages });
              }}
            />
            <Input
              placeholder={t("proficiency")}
              value={item.proficiency}
              onChange={(e) => {
                const languages = [...doc.languages];
                languages[index] = { ...item, proficiency: e.target.value };
                onChange({ ...doc, languages });
              }}
            />
            <IconRemove
              onClick={() => onChange({ ...doc, languages: doc.languages.filter((x) => x.id !== item.id) })}
            />
          </div>
        ))}
      </SimpleList>

      <SimpleList
        titleKey="achievements"
        hidden={hidden("achievements")}
        onToggle={() => toggle("achievements")}
        onAdd={() =>
          onChange({
            ...doc,
            achievements: [
              ...doc.achievements,
              { id: uid(), title: "", issuer: "", date: "", description: "" } satisfies Achievement,
            ],
          })
        }
      >
        {doc.achievements.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex justify-end">
              <IconRemove
                onClick={() =>
                  onChange({ ...doc, achievements: doc.achievements.filter((x) => x.id !== item.id) })
                }
              />
            </div>
            <Input
              placeholder={t("achievementTitle")}
              value={item.title}
              onChange={(e) => {
                const achievements = [...doc.achievements];
                achievements[index] = { ...item, title: e.target.value };
                onChange({ ...doc, achievements });
              }}
            />
            <Textarea
              placeholder={t("description")}
              value={item.description}
              onChange={(e) => {
                const achievements = [...doc.achievements];
                achievements[index] = { ...item, description: e.target.value };
                onChange({ ...doc, achievements });
              }}
            />
          </div>
        ))}
      </SimpleList>
    </div>
  );
}

function IconRemove({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <Button type="button" size="icon" variant="ghost" onClick={onClick} aria-label={t("remove")}>
      <Trash2 className="size-4" />
    </Button>
  );
}

function RepeatSection({
  title,
  section,
  hidden,
  onToggle,
  onAdd,
  children,
}: {
  title: string;
  section: SectionKey;
  hidden: boolean;
  onToggle: () => void;
  onAdd: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <SectionCard
      title={title}
      section={section}
      hidden={hidden}
      onToggle={onToggle}
      extra={
        <Button type="button" size="sm" variant="secondary" onClick={onAdd}>
          <Plus className="size-4" />
          {t("addItem")}
        </Button>
      }
    >
      <div className="space-y-3">{children}</div>
    </SectionCard>
  );
}

function SimpleList({
  titleKey,
  hidden,
  onToggle,
  onAdd,
  children,
}: {
  titleKey: MessageKey;
  hidden: boolean;
  onToggle: () => void;
  onAdd: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <RepeatSection
      title={t(titleKey)}
      section={titleKey as SectionKey}
      hidden={hidden}
      onToggle={onToggle}
      onAdd={onAdd}
    >
      {children}
    </RepeatSection>
  );
}
