'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Save, Search, TrendingUp, PackageSearch, Loader2, AlertTriangle, Sparkles, DollarSign } from 'lucide-react';
import api from '@/lib/api';

export default function HargaJualPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('TOKEN');
            const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/harga-jual`);

            const formatted = res.data.data.map((item) => ({
                ...item,
                margin: item.margin || 100,
                harga_jual: item.hpp_per_pcs + (item.hpp_per_pcs * (item.margin || 100)) / 100
            }));

            setData(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarginChange = (produk_id, value) => {
        const updated = [...data];
        const index = updated.findIndex((i) => i.produk_id === produk_id);

        const margin = parseFloat(value) || 0;

        updated[index].margin = margin;
        updated[index].harga_jual = updated[index].hpp_per_pcs + (updated[index].hpp_per_pcs * margin) / 100;

        setData(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/harga-jual`, data);
            setSavedAt(new Date());
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan data');
        } finally {
            setSaving(false);
        }
    };

    const filtered = useMemo(() => data.filter((item) => `${item.nama_produk_jadi} ${item.produk_id}`.toLowerCase().includes(query.toLowerCase())), [data, query]);

    const stats = useMemo(() => {
        if (!data.length) return { count: 0, avgMargin: 0, totalProfit: 0 };
        const avgMargin = data.reduce((sum, i) => sum + (i.margin || 0), 0) / data.length;
        const totalProfit = data.reduce((sum, i) => sum + (i.harga_jual - i.hpp_per_pcs), 0);
        return { count: data.length, avgMargin, totalProfit };
    }, [data]);

    const fmt = (n) => Number(n || 0).toLocaleString('id-ID');

    return (
        <div className="p-4">
            <style>{`
        /* HEADER GRADIENT STYLING (MENGIKUTI HPP) */
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

        /* CARD DAN TABEL STYLING */
        .hpp-table-card { 
          background: #fff; 
          border: 1px solid #edeef1; 
          border-radius: 20px; 
          padding: 18px; 
          margin-bottom: 16px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
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
          border-color: #4f46e5; 
          box-shadow: 0 0 0 3px #eef0ff; 
        }
        
        .stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .stat-row { grid-template-columns: 1fr; }
        }

        .save-btn {
          background: #4f46e5;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .save-btn:hover { opacity: 0.9; }
        .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .saved-note {
          font-size: 11.5px;
          color: #0d9f6e;
          margin-top: 6px;
          text-align: right;
          font-weight: 600;
        }
      `}</style>

            {/* HEADER GRADIENT */}
            <div className="hpp-header">
                <div className="hpp-header-inner">
                    <div className="hpp-header-left">
                        <div className="hpp-icon-box">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <span className="hpp-eyebrow">
                                <Sparkles size={12} /> Buku Harga · Produksi
                            </span>
                            <h1 className="hpp-header-title">Harga Jual Produk</h1>
                            <p className="hpp-header-sub">Atur margin tiap produk — harga jual dihitung otomatis dari HPP.</p>
                        </div>
                    </div>
                    <div>
                        <button className="save-btn" onClick={handleSave} disabled={saving} type="button">
                            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                            {saving ? 'Menyimpan...' : 'Simpan Semua'}
                        </button>
                        {savedAt && <p className="saved-note">✓ Tersimpan {savedAt.toLocaleTimeString('id-ID')}</p>}
                    </div>
                </div>
            </div>

            {/* STATISTIK */}
            <div className="stat-row">
                <div className="hpp-table-card" style={{ margin: 0, padding: '16px' }}>
                    <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Total Produk</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1d1f' }}>{stats.count}</div>
                </div>
                <div className="hpp-table-card" style={{ margin: 0, padding: '16px' }}>
                    <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Rata-rata Margin</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#4f46e5' }}>{stats.avgMargin.toFixed(0)}%</div>
                </div>
                <div className="hpp-table-card" style={{ margin: 0, padding: '16px' }}>
                    <div style={{ color: '#8b95a1', fontSize: '10.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Potensi Profit / Pcs</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#0d9f6e' }}>Rp {fmt(stats.totalProfit)}</div>
                </div>
            </div>

            {/* TOOLBAR PENCARIAN */}
            <div className="hpp-table-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', maxWidth: '320px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98a2ac' }} />
                    <input placeholder="Cari produk atau ID..." value={query} onChange={(e) => setQuery(e.target.value)} className="hpp-field" style={{ paddingLeft: '36px', borderRadius: '999px' }} />
                </div>
            </div>

            {loading && (
                <div className="hpp-table-card" style={{ textAlign: 'center', padding: '40px', color: '#8b95a1' }}>
                    Memuat data...
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="hpp-table-card" style={{ textAlign: 'center', padding: '40px', color: '#8b95a1' }}>
                    Belum ada produk yang cocok. Coba kata kunci lain.
                </div>
            )}

            {/* TABEL DAFTAR HARGA JUAL */}
            {!loading && filtered.length > 0 && (
                <div className="hpp-table-card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#fafafb', borderBottom: '1px solid #f0f1f3' }}>
                                    <th style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Produk & ID</th>
                                    <th style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>HPP / Pcs</th>
                                    <th style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Margin (%)</th>
                                    <th style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', color: '#98a2ac', fontWeight: '700' }}>Harga Jual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => {
                                    const isLow = item.margin <= 100;
                                    const fillPct = Math.min(100, Math.max(8, (item.margin / 300) * 100));

                                    return (
                                        <tr key={item.produk_id} style={{ borderBottom: '1px solid #f5f6f7' }}>
                                            {/* Kolom Nama & ID */}
                                            <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                                <span style={{ fontSize: '10.5px', background: '#f0f1f3', padding: '2px 8px', borderRadius: '999px', fontFamily: 'monospace', color: '#5b6670' }}>{item.produk_id}</span>
                                                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1d1f', marginTop: '4px' }}>{item.nama_produk_jadi}</div>
                                            </td>

                                            {/* Kolom HPP */}
                                            <td style={{ padding: '12px', verticalAlign: 'middle', fontFamily: 'monospace', fontWeight: '600', color: '#5b6670' }}>Rp {fmt(item.hpp_per_pcs)}</td>

                                            {/* Kolom Margin */}
                                            <td style={{ padding: '12px', verticalAlign: 'middle', width: '180px' }}>
                                                <div style={{ position: 'relative', width: '110px' }}>
                                                    <input
                                                        type="number"
                                                        min="100"
                                                        className="hpp-field"
                                                        style={{
                                                            paddingRight: '26px',
                                                            fontFamily: 'monospace',
                                                            borderColor: isLow ? '#d9614f' : '#e7e9ec',
                                                            background: isLow ? '#fdeae7' : '#fff'
                                                        }}
                                                        value={item.margin}
                                                        onChange={(e) => handleMarginChange(item.produk_id, e.target.value)}
                                                    />
                                                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#8b95a1' }}>%</span>
                                                </div>
                                                {isLow && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#d9614f', marginTop: '4px', fontWeight: '700' }}>
                                                        <AlertTriangle size={10} /> Min 100%
                                                    </div>
                                                )}
                                            </td>

                                            {/* Kolom Harga Jual & Gauge */}
                                            <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>Rp {fmt(item.harga_jual)}</div>
                                                <div style={{ marginTop: '6px', height: '6px', borderRadius: '999px', background: '#f0f1f3', overflow: 'hidden', width: '140px' }}>
                                                    <div
                                                        style={{
                                                            height: '100%',
                                                            borderRadius: '999px',
                                                            width: `${fillPct}%`,
                                                            background: isLow ? 'linear-gradient(90deg, #d9614f, #e08274)' : 'linear-gradient(90deg, #0d9f6e, #5fb98c)',
                                                            transition: 'width 0.25s ease'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
