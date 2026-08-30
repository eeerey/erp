import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * 🔹 Universal upload function dengan dynamic subfolder berdasarkan fieldname
 */
const createUpload = (defaultFolder, filePrefix = "") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folderName = defaultFolder;

      if (file.fieldname === "foto_umkm") {
        folderName = "foto_umkm";
      } else if (file.fieldname === "foto_karyawan") {
        folderName = "foto_karyawan";
      }

      const uploadDir = `./uploads/${folderName}`;

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const prefix = filePrefix ? `${filePrefix}-` : "";
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    },
  });

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
      fileSize: 5 * 1024 * 1024, // 5MB limit per file
    },
  });
};

/**
 * 🔹 Middleware Wrapper untuk Menangkap Eror Multer secara Rapi
 */
export const handleUpload = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: "GAGAL",
            message: "Ukuran berkas terlalu besar! Maksimal 5MB per berkas.",
          });
        }
        return res.status(400).json({
          status: "GAGAL",
          message: `Gagal mengunggah berkas: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          status: "GAGAL",
          message: err.message,
        });
      }
      next();
    });
  };
};

/**
 * 🔹 Helper Function untuk Menghapus Berkas Lama
 */
export const removeFile = (filePath) => {
  if (!filePath) return;
  const cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
  const fullPath = path.join(process.cwd(), cleanPath);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Gagal menghapus file lama (${fullPath}):`, err);
    });
  }
};

export const uploadPresensi = createUpload("presensi", "presensi");
export const uploadKaryawan = createUpload("foto_karyawan", "karyawan");
export const uploadLogbook = createUpload("foto_logbook", "logbook");
export const uploadBatch = createUpload("foto_batch", "batch");

// 👈 FIX UTAMA: Definisikan susunan field yang menerima MULTIPLE foto_umkm (1-3 file)
export const uploadKaryawanFiles = uploadKaryawan.fields([
  { name: "foto_karyawan", maxCount: 1 },
  { name: "foto_umkm", maxCount: 3 }, // Menerima hingga 3 berkas foto UMKM
  { name: "foto_ktp", maxCount: 1 },
]);

export default uploadKaryawan;
