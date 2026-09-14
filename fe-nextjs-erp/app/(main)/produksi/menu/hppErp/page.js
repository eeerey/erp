'use client';

import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

import ToastNotifier from '../../../../components/ToastNotifier';
import CustomDataTable from '../../../../components/DataTable';
import HeaderBar from '../../../../components/headerbar';

import HeaderHpp from './components/HeaderHpp';
import ProductInput from './components/ProductInput';
import HppTable from './components/HppTable';
import SummaryCard from './components/SummaryCard';
import InfoCard from './components/InfoCard';
import Fase1ResultCard from './components/Fase1ResultCard';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Layout notes:
 * - Page is organized into clearly separated "panels" (input panel,
 *   breakdown panel, summary panel, history panel) instead of one long
 *   unbroken scroll — each panel has its own card, icon, and heading.
 * - Edit mode gets a visible amber banner instead of a floating button,
 *   so it's obvious the form is in a different state.
 * - Table columns get pill/badge styling instead of plain colored text.
 */

export default function Page() {
    const toastRef = useRef(null);
    const isMounted = useRef(true);

    // ======================
    // STATE
    // ======================
    const [productName, setProductName] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [productList, setProductList] = useState([]);

    const [editId, setEditId] = useState(null);

    const [materials, setMaterials] = useState([]);
    const [additionalMaterials, setAdditionalMaterials] = useState([]);
    const [labor, setLabor] = useState([]);
    const [overhead, setOverhead] = useState([]);
    const [totalCone, setTotalCone] = useState(100);
    const [hasilFase1, setHasilFase1] = useState(null);
    const [selectedHppId, setSelectedHppId] = useState(null);
    const [satuanHasil, setSatuanHasil] = useState('Cone');
    const [satuanList, setSatuanList] = useState([]);

    const [fase2Materials, setFase2Materials] = useState([]);
    const [fase2Overhead, setFase2Overhead] = useState([]);
    const [showFase2Dialog, setShowFase2Dialog] = useState(false);
    const [selectedFase1, setSelectedFase1] = useState(null);
    const [qtyDipakai, setQtyDipakai] = useState(0);
    const [produkFase2, setProdukFase2] = useState('');
    const [productSatuan, setProductSatuan] = useState('');
    const [fase2Labor, setFase2Labor] = useState([]);

    const [dataList, setDataList] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // ======================
    // INIT
    // ======================
    useEffect(() => {
        fetchData();
        fetchProducts();
        fetchSatuan();

        return () => {
            isMounted.current = false;
        };
    }, []);

    // ======================
    // FETCH LIST HPP
    // ======================

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('TOKEN');

            console.log('TOKEN =', token);

            if (!token) {
                toastRef.current?.showToast('01', 'Token tidak ditemukan');
                return;
            }

            const res = await api.get(`${API_URL}/hppErp`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('========== RESPONSE HPP ==========');
            console.log('STATUS:', res.status);
            console.log('RESPONSE:', res.data);
            console.log('STATUS API:', res.data?.status);
            console.log('DATA HPP:', res.data?.data);
            console.log('JUMLAH DATA:', res.data?.data?.length);

            if (res.data.status === '00') {
                setDataList(res.data.data || []);
                setOriginalData(res.data.data || []);
            }
        } catch (err) {
            console.error(err);
            toastRef.current?.showToast('01', 'Gagal memuat data');
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };
    // ======================
    // FETCH MASTER PRODUK
    // ======================
    const fetchProducts = async () => {
        try {
            const res = await api.get(`${API_URL}/hppErp/produk`);
            setProductList(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ======================
    // FETCH satuan fase 1
    // ======================
    const fetchSatuan = async () => {
        try {
            const res = await api.get(`${API_URL}/hppErp/form-data`);
            setSatuanList(res.data.data.satuan || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ======================
    // FORMAT RUPIAH
    // ======================
    const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number || 0);

    // ======================
    // CALC TOTAL
    // ======================
    const sectionTotal = (data, useJam = false) =>
        data.reduce((acc, item) => {
            const total = useJam ? Number(item.harga || 0) * Number(item.jumlah || 0) * Number(item.jam || 0) : Number(item.harga || 0) * Number(item.jumlah || 0);

            return acc + total;
        }, 0);
    console.log('OVERHEAD =', overhead);
    console.log('OVERHEAD TOTAL =', sectionTotal(overhead));

    const totalHPP = sectionTotal(materials) + sectionTotal(additionalMaterials) + sectionTotal(labor, true) + sectionTotal(overhead, true) + sectionTotal(fase2Materials) + sectionTotal(fase2Overhead, true);

    const hppPerPcs = totalCone > 0 ? totalHPP / totalCone : 0;

    // ======================
    // SEARCH
    // ======================
    const handleSearch = (keyword) => {
        if (!keyword) return setDataList(originalData);

        const filtered = originalData.filter((v) => v.nama_produk_jadi?.toLowerCase().includes(keyword.toLowerCase()));

        setDataList(filtered);
    };

    // ======================
    // HANDLE EDIT
    // ======================
    const handleEdit = async (row) => {
        try {
            resetForm();
            const res = await api.get(`${API_URL}/hppErp/${row.id}`);

            const { header, detail } = res.data.data;
            console.log('HEADER:', header);

            setEditId(header.id);
            setSelectedProductId(header.produk_id);
            setProductName(header.nama_produk_jadi);

            const mapDetail = (items) =>
                items.map((i) => ({
                    nama: i.nama_item,
                    harga: i.harga,
                    satuan: i.satuan,
                    jumlah: i.jumlah,
                    jam: i.jam || 0,
                    barangKode: i.BARANG_KODE
                }));

            setMaterials(mapDetail(detail.filter((d) => d.kategori === 'BAHAN_BAKU')));
            setAdditionalMaterials(mapDetail(detail.filter((d) => d.kategori === 'BAHAN_BAKU_TAMBAHAN')));
            setLabor(mapDetail(detail.filter((d) => d.kategori === 'TENAGA_KERJA')));
            setOverhead(mapDetail(detail.filter((d) => d.kategori === 'OVERHEAD')));

            // bring the form into view since edit data just loaded
            document.getElementById('hpp-input-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            console.error(err);
            toastRef.current?.showToast('01', 'Gagal load data edit');
        }
    };

    // ======================
    // RESET FORM
    // ======================
    const resetForm = () => {
        setEditId(null);
        setSelectedProductId('');
        setProductName('');
        setMaterials([]);
        setAdditionalMaterials([]);
        setLabor([]);
        setOverhead([]);
        setFase2Materials([]);
        setFase2Overhead([]);
    };

    // ======================
    // SAVE (CREATE / UPDATE)
    // ======================
    const handleSave = async () => {
        console.log('1. handleSave dipanggil');

        try {
            console.log('2. sebelum validasi');

            if (!productName || productName.trim() === '') {
                toastRef.current?.showToast('01', 'Isi nama produk dulu');
                return;
            }

            const payload = {
                nama_produk_jadi: productName,
                bahanBaku: materials,
                bahanBakuTambahan: additionalMaterials,
                tenagaKerja: labor,
                overhead,
                fase2BahanBaku: fase2Materials,
                fase2Overhead: fase2Overhead,
                totalHPP,
                hppPerPcs,
                qty_hasil: totalCone,
                satuan_hasil: satuanHasil
            };

            let res;
            let hppId;

            if (editId) {
                const res = await api.put(`${API_URL}/hppErp/${editId}`, payload);

                hppId = editId; // gunakan id yang sedang diedit
            } else {
                const res = await api.post(`${API_URL}/hppErp`, payload);

                hppId = res.data.data.hppId;
            }

            setHasilFase1({
                id: hppId,
                namaProduk: productName,
                satuan: satuanHasil,
                jumlah: totalCone,
                totalHPP,
                hargaSatuan: hppPerPcs
            });

            toastRef.current?.showToast('00', 'Berhasil disimpan');

            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            console.error(err.response?.data);

            toastRef.current?.showToast('01', 'Gagal menyimpan data');
        }
    };

    // ======================
    // CREATE FASE 2
    // ======================
    const handleCreateFase2 = async () => {
        try {
            console.log(selectedFase1);
            console.log(qtyDipakai);
            console.log(produkFase2);

            const payload = {
                hpp_id: selectedFase1.id,
                qty_dipakai: qtyDipakai,
                nama_produk_baru: produkFase2
            };

            await api.post(`${API_URL}/hppErp/fase2`, {
                hpp_id: selectedFase1.id,
                qty_dipakai: qtyDipakai,
                nama_produk_baru: produkFase2,

                bahanBaku: fase2Materials,
                overhead: fase2Overhead,
                tenagaKerja: labor,

                totalHPP,
                hppPerPcs
            });
            toastRef.current?.showToast('00', 'Produksi Fase 2 berhasil');

            setShowFase2Dialog(false);

            fetchData();
        } catch (err) {
            console.error(err);
            console.error(err.response?.data);
            toastRef.current?.showToast('01', 'Gagal membuat Fase 2');
        }
    };

    // ======================
    // DELETE
    // ======================
    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Yakin hapus produk "${rowData.nama_produk_jadi}" ?`,
            header: 'Konfirmasi Hapus',
            icon: 'pi pi-exclamation-triangle',

            accept: async () => {
                try {
                    const res = await api.delete(`${API_URL}/hppErp/${rowData.id}`);

                    if (res.data.status === '00') {
                        toastRef.current?.showToast('00', 'Berhasil dihapus');
                        fetchData();
                    }
                } catch (err) {
                    console.error(err);
                    toastRef.current?.showToast('01', 'Gagal hapus data');
                }
            }
        });
    };

    // ======================
    // OPEN DIALOG FASE 2
    // ======================
    const openFase2 = (row) => {
        setSelectedFase1(row);
        setQtyDipakai(0);
        setProdukFase2('');
        setShowFase2Dialog(true);
    };

    // ======================
    // TABLE
    // ======================
    const columns = [
        {
            field: 'nama_produk_jadi',
            header: 'Nama Produk',
            sortable: true,
            body: (row) => (
                <div className="flex items-center gap-3">
                    <div className="hpp-avatar">{row.nama_produk_jadi?.charAt(0)?.toUpperCase() || '?'}</div>
                    <span className="font-semibold text-slate-800">{row.nama_produk_jadi}</span>
                </div>
            )
        },
        {
            field: 'total_hpp',
            header: 'Total HPP',
            sortable: true,
            body: (row) => <span className="hpp-badge hpp-badge-indigo">Rp {formatRupiah(row.total_hpp)}</span>
        },
        {
            field: 'hpp_per_pcs',
            header: 'HPP/Pcs',
            sortable: true,
            body: (row) => <span className="hpp-badge hpp-badge-emerald">Rp {formatRupiah(row.hpp_per_pcs)}</span>
        },
        {
            field: 'created_at',
            header: 'Tanggal',
            sortable: true,
            body: (row) => {
                if (!row.created_at) return '-';
                const date = new Date(row.created_at);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        },
        {
            header: 'Aksi',
            body: (row) => (
                <div className="flex gap-2">
                    <Button icon="pi pi-pencil" severity="warning" size="small" rounded text onClick={() => handleEdit(row)} />

                    {}

                    <Button icon="pi pi-trash" severity="danger" size="small" rounded text onClick={() => handleDelete(row)} />
                </div>
            )
        }
    ];

    // ======================
    // SAVE FASE 2
    // ======================
    const saveFase2 = async () => {
        try {
            console.log('SAVE FASE 2');
            console.log('hasilFase1 =', hasilFase1);
            console.log('selectedHppId =', selectedHppId);
            console.log('hasilFase1.id =', hasilFase1?.id);

            const payload = {
                hpp_id: selectedHppId || hasilFase1?.id,
                qty_dipakai: qtyDipakai,
                nama_produk_baru: produkFase2,

                bahanBaku: fase2Materials,
                overhead: fase2Overhead,
                tenagaKerja: fase2Labor,

                totalHPP,
                hppPerPcs
            };

            console.log('API_URL =', API_URL);
            console.log('PAYLOAD FASE2 =', payload);

            const res = await api.post(`${API_URL}/hppErp/fase2`, payload);

            console.log('RESPONSE =', res.data);

            toastRef.current?.showToast('00', 'Produksi Fase 2 berhasil disimpan');

            fetchData();
        } catch (err) {
            console.error('ERROR =', err);
            console.error('RESPONSE =', err.response);
            console.error('DATA =', err.response?.data);

            const errorMessage = err.response?.data?.error;

            if (errorMessage === 'Qty melebihi stok') {
                toastRef.current?.showToast('01', 'Qty melebihi stok');
            } else {
                toastRef.current?.showToast('01', 'Gagal menyimpan Fase 2');
            }
        }
    };

    // ======================
    // RENDER
    // ======================
    console.log('hasilFase1 =', hasilFase1);
    return (
        <div className="hpp-page">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        .hpp-page {
          --ink: #14181a;
          --ink-soft: #5b6670;
          --muted: #98a2ac;
          --border: #e8eaed;
          --surface: #ffffff;
          --surface-soft: #f7f8fa;
          --indigo: #4f46e5;
          --indigo-soft: #eef0ff;
          --emerald: #0d9f6e;
          --emerald-soft: #e7f8f1;
          --amber: #d98a32;
          --amber-soft: #fdf1e2;

          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 20px 60px;
          font-family: 'Sora', system-ui, sans-serif;
          color: var(--ink);
        }

        .hpp-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px -6px rgba(0,0,0,0.06);
        }

        .hpp-panel-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .hpp-panel-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--indigo);
        }

        .hpp-panel-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .hpp-edit-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: var(--amber-soft);
          border: 1px solid #f0d4ab;
          color: #8a5a14;
          border-radius: 14px;
          padding: 12px 18px;
          margin-bottom: 18px;
          font-size: 13px;
          font-weight: 600;
        }

        .hpp-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 860px) {
          .hpp-summary-grid { grid-template-columns: 1fr; }
        }

        .hpp-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--indigo-soft);
          color: var(--indigo);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .hpp-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 999px;
          display: inline-block;
        }
        .hpp-badge-indigo { background: var(--indigo-soft); color: var(--indigo); }
        .hpp-badge-emerald { background: var(--emerald-soft); color: var(--emerald); }
      `
                }}
            />

            <ToastNotifier ref={toastRef} />
            <ConfirmDialog />

            <HeaderHpp />

            {/* EDIT MODE INDICATOR */}
            {editId && (
                <div className="hpp-edit-banner">
                    <span>✏️ Sedang mengedit produk — perubahan belum tersimpan.</span>
                    <Button label="Batal Edit" severity="secondary" size="small" onClick={resetForm} />
                </div>
            )}

            <div id="hpp-input-panel" className="hpp-panel">
                <div className="hpp-panel-head">
                    <span className="hpp-panel-dot" />
                    <h2 className="hpp-panel-title">Data Produk</h2>
                </div>
                <ProductInput productName={productName} setProductName={setProductName} productId={selectedProductId} setProductId={setSelectedProductId} productSatuan={productSatuan} setProductSatuan={setProductSatuan} products={productList} />
            </div>

            <div className="hpp-panel">
                <div className="hpp-panel-head">
                    <span className="hpp-panel-dot" style={{ background: '#4f46e5' }} />
                    <h2 className="hpp-panel-title">Rincian Biaya</h2>
                </div>

                <HppTable title="Bahan Baku Utama" data={materials} setData={setMaterials} type="bahan" color="text-indigo-600" />

                <HppTable title="Bahan Baku Tambahan" data={additionalMaterials} setData={setAdditionalMaterials} type="bahan_tambahan" color="text-cyan-600" />

                <HppTable title="Tenaga Kerja" data={labor} setData={setLabor} type="tenaga" color="text-emerald-600" />

                <HppTable title="Overhead" data={overhead} setData={setOverhead} type="overhead" color="text-orange-600" />
            </div>

            <div className="hpp-summary-grid">
                <SummaryCard materials={materials} labor={labor} overhead={overhead} totalHPP={totalHPP} formatRupiah={formatRupiah} sectionTotal={sectionTotal} totalCone={totalCone} />

                <InfoCard totalHPP={totalHPP} totalCone={totalCone} setTotalCone={setTotalCone} onSave={handleSave} />
            </div>

            {hasilFase1 && (
                <div className="fase1-panel">
                    <style>{`
      .fase1-panel {
        background: #fff;
        border: 1px solid #d1fae5;
        border-radius: 24px;
        padding: 24px;
        margin-bottom: 20px;
      }

      .fase1-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
      }

      .fase1-head-icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        background: #dcfce7;
        color: #16a34a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .fase1-head-title {
        font-size: 17px;
        font-weight: 800;
        color: #1a1d1f;
        margin: 0;
      }

      .fase1-head-sub {
        font-size: 12px;
        color: #98a2ac;
        margin-top: 1px;
      }

      /* PRODUK CARD */
      .fase1-product-card {
        background: linear-gradient(135deg, #f0fdf4, #fff);
        border: 1px solid #bbf7d0;
        border-radius: 18px;
        padding: 18px 22px;
        display: grid;
        grid-template-columns: 2fr 1fr 1.4fr 1.4fr;
        gap: 16px;
        align-items: center;
        margin-bottom: 18px;
      }

      @media (max-width: 640px) {
        .fase1-product-card { grid-template-columns: 1fr 1fr; }
      }

      .fase1-col-label {
        font-size: 10.5px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #6b7280;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .fase1-prod-name {
        font-size: 16px;
        font-weight: 700;
        color: #1a1d1f;
      }

      .fase1-qty-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #dcfce7;
        color: #15803d;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        font-size: 15px;
        padding: 5px 12px;
        border-radius: 999px;
      }

      .fase1-satuan-select {
        border: 1.5px solid #d1d5db;
        border-radius: 12px;
        padding: 8px 12px;
        font-size: 13px;
        color: #1a1d1f;
        background: #fff;
        outline: none;
        transition: border-color 0.15s ease;
        width: 100%;
      }
      .fase1-satuan-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px #dcfce7; }

      .fase1-money {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        font-size: 15px;
        color: #1a1d1f;
      }

      .fase1-money.highlight { color: #16a34a; font-size: 17px; }

      /* FORMULA BOX */
      .fase1-formula {
        background: #f8fafc;
        border: 1px solid #e9edf2;
        border-radius: 16px;
        padding: 16px 20px;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .fase1-formula-label {
        font-size: 12px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        white-space: nowrap;
        border-right: 1px solid #e2e8f0;
        padding-right: 14px;
        margin-right: 2px;
      }

      .fase1-formula-eq {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 600;
        color: #1a1d1f;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .fase1-formula-chip {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 13.5px;
      }

      .fase1-formula-chip.result {
        background: #dcfce7;
        border-color: #86efac;
        color: #15803d;
        font-weight: 800;
      }

      .fase1-op { color: #9ca3af; font-size: 16px; }

      /* BUTTON */
      .fase1-action-row {
        display: flex;
        justify-content: flex-end;
      }

      .fase1-cta-btn {
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: #fff;
        border: none;
        padding: 13px 22px;
        border-radius: 14px;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        box-shadow: 0 10px 24px -10px rgba(22,163,74,0.55);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .fase1-cta-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 28px -10px rgba(22,163,74,0.6);
      }

      .fase1-cta-arrow {
        width: 24px;
        height: 24px;
        background: rgba(255,255,255,0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>

                    {/* HEADER */}
                    <div className="fase1-head">
                        <div className="fase1-head-icon">🌿</div>
                        <div>
                            <h2 className="fase1-head-title">Hasil Produksi Fase 1</h2>
                            <p className="fase1-head-sub">Kalkulasi HPP berdasarkan input yang telah diisi</p>
                        </div>
                    </div>

                    {/* PRODUK CARD */}
                    <div className="fase1-product-card">
                        <div>
                            <p className="fase1-col-label">Nama Produk</p>
                            <p className="fase1-prod-name">{hasilFase1.namaProduk}</p>
                        </div>

                        <div>
                            <p className="fase1-col-label">Qty</p>
                            <span className="fase1-qty-badge">{hasilFase1.jumlah}</span>
                        </div>

                        <div>
                            <p className="fase1-col-label">Satuan</p>
                            <select value={satuanHasil} onChange={(e) => setSatuanHasil(e.target.value)} className="fase1-satuan-select">
                                {satuanList.map((item) => (
                                    <option key={item.ID} value={item.NAMA_SATUAN}>
                                        {item.NAMA_SATUAN}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <p className="fase1-col-label">Total HPP</p>
                            <p className="fase1-money">Rp {formatRupiah(hasilFase1.totalHPP)}</p>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <p className="fase1-col-label">HPP / Satuan</p>
                            <p className="fase1-money highlight">Rp {formatRupiah(hasilFase1.hargaSatuan)}</p>
                        </div>
                    </div>

                    {/* FORMULA */}
                    <div className="fase1-formula">
                        <span className="fase1-formula-label">Rumus</span>
                        <div className="fase1-formula-eq">
                            <span className="fase1-formula-chip">Rp {formatRupiah(hasilFase1.totalHPP)}</span>
                            <span className="fase1-op">÷</span>
                            <span className="fase1-formula-chip">{hasilFase1.jumlah}</span>
                            <span className="fase1-op">=</span>
                            <span className="fase1-formula-chip result">Rp {formatRupiah(hasilFase1.hargaSatuan)}</span>
                        </div>
                    </div>

                    {/* ACTION */}
                    <div className="fase1-action-row">
                        <button
                            className="fase1-cta-btn"
                            onClick={() => {
                                setSelectedHppId(hasilFase1.id);
                                setFase2Materials((prev) => [
                                    {
                                        nama: hasilFase1.namaProduk,
                                        harga: hasilFase1.hargaSatuan,
                                        satuan: hasilFase1.satuan,
                                        jumlah: hasilFase1.jumlah,
                                        fromFase1: true,
                                        hppId: hasilFase1.id
                                    },
                                    ...prev
                                ]);
                            }}
                        >
                            Gunakan Sebagai Bahan Baku Fase 2<div className="fase1-cta-arrow">→</div>
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="qtyDipakai" className="text-base font-semibold text-gray-800 block mb-2">
                    Qty Dipakai dari Fase 1
                </label>

                <InputNumber
                    inputId="qtyDipakai"
                    value={qtyDipakai}
                    onValueChange={(e) => setQtyDipakai(e.value || 0)}
                    min={1}
                    className="w-full"
                    inputClassName="w-full rounded-xl border-gray-200 text-lg font-medium px-4 py-2.5 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    placeholder="0"
                />
            </div>

            <div className="hpp-panel">
                <div className="hpp-panel-head">
                    <span className="hpp-panel-dot" style={{ background: '#9333ea' }} />
                    <h2 className="hpp-panel-title">Fase 2 Produksi</h2>
                </div>

                <HppTable title="Bahan Baku Fase 2" data={fase2Materials} setData={setFase2Materials} type="bahan" color="text-purple-600" />

                <HppTable title="Overhead Fase 2" data={fase2Overhead} setData={setFase2Overhead} type="overhead" color="text-orange-600" />
                <InputText value={produkFase2} onChange={(e) => setProdukFase2(e.target.value)} placeholder="Nama Produk Baru" />
                <div className="flex justify-end gap-2 mt-4">
                    <Button label="Simpan Produksi Fase 2" icon="pi pi-save" severity="success" onClick={saveFase2} />
                </div>
            </div>

            <div className="hpp-panel">
                <div className="hpp-panel-head">
                    <span className="hpp-panel-dot" style={{ background: '#0d9f6e' }} />
                    <h2 className="hpp-panel-title">Riwayat HPP</h2>
                </div>

                <HeaderBar onSearch={handleSearch} showAddButton={false} placeholder="Cari nama produk..." />

                <CustomDataTable data={dataList} loading={isLoading} columns={columns} emptyMessage="Data HPP tidak ditemukan." />
            </div>
        </div>
    );
}
