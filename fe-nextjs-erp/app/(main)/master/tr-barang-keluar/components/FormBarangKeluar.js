'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormBarangKeluar = ({ visible, onHide, onSave, masterBarang = [], masterGudang = [], masterRak = [], masterPengiriman = [], barangKeluarList = [] }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        NO_KELUAR: '',
        NO_PENGIRIMAN: null,
        BARANG_KODE: null,
        KODE_GUDANG: null,
        KODE_RAK: null,
        QTY: 0.0,
        BATCH_NO: ''
    });

    // Generator No Keluar: OUT-YYYYMMDD-0001
    const generateNoKeluar = () => {
        const today = new Date();
        const dateStr = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0');

        let nextNum = 1;
        if (barangKeluarList && barangKeluarList.length > 0) {
            const lastNo = barangKeluarList[0]?.NO_KELUAR || '';
            if (lastNo.includes(dateStr)) {
                const lastSeq = parseInt(lastNo.split('-')[2], 10);
                nextNum = isNaN(lastSeq) ? 1 : lastSeq + 1;
            }
        }
        return `OUT-${dateStr}-${nextNum.toString().padStart(4, '0')}`;
    };

    useEffect(() => {
        if (visible) {
            setFormData({
                NO_KELUAR: generateNoKeluar(),
                NO_PENGIRIMAN: null,
                BARANG_KODE: null,
                KODE_GUDANG: null,
                KODE_RAK: null,
                QTY: 0,
                BATCH_NO: ''
            });
            setErrors({});
        }
    }, [visible, barangKeluarList]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.BARANG_KODE) newErrors.BARANG_KODE = 'Wajib diisi';
        if (!formData.KODE_GUDANG) newErrors.KODE_GUDANG = 'Wajib diisi';
        if (!formData.KODE_RAK) newErrors.KODE_RAK = 'Wajib diisi'; // Diubah menjadi wajib agar sesuai dengan database stok
        if (!formData.QTY || formData.QTY <= 0) newErrors.QTY = 'Qty minimal 0.01';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                NO_KELUAR: formData.NO_KELUAR,
                NO_PENGIRIMAN: formData.NO_PENGIRIMAN || null,
                BARANG_KODE: formData.BARANG_KODE,
                KODE_GUDANG: formData.KODE_GUDANG,
                KODE_RAK: formData.KODE_RAK, // Dipastikan terisi
                QTY: parseFloat(formData.QTY),
                BATCH_NO: formData.BATCH_NO?.trim() || '-'
            };

            await onSave(payload);
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Input Barang Keluar"
            visible={visible}
            style={{ width: '500px' }}
            modal
            onHide={onHide}
            footer={
                <div className="flex justify-content-end gap-2">
                    <Button label="Batal" icon="pi pi-times" text onClick={onHide} disabled={loading} />
                    <Button label="Simpan" icon="pi pi-check" loading={loading} onClick={handleSubmit} severity="success" />
                </div>
            }
        >
            <div className="p-fluid grid mt-1">
                <div className="field col-6">
                    <label className="font-bold text-sm">No. Keluar</label>
                    <InputText value={formData.NO_KELUAR} disabled className="p-disabled bg-gray-100" />
                </div>

                <div className="field col-6">
                    <label className="font-bold text-sm">No. Pengiriman</label>
                    <Dropdown
                        value={formData.NO_PENGIRIMAN}
                        options={masterPengiriman}
                        optionLabel="NO_PENGIRIMAN"
                        optionValue="NO_PENGIRIMAN"
                        onChange={(e) => setFormData({ ...formData, NO_PENGIRIMAN: e.value })}
                        placeholder="Tanpa Pengiriman (Opsional)"
                        filter
                        showClear
                    />
                </div>

                <div className="field col-12">
                    <label className="font-bold text-sm">
                        Barang <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.BARANG_KODE}
                        options={masterBarang}
                        optionLabel="NAMA_BARANG"
                        optionValue="BARANG_KODE"
                        onChange={(e) => setFormData({ ...formData, BARANG_KODE: e.value })}
                        placeholder="Cari Barang..."
                        filter
                        className={errors.BARANG_KODE ? 'p-invalid' : ''}
                    />
                    {errors.BARANG_KODE && <small className="p-error">{errors.BARANG_KODE}</small>}
                </div>

                <div className="field col-6">
                    <label className="font-bold text-sm">
                        QTY Keluar <span className="text-red-500">*</span>
                    </label>
                    <InputNumber value={formData.QTY} onValueChange={(e) => setFormData({ ...formData, QTY: e.value })} minFractionDigits={2} maxFractionDigits={2} placeholder="0.00" className={errors.QTY ? 'p-invalid' : ''} />
                    {errors.QTY && <small className="p-error">{errors.QTY}</small>}
                </div>

                <div className="field col-6">
                    <label className="font-bold text-sm">Batch No</label>
                    <InputText value={formData.BATCH_NO} onChange={(e) => setFormData({ ...formData, BATCH_NO: e.target.value })} placeholder="No. Produksi" />
                </div>

                <div className="field col-6">
                    <label className="font-bold text-sm">
                        Gudang Asal <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.KODE_GUDANG}
                        options={masterGudang}
                        optionLabel="NAMA_GUDANG"
                        optionValue="KODE_GUDANG"
                        onChange={(e) => setFormData({ ...formData, KODE_GUDANG: e.value, KODE_RAK: null })}
                        placeholder="Pilih Gudang"
                        className={errors.KODE_GUDANG ? 'p-invalid' : ''}
                    />
                    {errors.KODE_GUDANG && <small className="p-error">{errors.KODE_GUDANG}</small>}
                </div>

                <div className="field col-6">
                    <label className="font-bold text-sm">
                        Rak <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.KODE_RAK}
                        options={masterRak?.filter((r) => r.KODE_GUDANG === formData.KODE_GUDANG)}
                        optionLabel="NAMA_RAK"
                        optionValue="KODE_RAK"
                        onChange={(e) => setFormData({ ...formData, KODE_RAK: e.value })}
                        placeholder="Pilih Rak"
                        disabled={!formData.KODE_GUDANG}
                        className={errors.KODE_RAK ? 'p-invalid' : ''}
                        showClear
                    />
                    {errors.KODE_RAK && <small className="p-error">{errors.KODE_RAK}</small>}
                </div>
            </div>
        </Dialog>
    );
};

export default FormBarangKeluar;
