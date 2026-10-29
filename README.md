# Notes App

Aplikasi catatan yang terintegrasi dengan [Dicoding Notes API v2](https://notes-api.dicoding.dev/v2). Dibangun dengan HTML, CSS, JavaScript, Web Component, dan webpack.

## Fitur

- Menampilkan catatan aktif dan catatan yang diarsipkan.
- Menambah catatan baru dengan validasi judul dan isi secara realtime.
- Mengarsipkan dan membatalkan arsip catatan.
- Menghapus catatan dengan dialog konfirmasi.
- Indikator loading pada setiap request HTTP.
- Notifikasi sukses dan pesan error ketika request gagal.
- Animasi halus pada kartu catatan, dialog, dan notifikasi.

## Menjalankan Proyek

```bash
npm install
npm run start-dev
```

Aplikasi berjalan di `http://localhost:3000`.

## Build Production

```bash
npm run build
```

Hasil build tersedia di direktori `dist`.

## Format Kode

```bash
npm run format
```

Konfigurasi Prettier ada di `.prettierrc`.

## Struktur Proyek

```text
src/
├── components/       # Web Component: app-bar, note-form, note-list, note-item, dll.
├── data/             # Modul komunikasi dengan RESTful API memakai Fetch API
├── index.html        # Template HTML untuk html-webpack-plugin
├── main.js           # Entry point aplikasi
└── styles.css        # Seluruh gaya dan animasi
```
