'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
// >>> BARU: dipakai untuk menampilkan tabel riwayat di dalam Dialog
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Plus, Trash2, Package, Users, Layers, Calculator, Save, Sliders, History, Eye, Pencil, X } from 'lucide-react';

import api from '@/lib/api';

const ICONS = { bahan: Package, tenaga: Users, overhead: Layers };

/* =========================================================
   HELPER
========================================================= */

const getToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('jwt') ||
        sessionStorage.getItem('token') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('access_token') ||
        sessionStorage.getItem('jwt')
    );
};

const authConfig = () => {
    const token = getToken();

    return {
        headers: {
            ...(token
                ? {
                      Authorization: `Bearer ${token}`
                  }
                : {}),
            'Content-Type': 'application/json'
        }
    };
};

const formatRupiah = (value) => {
    return `Rp ${Math.round(Number(value) || 0).toLocaleString('id-ID')}`;
};

const createId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/* =========================================================
   FUNGSI KONVERSI SATUAN
   >>> DIPINDAHKAN KE MODULE-LEVEL (di luar komponen) <<<
   Ini kunci perbaikannya: karena dipakai di KalkulasiBaruPage
   DAN di HppTable, fungsi ini tidak boleh berada di dalam
   salah satu komponen saja, harus berada di scope module
   supaya bisa diakses oleh semua komponen di file ini.
========================================================= */

const hitungHargaSatuanPemakaian = ({ hargaMaster, satuanMaster, satuanPemakaian, daftarSatuan = [] }) => {
    const harga = Number(hargaMaster) || 0;

    if (!satuanPemakaian || harga <= 0) {
        return 0;
    }

    const normalize = (value) =>
        String(value ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '');

    // Jika satuan sama
    if (normalize(satuanMaster) === normalize(satuanPemakaian)) {
        return harga;
    }

    const unitMaster = daftarSatuan.find((unit) => normalize(unit.NAMA_SATUAN) === normalize(satuanMaster));

    const unitPemakaian = daftarSatuan.find((unit) => normalize(unit.NAMA_SATUAN) === normalize(satuanPemakaian));

    if (!unitMaster || !unitPemakaian) {
        return 0;
    }

    const faktorMaster = Number(unitMaster.FAKTOR_DASAR);
    const faktorPemakaian = Number(unitPemakaian.FAKTOR_DASAR);

    // >>> DIPERBAIKI: normalisasi KELOMPOK (trim + lowercase, tanpa spasi)
    // supaya konsisten dengan perbandingan di backend model
    // (yang pakai .trim().toUpperCase()). Sebelumnya FE membandingkan
    // KELOMPOK secara strict (===) tanpa normalisasi, sehingga kalau
    // data KELOMPOK di database punya variasi huruf besar/kecil atau
    // spasi ekstra, konversi harga jadi gagal secara tidak konsisten
    // (kadang cocok kadang tidak, tergantung data barang/satuannya).
    const kelompokMaster = normalize(unitMaster.KELOMPOK);
    const kelompokPemakaian = normalize(unitPemakaian.KELOMPOK);

    if (!kelompokMaster || !kelompokPemakaian || kelompokMaster !== kelompokPemakaian || faktorMaster <= 0 || faktorPemakaian <= 0) {
        return 0;
    }

    return (harga * faktorPemakaian) / faktorMaster;
};

/* =========================================================
   PAGE UTAMA
========================================================= */

export default function KalkulasiBaruPage() {
    const [namaProduk, setNamaProduk] = useState('');
    const [jumlahPorsi, setJumlahPorsi] = useState('');
    const [targetMargin, setTargetMargin] = useState(50);
    const [hargaJualFinal, setHargaJualFinal] = useState('');

    const [masterBarang, setMasterBarang] = useState([]);
    const [loadingBarang, setLoadingBarang] = useState(false);
    const [daftarSatuan, setDaftarSatuan] = useState([]);

    const [bahanBakuLangsung, setBahanBakuLangsung] = useState([]);
    const [bahanBakuTidakLangsung, setBahanBakuTidakLangsung] = useState([]);
    const [tenagaKerja, setTenagaKerja] = useState([]);
    const [overhead, setOverhead] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    // >>> BARU: state untuk fitur Riwayat (muncul di page yang sama)
    const [showRiwayat, setShowRiwayat] = useState(false);
    const [riwayat, setRiwayat] = useState([]);
    const [loadingRiwayat, setLoadingRiwayat] = useState(false);

    const [showDetailRiwayat, setShowDetailRiwayat] = useState(false);
    const [detailRiwayat, setDetailRiwayat] = useState(null);
    const [loadingDetailRiwayat, setLoadingDetailRiwayat] = useState(false);

    // >>> BARU: id riwayat yang sedang diedit. null = mode "buat baru"
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMasterBarang();
        fetchMasterSatuan();
    }, []);

    const fetchMasterBarang = async () => {
        try {
            setLoadingBarang(true);
            setErrorMessage('');

            const response = await api.get('/hppKalkulasi/master-barang', authConfig());
            const data = response?.data?.data ?? response?.data ?? [];
            setMasterBarang(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('FETCH MASTER BARANG ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal mengambil data master barang';
            setErrorMessage(errorMsg);
        } finally {
            setLoadingBarang(false);
        }
    };

    const fetchMasterSatuan = async () => {
        try {
            const response = await api.get('/hppKalkulasi/master-satuan', authConfig());

            const data = response?.data?.data ?? response?.data ?? [];

            setDaftarSatuan(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('FETCH MASTER SATUAN ERROR:', error);

            setDaftarSatuan([]);
        }
    };

    /* =====================================================
       >>> BARU: RIWAYAT KALKULASI HPP
       Dibuka lewat tombol "Riwayat" di bagian bawah page.
       Butuh 2 endpoint baru di backend:
       - GET /hppKalkulasi         -> daftar riwayat
       - GET /hppKalkulasi/:id     -> detail 1 riwayat
    ===================================================== */

    const bukaRiwayat = () => {
        setShowRiwayat(true);
        fetchRiwayat();
    };

    const fetchRiwayat = async () => {
        try {
            setLoadingRiwayat(true);
            setErrorMessage('');

            const response = await api.get('/hppKalkulasi', authConfig());
            const data = response?.data?.data ?? response?.data ?? [];

            setRiwayat(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('FETCH RIWAYAT HPP ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal mengambil riwayat HPP';
            setErrorMessage(errorMsg);
        } finally {
            setLoadingRiwayat(false);
        }
    };

    const lihatDetailRiwayat = async (row) => {
        try {
            setLoadingDetailRiwayat(true);
            setShowDetailRiwayat(true);
            setDetailRiwayat(null);

            const response = await api.get(`/hppKalkulasi/${row.id}`, authConfig());
            // >>> getById mengembalikan { header, detail } - disimpan apa adanya,
            // lalu dibaca sesuai bentuk itu di bagian render Dialog Detail di bawah.
            const data = response?.data?.data ?? response?.data ?? null;

            setDetailRiwayat(data);
        } catch (error) {
            console.error('FETCH DETAIL RIWAYAT ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal mengambil detail riwayat';
            setErrorMessage(errorMsg);
            setShowDetailRiwayat(false);
        } finally {
            setLoadingDetailRiwayat(false);
        }
    };

    /* =====================================================
       >>> BARU: HAPUS RIWAYAT
       Konfirmasi dulu sebelum memanggil DELETE /hppKalkulasi/:id
    ===================================================== */

    const konfirmasiHapusRiwayat = (row) => {
        confirmDialog({
            message: `Yakin ingin menghapus riwayat "${row.nama_produk_jadi || row.namaProduk || 'ini'}"? Data yang sudah dihapus tidak bisa dikembalikan.`,
            header: 'Konfirmasi Hapus Riwayat',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ya, Hapus',
            rejectLabel: 'Batal',
            acceptClassName: 'p-button-danger',
            accept: () => hapusRiwayat(row)
        });
    };

    const hapusRiwayat = async (row) => {
        try {
            setLoadingRiwayat(true);
            setErrorMessage('');

            await api.delete(`/hppKalkulasi/${row.id}`, authConfig());

            setMessage('Riwayat HPP berhasil dihapus');

            // Kalau yang dihapus adalah data yang sedang diedit, batalkan mode edit
            if (editingId && String(editingId) === String(row.id)) {
                batalEdit();
            }

            fetchRiwayat();
        } catch (error) {
            console.error('HAPUS RIWAYAT ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal menghapus riwayat';
            setErrorMessage(errorMsg);
        } finally {
            setLoadingRiwayat(false);
        }
    };

    /* =====================================================
       >>> BARU: EDIT RIWAYAT
       Ambil detail data lalu isi ulang seluruh form supaya
       user bisa mengubahnya. Saat disimpan (simpanHPP),
       karena editingId terisi, otomatis akan memanggil
       PUT /hppKalkulasi/:id alih-alih POST /hppKalkulasi.
    ===================================================== */

    const editRiwayat = async (row) => {
        try {
            setLoadingRiwayat(true);
            setErrorMessage('');

            const response = await api.get(`/hppKalkulasi/${row.id}`, authConfig());
            const result = response?.data?.data ?? response?.data ?? null;

            // >>> PENTING: getById mengembalikan { header, detail }
            // header = 1 baris dari tabel hpp_kalkulasi
            // detail = array flat dari hpp_kalkulasi_detail, dibedakan
            //          lewat kolom "kategori"
            const header = result?.header;
            const detailList = Array.isArray(result?.detail) ? result.detail : [];

            if (!header) {
                throw new Error('Data riwayat tidak ditemukan');
            }

            // Isi ulang info produk (nama kolom snake_case sesuai tabel hpp_kalkulasi)
            setNamaProduk(header.nama_produk_jadi || '');
            setJumlahPorsi(header.jumlah_porsi ?? '');
            setTargetMargin(header.target_margin ?? 50);
            setHargaJualFinal(header.harga_jual_final ?? '');

            // Pisahkan detail flat berdasarkan kategori
            const byKategori = (kategori) => detailList.filter((item) => item.kategori === kategori);

            // Bahan baku: cocokkan lagi ke masterBarang untuk dapat
            // satuanMaster & hargaMaster (dua ini tidak disimpan di tabel detail,
            // yang tersimpan hanya harga_satuan hasil konversi saat itu)
            const mapBahanBaku = (list) =>
                list.map((item) => {
                    const barangKode = item.barang_kode;
                    const barang = masterBarang.find((b) => String(b.BARANG_KODE) === String(barangKode));

                    const satuanMaster = barang?.NAMA_SATUAN ?? barang?.nama_satuan ?? barang?.NAMA_SATUAN_BARANG ?? barang?.SATUAN ?? barang?.satuan ?? '';

                    const hargaMaster = Number(barang?.HARGA_BELI_TERAKHIR ?? barang?.harga_beli_terakhir ?? barang?.HARGA_BELI ?? barang?.harga_beli ?? 0);

                    return {
                        id: createId(),
                        barangKode,
                        nama: barang?.NAMA_BARANG || item.nama_item || '',
                        satuan: item.satuan || '',
                        satuanMaster,
                        hargaMaster,
                        hargaSatuan: 0,
                        jumlah: item.jumlah ?? ''
                    };
                });

            // Tenaga kerja / overhead: field-nya sudah lengkap di tabel detail
            const mapManual = (list) =>
                list.map((item) => ({
                    id: createId(),
                    nama: item.nama_item || '',
                    jumlah: item.jumlah ?? '',
                    satuan: item.satuan || '',
                    hargaSatuan: item.harga_satuan ?? 0,
                    // >>> BARU: baca kembali nilai jam yang tersimpan (kolom baru di tabel detail)
                    jam: item.jam ?? 1
                }));

            setBahanBakuLangsung(mapBahanBaku(byKategori('BAHAN_BAKU_LANGSUNG')));
            setBahanBakuTidakLangsung(mapBahanBaku(byKategori('BAHAN_BAKU_TIDAK_LANGSUNG')));
            setTenagaKerja(mapManual(byKategori('TENAGA_KERJA')));
            setOverhead(mapManual(byKategori('OVERHEAD')));

            setEditingId(row.id);
            setShowRiwayat(false);
            setMessage(`Sedang mengedit: ${header.nama_produk_jadi || ''}`);

            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('EDIT RIWAYAT ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal memuat data untuk edit';
            setErrorMessage(errorMsg);
        } finally {
            setLoadingRiwayat(false);
        }
    };

    const batalEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const formatTanggalRiwayat = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /* =====================================================
       PERHITUNGAN TOTAL PER SECTION
       (memakai hitungHargaSatuanPemakaian dari module-level)
    ===================================================== */

    const calculateBahanBakuTotal = (items) => {
        if (!Array.isArray(items)) return 0;

        return items.reduce((total, item) => {
            const jumlah = Number(item.jumlah) || 0;

            const hargaSatuan = hitungHargaSatuanPemakaian({
                hargaMaster: item.hargaMaster,
                satuanMaster: item.satuanMaster,
                satuanPemakaian: item.satuan,
                daftarSatuan
            });

            return total + jumlah * hargaSatuan;
        }, 0);
    };

    const calculateManualTotal = (items) => {
        if (!Array.isArray(items)) return 0;

        return items.reduce((total, item) => {
            const jumlah = Number(item.jumlah) || 0;
            const harga = Number(item.hargaSatuan) || 0;
            const jam = Number(item.jam) || 1;

            return total + jumlah * harga * jam;
        }, 0);
    };

    const totalBBL = useMemo(() => calculateBahanBakuTotal(bahanBakuLangsung), [bahanBakuLangsung, daftarSatuan]);
    const totalBBTL = useMemo(() => calculateBahanBakuTotal(bahanBakuTidakLangsung), [bahanBakuTidakLangsung, daftarSatuan]);
    const totalTK = useMemo(() => calculateManualTotal(tenagaKerja), [tenagaKerja]);
    const totalOH = useMemo(() => calculateManualTotal(overhead), [overhead]);

    const totalBiayaProduksi = useMemo(() => {
        return totalBBL + totalBBTL + totalTK + totalOH;
    }, [totalBBL, totalBBTL, totalTK, totalOH]);

    const hppPerPorsi = useMemo(() => {
        const qty = Number(jumlahPorsi) || 0;
        if (qty <= 0) return 0;
        return Math.round(totalBiayaProduksi / qty);
    }, [totalBiayaProduksi, jumlahPorsi]);

    const rekomendasiHargaJual = useMemo(() => {
        const margin = Number(targetMargin) || 0;
        return Math.round(hppPerPorsi + (hppPerPorsi * margin) / 100);
    }, [hppPerPorsi, targetMargin]);

    const hargaJualDipakai = useMemo(() => {
        const harga = Number(hargaJualFinal) || 0;
        if (harga > 0) return harga;
        return rekomendasiHargaJual;
    }, [hargaJualFinal, rekomendasiHargaJual]);

    const profitPerPorsi = useMemo(() => {
        return hargaJualDipakai - hppPerPorsi;
    }, [hargaJualDipakai, hppPerPorsi]);

    const totalProfit = useMemo(() => {
        const qty = Number(jumlahPorsi) || 0;
        return profitPerPorsi * qty;
    }, [profitPerPorsi, jumlahPorsi]);

    const validateBahanBaku = (items, label) => {
        if (!Array.isArray(items)) return null;

        for (const item of items) {
            if (!item.barangKode) {
                return `${label}: silakan pilih barang`;
            }

            if ((Number(item.jumlah) || 0) <= 0) {
                return `${label}: jumlah harus lebih dari 0`;
            }

            if (!item.satuan?.trim()) {
                return `${label}: satuan pemakaian wajib diisi`;
            }

            if (!item.satuanMaster) {
                return `${label}: satuan master barang tidak ditemukan`;
            }

            const hargaSatuan = hitungHargaSatuanPemakaian({
                hargaMaster: item.hargaMaster,
                satuanMaster: item.satuanMaster,
                satuanPemakaian: item.satuan,
                daftarSatuan
            });

            if (!hargaSatuan || hargaSatuan <= 0) {
                return `${label}: satuan "${item.satuan}" tidak dapat dikonversi dari satuan master "${item.satuanMaster}"`;
            }
        }

        return null;
    };

    const validateManualItems = (items, label) => {
        if (!Array.isArray(items)) return null;
        for (const item of items) {
            if (!item.nama?.trim()) return `${label}: nama wajib diisi`;
            if (Number(item.jumlah) <= 0) return `${label}: jumlah harus lebih dari 0`;
            if (!item.satuan?.trim()) return `${label}: satuan wajib diisi`;
            if (Number(item.hargaSatuan) < 0) return `${label}: harga satuan tidak boleh negatif`;
        }
        return null;
    };

    const prepareBahanBaku = (items) => {
        return items.map((item) => ({
            barangKode: item.barangKode,
            jumlah: Number(item.jumlah) || 0,
            satuan: item.satuan?.trim() || ''
        }));
    };

    const prepareManualItemsPayload = (items) => {
        return items.map((item) => ({
            nama: item.nama?.trim() || '',
            jumlah: Number(item.jumlah) || 0,
            satuan: item.satuan?.trim() || '',
            hargaSatuan: Number(item.hargaSatuan) || 0,
            // >>> BARU: kirim juga pengali jam/hari/dst, sebelumnya tidak
            // pernah dikirim sehingga backend selalu menghitung tanpa pengali
            jam: Number(item.jam) || 1
        }));
    };

    const validateForm = () => {
        if (!namaProduk.trim()) return 'Nama menu / produk wajib diisi';
        if (!jumlahPorsi || Number(jumlahPorsi) <= 0) return 'Jumlah porsi harus lebih dari 0';

        const errBBL = validateBahanBaku(bahanBakuLangsung, 'Bahan Baku Langsung');
        if (errBBL) return errBBL;

        const errBBTL = validateBahanBaku(bahanBakuTidakLangsung, 'Bahan Baku Tidak Langsung');
        if (errBBTL) return errBBTL;

        const errTK = validateManualItems(tenagaKerja, 'Tenaga Kerja');
        if (errTK) return errTK;

        const errOH = validateManualItems(overhead, 'Biaya Overhead');
        if (errOH) return errOH;

        return null;
    };

    const simpanHPP = async () => {
        try {
            setLoading(true);
            setMessage('');
            setErrorMessage('');

            const validation = validateForm();
            if (validation) throw new Error(validation);

            const payload = {
                nama_produk_jadi: namaProduk.trim(),
                jumlahPorsi: Number(jumlahPorsi),
                bahanBakuLangsung: prepareBahanBaku(bahanBakuLangsung),
                bahanBakuTidakLangsung: prepareBahanBaku(bahanBakuTidakLangsung),
                tenagaKerja: prepareManualItemsPayload(tenagaKerja),
                overhead: prepareManualItemsPayload(overhead),
                targetMargin: Number(targetMargin) || 0,
                hargaJualFinal: Number(hargaJualFinal) || 0
            };

            if (editingId) {
                // Mode edit: update data yang sudah ada
                await api.put(`/hppKalkulasi/${editingId}`, payload, authConfig());
                setMessage('HPP kalkulasi berhasil diupdate');
            } else {
                // Mode baru: simpan data baru
                await api.post('/hppKalkulasi', payload, authConfig());
                setMessage('HPP kalkulasi berhasil disimpan');
            }

            resetForm();
        } catch (error) {
            console.error('SIMPAN HPP ERROR:', error);
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal menyimpan HPP';
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const confirmSimpan = () => {
        const validation = validateForm();
        if (validation) {
            setErrorMessage(validation);
            return;
        }

        confirmDialog({
            message: 'Apakah Anda yakin ingin menyimpan kalkulasi HPP ini?',
            header: 'Konfirmasi Simpan HPP',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ya, Simpan',
            rejectLabel: 'Batal',
            acceptClassName: 'p-button-success',
            accept: simpanHPP
        });
    };

    const resetForm = () => {
        setNamaProduk('');
        setJumlahPorsi('');
        setTargetMargin(50);
        setHargaJualFinal('');
        setBahanBakuLangsung([]);
        setBahanBakuTidakLangsung([]);
        setTenagaKerja([]);
        setOverhead([]);
        setMessage('');
        setErrorMessage('');
        setEditingId(null); // >>> BARU: keluar dari mode edit juga saat reset
    };

    return (
        <div className="p-4">
            <ConfirmDialog />

            {/* HEADER GRADIENT */}
            <HeaderHpp />

            {/* MESSAGE SUCCESS */}
            {message && (
                <div className="p-3 mb-3 border-round" style={{ background: '#DEE6D6', color: '#2E4A2C', border: '1px solid #5C7A5A' }}>
                    {message}
                </div>
            )}

            {/* MESSAGE ERROR */}
            {errorMessage && (
                <div className="p-3 mb-3 border-round" style={{ background: '#F1DED3', color: '#8B321F', border: '1px solid #B5502E' }}>
                    {errorMessage}
                </div>
            )}

            {/* >>> BARU: BANNER MODE EDIT */}
            {editingId && (
                <div
                    className="p-3 mb-3 border-round"
                    style={{
                        background: '#FFF4DE',
                        color: '#8A5A00',
                        border: '1px solid #F0C36D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                    }}
                >
                    <span>Sedang mengedit riwayat kalkulasi. Simpan untuk memperbarui, atau batalkan untuk kembali membuat kalkulasi baru.</span>
                    <button
                        type="button"
                        onClick={batalEdit}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'transparent',
                            border: '1px solid #8A5A00',
                            color: '#8A5A00',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <X size={12} />
                        Batal Edit
                    </button>
                </div>
            )}

            {/* INFORMASI PRODUK (DIUBAH MENYESUAIKAN DESAIN HPP TABLE CARD & FIELD) */}
            <div className="hpp-table-card" style={{ '--accent': '#4f46e5', '--accent-soft': '#eef0ff' }}>
                <div className="hpp-table-head" style={{ marginBottom: '12px' }}>
                    <div className="hpp-table-title-row">
                        <div className="hpp-table-icon" style={{ background: '#eef0ff', color: '#4f46e5' }}>
                            <Package size={16} />
                        </div>
                        <div>
                            <h2 className="hpp-table-title" style={{ fontSize: '15px' }}>
                                Informasi Produk
                            </h2>
                            <span className="hpp-table-count">Detail menu dan jumlah porsi</span>
                        </div>
                    </div>
                </div>

                <div className="info-field-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Nama Menu / Produk</label>
                        <div className="info-field-wrap">
                            <input type="text" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} placeholder="Masukkan nama menu / produk" className="hpp-field" />
                        </div>
                    </div>
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Jumlah Porsi</label>
                        <div className="info-field-wrap" style={{ position: 'relative' }}>
                            <input type="number" min="1" step="any" value={jumlahPorsi} onChange={(e) => setJumlahPorsi(e.target.value)} placeholder="Jumlah porsi" className="hpp-field" />
                            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#8b95a1' }}>pcs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABEL-TABEL SECTION */}
            <HppTable title="Bahan Baku Langsung" items={bahanBakuLangsung} setItems={setBahanBakuLangsung} color="indigo" type="bahan" masterBarang={masterBarang} daftarSatuan={daftarSatuan} />

            <HppTable title="Bahan Baku Tidak Langsung" items={bahanBakuTidakLangsung} setItems={setBahanBakuTidakLangsung} color="emerald" type="bahan" masterBarang={masterBarang} daftarSatuan={daftarSatuan} />

            <HppTable title="Tenaga Kerja" items={tenagaKerja} setItems={setTenagaKerja} color="orange" type="tenaga" />

            <HppTable title="Biaya Overhead" items={overhead} setItems={setOverhead} color="indigo" type="overhead" />

            {/* INFO CARD UNTUK PARAMETER & RINGKASAN */}
            <div className="mb-4">
                <InfoCard
                    totalBBL={totalBBL}
                    totalBBTL={totalBBTL}
                    totalTK={totalTK}
                    totalOH={totalOH}
                    totalBiayaProduksi={totalBiayaProduksi}
                    hppPerPorsi={hppPerPorsi}
                    targetMargin={targetMargin}
                    setTargetMargin={setTargetMargin}
                    rekomendasiHargaJual={rekomendasiHargaJual}
                    hargaJualFinal={hargaJualFinal}
                    setHargaJualFinal={setHargaJualFinal}
                    hargaJualDipakai={hargaJualDipakai}
                    profitPerPorsi={profitPerPorsi}
                    totalProfit={totalProfit}
                    onSave={confirmSimpan}
                />
            </div>

            {/* ACTION TOMBOL BAWAH */}
            <div className="flex justify-content-end gap-2 mt-4">
                <Button label="Reset" icon="pi pi-refresh" severity="secondary" outlined type="button" onClick={resetForm} disabled={loading} />
                <Button label={loading ? 'Menyimpan...' : editingId ? 'Update HPP' : 'Simpan HPP'} icon="pi pi-save" type="button" onClick={confirmSimpan} loading={loading} disabled={loading || loadingBarang} />
                <Button label="Lihat Ringkasan" icon="pi pi-eye" severity="info" outlined type="button" onClick={() => setShowDialog(true)} />
                {/* >>> BARU: tombol buka riwayat kalkulasi HPP */}
                <Button label="Riwayat" icon="pi pi-history" severity="secondary" outlined type="button" onClick={bukaRiwayat} />
            </div>

            {/* DIALOG */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eef0ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calculator size={16} />
                        </div>
                        <div>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1d1f', display: 'block' }}>Ringkasan Kalkulasi HPP</span>
                            <span style={{ fontSize: '11.5px', color: '#8b95a1', fontWeight: '500' }}>Pratinjau hasil perhitungan produk</span>
                        </div>
                    </div>
                }
                visible={showDialog}
                style={{ width: '480px', borderRadius: '20px', overflow: 'hidden' }}
                onHide={() => setShowDialog(false)}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            >
                <div style={{ padding: '4px 0' }}>
                    {/* Nama Produk Banner */}
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#8b95a1', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Nama Menu / Produk</span>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1d1f', margin: 0 }}>{namaProduk || 'Belum diisi'}</h3>
                    </div>

                    {/* Detail Baris Kalkulasi */}
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '4px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Jumlah Porsi</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f', fontFamily: 'inherit' }}>{jumlahPorsi || 0} pcs</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Total Biaya Produksi</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f', fontFamily: 'inherit' }}>{formatRupiah(totalBiayaProduksi)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>HPP / Porsi</span>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#4f46e5', fontFamily: 'inherit' }}>{formatRupiah(hppPerPorsi)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Harga Jual / Porsi</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f', fontFamily: 'inherit' }}>{formatRupiah(hargaJualDipakai)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d9f6e' }}>Profit / Porsi</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0d9f6e', fontFamily: 'inherit' }}>{formatRupiah(profitPerPorsi)}</span>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* =====================================================
                >>> BARU: DIALOG RIWAYAT (daftar kalkulasi tersimpan)
            ===================================================== */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eef0ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <History size={16} />
                        </div>
                        <div>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1d1f', display: 'block' }}>Riwayat Kalkulasi HPP</span>
                            <span style={{ fontSize: '11.5px', color: '#8b95a1', fontWeight: '500' }}>Daftar kalkulasi yang pernah disimpan</span>
                        </div>
                    </div>
                }
                visible={showRiwayat}
                onHide={() => setShowRiwayat(false)}
                style={{ width: '760px', borderRadius: '20px', overflow: 'hidden' }}
                breakpoints={{ '960px': '85vw', '641px': '95vw' }}
            >
                <DataTable value={riwayat} loading={loadingRiwayat} paginator rows={8} emptyMessage="Belum ada riwayat kalkulasi HPP" stripedRows responsiveLayout="scroll">
                    <Column field="nama_produk_jadi" header="Nama Produk" sortable body={(row) => row.nama_produk_jadi || row.namaProduk || '-'} />
                    <Column field="jumlahPorsi" header="Porsi" sortable body={(row) => `${row.jumlahPorsi ?? row.jumlah_porsi ?? 0} pcs`} />
                    <Column field="hppPerPorsi" header="HPP / Porsi" sortable body={(row) => formatRupiah(row.hppPerPorsi ?? row.hpp_per_porsi)} />
                    <Column field="hargaJualDipakai" header="Harga Jual" sortable body={(row) => formatRupiah(row.hargaJualDipakai ?? row.harga_jual_final ?? row.harga_jual)} />
                    <Column field="createdAt" header="Tanggal" sortable body={(row) => formatTanggalRiwayat(row.createdAt ?? row.created_at)} />
                    <Column
                        header="Aksi"
                        style={{ textAlign: 'center', width: '140px' }}
                        body={(row) => (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button type="button" onClick={() => lihatDetailRiwayat(row)} className="hpp-del-btn" style={{ color: '#4f46e5', background: '#eef0ff' }} title="Lihat Detail">
                                    <Eye size={14} />
                                </button>

                                {/* >>> BARU: tombol Edit */}
                                <button type="button" onClick={() => editRiwayat(row)} className="hpp-del-btn" style={{ color: '#d97706', background: '#fef3e2' }} title="Edit">
                                    <Pencil size={14} />
                                </button>

                                {/* >>> BARU: tombol Hapus */}
                                <button type="button" onClick={() => konfirmasiHapusRiwayat(row)} className="hpp-del-btn" title="Hapus">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                    />
                </DataTable>
            </Dialog>

            {/* =====================================================
                >>> BARU: DIALOG DETAIL SATU RIWAYAT
            ===================================================== */}
            <Dialog header="Detail Kalkulasi HPP" visible={showDetailRiwayat} onHide={() => setShowDetailRiwayat(false)} style={{ width: '480px', borderRadius: '20px' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}>
                {loadingDetailRiwayat && <div style={{ padding: '20px 0', textAlign: 'center', color: '#8b95a1', fontSize: '13px' }}>Memuat detail...</div>}

                {!loadingDetailRiwayat && detailRiwayat?.header && (
                    <div style={{ padding: '4px 0' }}>
                        <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#8b95a1', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Nama Menu / Produk</span>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1d1f', margin: 0 }}>{detailRiwayat.header.nama_produk_jadi || '-'}</h3>
                        </div>

                        <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '4px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Jumlah Porsi</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>{detailRiwayat.header.jumlah_porsi ?? 0} pcs</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Total Biaya Produksi</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>{formatRupiah(detailRiwayat.header.total_biaya_produksi)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>HPP / Porsi</span>
                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#4f46e5' }}>{formatRupiah(detailRiwayat.header.hpp_per_porsi)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Harga Jual / Porsi</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>{formatRupiah(detailRiwayat.header.harga_jual_final)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d9f6e' }}>Profit / Porsi</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0d9f6e' }}>{formatRupiah(detailRiwayat.header.profit_per_porsi)}</span>
                            </div>
                        </div>

                        {/* Rincian item per kategori (opsional, dari detailRiwayat.detail) */}
                        {Array.isArray(detailRiwayat.detail) && detailRiwayat.detail.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#8b95a1', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Rincian Item</span>
                                <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '4px 16px', maxHeight: '220px', overflowY: 'auto' }}>
                                    {detailRiwayat.detail.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '10px 0',
                                                borderBottom: idx === detailRiwayat.detail.length - 1 ? 'none' : '1px solid #f0f1f3'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1d1f' }}>{item.nama_item}</div>
                                                <div style={{ fontSize: '11px', color: '#8b95a1' }}>
                                                    {item.jumlah} {item.satuan} &times; {formatRupiah(item.harga_satuan)}
                                                    {item.jam && Number(item.jam) !== 1 ? ` \u00d7 ${item.jam}` : ''}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>{formatRupiah(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    );
}

/* =========================================================
   KOMPONEN HEADER HPP (GRADIENT STYLING)
========================================================= */

function HeaderHpp() {
    const cssStyles = `
    .hpp-header {
      position: relative;
      background: linear-gradient(135deg, #4338ca 0%, #4f46e5 45%, #6366f1 100%);
      border-radius: 20px;
      padding: 28px 32px;
      margin-bottom: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px -16px rgba(67, 56, 202, 0.45);
    }
    .hpp-header::before {
      content: "";
      position: absolute;
      top: -60px;
      right: -40px;
      width: 220px;
      height: 220px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
    }
    .hpp-header::after {
      content: "";
      position: absolute;
      bottom: -80px;
      right: 120px;
      width: 160px;
      height: 160px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
    }
    .hpp-header-inner {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 24px;
    }
    .hpp-header-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .hpp-icon-box {
      background: rgba(255,255,255,0.16);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 14px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .hpp-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.75);
      margin-bottom: 4px;
    }
    .hpp-header-title {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .hpp-header-sub {
      color: rgba(255,255,255,0.78);
      font-size: 13.5px;
      margin-top: 4px;
      margin-bottom: 0;
    }
    @media (max-width: 640px) {
      .hpp-header { padding: 22px 20px; }
      .hpp-header-title { font-size: 20px; }
    }
  `;

    return (
        <div className="hpp-header">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            <div className="hpp-header-inner">
                <div className="hpp-header-left">
                    <div className="hpp-icon-box">
                        <Calculator size={28} />
                    </div>
                    <div>
                        <span className="hpp-eyebrow">Modul Produksi</span>
                        <h1 className="hpp-header-title">Kalkulasi Harga Pokok Produksi</h1>
                        <p className="hpp-header-sub">Kelola dan hitung HPP produk dengan akurat dan efisien.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   KOMPONEN HPP TABLE (DESIGN DISAMAKAN)
========================================================= */

function HppTable({ title, items = [], setItems, color, type, masterBarang = [], daftarSatuan = [] }) {
    const addRow = () => {
        setItems([
            ...items,
            {
                id: createId(),
                barangKode: '',
                nama: '',

                // KHUSUS BAHAN BAKU
                satuan: '',
                satuanMaster: '',
                hargaMaster: 0,
                hargaSatuan: 0,

                jumlah: '',

                // KHUSUS TENAGA KERJA / OVERHEAD
                jam: type === 'tenaga' || type === 'overhead' ? 1 : undefined
            }
        ]);
    };

    /* =====================================================
       UPDATE & REMOVE ROW
       >>> DIPINDAHKAN KE DALAM HppTable <<<
       Sebelumnya fungsi ini berada di KalkulasiBaruPage dan
       merujuk ke `items`/`setItems` yang tidak ada di scope
       situ. Sekarang memakai props `items`/`setItems` milik
       HppTable sendiri, sesuai section mana yang sedang
       diedit (Bahan Baku Langsung / Tidak Langsung / Tenaga
       Kerja / Overhead).
    ===================================================== */

    const removeRow = (id) => {
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
    };

    const updateRow = (id, field, value) => {
        const updated = items.map((item) => {
            if (item.id !== id) {
                return item;
            }

            return {
                ...item,
                [field]: field === 'hargaSatuan' || field === 'jumlah' || field === 'jam' ? (value === '' ? '' : Number(value)) : value
            };
        });

        setItems(updated);
    };

    /* =====================================================
       HITUNG TOTAL PER ITEM
    ===================================================== */

    const total = (item) => {
        const jumlah = Number(item.jumlah || 0);

        /* ================================================
           TENAGA KERJA / OVERHEAD
        ================================================ */
        if (type === 'tenaga' || type === 'overhead') {
            const harga = Number(item.hargaSatuan || 0);
            const jam = Number(item.jam || 1);

            return jumlah * harga * jam;
        }

        /* ================================================
           BAHAN BAKU
           Harga dihitung berdasarkan satuan pemakaian
        ================================================ */

        const hargaSatuan = hitungHargaSatuanPemakaian({
            hargaMaster: item.hargaMaster,
            satuanMaster: item.satuanMaster,
            satuanPemakaian: item.satuan,
            daftarSatuan
        });

        return jumlah * hargaSatuan;
    };

    const sectionTotal = useMemo(() => {
        return (items || []).reduce((acc, item) => acc + total(item), 0);
    }, [items, type, daftarSatuan]);

    /* =====================================================
       PILIH BARANG
    ===================================================== */

    const pilihBarang = (itemId, barangKode) => {
        if (!barangKode) {
            const updated = items.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          barangKode: '',
                          nama: '',
                          satuan: '',
                          satuanMaster: '',
                          hargaMaster: 0,
                          hargaSatuan: 0
                      }
                    : item
            );

            setItems(updated);
            return;
        }

        const barang = masterBarang.find((b) => String(b.BARANG_KODE) === String(barangKode));

        if (!barang) {
            return;
        }

        const satuanMaster = barang.NAMA_SATUAN ?? barang.nama_satuan ?? barang.NAMA_SATUAN_BARANG ?? barang.SATUAN ?? barang.satuan ?? '';

        const hargaMaster = Number(barang.HARGA_BELI_TERAKHIR ?? barang.harga_beli_terakhir ?? barang.HARGA_BELI ?? barang.harga_beli ?? 0);

        const updated = items.map((item) => {
            if (item.id !== itemId) {
                return item;
            }

            return {
                ...item,

                barangKode: barang.BARANG_KODE,

                nama: barang.NAMA_BARANG,

                // Satuan pemakaian dipilih user melalui dropdown
                satuan: '',

                // Satuan asli dari master barang
                satuanMaster,

                // Harga asli dari master barang
                hargaMaster,

                // Harga hasil konversi
                hargaSatuan: 0
            };
        });

        setItems(updated);
    };

    /* =====================================================
       RENDER NAMA
    ===================================================== */

    const renderNama = (item) => {
        /* ================================================
           TENAGA KERJA / OVERHEAD
        ================================================ */

        if (type === 'tenaga' || type === 'overhead') {
            return <input type="text" placeholder={type === 'tenaga' ? 'Contoh: Koki' : 'Contoh: Gas LPG'} value={item.nama || ''} onChange={(e) => updateRow(item.id, 'nama', e.target.value)} className="hpp-field" />;
        }

        /* ================================================
           BAHAN BAKU
        ================================================ */

        return (
            <select value={item.barangKode || ''} onChange={(e) => pilihBarang(item.id, e.target.value)} className="hpp-field">
                <option value="">Pilih Barang</option>

                {masterBarang.map((barang) => (
                    <option key={barang.ID || barang.BARANG_KODE} value={barang.BARANG_KODE}>
                        {barang.NAMA_BARANG}
                    </option>
                ))}
            </select>
        );
    };

    const isTenagaOrOverhead = type === 'tenaga' || type === 'overhead';

    const theme = {
        indigo: {
            accent: '#4f46e5',
            soft: '#eef0ff'
        },
        emerald: {
            accent: '#0d9f6e',
            soft: '#e7f8f1'
        },
        orange: {
            accent: '#d97706',
            soft: '#fef3e2'
        }
    };

    const colorKey = color?.includes('indigo') ? 'indigo' : color?.includes('emerald') ? 'emerald' : 'orange';

    const t = theme[colorKey] || theme.indigo;

    const Icon = ICONS[type] || Package;

    return (
        <div
            className="hpp-table-card"
            style={{
                '--accent': t.accent,
                '--accent-soft': t.soft
            }}
        >
            <style>{`
                .hpp-table-card {
                    background: #fff;
                    border: 1px solid #edeef1;
                    border-radius: 20px;
                    padding: 18px;
                    margin-bottom: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .hpp-table-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 14px;
                }

                .hpp-table-title-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .hpp-table-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    background: var(--accent-soft);
                    color: var(--accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hpp-table-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1a1d1f;
                    margin: 0;
                }

                .hpp-table-count {
                    font-size: 11.5px;
                    color: #8b95a1;
                    font-weight: 500;
                }

                .hpp-add-btn {
                    background: var(--accent);
                    color: #fff;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }

                .hpp-add-btn:hover {
                    opacity: 0.9;
                }

                .hpp-table-wrap {
                    overflow: auto;
                    border: 1px solid #f0f1f3;
                    border-radius: 14px;
                }

                .hpp-table {
                    width: 100%;
                    font-size: 13px;
                    border-collapse: collapse;
                }

                .hpp-table thead tr {
                    background: #fafafb;
                }

                .hpp-table th {
                    padding: 11px 12px;
                    text-align: left;
                    font-size: 10.5px;
                    text-transform: uppercase;
                    color: #98a2ac;
                    font-weight: 700;
                    border-bottom: 1px solid #f0f1f3;
                }

                .hpp-table td {
                    padding: 9px 12px;
                    border-bottom: 1px solid #f5f6f7;
                    vertical-align: middle;
                }

                .hpp-field {
                    width: 100%;
                    border: 1.5px solid #e7e9ec;
                    border-radius: 10px;
                    padding: 7px 10px;
                    font-size: 13px;
                    outline: none;
                    background: #fff;
                }

                .hpp-field:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px var(--accent-soft);
                }

                .hpp-total-val {
                    font-weight: 700;
                    color: var(--accent);
                    white-space: nowrap;
                }

                .hpp-del-btn {
                    color: #d9614f;
                    background: #fdeae7;
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .hpp-del-btn:hover {
                    background: #fbdad4;
                }

                .hpp-empty-row {
                    text-align: center;
                    padding: 26px 12px;
                    color: #aab1ba;
                    font-size: 12.5px;
                }

                .hpp-footer-row {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 4px 2px;
                    font-size: 13px;
                }

                .hpp-footer-label {
                    color: #8b95a1;
                    font-weight: 600;
                }

                .hpp-footer-val {
                    font-weight: 700;
                    font-size: 15px;
                    color: var(--accent);
                }

                .hpp-master-info {
                    margin-top: 4px;
                    font-size: 10px;
                    color: #98a2ac;
                }
            `}</style>

            <div className="hpp-table-head">
                <div className="hpp-table-title-row">
                    <div className="hpp-table-icon">
                        <Icon size={16} />
                    </div>

                    <div>
                        <h2 className="hpp-table-title">{title}</h2>
                        <span className="hpp-table-count">{(items || []).length} item</span>
                    </div>
                </div>

                <button onClick={addRow} className="hpp-add-btn" type="button">
                    <Plus size={13} />
                    Tambah
                </button>
            </div>

            <div className="hpp-table-wrap">
                <table className="hpp-table">
                    <thead>
                        <tr>
                            <th>{isTenagaOrOverhead ? 'Nama' : 'Nama Barang'}</th>

                            {isTenagaOrOverhead ? (
                                <>
                                    <th>Harga Satuan</th>
                                    <th>Jumlah</th>
                                    <th>Satuan</th>
                                    {/* >>> BARU: kolom pengali (jam/hari/dst) yang sebelumnya tidak ada inputnya */}
                                    <th>Jml Jam/Hari/dst</th>
                                </>
                            ) : (
                                <>
                                    <th>Satuan Pemakaian</th>
                                    <th>Jumlah</th>
                                    <th>Harga Satuan</th>
                                </>
                            )}

                            <th>Total</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(!items || items.length === 0) && (
                            <tr>
                                {/* >>> DIPERBAIKI: colSpan dinamis, karena tenaga/overhead sekarang punya 1 kolom tambahan (Jml Jam/Hari/dst) */}
                                <td colSpan={isTenagaOrOverhead ? 7 : 6} className="hpp-empty-row">
                                    Belum ada item. Klik "Tambah" untuk mulai mengisi.
                                </td>
                            </tr>
                        )}

                        {(items || []).map((item) => {
                            const hargaSatuan = hitungHargaSatuanPemakaian({
                                hargaMaster: item.hargaMaster,
                                satuanMaster: item.satuanMaster,
                                satuanPemakaian: item.satuan,
                                daftarSatuan
                            });

                            return (
                                <tr key={item.id}>
                                    <td>{renderNama(item)}</td>

                                    {isTenagaOrOverhead ? (
                                        <>
                                            <td>
                                                <input type="number" min="0" value={item.hargaSatuan} onChange={(e) => updateRow(item.id, 'hargaSatuan', e.target.value)} className="hpp-field" />
                                            </td>

                                            <td>
                                                <input type="number" min="0" value={item.jumlah} onChange={(e) => updateRow(item.id, 'jumlah', e.target.value)} className="hpp-field" placeholder="Jumlah" />
                                            </td>

                                            <td>
                                                <input type="text" value={item.satuan || ''} onChange={(e) => updateRow(item.id, 'satuan', e.target.value)} className="hpp-field" placeholder="Jam/Hari/Orang" />
                                            </td>

                                            {/* >>> BARU: input angka pengali (jam/hari/dst) - sebelumnya tidak ada,
                                                sehingga item.jam selalu default 1 dan tidak pernah ikut dihitung */}
                                            <td>
                                                <input type="number" min="0" step="any" value={item.jam ?? 1} onChange={(e) => updateRow(item.id, 'jam', e.target.value)} className="hpp-field" placeholder="Contoh: 8" />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <select value={item.satuan || ''} onChange={(e) => updateRow(item.id, 'satuan', e.target.value)} className="hpp-field">
                                                    <option value="">Pilih Satuan</option>

                                                    {daftarSatuan.map((unit) => (
                                                        <option key={unit.ID} value={unit.NAMA_SATUAN}>
                                                            {unit.NAMA_SATUAN}
                                                        </option>
                                                    ))}
                                                </select>

                                                {item.satuanMaster && <div className="hpp-master-info">Satuan master: {item.satuanMaster}</div>}
                                            </td>

                                            <td>
                                                <input type="number" min="0" step="any" value={item.jumlah} onChange={(e) => updateRow(item.id, 'jumlah', e.target.value)} className="hpp-field" placeholder="Jumlah" />
                                            </td>

                                            <td>
                                                <input type="text" value={hargaSatuan ? formatRupiah(hargaSatuan) : ''} readOnly className="hpp-field" style={{ background: '#f8fafc' }} placeholder="Otomatis" />
                                            </td>
                                        </>
                                    )}

                                    <td>
                                        <span className="hpp-total-val">{formatRupiah(total(item))}</span>
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => removeRow(item.id)} className="hpp-del-btn" type="button">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {items && items.length > 0 && (
                <div className="hpp-footer-row">
                    <span className="hpp-footer-label">Subtotal {title}</span>
                    <span className="hpp-footer-val">{formatRupiah(sectionTotal)}</span>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   KOMPONEN INFO CARD (PARAMETER TAMBAHAN & RINGKASAN)
   Didesain seragam menggunakan kelas .hpp-table-card
========================================================= */

function InfoCard({
    totalBBL = 0,
    totalBBTL = 0,
    totalTK = 0,
    totalOH = 0,
    totalBiayaProduksi = 0,
    hppPerPorsi = 0,
    targetMargin = 50,
    setTargetMargin,
    rekomendasiHargaJual = 0,
    hargaJualFinal = '',
    setHargaJualFinal,
    hargaJualDipakai = 0,
    profitPerPorsi = 0,
    totalProfit = 0,
    onSave
}) {
    const [gajiPegawai, setGajiPegawai] = useState(2500000);
    const [jamKerjaHarian, setJamKerjaHarian] = useState(8);
    const [hariKerja, setHariKerja] = useState(22);
    const [totalLiterProduksi, setTotalLiterProduksi] = useState(5);
    const [gajiPerJam, setGajiPerJam] = useState(0);

    const formatNum = (number) => new Intl.NumberFormat('id-ID').format(Math.round(number || 0));

    useEffect(() => {
        const resultGajiPerJam = gajiPegawai / (jamKerjaHarian * hariKerja);
        setGajiPerJam(resultGajiPerJam || 0);
    }, [gajiPegawai, jamKerjaHarian, hariKerja]);

    const results = [
        {
            label: 'Gaji Pegawai / Jam',
            value: gajiPerJam
        }
    ];

    const fields = [
        {
            label: 'Gaji Pegawai',
            value: gajiPegawai,
            set: setGajiPegawai,
            suffix: '/ bulan'
        },
        {
            label: 'Jam Kerja Harian',
            value: jamKerjaHarian,
            set: setJamKerjaHarian,
            suffix: 'jam'
        },
        {
            label: 'Hari Kerja / Bulan',
            value: hariKerja,
            set: setHariKerja,
            suffix: 'hari'
        },
        {
            label: 'Total (Liter, kg)',
            value: totalLiterProduksi,
            set: setTotalLiterProduksi,
            suffix: ''
        }
    ];

    return (
        <>
            {/* KARTU 2: RINGKASAN HPP */}
            <div className="hpp-table-card" style={{ '--accent': '#4f46e5', '--accent-soft': '#eef0ff' }}>
                <div className="hpp-table-head">
                    <div className="hpp-table-title-row">
                        <div className="hpp-table-icon">
                            <Calculator size={16} />
                        </div>
                        <div>
                            <h2 className="hpp-table-title">Ringkasan HPP</h2>
                            <span className="hpp-table-count">Akumulasi seluruh komponen biaya produksi</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Bahan Langsung</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalBBL)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Bahan Tidak Langsung</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalBBTL)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Tenaga Kerja</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalTK)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Overhead</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalOH)}</div>
                    </div>
                </div>

                <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '4px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#5b6670' }}>Total Biaya Produksi</span>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalBiayaProduksi)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #f0f1f3' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>HPP per Porsi</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>Rp {formatNum(hppPerPorsi)}</span>
                    </div>
                </div>
            </div>

            {/* KARTU 3: HARGA JUAL & PROFIT */}
            <div className="hpp-table-card" style={{ '--accent': '#4f46e5', '--accent-soft': '#eef0ff' }}>
                <div className="hpp-table-head">
                    <div className="hpp-table-title-row">
                        <div className="hpp-table-icon">
                            <Sliders size={16} />
                        </div>
                        <div>
                            <h2 className="hpp-table-title">Harga Jual & Profit</h2>
                            <span className="hpp-table-count">Pengaturan margin dan simulasi keuntungan</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '16px' }} className="info-field-grid">
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Target Margin (%)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min="0"
                                value={targetMargin ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTargetMargin(val === '' ? '' : Number(val));
                                }}
                                className="hpp-field"
                            />
                            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#8b95a1' }}>%</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Harga Jual Final</label>
                        <input
                            type="number"
                            min="0"
                            value={hargaJualFinal ?? ''}
                            placeholder="Kosongkan untuk menggunakan rekomendasi"
                            onChange={(e) => {
                                const val = e.target.value;
                                setHargaJualFinal(val === '' ? '' : Number(val));
                            }}
                            className="hpp-field"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Rekomendasi Harga Jual</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(rekomendasiHargaJual)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Harga Jual Digunakan</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(hargaJualDipakai)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Profit per Porsi</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(profitPerPorsi)}</div>
                    </div>
                    <div style={{ background: '#fafafb', border: '1px solid #f0f1f3', borderRadius: '14px', padding: '12px 14px' }}>
                        <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Total Profit</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1d1f' }}>Rp {formatNum(totalProfit)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
