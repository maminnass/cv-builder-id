import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  const { t, lang } = useI18n();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl text-navy">{t("privacyTitle")}</h1>
        {lang === "id" ? (
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>CV Builder ID tidak meminta akun. CV disimpan di browser Anda (IndexedDB), bukan di server profil.</p>
            <p>Teks yang Anda kirim ke asisten AI hanya mencakup field yang Anda pilih untuk diperbaiki. Kunci API tidak pernah dikirim ke browser.</p>
            <p>Kami tidak memakai analitik yang mengirim isi CV. Menghapus data situs pada browser juga menghapus CV lokal.</p>
            <p>Foto diproses di perangkat Anda dan disimpan secara lokal. Batas ukuran 5 MB.</p>
            <p>Jika Anda mendukung proyek lewat Saweria, transaksi ditangani oleh Saweria sesuai kebijakan mereka.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>CV Builder ID does not require an account. CVs live in your browser (IndexedDB), not in a server-side profile.</p>
            <p>Text sent to the AI assistant is limited to the field you chose to improve. API keys never ship to the browser.</p>
            <p>Analytics never include CV contents. Clearing site data also deletes local CVs.</p>
            <p>Photos are processed on-device and stored locally, with a 5 MB limit.</p>
            <p>Optional Saweria donations are handled by Saweria under their own policies.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
