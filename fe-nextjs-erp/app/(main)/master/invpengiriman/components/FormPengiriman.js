'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

export default function FormPengiriman({ masterData, onSave, onCancel, loading }) {
    const [header, setHeader] = useState({
        NO_PENGIRIMAN: '',
        TGL_KIRIM: new Date(),
        KODE_PELANGGAN: '',
        ALAMAT_TUJUAN: '',
        KETERANGAN: ''
    });

    const [items, setItems] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [selectedGudang, setSelectedGudang] = useState(null);
    const [selectedRak, setSelectedRak] = useState(null);
    const [qty, setQty] = useState(1);
    const [error, setError] = useState('');

    const onCustomerChange = (e) => {
        const cust = masterData?.customers?.find((c) => c.KODE_CUSTOMER === e.value);
        setHeader({
            ...header,
            KODE_PELANGGAN: e.value,
            ALAMAT_TUJUAN: cust?.ALAMAT || ''
        });
        setError('');
    };

    const addBarang = () => {
        if (!selectedBarang) {
            setError('Pilih barang terlebih dahulu!');
            return;
        }
        if (!selectedGudang) {
            setError('Pilih gudang asal terlebih dahulu!');
            return;
        }
        if (!selectedRak) {
            setError('Pilih rak terlebih dahulu!');
            return;
        }
        if (qty <= 0) {
            setError('Jumlah minimal adalah 1');
            return;
        }

        // Cek apakah kombinasi Barang, Gudang, dan Rak yang sama sudah ada di tabel
        const existingIndex = items.findIndex((i) => i.BARANG_KODE === selectedBarang.BARANG_KODE && i.KODE_GUDANG === selectedGudang && i.KODE_RAK === selectedRak);

        if (existingIndex > -1) {
            const newItems = [...items];
            newItems[existingIndex].QTY += qty;
            setItems(newItems);
        } else {
            setItems([
                ...items,
                {
                    BARANG_KODE: selectedBarang.BARANG_KODE,
                    NAMA_BARANG: selectedBarang.NAMA_BARANG,
                    KODE_GUDANG: selectedGudang,
                    KODE_RAK: selectedRak,
                    QTY: qty,
                    BATCH_NO: '-'
                }
            ]);
        }

        // Reset pilihan input item
        setSelectedBarang(null);
        setSelectedGudang(null);
        setSelectedRak(null);
        setQty(1);
        setError('');
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleFinalSave = () => {
        if (!header.NO_PENGIRIMAN || !header.KODE_PELANGGAN) {
            setError('Nomor Surat Jalan dan Customer wajib diisi!');
            return;
        }
        if (items.length === 0) {
            setError('Tambahkan minimal 1 barang untuk dikirim!');
            return;
        }

        onSave({ header, items });
    };

    const footerTable = (
        <div className="flex justify-content-between align-items-center px-2">
            <span className="font-bold">Total Jenis Barang: {items.length}</span>
            <span className="text-xl font-bold text-primary">Total Qty: {items.reduce((sum, item) => sum + item.QTY, 0)}</span>
        </div>
    );

    return (
        <div className="grid p-fluid">
            {error && (
                <div className="col-12 mb-2">
                    <Message severity="error" text={error} className="w-full justify-content-start" />
                </div>
            )}

            {/* Bagian Kiri: Informasi Header Pengiriman */}
            <div className="col-12 md:col-4">
                <Card title="Informasi Pengiriman">
                    <div className="flex flex-column gap-3">
                        <div className="field">
                            <label className="font-bold">No. Surat Jalan</label>
                            <InputText value={header.NO_PENGIRIMAN} onChange={(e) => setHeader({ ...header, NO_PENGIRIMAN: e.target.value.toUpperCase() })} placeholder="CONTOH: SJ/2026/001" />
                        </div>

                        <div className="field">
                            <label className="font-bold">Tanggal Kirim</label>
                            <Calendar value={header.TGL_KIRIM} onChange={(e) => setHeader({ ...header, TGL_KIRIM: e.value })} showIcon dateFormat="dd/mm/yy" />
                        </div>

                        <div className="field">
                            <label className="font-bold">Customer</label>
                            <Dropdown value={header.KODE_PELANGGAN} options={masterData?.customers || []} optionLabel="NAMA_CUSTOMER" optionValue="KODE_CUSTOMER" onChange={onCustomerChange} filter placeholder="Pilih Pelanggan" />
                        </div>

                        <div className="field">
                            <label className="font-bold">Alamat Tujuan</label>
                            <InputText value={header.ALAMAT_TUJUAN} onChange={(e) => setHeader({ ...header, ALAMAT_TUJUAN: e.target.value })} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bagian Kanan: Input & Daftar Barang */}
            <div className="col-12 md:col-8">
                <Card title="Daftar Barang">
                    <div className="grid align-items-end mb-4">
                        <div className="col-12 md:col-6 field mb-2">
                            <label className="font-bold">Pilih Barang</label>
                            <Dropdown value={selectedBarang} options={masterData?.barangs || []} optionLabel="NAMA_BARANG" onChange={(e) => setSelectedBarang(e.value)} filter placeholder="Cari Barang..." />
                        </div>

                        <div className="col-12 md:col-6 field mb-2">
                            <label className="font-bold">Gudang Asal</label>
                            <Dropdown
                                value={selectedGudang}
                                options={masterData?.gudangs || masterData?.gudang || masterData?.masterGudang || []}
                                optionLabel="NAMA_GUDANG"
                                optionValue="KODE_GUDANG"
                                onChange={(e) => {
                                    setSelectedGudang(e.value);
                                    setSelectedRak(null); // Reset rak jika gudang berubah
                                }}
                                placeholder="Pilih Gudang"
                                filter
                            />
                        </div>

                        <div className="col-12 md:col-4 field mb-2">
                            <label className="font-bold">Rak</label>
                            <Dropdown
                                value={selectedRak}
                                options={(masterData?.raks || masterData?.rak || masterData?.masterRak || []).filter((r) => r.KODE_GUDANG === selectedGudang)}
                                optionLabel="NAMA_RAK"
                                optionValue="KODE_RAK"
                                onChange={(e) => setSelectedRak(e.value)}
                                placeholder="Pilih Rak"
                                disabled={!selectedGudang}
                                filter
                            />
                        </div>

                        <div className="col-12 md:col-4 field mb-2">
                            <label className="font-bold">Jumlah (Qty)</label>
                            <InputNumber value={qty} onValueChange={(e) => setQty(e.value)} showButtons min={1} />
                        </div>

                        <div className="col-12 md:col-4 field mb-2">
                            <Button label="Tambah Item" icon="pi pi-plus" onClick={addBarang} className="w-full" />
                        </div>
                    </div>

                    <DataTable value={items} className="p-datatable-sm" footer={items.length > 0 ? footerTable : null}>
                        <Column field="BARANG_KODE" header="Kode" />
                        <Column field="NAMA_BARANG" header="Nama" />
                        <Column
                            header="Lokasi (Gudang | Rak)"
                            body={(r) => (
                                <small className="p-tag p-tag-info">
                                    {r.KODE_GUDANG} | {r.KODE_RAK}
                                </small>
                            )}
                        />
                        <Column field="QTY" header="Qty" body={(r) => <b>{r.QTY}</b>} />
                        <Column header="Aksi" body={(_, options) => <Button icon="pi pi-trash" severity="danger" text onClick={() => removeItem(options.rowIndex)} />} />
                    </DataTable>

                    <div className="flex justify-content-end gap-2 mt-4">
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={onCancel} />
                        <Button label="Simpan Pengiriman" icon="pi pi-check" severity="success" onClick={handleFinalSave} loading={loading} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
