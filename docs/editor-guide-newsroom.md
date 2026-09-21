# Panduan Newsroom — untuk News Admin

Anda mengelola **Newsroom** dan **Laporan**. Panduan ini ditulis untuk
penggunaan sehari-hari, bukan untuk developer.

## Menulis artikel

**Newsroom → Artikel → Create new**

| Kolom | Isi |
| --- | --- |
| Judul | Judul berita |
| Slug | Terisi otomatis dari judul. Ini yang muncul di alamat halaman. |
| Ringkasan | 1–2 kalimat. Muncul di kartu berita, bukan di halaman detail. |
| Isi artikel | Naskah lengkap. Bisa berisi gambar, tabel, dan tautan. Paragraf tampil rapat; beri satu baris kosong untuk memberi jarak. |
| Gambar sampul | Muncul di kartu, dan di bagian atas halaman detail bila Gambar banner kosong. |
| Gambar banner (halaman detail) | Opsional. Gambar lebar 1300x372 di atas halaman detail. |
| Penulis | Nama penulis, ditulis bebas. |
| Tanggal publikasi | Menentukan urutan. Yang terbaru tampil lebih dulu; di hari yang sama, jam yang lebih akhir tampil lebih dulu. |
| Featured News | Centang agar muncul di daftar Featured News pada sidebar Newsroom. |
| Posisi di Featured News | Nomor urut di daftar Featured News (1 = paling atas). Boleh lebih dari satu nomor. Kosong: tampil setelah yang bernomor. |
| Sembunyikan dari daftar | Artikel tidak muncul di kartu Newsroom, Home, dan "Anda mungkin juga tertarik dengan", tetapi halamannya dan tautan Featured News tetap berfungsi. |
| Anda mungkin juga tertarik dengan | Pilih sampai 3 artikel terkait. Kosong: artikel terbaru. |
| SEO | Judul dan deskripsi untuk mesin pencari. Kosongkan jika ragu. |

Setelah selesai, ubah **Approval Status** menjadi **In Review** lalu simpan.
Artikel akan tayang setelah Approver menyetujui.

## Dua bahasa

Isi versi Bahasa Indonesia lebih dulu. Lalu tekan **Auto-translate to English**
di kolom kanan, pindah ke bahasa English lewat pemilih bahasa di atas, dan
periksa hasilnya sebelum mengirim untuk review.

Nama produk dan singkatan seperti CLIK, CRIF, dan OJK tidak diterjemahkan.

## Liputan Media

Daftar media, tombol **Daftar Media**, strip logo di atas Newsroom, dan
liputan tiap media tidak diatur di CMS. Semuanya ada di kode
(`src/content/newsroom.ts`) dan diubah oleh developer. Liputan tiap media
adalah artikel Newsroom yang dipilih berdasarkan slug.

## Laporan

**Modul: Laporan → Daftar Laporan**

Pilih **Type**: *Laporan Tahunan* atau *Laporan Perkembangan Usaha*. Laporan
Tahunan menggunakan gambar sampul; Laporan Perkembangan Usaha tidak.

Isi laporan mendukung gambar dan tabel, termasuk tabel laporan keuangan. Tabel
yang lebar akan bisa digeser ke samping pada layar kecil.

## Hal yang sering ditanyakan

**Artikel saya tidak muncul di website.** Periksa Approval Status. Artikel baru
tayang setelah statusnya **Approved**.

**Saya tidak bisa mengubah artikel.** Kalau statusnya **In Review**, artikel
dikunci sampai Approver memutuskan.

**Berapa artikel per halaman?** Enam. Halaman berikutnya otomatis muncul.
