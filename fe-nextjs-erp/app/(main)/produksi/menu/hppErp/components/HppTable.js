'use client';

import React, { useMemo } from 'react';
import { Plus, Trash2, Package, Users, Layers } from 'lucide-react';

const ICONS = { bahan: Package, tenaga: Users, overhead: Layers };

export default function HppTable({ title, items = [], setItems, color, type, masterBarang = [] }) {
    // ======================
    // ADD ROW
    // ======================
    const addRow = () => {
        setItems([
            ...items,
            {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                barangKode: '',
                nama: '',
                hargaSatuan: 0,
                satuan: '',
                jumlah: '',
                jam: type === 'tenaga' || type === 'overhead' ? 1 : undefined
            }
        ]);
    };

    // ======================
    // REMOVE ROW
    // ======================
    const removeRow = (id) => {
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
    };

    // ======================
    // UPDATE ROW
    // ======================
    const updateRow = (id, field, value) => {
        const updated = items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    [field]: field === 'hargaSatuan' || field === 'jumlah' || field === 'jam' ? (value === '' ? '' : Number(value)) : value
                };
            }
            return item;
        });
        setItems(updated);
    };

    // ======================
    // TOTAL CALC
    // ======================
    const total = (item) => {
        const jumlah = Number(item.jumlah || 0);
        const harga = Number(item.hargaSatuan || 0);
        const jam = Number(item.jam || 1);

        if (type === 'tenaga' || type === 'overhead') {
            return jumlah * harga * jam;
        }
        return jumlah * harga;
    };

    const sectionTotal = useMemo(() => {
        return (items || []).reduce((acc, item) => acc + total(item), 0);
    }, [items, type]);

    // ======================
    // RENDER NAMA / DROPDOWN BARANG
    // ======================
    const renderNama = (item) => {
        if (type === 'tenaga' || type === 'overhead') {
            return <input type="text" placeholder={type === 'tenaga' ? 'Contoh: Koki' : 'Contoh: Gas LPG'} value={item.nama || ''} onChange={(e) => updateRow(item.id, 'nama', e.target.value)} className="hpp-field" />;
        }

        return (
            <select
                value={item.barangKode || ''}
                onChange={(e) => {
                    const selectedCode = e.target.value;
                    if (!selectedCode) {
                        const updated = items.map((i) => (i.id === item.id ? { ...i, barangKode: '', nama: '', hargaSatuan: 0, satuan: '' } : i));
                        setItems(updated);
                        return;
                    }

                    const barang = masterBarang.find((b) => String(b.BARANG_KODE) === String(selectedCode));
                    if (!barang) return;

                    const namaSatuan = barang.NAMA_SATUAN || barang.nama_satuan || barang.SATUAN_ID || '';

                    const updated = items.map((i) => {
                        if (i.id === item.id) {
                            return {
                                ...i,
                                barangKode: barang.BARANG_KODE,
                                nama: barang.NAMA_BARANG,
                                hargaSatuan: Number(barang.HARGA_BELI_TERAKHIR) || 0,
                                satuan: namaSatuan
                            };
                        }
                        return i;
                    });
                    setItems(updated);
                }}
                className="hpp-field"
            >
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
        indigo: { accent: '#4f46e5', soft: '#eef0ff' },
        emerald: { accent: '#0d9f6e', soft: '#e7f8f1' },
        orange: { accent: '#d97706', soft: '#fef3e2' }
    };
    const colorKey = color?.includes('indigo') ? 'indigo' : color?.includes('emerald') ? 'emerald' : 'orange';
    const t = theme[colorKey] || theme.indigo;
    const Icon = ICONS[type] || Package;

    return (
        <div className="hpp-table-card" style={{ '--accent': t.accent, '--accent-soft': t.soft }}>
            <style>{`
                .hpp-table-card { background: #fff; border: 1px solid #edeef1; border-radius: 20px; padding: 18px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .hpp-table-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
                .hpp-table-title-row { display: flex; align-items: center; gap: 10px; }
                .hpp-table-icon { width: 32px; height: 32px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: flex; align-items: center; justify-content: center; }
                .hpp-table-title { font-size: 15px; font-weight: 700; color: #1a1d1f; margin: 0; }
                .hpp-table-count { font-size: 11.5px; color: #8b95a1; font-weight: 500; }
                .hpp-add-btn { background: var(--accent); color: #fff; border: none; padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: opacity 0.2s; }
                .hpp-add-btn:hover { opacity: 0.9; }
                .hpp-table-wrap { overflow: auto; border: 1px solid #f0f1f3; border-radius: 14px; }
                .hpp-table { width: 100%; font-size: 13px; border-collapse: collapse; }
                .hpp-table thead tr { background: #fafafb; }
                .hpp-table th { padding: 11px 12px; text-align: left; font-size: 10.5px; text-transform: uppercase; color: #98a2ac; font-weight: 700; border-bottom: 1px solid #f0f1f3; }
                .hpp-table td { padding: 9px 12px; border-bottom: 1px solid #f5f6f7; vertical-align: middle; }
                .hpp-field { width: 100%; border: 1.5px solid #e7e9ec; border-radius: 10px; padding: 7px 10px; font-size: 13px; outline: none; background: #fff; }
                .hpp-field:focus { border-color: var(--accent); }
                .hpp-total-val { font-weight: 700; color: var(--accent); white-space: nowrap; }
                .hpp-del-btn { color: #d9614f; background: #fdeae7; border: none; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
                .hpp-del-btn:hover { background: #fbdad4; }
                .hpp-empty-row { text-align: center; padding: 26px 12px; color: #aab1ba; font-size: 12.5px; }
                .hpp-footer-row { display: flex; justify-content: flex-end; align-items: center; gap: 12px; padding: 12px 4px 2px; font-size: 13px; }
                .hpp-footer-label { color: #8b95a1; font-weight: 600; }
                .hpp-footer-val { font-weight: 700; font-size: 15px; color: var(--accent); }
            `}</style>

            {/* HEADER */}
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

            {/* TABLE */}
            <div className="hpp-table-wrap">
                <table className="hpp-table">
                    <thead>
                        <tr>
                            <th>{isTenagaOrOverhead ? 'Nama' : 'Nama Barang'}</th>
                            {isTenagaOrOverhead ? (
                                <>
                                    <th>Harga Satuan</th>
                                    <th>Jumlah</th>
                                    <th>Satuan / Jam</th>
                                </>
                            ) : (
                                <>
                                    <th>Satuan</th>
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
                                <td colSpan={6} className="hpp-empty-row">
                                    Belum ada item. Klik "Tambah" untuk mulai mengisi.
                                </td>
                            </tr>
                        )}

                        {(items || []).map((item) => (
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
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <input type="text" value={item.satuan || ''} readOnly className="hpp-field" style={{ background: '#f8fafc' }} placeholder="Satuan" />
                                        </td>
                                        <td>
                                            <input type="number" min="0" value={item.jumlah} onChange={(e) => updateRow(item.id, 'jumlah', e.target.value)} className="hpp-field" />
                                        </td>
                                        <td>
                                            <input type="number" min="0" value={item.hargaSatuan} onChange={(e) => updateRow(item.id, 'hargaSatuan', e.target.value)} className="hpp-field" />
                                        </td>
                                    </>
                                )}

                                <td>
                                    <span className="hpp-total-val">Rp {total(item).toLocaleString('id-ID')}</span>
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => removeRow(item.id)} className="hpp-del-btn" type="button">
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {items && items.length > 0 && (
                <div className="hpp-footer-row">
                    <span className="hpp-footer-label">Subtotal {title}</span>
                    <span className="hpp-footer-val">Rp {sectionTotal.toLocaleString('id-ID')}</span>
                </div>
            )}
        </div>
    );
}
