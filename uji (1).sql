-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 15, 2026 at 01:39 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uji`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `login_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_at` timestamp NULL DEFAULT NULL,
  `duration_seconds` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `login_at`, `logout_at`, `duration_seconds`, `created_at`) VALUES
(1, 1, '2026-09-15 08:25:30', '2026-09-15 08:30:05', 274, '2026-09-15 08:25:30'),
(2, 3, '2026-09-15 08:30:12', '2026-09-15 08:32:16', 123, '2026-09-15 08:30:11'),
(3, 2, '2026-09-15 08:32:39', NULL, NULL, '2026-09-15 08:32:39'),
(4, 2, '2026-09-15 08:51:10', '2026-09-15 09:07:28', 977, '2026-09-15 08:51:10'),
(5, 3, '2026-09-15 09:07:38', '2026-09-15 10:02:49', 3311, '2026-09-15 09:07:38'),
(6, 2, '2026-09-15 09:15:24', '2026-09-15 09:53:41', 2297, '2026-09-15 09:15:24'),
(7, 1, '2026-09-15 10:49:14', '2026-09-15 10:49:29', 14, '2026-09-15 10:49:14'),
(8, 3, '2026-09-15 10:49:49', NULL, NULL, '2026-09-15 10:49:48');

-- --------------------------------------------------------

--
-- Table structure for table `batch_karyawan`
--

CREATE TABLE `batch_karyawan` (
  `ID` int UNSIGNED NOT NULL,
  `BATCH_ID` varchar(20) NOT NULL,
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `ROLE_DALAM_BATCH` enum('Leader','Member') NOT NULL DEFAULT 'Member',
  `STATUS` enum('Aktif','Selesai','Keluar') NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blacklist_tokens`
--

CREATE TABLE `blacklist_tokens` (
  `id` int UNSIGNED NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blacklist_tokens`
--

INSERT INTO `blacklist_tokens` (`id`, `token`, `created_at`, `expired_at`) VALUES
(1, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTRE0iLCJlbWFpbCI6ImFsaWZmaXlhaHJhaG1hMTJAZ21haWwuY29tIiwia2FyeWF3YW5faWQiOiJLUlktMDAwMSIsImNvbXBhbnlfaWQiOjEsImxvZ19pZCI6MSwiaWF0IjoxNzg5NDYwNzMwLCJleHAiOjE3ODk1NDcxMzB9.1sCgzFNYsuyquSiEKKgvztGhWiYtoX4n1W0wHOjccQs-d2_o9mRSQAKtbd2XP-7rvPFYygHwOCMYD3Vg0X2joA', '2026-09-15 08:30:04', '2026-09-16 08:25:30'),
(2, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJHVURBTkciLCJlbWFpbCI6Imd1ZGFuZ2FkbWluQGdtYWlsLmNvbSIsImthcnlhd2FuX2lkIjoiS1JZLTAwMDMiLCJjb21wYW55X2lkIjoxLCJsb2dfaWQiOjIsImlhdCI6MTc4OTQ2MTAxMSwiZXhwIjoxNzg5NTQ3NDExfQ.1bXqSHeCGOCX-62sTlONjAozKbFURjG_LSB0ut3dKJ4vRq1NgBE-ZIx4L3139-nnXDhhxETvkSGTv1br4TW6JQ', '2026-09-15 08:32:16', '2026-09-16 08:30:11'),
(3, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJQUk9EVUtTSSIsImVtYWlsIjoicHJvZHVrc2lhZG1pbkBnbWFpbC5jb20iLCJrYXJ5YXdhbl9pZCI6IktSWS0wMDAyIiwiY29tcGFueV9pZCI6MSwibG9nX2lkIjo0LCJpYXQiOjE3ODk0NjIyNzAsImV4cCI6MTc4OTU0ODY3MH0.QiKhWU6ggOuX56NQSjP3j8JWJNu1XUc6Bmz59MMzrUSIRT2SXEWHzhDS2RVuYF6jvuL9lyKb18PQKF6BweH9ow', '2026-09-15 09:07:27', '2026-09-16 08:51:10'),
(4, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJQUk9EVUtTSSIsImVtYWlsIjoicHJvZHVrc2lhZG1pbkBnbWFpbC5jb20iLCJrYXJ5YXdhbl9pZCI6IktSWS0wMDAyIiwiY29tcGFueV9pZCI6MSwibG9nX2lkIjo2LCJpYXQiOjE3ODk0NjM3MjQsImV4cCI6MTc4OTU1MDEyNH0.pX1K-RFX_Y1HKNaDOvX0dwevkDKslBDk2Yt7KFMB932ZdH5U-z0q4Y_kqMBhm_znLKDxm_GlmrKZUXa7G7eHFA', '2026-09-15 09:53:41', '2026-09-16 09:15:24'),
(5, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJHVURBTkciLCJlbWFpbCI6Imd1ZGFuZ2FkbWluQGdtYWlsLmNvbSIsImthcnlhd2FuX2lkIjoiS1JZLTAwMDMiLCJjb21wYW55X2lkIjoxLCJsb2dfaWQiOjUsImlhdCI6MTc4OTQ2MzI1OCwiZXhwIjoxNzg5NTQ5NjU4fQ.bn44nobOGH9fCywgvEmZmw_5Wm0zrQntVId1VdTBn5Sj4wPs5AvKbxk_tFYD4D5O2QzMVNhOUnUu1izN76yCjQ', '2026-09-15 10:02:49', '2026-09-16 09:07:38'),
(6, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTRE0iLCJlbWFpbCI6ImFsaWZmaXlhaHJhaG1hMTJAZ21haWwuY29tIiwia2FyeWF3YW5faWQiOiJLUlktMDAwMSIsImNvbXBhbnlfaWQiOjEsImxvZ19pZCI6NywiaWF0IjoxNzg5NDY5MzU0LCJleHAiOjE3ODk1NTU3NTR9.UFvbh7C8FYWS7AhKfhN9zDVufzbmukAxu-KeZByWyG8ex6yCERE49luA8E70k2SxZaLehTFnD0DgzuVXjQmU9A', '2026-09-15 10:49:28', '2026-09-16 10:49:14');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int UNSIGNED NOT NULL,
  `nama_perusahaan` varchar(255) NOT NULL,
  `alamat` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `nib` varchar(50) DEFAULT NULL,
  `npwp` varchar(50) DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `nama_perusahaan`, `alamat`, `created_at`, `nib`, `npwp`, `no_telp`) VALUES
(1, 'pt coba uji admin', 'wertyuiosdfghjklcvbnm,dfghj', '2026-09-15 08:24:34', '1435456', '89204', '0329834759834');

-- --------------------------------------------------------

--
-- Table structure for table `detail_faktur_penjualan`
--

CREATE TABLE `detail_faktur_penjualan` (
  `ID_DETAIL` int UNSIGNED NOT NULL,
  `ID_FAKTUR` int UNSIGNED NOT NULL,
  `PRODUK_ID` int NOT NULL,
  `QTY` decimal(18,2) DEFAULT '0.00',
  `HARGA_JUAL` decimal(18,2) DEFAULT '0.00',
  `DISKON` decimal(18,2) DEFAULT '0.00',
  `SUBTOTAL` decimal(18,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faktur_penjualan`
--

CREATE TABLE `faktur_penjualan` (
  `ID_FAKTUR` int UNSIGNED NOT NULL,
  `company_id` int NOT NULL DEFAULT '0',
  `NO_FAKTUR` varchar(50) NOT NULL,
  `ID_CUSTOMER` int UNSIGNED NOT NULL,
  `NAMA_CUSTOMER` varchar(150) DEFAULT NULL,
  `TGL_FAKTUR` datetime DEFAULT NULL,
  `TOTAL_PENJUALAN` decimal(18,2) DEFAULT '0.00',
  `DISKON` decimal(18,2) DEFAULT '0.00',
  `PAJAK` decimal(18,2) DEFAULT '0.00',
  `GRAND_TOTAL` decimal(18,2) DEFAULT '0.00',
  `JUMLAH_BAYAR` decimal(18,2) DEFAULT '0.00',
  `SISA_PIUTANG` decimal(18,2) DEFAULT '0.00',
  `STATUS_BAYAR` enum('Belum Lunas','Cicil','Lunas') DEFAULT 'Belum Lunas',
  `STATUS_FAKTUR` enum('Draft','Selesai','Void') DEFAULT 'Draft',
  `KETERANGAN` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `harga_jual`
--

CREATE TABLE `harga_jual` (
  `id` int UNSIGNED NOT NULL,
  `company_id` int NOT NULL,
  `produk_id` int NOT NULL,
  `margin` decimal(5,2) NOT NULL,
  `harga_jual` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `harga_jual`
--

INSERT INTO `harga_jual` (`id`, `company_id`, `produk_id`, `margin`, `harga_jual`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '123.00', '3345.00', '2026-09-15 09:23:22', '2026-09-15 09:38:10');

-- --------------------------------------------------------

--
-- Table structure for table `hpp`
--

CREATE TABLE `hpp` (
  `id` int UNSIGNED NOT NULL,
  `company_id` int DEFAULT NULL,
  `produk_id` int DEFAULT NULL,
  `parent_hpp_id` int DEFAULT NULL,
  `produk_jadi` varchar(255) DEFAULT NULL,
  `total_hpp` decimal(15,2) DEFAULT NULL,
  `hpp_awal` decimal(18,2) DEFAULT '0.00',
  `hpp_per_pcs` decimal(15,2) DEFAULT '0.00',
  `fase` int DEFAULT '1',
  `qty_hasil` decimal(18,2) DEFAULT '0.00',
  `qty_sisa` decimal(10,2) DEFAULT '0.00',
  `qty_dipakai` decimal(10,2) DEFAULT '0.00',
  `satuan_hasil` varchar(50) DEFAULT NULL,
  `status` enum('FASE1','FASE2','FINAL') DEFAULT 'FASE1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hpp`
--

INSERT INTO `hpp` (`id`, `company_id`, `produk_id`, `parent_hpp_id`, `produk_jadi`, `total_hpp`, `hpp_awal`, `hpp_per_pcs`, `fase`, `qty_hasil`, `qty_sisa`, `qty_dipakai`, `satuan_hasil`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL, '150000.00', '0.00', '1500.00', 1, '100.00', '100.00', '0.00', 'Cone', 'FASE1', '2026-09-15 09:21:21', '2026-09-15 09:21:21');

-- --------------------------------------------------------

--
-- Table structure for table `hpp_detail`
--

CREATE TABLE `hpp_detail` (
  `id` int UNSIGNED NOT NULL,
  `hpp_id` int DEFAULT NULL,
  `parent_hpp_id` int DEFAULT NULL,
  `is_fase1` tinyint(1) DEFAULT '0',
  `fase` int DEFAULT '1',
  `BARANG_KODE` varchar(50) DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `nama_item` varchar(255) DEFAULT NULL,
  `harga` decimal(15,2) DEFAULT NULL,
  `satuan` varchar(50) DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `jam` decimal(10,2) DEFAULT '0.00',
  `total` decimal(15,2) DEFAULT NULL,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hpp_detail`
--

INSERT INTO `hpp_detail` (`id`, `hpp_id`, `parent_hpp_id`, `is_fase1`, `fase`, `BARANG_KODE`, `kategori`, `nama_item`, `harga`, `satuan`, `jumlah`, `jam`, `total`, `company_id`) VALUES
(1, 1, NULL, 0, 1, 'BRG-010564', 'BAHAN_BAKU', 'BEEF', '50000.00', 'Kilo Gram', '3.00', '0.00', '150000.00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hpp_kalkulasi`
--

CREATE TABLE `hpp_kalkulasi` (
  `id` int UNSIGNED NOT NULL,
  `company_id` int UNSIGNED NOT NULL,
  `nama_produk_jadi` varchar(255) NOT NULL,
  `jumlah_porsi` decimal(15,2) NOT NULL DEFAULT '1.00',
  `total_bahan_baku_langsung` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_bahan_baku_tidak_langsung` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_tenaga_kerja` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_overhead` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_biaya_produksi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `hpp_per_porsi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `target_margin` decimal(5,2) NOT NULL DEFAULT '0.00',
  `rekomendasi_harga_jual` decimal(15,2) NOT NULL DEFAULT '0.00',
  `harga_jual_final` decimal(15,2) NOT NULL DEFAULT '0.00',
  `profit_per_porsi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hpp_kalkulasi`
--

INSERT INTO `hpp_kalkulasi` (`id`, `company_id`, `nama_produk_jadi`, `jumlah_porsi`, `total_bahan_baku_langsung`, `total_bahan_baku_tidak_langsung`, `total_tenaga_kerja`, `total_overhead`, `total_biaya_produksi`, `hpp_per_porsi`, `target_margin`, `rekomendasi_harga_jual`, `harga_jual_final`, `profit_per_porsi`, `created_at`, `updated_at`) VALUES
(1, 1, 'kebab', '1.00', '5000.00', '0.00', '0.00', '0.00', '5000.00', '5000.00', '50.00', '7500.00', '7500.00', '2500.00', '2026-09-15 16:21:53', '2026-09-15 16:21:53');

-- --------------------------------------------------------

--
-- Table structure for table `hpp_kalkulasi_detail`
--

CREATE TABLE `hpp_kalkulasi_detail` (
  `id` int UNSIGNED NOT NULL,
  `hpp_kalkulasi_id` int UNSIGNED NOT NULL,
  `company_id` int UNSIGNED NOT NULL,
  `kategori` enum('BAHAN_BAKU_LANGSUNG','BAHAN_BAKU_TIDAK_LANGSUNG','TENAGA_KERJA','OVERHEAD') NOT NULL,
  `barang_kode` varchar(100) DEFAULT NULL,
  `nama_item` varchar(255) NOT NULL,
  `jumlah` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `satuan` varchar(50) DEFAULT '-',
  `harga_satuan` decimal(15,2) NOT NULL DEFAULT '0.00',
  `jam` decimal(10,2) NOT NULL DEFAULT '1.00',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hpp_kalkulasi_detail`
--

INSERT INTO `hpp_kalkulasi_detail` (`id`, `hpp_kalkulasi_id`, `company_id`, `kategori`, `barang_kode`, `nama_item`, `jumlah`, `satuan`, `harga_satuan`, `jam`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 'BAHAN_BAKU_LANGSUNG', 'BRG-010564', 'BEEF', '100.0000', 'Gram', '50.00', '1.00', '5000.00', '2026-09-15 16:21:53');

-- --------------------------------------------------------

--
-- Table structure for table `inv_pembelian`
--

CREATE TABLE `inv_pembelian` (
  `ID_INV_BELI` int UNSIGNED NOT NULL,
  `NO_INVOICE_BELI` varchar(50) NOT NULL,
  `VENDOR_ID` varchar(10) NOT NULL,
  `TGL_INVOICE` date NOT NULL,
  `TOTAL_BAYAR` decimal(15,2) DEFAULT '0.00',
  `SISA_TAGIHAN` decimal(15,2) DEFAULT '0.00',
  `STATUS_BAYAR` enum('Belum Lunas','Cicil','Lunas') DEFAULT 'Belum Lunas',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inv_pembelian_detail`
--

CREATE TABLE `inv_pembelian_detail` (
  `ID_BELI_DETAIL` int UNSIGNED NOT NULL,
  `NO_INVOICE_BELI` varchar(50) NOT NULL,
  `BARANG_KODE` varchar(50) NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `KODE_RAK` varchar(50) DEFAULT NULL,
  `QTY_BELI` decimal(15,2) NOT NULL DEFAULT '0.00',
  `HARGA_SATUAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `SUBTOTAL` decimal(15,2) NOT NULL DEFAULT '0.00',
  `BATCH_NO` varchar(100) DEFAULT NULL,
  `TGL_KADALUARSA` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inv_pengiriman_d`
--

CREATE TABLE `inv_pengiriman_d` (
  `ID_PENGIRIMAN_D` int UNSIGNED NOT NULL,
  `NO_PENGIRIMAN` varchar(50) DEFAULT NULL,
  `BARANG_KODE` varchar(50) NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `KODE_RAK` varchar(50) NOT NULL,
  `QTY` float(8,2) NOT NULL,
  `BATCH_NO` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inv_pengiriman_h`
--

CREATE TABLE `inv_pengiriman_h` (
  `ID_PENGIRIMAN_H` int UNSIGNED NOT NULL,
  `NO_PENGIRIMAN` varchar(50) NOT NULL,
  `KODE_PELANGGAN` varchar(50) NOT NULL,
  `TGL_KIRIM` date NOT NULL,
  `ALAMAT_TUJUAN` varchar(255) NOT NULL,
  `STATUS_KIRIM` enum('Diproses','Dikirim','Diterima') DEFAULT 'Diproses',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_produksi`
--

CREATE TABLE `jenis_produksi` (
  `ID` int UNSIGNED NOT NULL,
  `company_id` int NOT NULL,
  `ID_JENIS_PRODUKSI` varchar(50) DEFAULT NULL,
  `NAMA_PRODUK` varchar(100) DEFAULT NULL,
  `BARANG_KODE` varchar(50) DEFAULT NULL,
  `NO_BATCH` varchar(50) DEFAULT NULL,
  `TARGET` int DEFAULT NULL,
  `HASIL` int DEFAULT NULL,
  `GAGAL` int DEFAULT NULL,
  `SKALA` varchar(20) DEFAULT NULL,
  `TUJUAN` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20250520000000_create_companies_table.js', 1, '2026-09-15 08:07:14'),
(2, '20250521091124_create_users_table.js', 1, '2026-09-15 08:07:14'),
(3, '20250921145805_create_login_history_table.js', 1, '2026-09-15 08:07:14'),
(4, '20250921173015_create_blacklist_tokens.js.js', 1, '2026-09-15 08:07:14'),
(5, '20260201114151_create_master_vendor.js', 1, '2026-09-15 08:07:14'),
(6, '20260202024914_create_master_hari.js', 1, '2026-09-15 08:07:14'),
(7, '20260202035430_create_master_jenis_barang.js', 1, '2026-09-15 08:07:14'),
(8, '20260202035430_create_master_satuan_barang.js', 1, '2026-09-15 08:07:14'),
(9, '20260202035431_create_master_barang.js', 1, '2026-09-15 08:07:14'),
(10, '20260203010024_create_master_gudang.js', 1, '2026-09-15 08:07:14'),
(11, '20260203010048_create_master_rak.js', 1, '2026-09-15 08:07:14'),
(12, '20260203010100_create_master_customer.js', 1, '2026-09-15 08:07:14'),
(13, '20260203010154_create_inv_pembelian.js', 1, '2026-09-15 08:07:14'),
(14, '20260203010234_create_inv_pengiriman_h.js', 1, '2026-09-15 08:07:14'),
(15, '20260203010309_create_stok_lokasi.js', 1, '2026-09-15 08:07:14'),
(16, '20260203010332_create_tr_barang_masuk.js', 1, '2026-09-15 08:07:14'),
(17, '20260203010350_alter_inv_pengiriman_h_add_foreign.js', 1, '2026-09-15 08:07:14'),
(18, '20260203010420_create_tr_barang_keluar.js', 1, '2026-09-15 08:07:15'),
(19, '20260203010446_create_pembayaran_beli.js', 1, '2026-09-15 08:07:15'),
(20, '20260204145910_fix_stok_lokasi_qty.js', 1, '2026-09-15 08:07:15'),
(21, '20260204150220_create_inv_pembelian_detail.js', 1, '2026-09-15 08:07:15'),
(22, '20260206113124_create_master_karyawan.js', 1, '2026-09-15 08:07:15'),
(23, '20260211004915_create_master_batch.js', 1, '2026-09-15 08:07:15'),
(24, '20260211005028_create_batch_karyawan.js', 1, '2026-09-15 08:07:15'),
(25, '20260211005157_create_logbook_pekerjaan.js', 1, '2026-09-15 08:07:15'),
(26, '20260211005243_create_logbook_validasi.js', 1, '2026-09-15 08:07:15'),
(27, '20260211005711_create_logbook_revisi.js', 1, '2026-09-15 08:07:16'),
(28, '20260220023029_create_master_pengajuan.js', 1, '2026-09-15 08:07:16'),
(29, '20260225071842_create_master_perusahaan.js', 1, '2026-09-15 08:07:16'),
(30, '20260302042632_create_master_presensi.js', 1, '2026-09-15 08:07:16'),
(31, '20260302044023_add_gps_and_timing_to_master_perusahaan.js', 1, '2026-09-15 08:07:16'),
(32, '20260305053802_create_master_gaji_jabatan.js', 1, '2026-09-15 08:07:16'),
(33, '20260305053828_create_master_komponen_gaji.js', 1, '2026-09-15 08:07:16'),
(34, '20260305053852_create_master_payroll.js', 1, '2026-09-15 08:07:16'),
(35, '20260305155454_create_master_shift.js', 1, '2026-09-15 08:07:16'),
(36, '20260827032429_create_activity_logs_table.js', 1, '2026-09-15 08:07:16'),
(37, '20260904175631_create_hpp_tables.js', 1, '2026-09-15 08:07:16'),
(38, '20260904175653_create_harga_jual_table.js', 1, '2026-09-15 08:07:16'),
(39, '20260904175750_create_jenis_produksi_table.js', 1, '2026-09-15 08:07:16'),
(40, '20260904175916_create_hpp_detail_table.js', 1, '2026-09-15 08:07:16'),
(41, '20260908113242_create_master_nama_produk.js', 1, '2026-09-15 08:07:16'),
(42, '20260908113251_create_faktur_penjualan.js', 1, '2026-09-15 08:07:16'),
(43, '20260908113301_create_detail_faktur_penjualan.js', 1, '2026-09-15 08:07:16'),
(44, '20260908113308_create_pembayaran_penjualan.js', 1, '2026-09-15 08:07:16'),
(45, '20260908113340_create_inv_pengiriman_d.js', 1, '2026-09-15 08:07:16'),
(46, '20260908113345_create_transaksi.js', 1, '2026-09-15 08:07:16'),
(47, '20260911165053_create_hpp_kalkulasi_table.js', 1, '2026-09-15 08:07:16'),
(48, '20260911165056_create_hpp_kalkulasi_detail_table.js', 1, '2026-09-15 08:07:17'),
(49, '20260911165058_add_company_id_to_tables.js', 1, '2026-09-15 08:07:17'),
(50, '20260915133409_create_superadmin_table.js', 2, '2026-09-15 13:34:21');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int UNSIGNED NOT NULL,
  `is_locked` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `logbook_pekerjaan`
--

CREATE TABLE `logbook_pekerjaan` (
  `ID` int UNSIGNED NOT NULL,
  `LOGBOOK_ID` varchar(20) NOT NULL,
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `BATCH_ID` varchar(20) NOT NULL,
  `TANGGAL` date NOT NULL,
  `JAM_MULAI` time NOT NULL,
  `JAM_SELESAI` time DEFAULT NULL,
  `JAM_KERJA` decimal(5,2) NOT NULL DEFAULT '0.00',
  `AKTIVITAS` varchar(500) NOT NULL,
  `DESKRIPSI` text,
  `JUMLAH_OUTPUT` decimal(10,2) NOT NULL DEFAULT '0.00',
  `KENDALA` text,
  `FOTO_BUKTI` varchar(255) DEFAULT NULL,
  `STATUS` enum('Draft','Submitted','Approved','Rejected') NOT NULL DEFAULT 'Draft',
  `CREATED_BY_KARYAWAN` varchar(20) DEFAULT NULL,
  `UPDATED_BY_KARYAWAN` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logbook_revisi`
--

CREATE TABLE `logbook_revisi` (
  `ID` int UNSIGNED NOT NULL,
  `LOGBOOK_ID` varchar(20) NOT NULL,
  `REVISI_KE` int NOT NULL,
  `STATUS_SEBELUM` enum('Draft','Submitted','Approved','Rejected') NOT NULL,
  `STATUS_SESUDAH` enum('Draft','Submitted','Approved','Rejected') NOT NULL,
  `DATA_SEBELUM` text,
  `DATA_SESUDAH` text,
  `REVISED_BY_KARYAWAN` varchar(20) NOT NULL,
  `ALASAN_REVISI` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logbook_validasi`
--

CREATE TABLE `logbook_validasi` (
  `ID` int UNSIGNED NOT NULL,
  `LOGBOOK_ID` varchar(20) NOT NULL,
  `AKSI` enum('Approved','Rejected') NOT NULL,
  `VALIDATOR_KARYAWAN_ID` varchar(20) NOT NULL,
  `CATATAN` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `action` enum('LOGIN','LOGOUT') NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`id`, `user_id`, `action`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:25:30'),
(2, 1, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:30:04'),
(3, 3, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:30:11'),
(4, 3, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:32:16'),
(5, 2, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:32:39'),
(6, 2, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 08:51:10'),
(7, 2, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 09:07:27'),
(8, 3, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 09:07:38'),
(9, 2, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 09:15:24'),
(10, 2, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 09:53:41'),
(11, 3, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 10:02:49'),
(12, 1, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 10:49:14'),
(13, 1, 'LOGOUT', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 10:49:28'),
(14, 3, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '2026-09-15 10:49:48');

-- --------------------------------------------------------

--
-- Table structure for table `master_barang`
--

CREATE TABLE `master_barang` (
  `ID` int UNSIGNED NOT NULL,
  `company_id` int DEFAULT NULL,
  `BARANG_KODE` varchar(50) NOT NULL,
  `NAMA_BARANG` varchar(200) NOT NULL,
  `JENIS_ID` int UNSIGNED DEFAULT NULL,
  `SATUAN_ID` int UNSIGNED DEFAULT NULL,
  `NAMA_SATUAN` varchar(100) DEFAULT NULL,
  `STOK_MINIMAL` decimal(15,2) DEFAULT '0.00',
  `STOK_SAAT_INI` decimal(15,2) DEFAULT '0.00',
  `HARGA_BELI_TERAKHIR` decimal(15,2) DEFAULT '0.00',
  `HARGA_JUAL` decimal(15,2) DEFAULT '0.00',
  `STATUS` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_barang`
--

INSERT INTO `master_barang` (`ID`, `company_id`, `BARANG_KODE`, `NAMA_BARANG`, `JENIS_ID`, `SATUAN_ID`, `NAMA_SATUAN`, `STOK_MINIMAL`, `STOK_SAAT_INI`, `HARGA_BELI_TERAKHIR`, `HARGA_JUAL`, `STATUS`, `created_at`, `updated_at`) VALUES
(1, 1, 'BRG-01042', 'SAOS', 22, 2, 'Liter', '2.00', '13.00', '19000.00', '0.00', 'Aktif', '2026-09-15 08:32:09', '2026-09-15 08:32:09'),
(2, 1, 'BRG-010564', 'BEEF', 22, 3, 'Kilo Gram', '2.00', '100.00', '50000.00', '0.00', 'Aktif', '2026-09-15 09:08:26', '2026-09-15 09:08:26'),
(3, 1, 'BRG-015247', 'BEEF PREMIUM', 22, 3, NULL, '2.00', '190.00', '55000.00', '0.00', 'Aktif', '2026-09-15 09:10:52', '2026-09-15 09:10:52'),
(6, 1, 'LAP', 'mangga', 18, 214, 'Buah', '2.00', '4.00', '10000.00', '0.00', 'Aktif', '2026-09-15 09:18:34', '2026-09-15 09:18:34'),
(7, 1, 'RW', 'fxdcgh', 22, 2, 'Liter', '10.00', '20.00', '50000.00', '0.00', 'Aktif', '2026-09-15 09:19:17', '2026-09-15 09:19:17');

--
-- Triggers `master_barang`
--
DELIMITER $$
CREATE TRIGGER `auto_fill_nama_satuan` BEFORE INSERT ON `master_barang` FOR EACH ROW BEGIN
    IF NEW.SATUAN_ID IS NOT NULL THEN
        SET NEW.NAMA_SATUAN = (
            SELECT NAMA_SATUAN 
            FROM master_satuan_barang 
            WHERE ID = NEW.SATUAN_ID 
            LIMIT 1
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `master_batch`
--

CREATE TABLE `master_batch` (
  `ID` int UNSIGNED NOT NULL,
  `BATCH_ID` varchar(20) NOT NULL,
  `NAMA_BATCH` varchar(200) NOT NULL,
  `JENIS_BATCH` enum('Standar','Khusus') NOT NULL DEFAULT 'Standar',
  `KATEGORI_PRODUK` varchar(100) DEFAULT NULL,
  `KODE_PRODUK` varchar(50) DEFAULT NULL,
  `TARGET_JUMLAH` int NOT NULL DEFAULT '0',
  `JUMLAH_SELESAI` int NOT NULL DEFAULT '0',
  `JUMLAH_KARYAWAN_DIBUTUHKAN` int DEFAULT NULL,
  `SATUAN` varchar(20) DEFAULT NULL,
  `SPESIFIKASI` text,
  `TANGGAL_MULAI` date DEFAULT NULL,
  `TANGGAL_TARGET_SELESAI` date DEFAULT NULL,
  `TANGGAL_SELESAI_AKTUAL` date DEFAULT NULL,
  `ESTIMASI_JAM_KERJA` decimal(8,2) DEFAULT NULL,
  `STATUS_BATCH` enum('Pending','In Progress','Completed','On Hold','Cancelled') NOT NULL DEFAULT 'Pending',
  `CATATAN` text,
  `CREATED_BY_KARYAWAN` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_batch`
--

INSERT INTO `master_batch` (`ID`, `BATCH_ID`, `NAMA_BATCH`, `JENIS_BATCH`, `KATEGORI_PRODUK`, `KODE_PRODUK`, `TARGET_JUMLAH`, `JUMLAH_SELESAI`, `JUMLAH_KARYAWAN_DIBUTUHKAN`, `SATUAN`, `SPESIFIKASI`, `TANGGAL_MULAI`, `TANGGAL_TARGET_SELESAI`, `TANGGAL_SELESAI_AKTUAL`, `ESTIMASI_JAM_KERJA`, `STATUS_BATCH`, `CATATAN`, `CREATED_BY_KARYAWAN`, `created_at`, `updated_at`, `company_id`) VALUES
(1, 'BATCH-001', 'Bacth produksi', 'Standar', 'bahan pangan', 'PRD-001', 100, 0, NULL, 'Kg', NULL, '2026-08-31', '2026-09-01', NULL, '3.00', 'Pending', NULL, 'KRY-0003', '2026-09-15 09:46:29', '2026-09-15 09:46:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `master_customer`
--

CREATE TABLE `master_customer` (
  `ID_CUSTOMER` int UNSIGNED NOT NULL,
  `company_id` int UNSIGNED NOT NULL DEFAULT '0',
  `KODE_CUSTOMER` varchar(50) NOT NULL,
  `NAMA_CUSTOMER` varchar(150) NOT NULL,
  `ALAMAT` text,
  `NO_TELP` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `STATUS` enum('Aktif','Non-Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_gaji_jabatan`
--

CREATE TABLE `master_gaji_jabatan` (
  `ID` int UNSIGNED NOT NULL,
  `company_id` int NOT NULL DEFAULT '0',
  `JABATAN` varchar(100) NOT NULL,
  `DEPARTEMEN` varchar(100) DEFAULT NULL,
  `GAJI_POKOK` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_TRANSPORT` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_MAKAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_JABATAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_LAINNYA` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_TERLAMBAT_PER_MENIT` decimal(10,2) NOT NULL DEFAULT '500.00',
  `POTONGAN_ALPA_PER_HARI` decimal(10,2) NOT NULL DEFAULT '0.00',
  `BPJS_KESEHATAN_PERSEN` decimal(5,2) NOT NULL DEFAULT '1.00',
  `BPJS_TK_PERSEN` decimal(5,2) NOT NULL DEFAULT '2.00',
  `IS_KENA_PPH21` tinyint(1) NOT NULL DEFAULT '0',
  `BONUS_SCORE_90` decimal(5,2) NOT NULL DEFAULT '15.00',
  `BONUS_SCORE_75` decimal(5,2) NOT NULL DEFAULT '10.00',
  `BONUS_SCORE_60` decimal(5,2) NOT NULL DEFAULT '5.00',
  `STATUS` enum('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_gudang`
--

CREATE TABLE `master_gudang` (
  `ID_GUDANG` int UNSIGNED NOT NULL,
  `id_company` int UNSIGNED NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `NAMA_GUDANG` varchar(100) NOT NULL,
  `ALAMAT` text,
  `STATUS` varchar(20) DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_gudang`
--

INSERT INTO `master_gudang` (`ID_GUDANG`, `id_company`, `KODE_GUDANG`, `NAMA_GUDANG`, `ALAMAT`, `STATUS`, `created_at`, `updated_at`) VALUES
(1, 1, 'GDG001', 'Gudang utama', 'sebelah masjid', 'Aktif', '2026-09-15 09:45:20', '2026-09-15 09:45:20');

-- --------------------------------------------------------

--
-- Table structure for table `master_hari`
--

CREATE TABLE `master_hari` (
  `ID` int UNSIGNED NOT NULL,
  `HARI_ID` int NOT NULL,
  `NAMA_HARI` varchar(20) NOT NULL,
  `URUTAN` int NOT NULL,
  `JAM_MASUK_DEFAULT` time DEFAULT '08:00:00',
  `JAM_PULANG_DEFAULT` time DEFAULT '17:00:00',
  `IS_HARI_KERJA` tinyint(1) DEFAULT '1',
  `STATUS` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_jenis_barang`
--

CREATE TABLE `master_jenis_barang` (
  `ID` int UNSIGNED NOT NULL,
  `KODE_JENIS` varchar(20) NOT NULL,
  `NAMA_JENIS` varchar(100) NOT NULL,
  `STATUS` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_jenis_barang`
--

INSERT INTO `master_jenis_barang` (`ID`, `KODE_JENIS`, `NAMA_JENIS`, `STATUS`, `created_at`, `updated_at`) VALUES
(18, 'MKN', 'Makanan', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(19, 'MNM', 'Minuman', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(20, 'FRO', 'Frozen Food', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(21, 'KMS', 'Kemasan', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(22, 'BHN', 'Bahan Baku', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(23, 'PRD', 'Produk Jadi', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(24, 'SPT', 'Sparepart', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(25, 'ATK', 'Alat Tulis Kantor', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29'),
(26, 'LOG', 'Logistik', 'Aktif', '2026-05-24 07:59:29', '2026-05-24 07:59:29');

-- --------------------------------------------------------

--
-- Table structure for table `master_karyawan`
--

CREATE TABLE `master_karyawan` (
  `ID` int UNSIGNED NOT NULL,
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `EMAIL` varchar(120) NOT NULL,
  `NIK` varchar(30) NOT NULL,
  `NAMA` varchar(150) NOT NULL,
  `GENDER` enum('L','P') NOT NULL,
  `TEMPAT_LAHIR` varchar(100) DEFAULT NULL,
  `TGL_LAHIR` date DEFAULT NULL,
  `ALAMAT` text,
  `NO_TELP` varchar(20) DEFAULT NULL,
  `DEPARTEMEN` varchar(100) NOT NULL,
  `JABATAN` varchar(100) NOT NULL,
  `TANGGAL_MASUK` date DEFAULT NULL,
  `STATUS_KARYAWAN` enum('Tetap','Kontrak','Magang') DEFAULT 'Kontrak',
  `STATUS_AKTIF` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `SHIFT` varchar(20) DEFAULT NULL,
  `PENDIDIKAN_TERAKHIR` varchar(100) DEFAULT NULL,
  `FOTO` varchar(255) DEFAULT NULL,
  `FOTO_KTP` varchar(255) DEFAULT NULL,
  `company_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_karyawan`
--

INSERT INTO `master_karyawan` (`ID`, `KARYAWAN_ID`, `EMAIL`, `NIK`, `NAMA`, `GENDER`, `TEMPAT_LAHIR`, `TGL_LAHIR`, `ALAMAT`, `NO_TELP`, `DEPARTEMEN`, `JABATAN`, `TANGGAL_MASUK`, `STATUS_KARYAWAN`, `STATUS_AKTIF`, `SHIFT`, `PENDIDIKAN_TERAKHIR`, `FOTO`, `FOTO_KTP`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 'KRY-0001', 'aliffiyahrahma12@gmail.com', 'NIK-1789460674535-569', 'admin uji coba', 'P', 'surabaya', '2026-09-01', 'ertyuidfghjkldfghjkl', '0826323642', 'DIRECTOR', 'Owner', '2026-09-15', 'Tetap', 'Aktif', NULL, NULL, NULL, '[\"/uploads/foto_umkm/karyawan-1789460674446-449506959.png\"]', 1, '2026-09-15 08:24:35', '2026-09-15 08:24:34'),
(2, 'KRY-0002', 'produksiadmin@gmail.com', '279038490', 'admin produksi', 'L', 'malang', '2026-09-01', 'wertyuiopsdfghjklxcvbn', '08390847', 'PRODUKSI', 'Manager', '2026-09-15', 'Kontrak', 'Aktif', NULL, 'S2', NULL, NULL, 1, '2026-09-15 08:27:59', '2026-09-15 08:27:58'),
(3, 'KRY-0003', 'gudangadmin@gmail.com', '83729817390', 'admin gudang', 'L', '87986798676', '2026-09-01', 'qwertyuiopsdfghjklcvbn', '7567089357867', 'GUDANG', 'Manager', '2026-09-15', 'Kontrak', 'Aktif', NULL, 'S1', NULL, NULL, 1, '2026-09-15 08:29:16', '2026-09-15 08:29:15');

-- --------------------------------------------------------

--
-- Table structure for table `master_komponen_gaji`
--

CREATE TABLE `master_komponen_gaji` (
  `ID` int UNSIGNED NOT NULL,
  `company_id` int NOT NULL,
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `GAJI_POKOK` decimal(15,2) DEFAULT NULL,
  `TUNJANGAN_TRANSPORT` decimal(15,2) DEFAULT NULL,
  `TUNJANGAN_MAKAN` decimal(15,2) DEFAULT NULL,
  `TUNJANGAN_JABATAN` decimal(15,2) DEFAULT NULL,
  `TUNJANGAN_LAINNYA` decimal(15,2) DEFAULT NULL,
  `POTONGAN_TERLAMBAT_PER_MENIT` decimal(10,2) DEFAULT NULL,
  `POTONGAN_ALPA_PER_HARI` decimal(10,2) DEFAULT NULL,
  `BPJS_KESEHATAN_PERSEN` decimal(5,2) DEFAULT NULL,
  `BPJS_TK_PERSEN` decimal(5,2) DEFAULT NULL,
  `IS_KENA_PPH21` tinyint(1) DEFAULT NULL,
  `BONUS_SCORE_90` decimal(5,2) DEFAULT NULL,
  `BONUS_SCORE_75` decimal(5,2) DEFAULT NULL,
  `BONUS_SCORE_60` decimal(5,2) DEFAULT NULL,
  `CATATAN` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_nama_produk`
--

CREATE TABLE `master_nama_produk` (
  `id` int UNSIGNED NOT NULL,
  `nama_produk_jadi` varchar(100) NOT NULL,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_nama_produk`
--

INSERT INTO `master_nama_produk` (`id`, `nama_produk_jadi`, `company_id`) VALUES
(1, 'kebab', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `master_payroll`
--

CREATE TABLE `master_payroll` (
  `ID` int UNSIGNED NOT NULL,
  `KODE_PAYROLL` varchar(30) NOT NULL,
  `company_id` int UNSIGNED NOT NULL DEFAULT '0',
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `USER_ID` int UNSIGNED DEFAULT NULL,
  `PERIODE` date NOT NULL,
  `JABATAN_SNAPSHOT` varchar(100) DEFAULT NULL,
  `DEPARTEMEN_SNAPSHOT` varchar(100) DEFAULT NULL,
  `SUMBER_GAJI` enum('Jabatan','Override') NOT NULL DEFAULT 'Jabatan',
  `HARI_KERJA_NORMAL` int NOT NULL DEFAULT '0',
  `HARI_HADIR` int NOT NULL DEFAULT '0',
  `HARI_ALPA` int NOT NULL DEFAULT '0',
  `HARI_SAKIT` int NOT NULL DEFAULT '0',
  `HARI_IZIN` int NOT NULL DEFAULT '0',
  `HARI_CUTI` int NOT NULL DEFAULT '0',
  `HARI_DINAS_LUAR` int NOT NULL DEFAULT '0',
  `TOTAL_TERLAMBAT_MENIT` int NOT NULL DEFAULT '0',
  `TOTAL_KEJADIAN_TERLAMBAT` int NOT NULL DEFAULT '0',
  `TOTAL_PULANG_AWAL` int NOT NULL DEFAULT '0',
  `PERFORMANCE_SCORE` int NOT NULL DEFAULT '0',
  `TOTAL_OUTPUT` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TOTAL_JAM_PRODUKTIF` decimal(10,2) NOT NULL DEFAULT '0.00',
  `TOTAL_LOGBOOK_APPROVED` int NOT NULL DEFAULT '0',
  `GAJI_POKOK` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_TRANSPORT` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_MAKAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_JABATAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TUNJANGAN_LAINNYA` decimal(15,2) NOT NULL DEFAULT '0.00',
  `BONUS_KINERJA` decimal(15,2) NOT NULL DEFAULT '0.00',
  `BONUS_PERSEN_DIPAKAI` decimal(5,2) NOT NULL DEFAULT '0.00',
  `TOTAL_PENDAPATAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_TERLAMBAT` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_ALPA` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_BPJS_KESEHATAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_BPJS_TK` decimal(15,2) NOT NULL DEFAULT '0.00',
  `POTONGAN_PPH21` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TOTAL_POTONGAN` decimal(15,2) NOT NULL DEFAULT '0.00',
  `TAKE_HOME_PAY` decimal(15,2) NOT NULL DEFAULT '0.00',
  `STATUS` enum('Draft','Approved','Paid') NOT NULL DEFAULT 'Draft',
  `APPROVED_BY` varchar(20) DEFAULT NULL,
  `APPROVED_AT` timestamp NULL DEFAULT NULL,
  `PAID_BY` varchar(20) DEFAULT NULL,
  `PAID_AT` timestamp NULL DEFAULT NULL,
  `KETERANGAN` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_pengajuan`
--

CREATE TABLE `master_pengajuan` (
  `ID` int UNSIGNED NOT NULL,
  `KODE_PENGAJUAN` varchar(20) NOT NULL,
  `NAMA_PENGAJUAN` varchar(150) NOT NULL,
  `KATEGORI` enum('Kinerja','Operasional') NOT NULL,
  `KETERANGAN` text,
  `STATUS` enum('Aktif','Tidak aktif') NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_perusahaan`
--

CREATE TABLE `master_perusahaan` (
  `ID_PERUSAHAAN` int UNSIGNED NOT NULL,
  `NAMA_PERUSAHAAN` varchar(150) NOT NULL,
  `ALAMAT_KANTOR` text NOT NULL,
  `LAT_KANTOR` decimal(10,8) DEFAULT NULL,
  `LON_KANTOR` decimal(11,8) DEFAULT NULL,
  `RADIUS_METER` int DEFAULT '500',
  `JAM_MASUK_NORMAL` time DEFAULT '08:00:00',
  `JAM_PULANG_NORMAL` time DEFAULT '17:00:00',
  `ALAMAT_GUDANG` text,
  `TELEPON` varchar(20) DEFAULT NULL,
  `WA_HOTLINE` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `WEBSITE` varchar(100) DEFAULT NULL,
  `NPWP` varchar(30) DEFAULT NULL,
  `KOTA_TERBIT` varchar(50) NOT NULL,
  `NAMA_BANK` varchar(50) DEFAULT NULL,
  `NOMOR_REKENING` varchar(50) DEFAULT NULL,
  `ATAS_NAMA_BANK` varchar(150) DEFAULT NULL,
  `NAMA_PIMPINAN` varchar(150) DEFAULT NULL,
  `JABATAN_PIMPINAN` varchar(100) DEFAULT NULL,
  `LOGO_PATH` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_presensi`
--

CREATE TABLE `master_presensi` (
  `ID` int UNSIGNED NOT NULL,
  `COMPANY_ID` int NOT NULL,
  `KODE_PRESENSI` varchar(30) NOT NULL,
  `KARYAWAN_ID` varchar(20) NOT NULL,
  `TANGGAL` date NOT NULL,
  `JAM_MASUK` time DEFAULT NULL,
  `LOKASI_MASUK` varchar(255) DEFAULT NULL,
  `FOTO_MASUK` varchar(255) DEFAULT NULL,
  `JAM_KELUAR` time DEFAULT NULL,
  `LOKASI_KELUAR` varchar(255) DEFAULT NULL,
  `FOTO_KELUAR` varchar(255) DEFAULT NULL,
  `STATUS` enum('Hadir','Izin','Sakit','Alpa','Cuti','Dinas Luar') NOT NULL DEFAULT 'Hadir',
  `KETERANGAN` text,
  `IS_TERLAMBAT` tinyint(1) DEFAULT '0',
  `IS_PULANG_AWAL` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_rak`
--

CREATE TABLE `master_rak` (
  `ID_RAK` int UNSIGNED NOT NULL,
  `id_company` int UNSIGNED NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `KODE_RAK` varchar(50) NOT NULL,
  `NAMA_RAK` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_rak`
--

INSERT INTO `master_rak` (`ID_RAK`, `id_company`, `KODE_GUDANG`, `KODE_RAK`, `NAMA_RAK`, `created_at`, `updated_at`) VALUES
(1, 1, 'GDG001', 'RAK-01', 'RAK A-1', '2026-09-15 09:45:37', '2026-09-15 09:45:37');

-- --------------------------------------------------------

--
-- Table structure for table `master_satuan_barang`
--

CREATE TABLE `master_satuan_barang` (
  `ID` int UNSIGNED NOT NULL,
  `KODE_SATUAN` varchar(20) NOT NULL,
  `NAMA_SATUAN` varchar(100) NOT NULL,
  `KELOMPOK` varchar(30) DEFAULT NULL,
  `FAKTOR_DASAR` decimal(20,6) DEFAULT NULL,
  `STATUS` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_satuan_barang`
--

INSERT INTO `master_satuan_barang` (`ID`, `KODE_SATUAN`, `NAMA_SATUAN`, `KELOMPOK`, `FAKTOR_DASAR`, `STATUS`, `created_at`, `updated_at`) VALUES
(1, 'PCS', 'Pieces ', 'JUMLAH', '1.000000', 'Aktif', '2026-02-10 23:46:40', '2026-09-13 23:15:50'),
(2, 'L', 'Liter', 'VOLUME', '1000.000000', 'Aktif', '2026-05-24 01:23:33', '2026-05-24 01:23:33'),
(3, 'Kg', 'Kilo Gram', 'BERAT', '1000.000000', 'Aktif', '2026-05-24 01:23:33', '2026-05-24 01:23:33'),
(4, 'g', 'Gram', 'BERAT', '1.000000', 'Aktif', '2026-05-24 01:23:33', '2026-05-24 01:23:33'),
(214, 'BH', 'Buah', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-05-24 02:26:23'),
(215, 'LSN', 'Lusin', 'JUMLAH', '12.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(216, 'KODI', 'Kodi', 'JUMLAH', '20.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(217, 'GRS', 'Gross', 'JUMLAH', '144.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(218, 'RIM', 'Rim', 'JUMLAH', '500.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(219, 'SET', 'Set', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(220, 'PSG', 'Pasang', 'JUMLAH', '2.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(221, 'DUS', 'Dus', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(222, 'KRT', 'Karton', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(223, 'BOX', 'Box', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(224, 'PACK', 'Pack', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(225, 'BKS', 'Bungkus', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(226, 'PAK', 'Pak', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(227, 'SCH', 'Sachet', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(228, 'BTL', 'Botol', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(229, 'KLG', 'Kaleng', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(230, 'KRG', 'Karung', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(231, 'SAK', 'Sak', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(232, 'PL', 'Pail', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(233, 'TUBE', 'Tube', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(234, 'TON', 'Ton', 'BERAT', '1000000.000000', 'Aktif', '2026-05-24 02:26:23', '2026-05-24 02:26:23'),
(235, 'KWT', 'Kuintal', 'BERAT', '100.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(236, 'ONS', 'Ons', 'BERAT', '100.000000', 'Aktif', '2026-05-24 02:26:23', '2026-05-24 02:26:23'),
(237, 'ML', 'Milli Liter', 'VOLUME', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 07:05:42'),
(238, 'GLN', 'Galon', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(239, 'BRL', 'Barel', 'JUMLAH', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:15:50'),
(240, 'M', 'Meter', 'PANJANG', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(241, 'CM', 'Centimeter', 'PANJANG', '0.010000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(242, 'ROLL', 'Roll', 'PANJANG', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(243, 'GLG', 'Gulung', 'PANJANG', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(244, 'M2', 'Meter Persegi', 'LUAS', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04'),
(245, 'M3', 'Meter Kubik', 'VOLUME', '1.000000', 'Aktif', '2026-05-24 02:26:23', '2026-09-13 23:17:04');

-- --------------------------------------------------------

--
-- Table structure for table `master_shift`
--

CREATE TABLE `master_shift` (
  `ID` int UNSIGNED NOT NULL,
  `NAMA_SHIFT` varchar(20) NOT NULL,
  `JAM_MASUK` time NOT NULL COMMENT 'Jam masuk standar, misal 07:00:00',
  `JAM_KELUAR` time NOT NULL COMMENT 'Jam keluar standar, misal 15:00:00',
  `HARI_KERJA` varchar(100) NOT NULL DEFAULT 'Senin,Selasa,Rabu,Kamis,Jumat,Sabtu' COMMENT 'Hari kerja dipisah koma',
  `STATUS` enum('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_shift`
--

INSERT INTO `master_shift` (`ID`, `NAMA_SHIFT`, `JAM_MASUK`, `JAM_KELUAR`, `HARI_KERJA`, `STATUS`, `created_at`, `updated_at`) VALUES
(1, 'Pagi', '07:00:00', '15:00:00', 'Senin,Selasa,Rabu,Kamis,Jumat,Sabtu', 'Aktif', '2026-09-15 08:07:16', '2026-09-15 08:07:16'),
(2, 'Siang', '15:00:00', '23:00:00', 'Senin,Selasa,Rabu,Kamis,Jumat,Sabtu', 'Aktif', '2026-09-15 08:07:16', '2026-09-15 08:07:16'),
(3, 'Malam', '23:00:00', '07:00:00', 'Senin,Selasa,Rabu,Kamis,Jumat,Sabtu', 'Aktif', '2026-09-15 08:07:16', '2026-09-15 08:07:16');

-- --------------------------------------------------------

--
-- Table structure for table `master_vendor`
--

CREATE TABLE `master_vendor` (
  `ID` int UNSIGNED NOT NULL,
  `VENDOR_ID` varchar(10) NOT NULL,
  `NAMA_VENDOR` varchar(100) NOT NULL,
  `ALAMAT_VENDOR` varchar(255) NOT NULL,
  `PIC` varchar(100) NOT NULL,
  `NO_TELP_PIC` varchar(20) DEFAULT NULL,
  `EMAIL_PIC` varchar(100) DEFAULT NULL,
  `KETERSEDIAAN_BARANG` enum('Tersedia','Tidak Tersedia') NOT NULL DEFAULT 'Tersedia',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran_beli`
--

CREATE TABLE `pembayaran_beli` (
  `ID_BAYAR` int UNSIGNED NOT NULL,
  `NO_KWITANSI` varchar(50) NOT NULL,
  `NO_INVOICE_BELI` varchar(50) DEFAULT NULL,
  `NOMINAL_BAYAR` decimal(15,2) NOT NULL,
  `TGL_BAYAR` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran_penjualan`
--

CREATE TABLE `pembayaran_penjualan` (
  `ID_PEMBAYARAN` int UNSIGNED NOT NULL,
  `ID_FAKTUR` int UNSIGNED NOT NULL,
  `NO_KWITANSI` varchar(50) DEFAULT NULL,
  `TGL_BAYAR` date DEFAULT NULL,
  `METODE_BAYAR` varchar(50) DEFAULT NULL,
  `NOMINAL_BAYAR` decimal(18,2) DEFAULT '0.00',
  `KETERANGAN` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stok_lokasi`
--

CREATE TABLE `stok_lokasi` (
  `ID_STOK_LOKASI` int UNSIGNED NOT NULL,
  `BARANG_KODE` varchar(50) NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `KODE_RAK` varchar(50) DEFAULT NULL,
  `QTY` decimal(15,2) DEFAULT '0.00',
  `BATCH_NO` varchar(100) DEFAULT NULL,
  `TGL_KADALUARSA` date DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stok_lokasi`
--

INSERT INTO `stok_lokasi` (`ID_STOK_LOKASI`, `BARANG_KODE`, `KODE_GUDANG`, `KODE_RAK`, `QTY`, `BATCH_NO`, `TGL_KADALUARSA`, `CREATED_AT`, `UPDATED_AT`, `company_id`) VALUES
(1, 'BRG-01042', 'GDG001', 'RAK-01', '1.00', 'BRG-001', '2026-09-30', '2026-09-15 09:47:04', '2026-09-15 09:47:04', NULL),
(2, 'BRG-015247', 'GDG001', 'RAK-01', '90.00', 'BATCH-002', '2026-09-02', '2026-09-15 11:07:47', '2026-09-15 11:12:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `superadmin`
--

CREATE TABLE `superadmin` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `permissions` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `superadmin`
--

INSERT INTO `superadmin` (`id`, `user_id`, `permissions`, `created_at`, `updated_at`) VALUES
(1, 4, NULL, '2026-09-15 13:35:19', '2026-09-15 13:35:19');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int UNSIGNED NOT NULL,
  `order_id` varchar(100) DEFAULT NULL,
  `plan` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tr_barang_keluar`
--

CREATE TABLE `tr_barang_keluar` (
  `ID_KELUAR` int UNSIGNED NOT NULL,
  `NO_KELUAR` varchar(50) NOT NULL,
  `NO_PENGIRIMAN` varchar(50) DEFAULT NULL,
  `BARANG_KODE` varchar(50) NOT NULL,
  `KODE_GUDANG` varchar(50) NOT NULL,
  `KODE_RAK` varchar(50) NOT NULL,
  `QTY` float(8,2) NOT NULL,
  `BATCH_NO` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tr_barang_keluar`
--

INSERT INTO `tr_barang_keluar` (`ID_KELUAR`, `NO_KELUAR`, `NO_PENGIRIMAN`, `BARANG_KODE`, `KODE_GUDANG`, `KODE_RAK`, `QTY`, `BATCH_NO`, `created_at`, `updated_at`, `company_id`) VALUES
(3, 'OUT-20260915-0001', NULL, 'BRG-015247', 'GDG001', 'RAK-01', 10.00, 'BATCH-002', '2026-09-15 11:12:16', '2026-09-15 11:12:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tr_barang_masuk`
--

CREATE TABLE `tr_barang_masuk` (
  `ID_MASUK` int UNSIGNED NOT NULL,
  `NO_MASUK` varchar(50) NOT NULL,
  `BARANG_KODE` varchar(50) DEFAULT NULL,
  `KODE_GUDANG` varchar(50) DEFAULT NULL,
  `KODE_RAK` varchar(50) DEFAULT NULL,
  `QTY` float(8,2) NOT NULL,
  `BATCH_NO` varchar(100) DEFAULT NULL,
  `TGL_KADALUARSA` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `company_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tr_barang_masuk`
--

INSERT INTO `tr_barang_masuk` (`ID_MASUK`, `NO_MASUK`, `BARANG_KODE`, `KODE_GUDANG`, `KODE_RAK`, `QTY`, `BATCH_NO`, `TGL_KADALUARSA`, `created_at`, `updated_at`, `company_id`) VALUES
(1, 'IN-20260915-0001', 'BRG-01042', 'GDG001', 'RAK-01', 1.00, 'BRG-001', '2026-09-30', '2026-09-15 09:47:04', '2026-09-15 09:47:04', NULL),
(2, 'IN-20260915-0002', 'BRG-015247', 'GDG001', 'RAK-01', 100.00, 'BATCH-002', '2026-09-02', '2026-09-15 11:07:47', '2026-09-15 11:07:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SUPERADMIN','SDM','GUDANG','PRODUKSI','HR','KEUANGAN') NOT NULL DEFAULT 'GUDANG',
  `company_id` int UNSIGNED DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `company_id`, `is_verified`, `verification_token`, `token_expires_at`, `created_at`, `updated_at`) VALUES
(1, 'admin uji coba', 'aliffiyahrahma12@gmail.com', '$2b$10$AOnsIO.DKUUTiETA0TENbeB7YWaiP7uLqhE.avofz9WlbRk7ROEme', 'SDM', 1, 1, NULL, NULL, '2026-09-15 08:24:35', '2026-09-15 08:25:27'),
(2, 'admin produksi', 'produksiadmin@gmail.com', '$2b$10$ykmqIrCP/IrJMtYDEXgWd.EAy/GTSJgbLb6cmsbVXAljQQQWOWjmO', 'PRODUKSI', 1, 1, NULL, NULL, '2026-09-15 08:27:59', '2026-09-15 08:27:58'),
(3, 'admin gudang', 'gudangadmin@gmail.com', '$2b$10$CIEuW59Xh9xwAIAxuKKc7uRz55DrNtFZMFtj/NVL0O9WfqY9k/KEm', 'GUDANG', 1, 1, NULL, NULL, '2026-09-15 08:29:16', '2026-09-15 08:29:15'),
(4, 'Super Owner', 'rintiskuid@gmail.com', 'semesta_2026', 'SUPERADMIN', NULL, 1, NULL, NULL, '2026-09-15 13:35:19', '2026-09-15 13:35:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `batch_karyawan`
--
ALTER TABLE `batch_karyawan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `batch_karyawan_batch_id_karyawan_id_unique` (`BATCH_ID`,`KARYAWAN_ID`),
  ADD KEY `batch_karyawan_karyawan_id_foreign` (`KARYAWAN_ID`),
  ADD KEY `batch_karyawan_batch_id_status_index` (`BATCH_ID`,`STATUS`);

--
-- Indexes for table `blacklist_tokens`
--
ALTER TABLE `blacklist_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `detail_faktur_penjualan`
--
ALTER TABLE `detail_faktur_penjualan`
  ADD PRIMARY KEY (`ID_DETAIL`),
  ADD KEY `detail_faktur_penjualan_id_faktur_index` (`ID_FAKTUR`),
  ADD KEY `detail_faktur_penjualan_produk_id_index` (`PRODUK_ID`),
  ADD KEY `detail_faktur_penjualan_company_id_foreign` (`company_id`);

--
-- Indexes for table `faktur_penjualan`
--
ALTER TABLE `faktur_penjualan`
  ADD PRIMARY KEY (`ID_FAKTUR`),
  ADD UNIQUE KEY `faktur_penjualan_no_faktur_unique` (`NO_FAKTUR`),
  ADD KEY `faktur_penjualan_id_customer_index` (`ID_CUSTOMER`);

--
-- Indexes for table `harga_jual`
--
ALTER TABLE `harga_jual`
  ADD PRIMARY KEY (`id`),
  ADD KEY `harga_jual_company_id_index` (`company_id`),
  ADD KEY `harga_jual_produk_id_index` (`produk_id`);

--
-- Indexes for table `hpp`
--
ALTER TABLE `hpp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hpp_company_id_index` (`company_id`),
  ADD KEY `hpp_produk_id_index` (`produk_id`),
  ADD KEY `hpp_parent_hpp_id_index` (`parent_hpp_id`);

--
-- Indexes for table `hpp_detail`
--
ALTER TABLE `hpp_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hpp_detail_hpp_id_index` (`hpp_id`),
  ADD KEY `hpp_detail_parent_hpp_id_index` (`parent_hpp_id`),
  ADD KEY `hpp_detail_barang_kode_index` (`BARANG_KODE`),
  ADD KEY `hpp_detail_company_id_foreign` (`company_id`);

--
-- Indexes for table `hpp_kalkulasi`
--
ALTER TABLE `hpp_kalkulasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hpp_kalkulasi_company` (`company_id`);

--
-- Indexes for table `hpp_kalkulasi_detail`
--
ALTER TABLE `hpp_kalkulasi_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hpp_kalkulasi_detail_company` (`company_id`),
  ADD KEY `idx_hpp_kalkulasi_detail_header` (`hpp_kalkulasi_id`);

--
-- Indexes for table `inv_pembelian`
--
ALTER TABLE `inv_pembelian`
  ADD PRIMARY KEY (`ID_INV_BELI`),
  ADD UNIQUE KEY `inv_pembelian_no_invoice_beli_unique` (`NO_INVOICE_BELI`),
  ADD KEY `inv_pembelian_vendor_id_foreign` (`VENDOR_ID`);

--
-- Indexes for table `inv_pembelian_detail`
--
ALTER TABLE `inv_pembelian_detail`
  ADD PRIMARY KEY (`ID_BELI_DETAIL`),
  ADD KEY `inv_pembelian_detail_no_invoice_beli_foreign` (`NO_INVOICE_BELI`),
  ADD KEY `inv_pembelian_detail_barang_kode_foreign` (`BARANG_KODE`),
  ADD KEY `inv_pembelian_detail_kode_gudang_foreign` (`KODE_GUDANG`),
  ADD KEY `inv_pembelian_detail_kode_rak_foreign` (`KODE_RAK`);

--
-- Indexes for table `inv_pengiriman_d`
--
ALTER TABLE `inv_pengiriman_d`
  ADD PRIMARY KEY (`ID_PENGIRIMAN_D`);

--
-- Indexes for table `inv_pengiriman_h`
--
ALTER TABLE `inv_pengiriman_h`
  ADD PRIMARY KEY (`ID_PENGIRIMAN_H`),
  ADD UNIQUE KEY `inv_pengiriman_h_no_pengiriman_unique` (`NO_PENGIRIMAN`),
  ADD KEY `inv_pengiriman_h_kode_pelanggan_foreign` (`KODE_PELANGGAN`);

--
-- Indexes for table `jenis_produksi`
--
ALTER TABLE `jenis_produksi`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jenis_produksi_company_id_index` (`company_id`),
  ADD KEY `jenis_produksi_barang_kode_index` (`BARANG_KODE`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `logbook_pekerjaan`
--
ALTER TABLE `logbook_pekerjaan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `logbook_pekerjaan_logbook_id_unique` (`LOGBOOK_ID`),
  ADD KEY `logbook_pekerjaan_created_by_karyawan_foreign` (`CREATED_BY_KARYAWAN`),
  ADD KEY `logbook_pekerjaan_updated_by_karyawan_foreign` (`UPDATED_BY_KARYAWAN`),
  ADD KEY `logbook_pekerjaan_karyawan_id_tanggal_index` (`KARYAWAN_ID`,`TANGGAL`),
  ADD KEY `logbook_pekerjaan_batch_id_tanggal_index` (`BATCH_ID`,`TANGGAL`),
  ADD KEY `logbook_pekerjaan_status_tanggal_index` (`STATUS`,`TANGGAL`),
  ADD KEY `logbook_pekerjaan_tanggal_index` (`TANGGAL`),
  ADD KEY `logbook_pekerjaan_company_id_foreign` (`company_id`);

--
-- Indexes for table `logbook_revisi`
--
ALTER TABLE `logbook_revisi`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `logbook_revisi_revised_by_karyawan_foreign` (`REVISED_BY_KARYAWAN`),
  ADD KEY `logbook_revisi_logbook_id_revisi_ke_index` (`LOGBOOK_ID`,`REVISI_KE`),
  ADD KEY `logbook_revisi_logbook_id_index` (`LOGBOOK_ID`),
  ADD KEY `logbook_revisi_company_id_foreign` (`company_id`);

--
-- Indexes for table `logbook_validasi`
--
ALTER TABLE `logbook_validasi`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `logbook_validasi_validator_karyawan_id_foreign` (`VALIDATOR_KARYAWAN_ID`),
  ADD KEY `logbook_validasi_logbook_id_created_at_index` (`LOGBOOK_ID`,`created_at`),
  ADD KEY `logbook_validasi_company_id_foreign` (`company_id`);

--
-- Indexes for table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_history_user_id_foreign` (`user_id`);

--
-- Indexes for table `master_barang`
--
ALTER TABLE `master_barang`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_barang_barang_kode_unique` (`BARANG_KODE`),
  ADD KEY `master_barang_barang_kode_index` (`BARANG_KODE`),
  ADD KEY `master_barang_company_id_index` (`company_id`);

--
-- Indexes for table `master_batch`
--
ALTER TABLE `master_batch`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_batch_batch_id_unique` (`BATCH_ID`),
  ADD KEY `master_batch_satuan_foreign` (`SATUAN`),
  ADD KEY `master_batch_created_by_karyawan_foreign` (`CREATED_BY_KARYAWAN`),
  ADD KEY `master_batch_batch_id_status_batch_index` (`BATCH_ID`,`STATUS_BATCH`),
  ADD KEY `master_batch_jenis_batch_kategori_produk_index` (`JENIS_BATCH`,`KATEGORI_PRODUK`),
  ADD KEY `master_batch_status_batch_index` (`STATUS_BATCH`),
  ADD KEY `master_batch_company_id_foreign` (`company_id`);

--
-- Indexes for table `master_customer`
--
ALTER TABLE `master_customer`
  ADD PRIMARY KEY (`ID_CUSTOMER`),
  ADD UNIQUE KEY `master_customer_kode_customer_unique` (`KODE_CUSTOMER`);

--
-- Indexes for table `master_gaji_jabatan`
--
ALTER TABLE `master_gaji_jabatan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `uniq_jabatan_departemen` (`JABATAN`,`DEPARTEMEN`),
  ADD KEY `master_gaji_jabatan_jabatan_index` (`JABATAN`),
  ADD KEY `master_gaji_jabatan_status_index` (`STATUS`);

--
-- Indexes for table `master_gudang`
--
ALTER TABLE `master_gudang`
  ADD PRIMARY KEY (`ID_GUDANG`),
  ADD UNIQUE KEY `master_gudang_kode_gudang_unique` (`KODE_GUDANG`),
  ADD KEY `master_gudang_id_company_foreign` (`id_company`);

--
-- Indexes for table `master_hari`
--
ALTER TABLE `master_hari`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_hari_hari_id_unique` (`HARI_ID`),
  ADD UNIQUE KEY `master_hari_nama_hari_unique` (`NAMA_HARI`),
  ADD KEY `master_hari_company_id_foreign` (`company_id`);

--
-- Indexes for table `master_jenis_barang`
--
ALTER TABLE `master_jenis_barang`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_jenis_barang_kode_jenis_unique` (`KODE_JENIS`);

--
-- Indexes for table `master_karyawan`
--
ALTER TABLE `master_karyawan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_karyawan_karyawan_id_unique` (`KARYAWAN_ID`),
  ADD UNIQUE KEY `master_karyawan_email_unique` (`EMAIL`),
  ADD UNIQUE KEY `master_karyawan_nik_unique` (`NIK`),
  ADD KEY `master_karyawan_karyawan_id_nama_index` (`KARYAWAN_ID`,`NAMA`),
  ADD KEY `master_karyawan_departemen_jabatan_index` (`DEPARTEMEN`,`JABATAN`),
  ADD KEY `master_karyawan_email_index` (`EMAIL`),
  ADD KEY `master_karyawan_company_id_index` (`company_id`),
  ADD KEY `master_karyawan_shift_foreign` (`SHIFT`);

--
-- Indexes for table `master_komponen_gaji`
--
ALTER TABLE `master_komponen_gaji`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_komponen_gaji_karyawan_id_unique` (`KARYAWAN_ID`),
  ADD KEY `master_komponen_gaji_karyawan_id_index` (`KARYAWAN_ID`);

--
-- Indexes for table `master_nama_produk`
--
ALTER TABLE `master_nama_produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_nama_produk_company_id_foreign` (`company_id`);

--
-- Indexes for table `master_payroll`
--
ALTER TABLE `master_payroll`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_payroll_kode_payroll_unique` (`KODE_PAYROLL`),
  ADD UNIQUE KEY `uniq_payroll_karyawan_periode` (`KARYAWAN_ID`,`PERIODE`),
  ADD KEY `master_payroll_user_id_foreign` (`USER_ID`),
  ADD KEY `master_payroll_periode_index` (`PERIODE`),
  ADD KEY `master_payroll_status_index` (`STATUS`),
  ADD KEY `master_payroll_karyawan_id_index` (`KARYAWAN_ID`);

--
-- Indexes for table `master_pengajuan`
--
ALTER TABLE `master_pengajuan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_pengajuan_kode_pengajuan_unique` (`KODE_PENGAJUAN`),
  ADD KEY `master_pengajuan_kode_pengajuan_kategori_index` (`KODE_PENGAJUAN`,`KATEGORI`),
  ADD KEY `master_pengajuan_company_id_foreign` (`company_id`);

--
-- Indexes for table `master_perusahaan`
--
ALTER TABLE `master_perusahaan`
  ADD PRIMARY KEY (`ID_PERUSAHAAN`),
  ADD KEY `master_perusahaan_nama_perusahaan_index` (`NAMA_PERUSAHAAN`);

--
-- Indexes for table `master_presensi`
--
ALTER TABLE `master_presensi`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_presensi_kode_presensi_unique` (`KODE_PRESENSI`),
  ADD UNIQUE KEY `uniq_karyawan_per_hari` (`KARYAWAN_ID`,`TANGGAL`),
  ADD KEY `master_presensi_tanggal_index` (`TANGGAL`),
  ADD KEY `master_presensi_karyawan_id_index` (`KARYAWAN_ID`),
  ADD KEY `master_presensi_tanggal_status_index` (`TANGGAL`,`STATUS`);

--
-- Indexes for table `master_rak`
--
ALTER TABLE `master_rak`
  ADD PRIMARY KEY (`ID_RAK`),
  ADD UNIQUE KEY `master_rak_kode_rak_unique` (`KODE_RAK`),
  ADD KEY `master_rak_id_company_foreign` (`id_company`),
  ADD KEY `master_rak_kode_gudang_foreign` (`KODE_GUDANG`);

--
-- Indexes for table `master_satuan_barang`
--
ALTER TABLE `master_satuan_barang`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_satuan_barang_kode_satuan_unique` (`KODE_SATUAN`);

--
-- Indexes for table `master_shift`
--
ALTER TABLE `master_shift`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_shift_nama_shift_unique` (`NAMA_SHIFT`);

--
-- Indexes for table `master_vendor`
--
ALTER TABLE `master_vendor`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `master_vendor_vendor_id_unique` (`VENDOR_ID`),
  ADD KEY `master_vendor_vendor_id_nama_vendor_index` (`VENDOR_ID`,`NAMA_VENDOR`),
  ADD KEY `master_vendor_company_id_foreign` (`company_id`);

--
-- Indexes for table `pembayaran_beli`
--
ALTER TABLE `pembayaran_beli`
  ADD PRIMARY KEY (`ID_BAYAR`),
  ADD UNIQUE KEY `pembayaran_beli_no_kwitansi_unique` (`NO_KWITANSI`),
  ADD KEY `pembayaran_beli_no_invoice_beli_foreign` (`NO_INVOICE_BELI`),
  ADD KEY `pembayaran_beli_company_id_foreign` (`company_id`);

--
-- Indexes for table `pembayaran_penjualan`
--
ALTER TABLE `pembayaran_penjualan`
  ADD PRIMARY KEY (`ID_PEMBAYARAN`),
  ADD KEY `pembayaran_penjualan_id_faktur_index` (`ID_FAKTUR`),
  ADD KEY `pembayaran_penjualan_company_id_foreign` (`company_id`);

--
-- Indexes for table `stok_lokasi`
--
ALTER TABLE `stok_lokasi`
  ADD PRIMARY KEY (`ID_STOK_LOKASI`),
  ADD UNIQUE KEY `stok_lokasi_barang_kode_kode_gudang_kode_rak_batch_no_unique` (`BARANG_KODE`,`KODE_GUDANG`,`KODE_RAK`,`BATCH_NO`),
  ADD KEY `stok_lokasi_kode_gudang_foreign` (`KODE_GUDANG`),
  ADD KEY `stok_lokasi_kode_rak_foreign` (`KODE_RAK`),
  ADD KEY `stok_lokasi_company_id_foreign` (`company_id`);

--
-- Indexes for table `superadmin`
--
ALTER TABLE `superadmin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `superadmin_user_id_foreign` (`user_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaksi_company_id_foreign` (`company_id`);

--
-- Indexes for table `tr_barang_keluar`
--
ALTER TABLE `tr_barang_keluar`
  ADD PRIMARY KEY (`ID_KELUAR`),
  ADD UNIQUE KEY `tr_barang_keluar_no_keluar_unique` (`NO_KELUAR`),
  ADD KEY `tr_barang_keluar_no_pengiriman_foreign` (`NO_PENGIRIMAN`),
  ADD KEY `tr_barang_keluar_company_id_foreign` (`company_id`);

--
-- Indexes for table `tr_barang_masuk`
--
ALTER TABLE `tr_barang_masuk`
  ADD PRIMARY KEY (`ID_MASUK`),
  ADD UNIQUE KEY `tr_barang_masuk_no_masuk_unique` (`NO_MASUK`),
  ADD KEY `tr_barang_masuk_barang_kode_foreign` (`BARANG_KODE`),
  ADD KEY `tr_barang_masuk_kode_gudang_foreign` (`KODE_GUDANG`),
  ADD KEY `tr_barang_masuk_kode_rak_foreign` (`KODE_RAK`),
  ADD KEY `tr_barang_masuk_company_id_foreign` (`company_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_company_id_foreign` (`company_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `batch_karyawan`
--
ALTER TABLE `batch_karyawan`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blacklist_tokens`
--
ALTER TABLE `blacklist_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `detail_faktur_penjualan`
--
ALTER TABLE `detail_faktur_penjualan`
  MODIFY `ID_DETAIL` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faktur_penjualan`
--
ALTER TABLE `faktur_penjualan`
  MODIFY `ID_FAKTUR` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `harga_jual`
--
ALTER TABLE `harga_jual`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hpp`
--
ALTER TABLE `hpp`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hpp_detail`
--
ALTER TABLE `hpp_detail`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hpp_kalkulasi`
--
ALTER TABLE `hpp_kalkulasi`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hpp_kalkulasi_detail`
--
ALTER TABLE `hpp_kalkulasi_detail`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inv_pembelian`
--
ALTER TABLE `inv_pembelian`
  MODIFY `ID_INV_BELI` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_pembelian_detail`
--
ALTER TABLE `inv_pembelian_detail`
  MODIFY `ID_BELI_DETAIL` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_pengiriman_d`
--
ALTER TABLE `inv_pengiriman_d`
  MODIFY `ID_PENGIRIMAN_D` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_pengiriman_h`
--
ALTER TABLE `inv_pengiriman_h`
  MODIFY `ID_PENGIRIMAN_H` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_produksi`
--
ALTER TABLE `jenis_produksi`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `logbook_pekerjaan`
--
ALTER TABLE `logbook_pekerjaan`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logbook_revisi`
--
ALTER TABLE `logbook_revisi`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logbook_validasi`
--
ALTER TABLE `logbook_validasi`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `master_barang`
--
ALTER TABLE `master_barang`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `master_batch`
--
ALTER TABLE `master_batch`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_customer`
--
ALTER TABLE `master_customer`
  MODIFY `ID_CUSTOMER` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_gaji_jabatan`
--
ALTER TABLE `master_gaji_jabatan`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_gudang`
--
ALTER TABLE `master_gudang`
  MODIFY `ID_GUDANG` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_hari`
--
ALTER TABLE `master_hari`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_jenis_barang`
--
ALTER TABLE `master_jenis_barang`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `master_karyawan`
--
ALTER TABLE `master_karyawan`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `master_komponen_gaji`
--
ALTER TABLE `master_komponen_gaji`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_nama_produk`
--
ALTER TABLE `master_nama_produk`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_payroll`
--
ALTER TABLE `master_payroll`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_pengajuan`
--
ALTER TABLE `master_pengajuan`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_perusahaan`
--
ALTER TABLE `master_perusahaan`
  MODIFY `ID_PERUSAHAAN` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_presensi`
--
ALTER TABLE `master_presensi`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_rak`
--
ALTER TABLE `master_rak`
  MODIFY `ID_RAK` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_satuan_barang`
--
ALTER TABLE `master_satuan_barang`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT for table `master_shift`
--
ALTER TABLE `master_shift`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `master_vendor`
--
ALTER TABLE `master_vendor`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran_beli`
--
ALTER TABLE `pembayaran_beli`
  MODIFY `ID_BAYAR` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran_penjualan`
--
ALTER TABLE `pembayaran_penjualan`
  MODIFY `ID_PEMBAYARAN` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stok_lokasi`
--
ALTER TABLE `stok_lokasi`
  MODIFY `ID_STOK_LOKASI` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `superadmin`
--
ALTER TABLE `superadmin`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tr_barang_keluar`
--
ALTER TABLE `tr_barang_keluar`
  MODIFY `ID_KELUAR` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tr_barang_masuk`
--
ALTER TABLE `tr_barang_masuk`
  MODIFY `ID_MASUK` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `batch_karyawan`
--
ALTER TABLE `batch_karyawan`
  ADD CONSTRAINT `batch_karyawan_batch_id_foreign` FOREIGN KEY (`BATCH_ID`) REFERENCES `master_batch` (`BATCH_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `batch_karyawan_karyawan_id_foreign` FOREIGN KEY (`KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `detail_faktur_penjualan`
--
ALTER TABLE `detail_faktur_penjualan`
  ADD CONSTRAINT `detail_faktur_penjualan_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hpp_detail`
--
ALTER TABLE `hpp_detail`
  ADD CONSTRAINT `hpp_detail_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hpp_kalkulasi`
--
ALTER TABLE `hpp_kalkulasi`
  ADD CONSTRAINT `hpp_kalkulasi_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hpp_kalkulasi_detail`
--
ALTER TABLE `hpp_kalkulasi_detail`
  ADD CONSTRAINT `hpp_kalkulasi_detail_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hpp_kalkulasi_detail_hpp_kalkulasi_id_foreign` FOREIGN KEY (`hpp_kalkulasi_id`) REFERENCES `hpp_kalkulasi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inv_pembelian`
--
ALTER TABLE `inv_pembelian`
  ADD CONSTRAINT `inv_pembelian_vendor_id_foreign` FOREIGN KEY (`VENDOR_ID`) REFERENCES `master_vendor` (`VENDOR_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `inv_pembelian_detail`
--
ALTER TABLE `inv_pembelian_detail`
  ADD CONSTRAINT `inv_pembelian_detail_barang_kode_foreign` FOREIGN KEY (`BARANG_KODE`) REFERENCES `master_barang` (`BARANG_KODE`) ON UPDATE CASCADE,
  ADD CONSTRAINT `inv_pembelian_detail_kode_gudang_foreign` FOREIGN KEY (`KODE_GUDANG`) REFERENCES `master_gudang` (`KODE_GUDANG`) ON UPDATE CASCADE,
  ADD CONSTRAINT `inv_pembelian_detail_kode_rak_foreign` FOREIGN KEY (`KODE_RAK`) REFERENCES `master_rak` (`KODE_RAK`) ON UPDATE CASCADE,
  ADD CONSTRAINT `inv_pembelian_detail_no_invoice_beli_foreign` FOREIGN KEY (`NO_INVOICE_BELI`) REFERENCES `inv_pembelian` (`NO_INVOICE_BELI`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inv_pengiriman_h`
--
ALTER TABLE `inv_pengiriman_h`
  ADD CONSTRAINT `inv_pengiriman_h_kode_pelanggan_foreign` FOREIGN KEY (`KODE_PELANGGAN`) REFERENCES `master_customer` (`KODE_CUSTOMER`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `logbook_pekerjaan`
--
ALTER TABLE `logbook_pekerjaan`
  ADD CONSTRAINT `logbook_pekerjaan_batch_id_foreign` FOREIGN KEY (`BATCH_ID`) REFERENCES `master_batch` (`BATCH_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_pekerjaan_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_pekerjaan_created_by_karyawan_foreign` FOREIGN KEY (`CREATED_BY_KARYAWAN`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_pekerjaan_karyawan_id_foreign` FOREIGN KEY (`KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_pekerjaan_updated_by_karyawan_foreign` FOREIGN KEY (`UPDATED_BY_KARYAWAN`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `logbook_revisi`
--
ALTER TABLE `logbook_revisi`
  ADD CONSTRAINT `logbook_revisi_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_revisi_logbook_id_foreign` FOREIGN KEY (`LOGBOOK_ID`) REFERENCES `logbook_pekerjaan` (`LOGBOOK_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_revisi_revised_by_karyawan_foreign` FOREIGN KEY (`REVISED_BY_KARYAWAN`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logbook_validasi`
--
ALTER TABLE `logbook_validasi`
  ADD CONSTRAINT `logbook_validasi_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_validasi_logbook_id_foreign` FOREIGN KEY (`LOGBOOK_ID`) REFERENCES `logbook_pekerjaan` (`LOGBOOK_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logbook_validasi_validator_karyawan_id_foreign` FOREIGN KEY (`VALIDATOR_KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `login_history_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `master_batch`
--
ALTER TABLE `master_batch`
  ADD CONSTRAINT `master_batch_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `master_batch_created_by_karyawan_foreign` FOREIGN KEY (`CREATED_BY_KARYAWAN`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `master_batch_satuan_foreign` FOREIGN KEY (`SATUAN`) REFERENCES `master_satuan_barang` (`KODE_SATUAN`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `master_gudang`
--
ALTER TABLE `master_gudang`
  ADD CONSTRAINT `master_gudang_id_company_foreign` FOREIGN KEY (`id_company`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `master_hari`
--
ALTER TABLE `master_hari`
  ADD CONSTRAINT `master_hari_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_karyawan`
--
ALTER TABLE `master_karyawan`
  ADD CONSTRAINT `master_karyawan_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `master_karyawan_email_foreign` FOREIGN KEY (`EMAIL`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `master_karyawan_shift_foreign` FOREIGN KEY (`SHIFT`) REFERENCES `master_shift` (`NAMA_SHIFT`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `master_komponen_gaji`
--
ALTER TABLE `master_komponen_gaji`
  ADD CONSTRAINT `master_komponen_gaji_karyawan_id_foreign` FOREIGN KEY (`KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_nama_produk`
--
ALTER TABLE `master_nama_produk`
  ADD CONSTRAINT `master_nama_produk_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_payroll`
--
ALTER TABLE `master_payroll`
  ADD CONSTRAINT `master_payroll_karyawan_id_foreign` FOREIGN KEY (`KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `master_payroll_user_id_foreign` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `master_pengajuan`
--
ALTER TABLE `master_pengajuan`
  ADD CONSTRAINT `master_pengajuan_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_presensi`
--
ALTER TABLE `master_presensi`
  ADD CONSTRAINT `master_presensi_karyawan_id_foreign` FOREIGN KEY (`KARYAWAN_ID`) REFERENCES `master_karyawan` (`KARYAWAN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_rak`
--
ALTER TABLE `master_rak`
  ADD CONSTRAINT `master_rak_id_company_foreign` FOREIGN KEY (`id_company`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `master_rak_kode_gudang_foreign` FOREIGN KEY (`KODE_GUDANG`) REFERENCES `master_gudang` (`KODE_GUDANG`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_vendor`
--
ALTER TABLE `master_vendor`
  ADD CONSTRAINT `master_vendor_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran_beli`
--
ALTER TABLE `pembayaran_beli`
  ADD CONSTRAINT `pembayaran_beli_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pembayaran_beli_no_invoice_beli_foreign` FOREIGN KEY (`NO_INVOICE_BELI`) REFERENCES `inv_pembelian` (`NO_INVOICE_BELI`);

--
-- Constraints for table `pembayaran_penjualan`
--
ALTER TABLE `pembayaran_penjualan`
  ADD CONSTRAINT `pembayaran_penjualan_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stok_lokasi`
--
ALTER TABLE `stok_lokasi`
  ADD CONSTRAINT `stok_lokasi_barang_kode_foreign` FOREIGN KEY (`BARANG_KODE`) REFERENCES `master_barang` (`BARANG_KODE`) ON UPDATE CASCADE,
  ADD CONSTRAINT `stok_lokasi_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stok_lokasi_kode_gudang_foreign` FOREIGN KEY (`KODE_GUDANG`) REFERENCES `master_gudang` (`KODE_GUDANG`) ON UPDATE CASCADE,
  ADD CONSTRAINT `stok_lokasi_kode_rak_foreign` FOREIGN KEY (`KODE_RAK`) REFERENCES `master_rak` (`KODE_RAK`) ON UPDATE CASCADE;

--
-- Constraints for table `superadmin`
--
ALTER TABLE `superadmin`
  ADD CONSTRAINT `superadmin_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tr_barang_keluar`
--
ALTER TABLE `tr_barang_keluar`
  ADD CONSTRAINT `tr_barang_keluar_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tr_barang_keluar_no_pengiriman_foreign` FOREIGN KEY (`NO_PENGIRIMAN`) REFERENCES `inv_pengiriman_h` (`NO_PENGIRIMAN`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tr_barang_masuk`
--
ALTER TABLE `tr_barang_masuk`
  ADD CONSTRAINT `tr_barang_masuk_barang_kode_foreign` FOREIGN KEY (`BARANG_KODE`) REFERENCES `master_barang` (`BARANG_KODE`),
  ADD CONSTRAINT `tr_barang_masuk_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tr_barang_masuk_kode_gudang_foreign` FOREIGN KEY (`KODE_GUDANG`) REFERENCES `master_gudang` (`KODE_GUDANG`),
  ADD CONSTRAINT `tr_barang_masuk_kode_rak_foreign` FOREIGN KEY (`KODE_RAK`) REFERENCES `master_rak` (`KODE_RAK`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
