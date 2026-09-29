# Panduan CMS untuk Tim CLIK

Panduan ini untuk tim yang mengisi konten website — bukan untuk developer.
Anda tidak perlu tahu apa pun soal pemrograman untuk menggunakan CMS ini.

## Apa saja yang diatur di CMS

CMS hanya berisi hal yang tim terbitkan sendiri secara rutin:

| Menu | Isi | Tim |
| --- | --- | --- |
| **Berita** | Artikel Newsroom | News Admin |
| **Laporan** | Laporan Tahunan dan Laporan Perkembangan Usaha | News Admin |
| **Produk** | Produk di halaman Credit Scoring dan Business Solution | Marketing Admin |
| **Karir** | Lowongan pekerjaan | HR Admin |
| **Data Masuk** | Kiriman formulir Hubungi Kami | Sales Admin |

Isi lain di website — teks halaman, logo, testimoni, halaman kebijakan, alamat
dan nomor telepon — **tidak** ada di CMS. Untuk mengubahnya, hubungi developer.

## Masuk ke CMS

Buka alamat website diikuti `/admin`, lalu masuk dengan email dan kata sandi
Anda.

- **Akun baru** belum bisa dipakai sampai Anda menekan **tautan verifikasi**
  yang dikirim ke email Anda.
- **Lupa kata sandi?** Tekan *Lupa kata sandi* di halaman masuk. Tautan untuk
  membuat kata sandi baru dikirim ke email Anda dan berlaku satu jam.
- Lima kali salah kata sandi akan mengunci akun selama 10 menit.

> **Selama masa uji coba (staging)** email dari CMS belum benar-benar terkirim;
> semuanya tertahan di `/mailpit/`. Jika menunggu tautan verifikasi atau reset
> kata sandi, minta Super Admin mengambilkannya.

Menu di sebelah kiri hanya menampilkan bagian yang boleh Anda kelola. Kalau
Anda tidak melihat suatu menu, itu memang bukan bagian Anda. Menu **Akun** dan
**Keluar** selalu ada di bagian bawah.

Tampilan CMS bisa dipakai dalam Bahasa Indonesia atau English; atur di menu
**Akun**.

## Halaman pertama: Dashboard

Setelah masuk, Anda melihat **analitik website** tujuh hari terakhir: jumlah
pengunjung, halaman yang paling banyak dibuka, berapa lama orang membacanya,
dan seberapa cepat halaman tampil. Setiap angka kecepatan diberi label
**Baik**, **Perlu perbaikan**, atau **Buruk** beserta targetnya.

## Alur kerja: dari simpan sampai tayang

Setiap perubahan **tidak langsung tayang**. Perubahan harus disetujui Approver
lebih dulu. Hanya ada tiga status:

| Status | Artinya | Tampil di website? |
| --- | --- | --- |
| **In Review** | Sudah Anda simpan, menunggu keputusan | Tidak |
| **Approved** | Disetujui Approver | **Ya** |
| **Rejected** | Ditolak, dengan alasan | Tidak |

1. Isi formulir, lalu tekan tombol oranye **Publikasikan perubahan**.
   Menyimpan berarti mengirim untuk ditinjau — statusnya otomatis **In
   Review**, dan Anda dibawa kembali ke daftar.
2. Selama In Review, Anda **masih bisa mengubahnya** sendiri. Orang lain tidak.
3. Approver menyetujui (**Approved**, tayang) atau menolak (**Rejected**,
   dengan alasan yang bisa Anda baca di item tersebut).
4. Jika ditolak, perbaiki lalu simpan lagi. Item kembali ke In Review.

Yang penting diketahui:

- **Mengubah konten yang sudah tayang akan menurunkannya dari website** sampai
  perubahan itu disetujui lagi. Jadi kumpulkan perbaikan sekaligus, jangan
  satu per satu.
- **Tanggal publikasi di masa depan** membuat berita atau laporan baru tampil
  pada hari itu, mulai pukul 00:00 WIB — walaupun sudah disetujui lebih awal.
- **Menghapus** langsung terjadi tanpa persetujuan, dan tercatat di log. Hati-hati.
- Setiap versi tersimpan, sampai 25 versi per item.

## Mengisi dua bahasa

Setiap kolom tulisan muncul **dua kali, berdampingan**: Bahasa Indonesia dan
English. Keduanya wajib diisi sebelum item bisa disetujui.

Isi versi Indonesia lebih dulu. Pada **Berita** dan **Laporan**, tombol
**Auto-translate** di kolom kanan mengisi kolom English yang masih kosong dari
versi Indonesia. Kolom yang sudah Anda isi tidak akan ditimpa. **Hasilnya
tetap perlu dibaca ulang** — terjemahan otomatis adalah titik awal, bukan hasil
akhir. Produk dan Karir tidak punya tombol ini.

Nama produk dan singkatan seperti CLIK, CRIF, dan OJK tidak diterjemahkan.

## Gambar

Gambar diurus langsung di kolom gambar pada Berita dan Laporan. Dari sana Anda
bisa mengunggah file baru, memilih gambar yang sudah ada lewat **Pilih dari
yang sudah ada**, mengganti gambar, atau menyunting alt text-nya. Tidak ada
menu Media tersendiri.

Setiap kolom gambar menuliskan ukuran yang disarankan, misalnya *Rasio 7:4;
min 1140x650px; maks 5MB*. File lebih dari 5 MB, terlalu sempit, atau
rasionya tidak sesuai akan ditolak dengan pesan yang menjelaskan sebabnya.

Isi selalu **alt text**: itu yang dibaca pembaca tunanetra dan yang muncul
kalau gambar gagal dimuat.

## Panduan singkat per tim

**Tim Newsroom (News Admin)** — Berita dan Laporan. Berita selalu tampil dari
yang terbaru; Featured News otomatis berisi delapan berita terbaru. Panduan
lengkap: `editor-guide-newsroom.md`.

**Tim HR (HR Admin)** — Lowongan di menu Karir. Hanya lowongan yang dicentang
*Lowongan masih dibuka* yang tampil. Tombol Lamar membuka halaman JobStreet
CLIK. Panduan lengkap: `editor-guide-careers.md`.

**Tim Marketing (Marketing Admin)** — Produk. Status produk boleh dipilih
paling banyak dua. Panduan lengkap: `editor-guide-marketing.md`.

**Tim Sales (Sales Admin)** — Data Masuk dari formulir Hubungi Kami. Setiap
kiriman masuk berstatus **Baru**. Ubah menjadi **Ditindaklanjuti** setelah Anda
menghubungi pengirimnya; nama Anda dan waktunya tercatat otomatis. Mengembalikan
status ke Baru akan menghapus catatan itu. Isi kiriman tidak bisa diubah atau
dihapus oleh siapa pun.

## Untuk Approver

Buka daftar mana pun, lalu saring **Approval Status = In Review** untuk melihat
apa yang menunggu.

Buka itemnya. Versi Indonesia dan Inggris ada berdampingan di halaman yang
sama. Lalu tekan salah satu:

- **Setujui & tayangkan** — item tayang di website.
- **Tolak** — tulis **Alasan penolakan**, lalu kirim. Penolakan tidak bisa
  dikirim tanpa alasan. Tulis dengan jelas supaya editor tahu apa yang perlu
  diperbaiki.

Approver tidak bisa mengubah isi konten — itu memang disengaja. Tugas Approver
adalah memutuskan, bukan menulis ulang. Item tidak bisa disetujui kalau salah
satu bahasa belum lengkap; sistem menyebutkan bagian mana yang kurang.

## Kalau ada yang tidak beres

| Pesan | Artinya |
| --- | --- |
| *This item is locked while it is in review* | Item sedang ditinjau dan dikirim oleh orang lain. Tunggu keputusannya. |
| *Only the Approver can approve or reject* | Anda mencoba menyetujui pekerjaan sendiri. Minta Approver memutuskan. |
| *Belum bisa disetujui — …* | Salah satu bahasa belum lengkap. Lengkapi dulu. |
| *Beri judul Bahasa Indonesia lebih dulu* | Judul Indonesia wajib diisi sebelum menyimpan. |
| *Maksimal pilih 2* | Status produk dipilih lebih dari dua. |
| *Ukuran … tidak sesuai* / *Lebar …px, minimal …* | Gambar tidak memenuhi ukuran kolom itu. |

Kalau menu yang Anda cari tidak ada, kemungkinan besar itu bukan bagian tim
Anda. Hubungi Super Admin kalau memang seharusnya ada.
