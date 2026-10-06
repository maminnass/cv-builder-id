import { uid } from "@/lib/utils";
import type { CVDocument } from "./types";

export const SAMPLE_CV: CVDocument = {
  id: "sample",
  name: "Sample",
  type: "ats",
  templateId: "ats-01",
  language: "id",
  personal: {
    fullName: "Siti Rahmawati",
    title: "Digital Marketing Specialist",
    email: "siti.rahma@email.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Melati No. 12",
    city: "Jakarta",
    country: "Indonesia",
    linkedin: "linkedin.com/in/sitirahma",
    portfolio: "sitirahma.id",
    website: "",
  },
  profile:
    "Spesialis pemasaran digital dengan 4 tahun pengalaman mengelola kampanye media sosial, konten, dan analitik untuk merek konsumen. Fokus pada pertumbuhan organik, pesan yang jelas, dan hasil yang terukur.",
  experiences: [
    {
      id: uid(),
      position: "Digital Marketing Specialist",
      company: "Nusantara Media",
      location: "Jakarta",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "Mengelola kalender konten, iklan berbayar, dan laporan performa untuk tiga merek konsumen.",
      achievements: [
        "Menaikkan jangkauan organik Instagram sebesar 48% dalam 12 bulan",
        "Menyusun funnels kampanye yang menurunkan biaya per lead sebesar 18%",
      ],
    },
    {
      id: uid(),
      position: "Content Associate",
      company: "Pijar Kreatif",
      location: "Bandung",
      startDate: "2020-01",
      endDate: "2022-02",
      current: false,
      description:
        "Menulis copy kampanye, merancang brief visual, dan berkoordinasi dengan desainer serta klien UKM.",
      achievements: [],
    },
  ],
  education: [
    {
      id: uid(),
      degree: "S1",
      field: "Ilmu Komunikasi",
      institution: "Universitas Indonesia",
      location: "Depok",
      startDate: "2016-08",
      endDate: "2020-07",
      description: "IPK 3.64. Fokus komunikasi pemasaran dan riset khalayak.",
    },
  ],
  skills: [
    { id: uid(), name: "Content Strategy", category: "Marketing" },
    { id: uid(), name: "Google Ads", category: "Paid" },
    { id: uid(), name: "Meta Ads", category: "Paid" },
    { id: uid(), name: "SEO", category: "Organic" },
    { id: uid(), name: "Copywriting", category: "Writing" },
    { id: uid(), name: "Looker Studio", category: "Analytics" },
  ],
  organizations: [
    {
      id: uid(),
      name: "Himpunan Mahasiswa Komunikasi",
      role: "Kepala Divisi Media",
      startDate: "2018-01",
      endDate: "2019-12",
      description: "Mengelola kanal media kampus dan tim konten 8 orang.",
    },
  ],
  certificates: [
    {
      id: uid(),
      name: "Google Digital Garage",
      issuer: "Google",
      date: "2023-04",
      credentialId: "",
      url: "",
    },
  ],
  projects: [
    {
      id: uid(),
      name: "Rebrand Kampanye Ramadan",
      role: "Lead Content",
      description:
        "Menyusun narasi kampanye 30 hari dan aset sosial untuk peluncuran produk FMCG.",
      tech: "Meta Ads, Canva, GA4",
      url: "",
    },
  ],
  languages: [
    { id: uid(), language: "Indonesia", proficiency: "Native" },
    { id: uid(), language: "English", proficiency: "Professional" },
  ],
  achievements: [
    {
      id: uid(),
      title: "Best Campaign Quarter 3",
      issuer: "Nusantara Media",
      date: "2024-10",
      description: "Penghargaan internal untuk kampanye dengan ROI tertinggi.",
    },
  ],
  hiddenSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function previewCV(templateId: CVDocument["templateId"]): CVDocument {
  return {
    ...SAMPLE_CV,
    id: `preview-${templateId}`,
    templateId,
    type: templateId.startsWith("cr") ? "creative" : "ats",
  };
}
