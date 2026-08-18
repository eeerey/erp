import { z } from "zod";

/**
 * Schema validasi untuk register general user
 */
export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z
    .enum(
      ["SUPERADMIN", "OWNER", "GUDANG", "PRODUKSI", "HR", "KEUANGAN", "SDM"],
      { message: "Role tidak valid" },
    )
    .default("GUDANG"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
});

/**
 * Schema validasi untuk login
 */
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

/**
 * Schema validasi untuk kirim ulang email verifikasi
 */
export const resendVerificationSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

/**
 * Schema validasi untuk register karyawan
 */
export const registerKaryawanSchema = z.object({
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),

  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["HR", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM", "KARYAWAN"]),

  nik: z.string().min(1, "NIK wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["L", "P"], { message: "Gender harus 'L' atau 'P'" }),

  tempat_lahir: z.string().optional().nullable(),
  tgl_lahir: z.string().optional().nullable(), // format: YYYY-MM-DD
  alamat: z.string().optional().nullable(),
  no_telp: z.string().optional().nullable(),

  departemen: z.string().min(1, "Departemen wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  tanggal_masuk: z.string().optional().nullable(),

  status_karyawan: z.enum(["Tetap", "Kontrak", "Magang"]).optional().nullable(),
  shift: z.enum(["Pagi", "Siang", "Malam", ""]).optional().nullable(),
  pendidikan_terakhir: z.string().optional().nullable(),
  npwp: z.string().optional().nullable(),
  nib: z.string().optional().nullable(),
});
