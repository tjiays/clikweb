# Panduan Newsroom — untuk News Admin

Anda mengelola **Newsroom** dan **Laporan**. Panduan ini ditulis untuk
penggunaan sehari-hari, bukan untuk developer.

## Menulis artikel

**Newsroom → Artikel → Create new**

Formulirnya terbagi menjadi dua tab, dengan kolom-kolom pendek di sebelah
kanan. Yang perlu Anda tulis ada di tab pertama.

### Tab **Tulisan**

| Kolom | Isi |
| --- | --- |
| Judul | Judul berita |
| Ringkasan | 1–2 kalimat. Muncul di kartu berita, bukan di halaman detail. |
| Isi artikel | Naskah lengkap, ditulis dalam satu editor. Lihat "Editor" di bawah. |

### Tab **Pengaturan**

| Kolom | Isi |
| --- | --- |
| Gambar sampul | Muncul di kartu, dan di bagian atas halaman detail bila Gambar banner kosong. |
| Gambar banner (halaman detail) | Opsional. Gambar lebar 1300x372 di atas halaman detail. |
| Anda mungkin juga tertarik dengan | Pilih sampai 3 artikel terkait. Kosong: artikel terbaru. |
| SEO | Judul dan deskripsi untuk mesin pencari. Kosongkan jika ragu. |

### Kolom kanan

| Kolom | Isi |
| --- | --- |
| Penulis | Nama penulis, ditulis bebas. |
| Slug | Terisi otomatis dari judul. Ini yang muncul di alamat halaman. |
| Tanggal publikasi | Menentukan urutan. Yang terbaru tampil lebih dulu; di hari yang sama, jam yang lebih akhir tampil lebih dulu. |
| Featured News | Centang agar muncul di daftar Featured News pada sidebar Newsroom. |
| Posisi di Featured News | Nomor urut di daftar Featured News (1 = paling atas). Boleh lebih dari satu nomor. Kosong: tampil setelah yang bernomor. |
| Sembunyikan dari daftar | Artikel tidak muncul di kartu Newsroom, Home, dan "Anda mungkin juga tertarik dengan", tetapi halamannya dan tautan Featured News tetap berfungsi. |

Setelah selesai, ubah **Approval Status** menjadi **In Review** lalu simpan.
Artikel akan tayang setelah Approver menyetujui.

## Editor

Artikel dan laporan ditulis di satu editor. Toolbar-nya selalu terlihat di
atas kotak tulisan — tidak perlu menyorot teks lebih dulu — dan tetap
menempel di atas saat Anda menggulir naskah yang panjang.

Yang tersedia di toolbar:

| Tombol | Kegunaan |
| --- | --- |
| Paragraph / Heading | Ubah baris menjadi judul bagian (H2, H3, H4) atau kembali ke paragraf biasa. |
| **B** *I* U | Tebal, miring, garis bawah, coret. |
| Daftar | Daftar berpoin, daftar bernomor, dan daftar centang. |
| Perataan | Rata kiri, tengah, kanan, atau kiri-kanan. |
| Indent | Menjorokkan paragraf ke dalam. |
| Tautan | Menautkan teks ke alamat web, atau ke artikel dan laporan lain di CMS ini. |
| Kutipan | Blok kutipan dengan garis oranye di kiri. |
| Garis pemisah | Garis horizontal antar bagian. |
| Gambar | Menyisipkan gambar dari Media di tengah naskah. Anda bisa mengisi **Keterangan gambar** yang tampil di bawahnya. |
| Tabel | Membuat tabel. Tentukan jumlah baris dan kolom, lalu ketik isinya. |

Beberapa catatan:

- **Paragraf** tampil rapat; tekan Enter untuk paragraf baru, dan biarkan satu
  baris kosong bila ingin jarak tambahan.
- **Gambar** disisipkan pada posisi kursor, jadi letakkan kursor di antara dua
  paragraf lebih dulu. Gambar yang lebih lebar dari kolom akan dikecilkan
  otomatis.
- **Tabel** yang lebar bisa digeser ke samping di layar kecil, jadi tabel
  keuangan tetap terbaca di ponsel.
- File yang bukan gambar (misalnya PDF) tampil sebagai tautan unduhan.
- Gunakan **Preview** untuk melihat hasilnya di website sebelum mengirim untuk
  review.

## Melihat hasilnya (Live Preview)

Di layar artikel ada tombol **Live Preview**. Menekannya membelah layar: form
di kiri, dan **halaman website yang sesungguhnya** di kanan — bukan tiruan,
melainkan halaman yang sama persis dengan yang akan dilihat pembaca.

- Setelah Anda **Save**, panel kanan ikut diperbarui.
- Di atas panel ada pilihan ukuran layar: **Desktop**, **Tablet**, dan
  **Ponsel**. Gunakan Ponsel untuk memastikan tabel dan gambar tetap rapi di
  layar kecil.
- Panel menampilkan versi **draft**, jadi Anda bisa memeriksa artikel yang
  belum disetujui sekalipun.
- Ganti bahasa lewat pemilih bahasa di atas; panel ikut berpindah ke halaman
  Bahasa Inggris.

Live Preview baru muncul setelah artikel punya **Slug** — jadi simpan sekali
lebih dulu untuk artikel yang benar-benar baru.

Tombol **Preview** yang lama tetap ada bila Anda ingin membuka halamannya di
tab baru, lebar penuh.

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

Formulirnya sama seperti artikel: tulis di tab **Tulisan** dengan editor yang
sama, dan gambar sampul ada di tab **Pengaturan**.

Tab **Tabel keuangan (cara lama)** dipakai oleh laporan yang sudah ada sebelum
editor punya tombol tabel sendiri. Laporan itu tetap tampil seperti biasa dan
tidak perlu diubah. Untuk laporan baru, buat tabelnya langsung di editor pada
tab **Tulisan** — di sana tabel berada tepat di antara teks yang menjelaskannya.

## Hal yang sering ditanyakan

**Artikel saya tidak muncul di website.** Periksa Approval Status. Artikel baru
tayang setelah statusnya **Approved**.

**Saya tidak bisa mengubah artikel.** Kalau statusnya **In Review**, artikel
dikunci sampai Approver memutuskan.

**Berapa artikel per halaman?** Enam. Halaman berikutnya otomatis muncul.
