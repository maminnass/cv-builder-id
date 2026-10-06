import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { A4_WIDTH_PX } from "./constants";
import { cvFilename } from "./filename";
import { SECTION_HEADINGS } from "./headings";
import { getTemplate } from "./templates";
import type { CVDocument, SectionKey } from "./types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function exportPdf(element: HTMLElement, fullName: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: A4_WIDTH_PX,
    windowWidth: A4_WIDTH_PX,
  });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  if (imgHeight <= pageHeight + 2) {
    const fitted = Math.min(pageHeight, imgHeight);
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, fitted);
  } else if (imgHeight < pageHeight * 1.08) {
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
  } else {
    let remaining = imgHeight;
    let offset = 0;
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, imgHeight);
    remaining -= pageHeight;
    while (remaining > 1) {
      offset -= pageHeight;
      pdf.addPage();
      pdf.addImage(img, "JPEG", 0, offset, pageWidth, imgHeight);
      remaining -= pageHeight;
    }
  }
  pdf.save(cvFilename(fullName, "pdf"));
}

function text(value: string, opts: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {}) {
  return new TextRun({
    text: value,
    bold: opts.bold,
    italics: opts.italics,
    size: opts.size ?? 21,
    font: "Calibri",
    color: opts.color ?? "1A1C1E",
  });
}

function para(
  children: TextRun[] | string,
  extra: {
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
    spacing?: { before?: number; after?: number };
    border?: {
      bottom?: { color: string; space: number; style: "single"; size: number };
    };
    indent?: { left: number };
  } = {},
) {
  return new Paragraph({
    spacing: { after: 80, ...extra.spacing },
    border: extra.border,
    heading: extra.heading,
    indent: extra.indent,
    children: typeof children === "string" ? [text(children)] : children,
  });
}

function visible(doc: CVDocument, key: SectionKey) {
  if (doc.hiddenSections.includes(key)) return false;
  switch (key) {
    case "profile":
      return Boolean(doc.profile.trim());
    case "experience":
      return doc.experiences.some((e) => e.position || e.company);
    case "education":
      return doc.education.some((e) => e.institution || e.degree);
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
    default:
      return false;
  }
}

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return null;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function exportDocx(doc: CVDocument) {
  const headings = SECTION_HEADINGS[doc.language];
  const template = getTemplate(doc.templateId);
  const children: Paragraph[] = [];
  const p = doc.personal;

  if (doc.photo?.dataUrl && template.supportsPhoto) {
    const bytes = dataUrlToBytes(doc.photo.dataUrl);
    if (bytes) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new ImageRun({
              type: "jpg",
              data: bytes,
              transformation: { width: 96, height: 96 },
            }),
          ],
        }),
      );
    }
  }

  children.push(
    para([text(p.fullName || " ", { bold: true, size: 36 })], {
      heading: HeadingLevel.TITLE,
      spacing: { after: 40 },
    }),
  );
  if (p.title) {
    children.push(para([text(p.title, { size: 24, color: "5C6570" })]));
  }

  const contact = [p.email, p.phone, [p.city, p.country].filter(Boolean).join(", "), p.linkedin, p.portfolio, p.website]
    .filter(Boolean)
    .join("  ·  ");
  if (contact) children.push(para([text(contact, { size: 18, color: "5C6570" })]));

  for (const key of template.sectionOrder) {
    if (!visible(doc, key)) continue;
    children.push(
      para([text(headings[key].toUpperCase(), { bold: true, size: 22 })], {
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: "1A1C1E", space: 1, style: "single", size: 6 } },
        spacing: { before: 200, after: 120 },
      }),
    );

    if (key === "profile") {
      children.push(para(doc.profile));
    }

    if (key === "experience") {
      for (const item of doc.experiences) {
        if (!item.position && !item.company) continue;
        const dates = [item.startDate, item.current ? (doc.language === "id" ? "Sekarang" : "Present") : item.endDate]
          .filter(Boolean)
          .join(" – ");
        children.push(
          para([
            text(item.position, { bold: true }),
            text(item.company ? `  ·  ${item.company}` : ""),
            text(dates ? `  ·  ${dates}` : "", { color: "5C6570" }),
          ]),
        );
        if (item.location) children.push(para([text(item.location, { italics: true, size: 18, color: "5C6570" })]));
        if (item.description) children.push(para(item.description));
        for (const line of item.achievements.filter(Boolean)) {
          children.push(para([text(`• ${line}`)], { indent: { left: 240 } }));
        }
      }
    }

    if (key === "education") {
      for (const item of doc.education) {
        if (!item.institution && !item.degree) continue;
        const title = [item.degree, item.field].filter(Boolean).join(" ");
        children.push(para([text(title || item.institution, { bold: true }), text(title ? `  ·  ${item.institution}` : "")]));
        const meta = [item.location, [item.startDate, item.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ");
        if (meta) children.push(para([text(meta, { size: 18, color: "5C6570" })]));
        if (item.description) children.push(para(item.description));
      }
    }

    if (key === "skills") {
      const names = doc.skills.map((s) => s.name.trim()).filter(Boolean);
      children.push(para(names.join("  ·  ")));
    }

    if (key === "organizations") {
      for (const item of doc.organizations) {
        if (!item.name) continue;
        children.push(para([text(item.name, { bold: true }), text(item.role ? `  ·  ${item.role}` : "")]));
        if (item.description) children.push(para(item.description));
      }
    }

    if (key === "certificates") {
      for (const item of doc.certificates) {
        if (!item.name) continue;
        children.push(para([text(item.name, { bold: true }), text(item.issuer ? `  ·  ${item.issuer}` : "")]));
      }
    }

    if (key === "projects") {
      for (const item of doc.projects) {
        if (!item.name) continue;
        children.push(para([text(item.name, { bold: true }), text(item.role ? `  ·  ${item.role}` : "")]));
        if (item.description) children.push(para(item.description));
        if (item.tech) children.push(para([text(item.tech, { italics: true, size: 18, color: "5C6570" })]));
      }
    }

    if (key === "languages") {
      const names = doc.languages
        .filter((l) => l.language)
        .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language));
      children.push(para(names.join("  ·  ")));
    }

    if (key === "achievements") {
      for (const item of doc.achievements) {
        if (!item.title) continue;
        children.push(para([text(item.title, { bold: true }), text(item.issuer ? `  ·  ${item.issuer}` : "")]));
        if (item.description) children.push(para(item.description));
      }
    }
  }

  const file = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: children.length ? children : [para(" ")],
      },
    ],
  });

  const blob = await Packer.toBlob(file);
  downloadBlob(blob, cvFilename(p.fullName, "docx"));
}
