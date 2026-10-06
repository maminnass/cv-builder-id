import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  const { t, lang } = useI18n();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl text-navy">{t("termsTitle")}</h1>
        {lang === "id" ? (
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>Layanan ini disediakan apa adanya untuk membantu Anda menyusun CV. Anda bertanggung jawab atas keakuratan data yang dimasukkan.</p>
            <p>Output PDF/DOCX gratis dan tanpa watermark. Hak cipta MAMINNASS hanya tampil di situs, bukan di file unduhan.</p>
            <p>Asisten AI memperbaiki teks yang sudah Anda tulis. Jangan mengandalkannya untuk mengarang riwayat kerja.</p>
            <p>Donasi bersifat sukarela dan tidak mengunci unduhan.</p>
            <p>Template adalah desain original CV Builder ID. Dilarang menyalin aset berlisensi pihak ketiga ke dalam dokumen.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>The service is provided as-is to help you assemble a CV. You are responsible for the accuracy of the information you enter.</p>
            <p>PDF/DOCX downloads are free and watermark-free. MAMINNASS copyright appears only on the website, not in exported files.</p>
            <p>The AI assistant improves text you already wrote. Do not rely on it to invent work history.</p>
            <p>Donations are optional and never gate downloads.</p>
            <p>Templates are original CV Builder ID designs. Do not paste third-party licensed artwork into documents.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
