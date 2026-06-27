-- ==========================================================
-- SMART INFORMAX - DATABASE CONFIGURATION
-- Untuk diimpor ke MySQL melalui phpMyAdmin
-- ==========================================================

-- 1. Membuat Database Baru (Bisa lewat menu phpMyAdmin atau jalankan query ini)
CREATE DATABASE IF NOT EXISTS `smart_informax_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_informax_db`;

-- ==========================================================
-- TABEL 1: users (Penyimpanan akun siswa & admin)
-- ==========================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `nis` VARCHAR(50) NOT NULL,
  `sekolah` VARCHAR(255) NOT NULL,
  `jurusan` VARCHAR(255) NOT NULL DEFAULT 'Teknik Komputer dan Jaringan (TKJ)',
  `kelas` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user', -- 'user' biasa / siswa PKL, 'admin' guru/pembimbing
  `pembimbing` VARCHAR(255) DEFAULT 'Pak Ahmad Sanusi, S.Pd, M.T.',
  `tempat_pkl` VARCHAR(255) DEFAULT 'PT Telekomunikasi Indonesia Tbk',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- TABEL 2: jurnals (Penyimpanan jurnal harian magang siswa)
-- ==========================================================
CREATE TABLE IF NOT EXISTS `jurnals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `isi` TEXT NOT NULL,
  `tanggal` VARCHAR(100) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- TABEL 3: videos (Penyimpanan link video pembelajaran & langkah praktikum)
-- ==========================================================
CREATE TABLE IF NOT EXISTS `videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `video_url` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `difficulty` VARCHAR(50) NOT NULL DEFAULT 'Sedang',
  `duration` VARCHAR(50) NOT NULL DEFAULT '10:00',
  `description` TEXT NOT NULL,
  `steps` TEXT NOT NULL, -- Format teks baris-per-baris dipisahkan baris baru (\n)
  `views` VARCHAR(50) DEFAULT '0 views',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- SEED DATA AWAL (Pengisian Akun Contoh secara Otomatis)
-- ==========================================================

-- Masukkan Akun Siswa Biasa (planetorbit16@gmail.com)
INSERT INTO `users` (`nama`, `nis`, `sekolah`, `kelas`, `email`, `password`, `role`, `pembimbing`, `tempat_pkl`) 
VALUES (
  'Siswa PKL TKJ', 
  '22045678', 
  'SMK Negeri 1 Tanjungpinang', 
  'XII TKJ 1', 
  'planetorbit16@gmail.com', 
  'password123', 
  'user', 
  'Pak Ahmad Sanusi, S.Pd, M.T.', 
  'PT Telekomunikasi Indonesia Tbk'
) ON DUPLICATE KEY UPDATE `id`=`id`;

-- Masukkan Akun Admin Guru (admin@smartinformax.com)
INSERT INTO `users` (`nama`, `nis`, `sekolah`, `kelas`, `email`, `password`, `role`, `pembimbing`, `tempat_pkl`) 
VALUES (
  'Admin Guru Pembimbing', 
  '19780512', 
  'SMK Negeri 1 Tanjungpinang', 
  'Staff Guru', 
  'admin@smartinformax.com', 
  'admin123', 
  'admin', 
  'N/A', 
  'N/A'
) ON DUPLICATE KEY UPDATE `id`=`id`;

-- Masukkan Jurnal Contoh untuk Siswa ID 1 (Dihapus agar data default user = 0)
-- Jika ingin menambahkan jurnal baru, silakan gunakan form di dalam aplikasi.

-- ==========================================================
-- TABEL 4: kompetensi (Penyimpanan checklist pencapaian kompetensi TKJ)
-- ==========================================================
CREATE TABLE IF NOT EXISTS `kompetensi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `key_kompetensi` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Belum Dimulai',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_comp` (`user_id`, `key_kompetensi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

