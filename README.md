# DapurKurs: Purwarupa

Purwarupa web untuk essay "Tempe Makin Tipis Saat Rupiah Melemah" (Milad dan Olimpiade Pendidikan Ekonomi ke-20, 2026). Semua nama, harga, dan jumlah di dalamnya adalah data simulasi.

## Isi folder

- `index.html`: demo interaktif. Kiri berisi 10 langkah satu siklus belanja kedelai, kanan tampilan ponsel. Tombol di dalam layar bisa diklik, kalkulator bisa diisi angka sendiri.
- `storyboard.html`: semua layar sekaligus. Pakai `?set=esai` (6 layar untuk badan essay), `?set=lampiran` (8 layar untuk lampiran), atau `?set=semua`.
- `layar.html?id=chat`: satu layar penuh ukuran ponsel, untuk screenshot. Pilihan id: chat, hpp, pesan, rekap, penawaran, kontrak, siap, kartu, tabungan, wilayah.
- `screenshot/`: screenshot siap pakai.
  - `Gambar5_urutan_6_layar_badan_essay.png` untuk Gambar 5 di badan essay.
  - `Lampiran_3-12_8_layar.png` untuk Lampiran 3.12.
  - `01-chat.png` sampai `10-wilayah.png`: tiap layar terpisah.

## Cara membuka

Klik dua kali `index.html`. Tidak perlu internet dan tidak perlu instalasi.

## Cara online (agar dapat tautan untuk essay)

Pilih salah satu:

1. **Vercel**: buka vercel.com, masuk, pilih Add New lalu Project, lalu seret folder ini (sesudah diekstrak). Tidak perlu pengaturan build.
2. **Netlify Drop**: buka app.netlify.com/drop lalu seret folder ini.

Tautan yang didapat ditempel ke bagian [TAUTAN PURWARUPA] di bawah Gambar 5 essay.

## Urutan layar

1. Sinyal radar masuk lewat WhatsApp (perajin)
2. Hitung dampak ke harga pokok (perajin)
3. Pesan Beli Bareng dan kunci harga (perajin)
4. Rekap pesanan (pengurus Kopti)
5. Bandingkan penawaran distributor (pengurus Kopti)
6. Kontrak salam digital (pengurus Kopti)
7. Kedelai siap diambil (perajin)
8. Kartu Harga untuk pembeli (perajin)
9. Riwayat dan Tabungan Kedelai (perajin)
10. Dasbor wilayah (Gakoptindo dan pemerintah)
