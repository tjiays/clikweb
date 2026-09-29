# Panduan Karir — untuk HR Admin

Anda mengelola **lowongan pekerjaan** di menu **Karir**. Bagian lain halaman
Karir — hero dan foto, Nilai-Nilai Kami, Benefits, Proses Rekrutmen — ada di
kode, bukan di CMS. Untuk mengubahnya, hubungi developer.

## Memasang lowongan

**Karir → Create new**

Semua kolom ada di satu halaman. Setiap tulisan muncul dua kali, berdampingan:
Bahasa Indonesia dan English. Keduanya wajib diisi sebelum lowongan bisa
disetujui.

| Kolom | Isi |
| --- | --- |
| Nama posisi / Position | Judul lowongan, dua bahasa |
| Kategori | IT, Analytics, Sales / Business Development, Operations, atau Finance |
| Tanggung jawab / Key Responsibilities | Tanggung jawab utama |
| Persyaratan / Minimum Qualifications | Kualifikasi minimum |
| Tautan lamaran (JobStreet) | Alamat yang dibuka tombol **Lamar**. Kosongkan untuk memakai halaman JobStreet CLIK. |

### Kolom kanan

| Kolom | Isi |
| --- | --- |
| Lowongan masih dibuka | **Hanya lowongan yang dicentang yang tampil di website.** |
| Urutan | Biarkan 0 agar lowongan terbaru di atas. Angka lebih kecil menyematkan ke atas. |
| Status | Hanya dibaca. Berubah sendiri saat Anda menyimpan. |

Alamat halaman detail (slug) dibuat otomatis dari nama posisi.

Setelah selesai, tekan tombol oranye **Publikasikan perubahan**. Lowongan
dikirim untuk ditinjau (**In Review**) dan tayang setelah Approver menyetujui.

Karir tidak punya tombol Auto-translate; isi versi English sendiri.

## Menutup lowongan

Hilangkan centang **Lowongan masih dibuka**, lalu simpan. Setelah disetujui,
lowongan hilang dari daftar tanpa perlu dihapus, dan riwayatnya tetap
tersimpan.

Ingat: selama perubahan itu menunggu persetujuan, lowongan turun dari website.

## Tombol Lamar

Tombol **Lamar** membuka **halaman JobStreet CLIK** di tab baru:

`https://id.jobstreet.com/id/companies/crif-lembaga-informasi-keuangan-168557222859016/jobs`

Lamaran masuk lewat JobStreet, bukan lewat website. Jika sebuah posisi punya
iklan sendiri di JobStreet, tempel alamat iklan itu di **Tautan lamaran** agar
pelamar langsung sampai ke posisi yang tepat.

Catatan di bawah daftar lowongan ("Tidak menemukan posisi yang sesuai?") masih
mengarah ke **talent@cbclik.com** untuk kiriman CV umum.

> Halaman detail lowongan masih ditutup dengan catatan "Email to:
> talent@cbclik.com — Please mention on Subject E-mail: …". Catatan ini ada di
> kode dan belum disesuaikan dengan tombol Lamar yang sekarang ke JobStreet.
> Beri tahu developer bila catatan itu perlu diubah atau dihapus.
