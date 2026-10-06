# CV Builder ID

Buat CV profesional tanpa ribet. Pilih jenis ATS atau Kreatif, pilih salah satu dari 10 template original, isi data sambil melihat live preview A4, perbaiki teks dengan AI, lalu unduh PDF atau DOCX — tanpa login.

**Repo:** [github.com/maminnass/cv-builder-id](https://github.com/maminnass/cv-builder-id)

## Fitur

- 5 template ATS + 5 template Kreatif, bisa diganti tanpa mengetik ulang
- Editor + live preview A4 (desktop berdampingan, mobile tab EDIT / PREVIEW)
- Penyimpanan lokal di browser (IndexedDB), banyak CV lewat CV Switcher
- Foto opsional dengan crop sederhana (JPG/PNG/WebP, maks. 5 MB)
- Asisten AI untuk merapikan teks yang sudah ditulis — tidak mengarang fakta
- Pratinjau akhir wajib sebelum unduh
- Download PDF dan DOCX gratis, tanpa watermark
- Donasi Saweria bersifat sukarela
- UI Indonesia / English (bahasa tampilan terpisah dari bahasa dokumen)

## Alur

Landing → pilih ATS/Kreatif → pilih template → editor → pratinjau akhir → unduh PDF/DOCX → opsi Saweria

## Stack

- TanStack Start + React + TypeScript
- Tailwind CSS
- Dexie (IndexedDB)
- Asisten AI lewat server (`XAI_API_KEY`)
- PDF: html2canvas + jsPDF
- DOCX: library `docx`

## Menjalankan lokal

```bash
npm install
npm run dev
```

Aplikasi berjalan di port yang dikonfigurasi proyek (preview memakai `8080`).

Untuk asisten AI, set environment `XAI_API_KEY` di server. Tanpa kunci itu, tombol AI menampilkan pesan ramah dan teks asli tetap aman.

Data CV **tidak** dikirim ke cloud. Menghapus data browser juga menghapus CV.

## Privasi

Hak cipta MAMINNASS hanya tampil di footer situs, tidak masuk ke file PDF/DOCX.

Saweria: [saweria.co/Mamenss](https://saweria.co/Mamenss)

© 2026 MAMINNASS — CV Builder ID
