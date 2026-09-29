# Panduan Newsroom — untuk News Admin

Anda mengelola **Berita** dan **Laporan**. Panduan ini ditulis untuk
penggunaan sehari-hari, bukan untuk developer.

## Menulis berita

**Berita → Create new**

Semua kolom ada di **satu halaman**. Setiap tulisan muncul dua kali,
berdampingan: kiri Bahasa Indonesia, kanan English.

| Kolom | Isi |
| --- | --- |
| Gambar sampul | Muncul di kartu berita, dan di atas halaman berita bila Gambar banner kosong. Disarankan 1140x650px (rasio 7:4). |
| Gambar banner (halaman detail) | Opsional. Gambar lebar di atas halaman berita. Disarankan 1300x372px (rasio 3,5:1). |
| Judul / Title | Wajib, dua bahasa |
| Ringkasan / Summary | 1–2 kalimat. Muncul di kartu berita, bukan di halaman berita. |
| Isi artikel / Article body | Naskah lengkap. Lihat "Editor" di bawah. |
| Anda mungkin juga tertarik dengan | Pilih sampai 3 berita terkait. Kosong: berita terbaru. |
| SEO | Judul dan deskripsi untuk mesin pencari. Kosongkan jika ragu. |

### Kolom kanan

| Kolom | Isi |
| --- | --- |
| Penulis | Terisi otomatis dengan nama Anda. Ubah bila perlu. |
| Tanggal publikasi | Terisi otomatis hari ini. Berita tampil dari yang terbaru. Tanggal di masa depan menahan berita sampai hari itu, pukul 00:00 WIB. |
| Auto-translate | Mengisi kolom English yang masih kosong. Lihat "Dua bahasa". |
| Kelengkapan bahasa | Menunjukkan bagian mana yang belum lengkap di salah satu bahasa. |
| Status | Hanya dibaca. Berubah sendiri saat Anda menyimpan. |

Alamat halaman (slug) dibuat otomatis dari judul Indonesia, jadi tidak perlu
diisi.

Tidak ada lagi kotak *Featured News* atau *Sembunyikan dari daftar*. Berita
selalu tampil dari yang terbaru, dan **Featured News otomatis berisi delapan
berita terbaru**.

Setelah selesai, tekan tombol oranye **Publikasikan perubahan**. Berita
langsung dikirim untuk ditinjau (**In Review**) dan Anda dibawa kembali ke
daftar. Berita tayang setelah Approver menyetujui.

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
- Gunakan **Live Preview** untuk melihat hasilnya di website sebelum
  Approver memutuskan.

## Melihat hasilnya (Live Preview)

Di layar berita ada tombol **Live Preview**. Menekannya membelah layar: form
di kiri, dan **halaman website yang sesungguhnya** di kanan — bukan tiruan,
melainkan halaman yang sama persis dengan yang akan dilihat pembaca.

- Setelah Anda menyimpan, panel kanan ikut diperbarui.
- Di atas panel ada pilihan ukuran layar: **Desktop**, **Tablet**, dan
  **Ponsel**. Gunakan Ponsel untuk memastikan tabel dan gambar tetap rapi di
  layar kecil.
- Panel menampilkan versi yang **belum disetujui**, jadi Anda bisa memeriksanya
  sebelum Approver memutuskan.
- Panel menampilkan halaman **Bahasa Indonesia**. Versi Inggris diperiksa
  langsung di kolom-kolom English pada formulir; pratinjau halaman Inggris
  belum tersedia dari formulir.

Tombol **Preview** membuka halaman yang sama di tab baru, lebar penuh.

## Dua bahasa

Isi versi Bahasa Indonesia lebih dulu. Lalu tekan **Auto-translate** di kolom
kanan: kolom English yang masih kosong terisi dari versi Indonesia. Kolom yang
sudah Anda isi tidak akan ditimpa. **Baca ulang hasilnya** sebelum menyimpan.

Berita tidak bisa disetujui selama salah satu bahasa belum lengkap. Kotak
**Kelengkapan bahasa** menunjukkan bagian mana yang kurang.

Nama produk dan singkatan seperti CLIK, CRIF, dan OJK tidak diterjemahkan.

## Liputan Media

Daftar media, tombol **Daftar Media**, strip logo di atas Newsroom, dan
liputan tiap media tidak diatur di CMS. Semuanya ada di kode
(`src/content/newsroom.ts`) dan diubah oleh developer. Liputan tiap media
adalah artikel Newsroom yang dipilih berdasarkan slug.

## Laporan

**Laporan → Create new**

Formulirnya sama seperti berita: satu halaman, dua bahasa berdampingan, dan
editor yang sama.

| Kolom | Isi |
| --- | --- |
| Gambar sampul | Laporan Tahunan: disarankan 2000x1333px. Laporan Perkembangan Usaha: disarankan 1200x800px. Keduanya rasio 3:2. |
| Judul / Title | Wajib, dua bahasa |
| Ringkasan / Summary | 1–2 kalimat di kartu laporan |
| Isi laporan / Report body | Wajib, dua bahasa. Buat tabel keuangan langsung di editor, di antara teks yang menjelaskannya. |
| Jenis laporan *(kanan)* | Laporan Tahunan atau Laporan Perkembangan Usaha |
| Penulis, Tanggal publikasi *(kanan)* | Terisi otomatis; tanggal boleh dikosongkan |
| Urutan *(kanan)* | Biarkan 0 agar terbaru di atas. Angka lebih kecil menyematkan laporan ke atas. |

Tabel keuangan dari laporan lama sudah dipindahkan ke dalam editor, dengan
angka yang sama persis.

## Hal yang sering ditanyakan

**Berita saya tidak muncul di website.** Periksa statusnya: tayang hanya
setelah **Approved**. Periksa juga **Tanggal publikasi** — kalau di masa depan,
berita baru tampil pada hari itu.

**Berita saya hilang dari website setelah saya mengubahnya.** Itu disengaja.
Setiap perubahan pada berita yang sudah tayang harus disetujui lagi, dan
selama menunggu, berita turun dari website. Kumpulkan perbaikan sekaligus.

**Saya tidak bisa mengubah berita.** Kalau statusnya **In Review** dan bukan
Anda yang mengirimnya, berita itu dikunci sampai Approver memutuskan.

**Bagaimana menaruh berita di Featured News?** Tidak perlu: Featured News
selalu berisi delapan berita terbaru.

**Berapa berita per halaman?** Enam. Halaman berikutnya otomatis muncul.
