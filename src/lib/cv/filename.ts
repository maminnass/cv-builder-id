export function cvFilename(fullName: string, ext: "pdf" | "docx") {
  const cleaned = (fullName || "CV")
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return `${cleaned || "CV"}.${ext}`;
}
