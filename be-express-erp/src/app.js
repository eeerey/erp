import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "path";
import { setResponseHeader } from "./middleware/set-headers.js";

// ── Auth & User
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ── Master Data
import masterVendorRoutes from "./routes/masterVendorRoutes.js";
import masterHariRoutes from "./routes/masterHariRoutes.js";
import masterKaryawanRoutes from "./routes/masterKaryawanRoutes.js";
import masterPerusahaanRoutes from "./routes/masterPerusahaanRoutes.js";
import masterPengajuanRoutes from "./routes/masterPengajuanRoutes.js";
import masterCustomerRoutes from "./routes/masterCustomerRoutes.js";

// ── SDM
import batchRoutes from "./routes/masterBatchRoutes.js";
import batchKaryawanRoutes from "./routes/batchKaryawanRoutes.js";
import logbookRoutes from "./routes/logbookPekerjaanRoutes.js";
import rekapitulasiKinerjaRoutes from "./routes/rekapitulasiKinerjaRoutes.js";
import masterPresensiRoutes from "./routes/masterPresensiRoutes.js";

// ── PAYROLL (baru)
import masterGajiJabatanRoutes from "./routes/masterGajiJabatanRoutes.js";
import masterKomponenGajiRoutes from "./routes/masterKomponenGajiRoutes.js";
import masterPayrollRoutes from "./routes/masterPayrollRoutes.js";
import customerProfitRoutes from "./routes/customerProfitRoutes.js";
import produkHppRoutes from "./routes/produkHppRoutes.js";
import labaErpRoutes from "./routes/labaErpRoutes.js";
import labaBarangRoutes from "./routes/labaBarangRoutes.js";
import fakturPenjualanRoutes from "./routes/fakturPenjualanRoutes.js";

// ── Inventaris
import masterJenisBarangRoutes from "./routes/masterJenisBarangRoutes.js";
import masterSatuanBarangRoutes from "./routes/masterSatuanBarangRoutes.js";
import masterBarangRoutes from "./routes/masterBarangRoutes.js";
import masterGudangRoutes from "./routes/masterGudangRoutes.js";
import masterRakRoutes from "./routes/masterRakRoutes.js";
import stokLokasiRoutes from "./routes/stokLokasiRoutes.js";
import jenisProduksiRoutes from "./routes/jenisProduksiRoutes.js";
import produksiGudangRoutes from "./routes/produksiGudangRoutes.js";
import produkRoutes from "./routes/produkRoutes.js";
import hargaJualRoutes from "./routes/hargaJualRoutes.js";

// ── Transaksi
import trBarangMasukRoutes from "./routes/trBarangMasukRoutes.js";
import trBarangKeluarRoutes from "./routes/trBarangKeluarRoutes.js";
import invPembelianRoutes from "./routes/invPembelianRoutes.js";
import invPengirimanRoutes from "./routes/invPengirimanRoutes.js";
import pembayaranBeliRoutes from "./routes/pembayaranBeliRoutes.js";
import hppErpRoutes from "./routes/hppErpRoutes.js";
import productPerformanceRoutes from "./routes/productPerformanceRoutes.js";

// ── PAYMENT
import paymentRoutes from "./routes/paymentRoutes.js";

//log user
import activityLogRoutes from "./routes/activityLogRoutes.js";

const app = express();

// ── Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3005",
  "http://223.27.152.100:3005",
  "http://rintisku.id",
  "https://rintisku.id",
  "http://www.rintisku.id",
  "https://www.rintisku.id"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Timestamp",
      "X-Signature",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200,
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", [setResponseHeader], (req, res) => {
  return res
    .status(200)
    .json(`Welcome to the server! ${new Date().toLocaleString()}`);
});

// ════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════

// Auth & User
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Master Data
app.use("/api/master-vendor", masterVendorRoutes);
app.use("/api/master-hari", masterHariRoutes);
app.use("/api/master-karyawan", masterKaryawanRoutes);
app.use("/api/master-perusahaan", masterPerusahaanRoutes);
app.use("/api/master-pengajuan", masterPengajuanRoutes);
app.use("/api/master-customer", masterCustomerRoutes);

// SDM
app.use("/api/master-batch", batchRoutes);
app.use("/api/batch-karyawan", batchKaryawanRoutes);
app.use("/api/logbook-pekerjaan", logbookRoutes);
app.use("/api/rekapitulasi-kinerja", rekapitulasiKinerjaRoutes);
app.use("/api/master-presensi", masterPresensiRoutes);

// PAYROLL
app.use("/api/master-gaji-jabatan", masterGajiJabatanRoutes);
app.use("/api/master-komponen-gaji", masterKomponenGajiRoutes);
app.use("/api/master-payroll", masterPayrollRoutes);
app.use("/api/biaya-operasional", masterPayrollRoutes);
app.use("/api/customerProfit", customerProfitRoutes);
app.use("/api/produk-hpp", produkHppRoutes);
app.use("/api/labaErp", labaErpRoutes);
app.use("/api/labaBarang", labaBarangRoutes);
app.use("/api/fakturPenjualan", fakturPenjualanRoutes);

// Inventaris
app.use("/api/master-jenis-barang", masterJenisBarangRoutes);
app.use("/api/master-satuan-barang", masterSatuanBarangRoutes);
app.use("/api/master-barang", masterBarangRoutes);
app.use("/api/master-gudang", masterGudangRoutes);
app.use("/api/master-rak", masterRakRoutes);
app.use("/api/stok-lokasi", stokLokasiRoutes);
app.use("/api/jenis-produksi", jenisProduksiRoutes);
app.use("/api/produksi-gudang", produksiGudangRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/harga-jual", hargaJualRoutes);

// Transaksi
app.use("/api/barang-masuk", trBarangMasukRoutes);
app.use("/api/tr-barang-keluar", trBarangKeluarRoutes);
app.use("/api/inv-pembelian", invPembelianRoutes);
app.use("/api/inv-pengiriman", invPengirimanRoutes);
app.use("/api/pembayaran-beli", pembayaranBeliRoutes);
app.use("/api/hppErp", hppErpRoutes);
app.use("/api/productPerformance", productPerformanceRoutes);

// ── PAYMENT
app.use("/api/payment", paymentRoutes);

// ── Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Log User
app.use("/api/admin", activityLogRoutes);

export default app;
