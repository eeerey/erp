import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * 🔹 Universal upload function dengan dynamic subfolder berdasarkan fieldname
 */
const createUpload = (defaultFolder, filePrefix = "") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Menentukan folder secara dinamis berdasarkan nama field form data
      let folderName = defaultFolder;

      if (file.fieldname === "foto_ktp") {
        folderName = "foto_ktp";
      } else if (file.fieldname === "foto_karyawan") {
        folderName = "foto_karyawan";
      }

      const uploadDir = `./uploads/${folderName}`;

      // Buat folder secara otomatis jika belum ada
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Format: prefix-timestamp-random.ext
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const prefix = filePrefix ? `${filePrefix}-` : "";
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    },
  });

  // Filter hanya menerima file gambar
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
      cb(null, true);
    } else {
      cb(
        new Error("Hanya file gambar yang diizinkan (jpg, jpeg, png, gif)"),
        false,
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });
};

/**
 * 🔹 Helper Function untuk Menghapus Berkas Lama
 */
export const removeFile = (filePath) => {
  if (!filePath) return;
  // Hapus slash di awal jika ada
  const cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
  const fullPath = path.join(process.cwd(), cleanPath);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Gagal menghapus file lama (${fullPath}):`, err);
    });
  }
};

/**
 * ✅ EXPORT MIDDLEWARE
 */
export const uploadPresensi = createUpload("presensi", "presensi");
export const uploadKaryawan = createUpload("foto_karyawan", "karyawan");
export const uploadLogbook = createUpload("foto_logbook", "logbook");
export const uploadBatch = createUpload("foto_batch", "batch");

export default uploadKaryawan;
