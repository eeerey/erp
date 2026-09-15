'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';

const FormGudang = ({ visible, onHide, onSave, selectedGudang, gudangList }) => {
    const [kodeGudang, setKodeGudang] = useState('');
    const [namaGudang, setNamaGudang] = useState('');
    const [alamat, setAlamat] = useState('');
    const [status, setStatus] = useState('Aktif');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [latestList, setLatestList] = useState([]);

    const statusOptions = [
        { label: 'Aktif', value: 'Aktif' },
        { label: 'Tidak Aktif', value: 'Tidak Aktif' }
    ];

    // Fungsi generate kode otomatis (opsional dipakai sebagai default jika ingin tetap ada, atau dikosongkan)
    const generateNewCode = (listData) => {
        if (!Array.isArray(listData) || listData.length === 0) {
            return 'GDG001';
        }

        const sortedList = [...listData].sort((a, b) => {
            const numA = parseInt((a?.KODE_GUDANG || '').replace(/\D/g, '') || 0, 10);
            const numB = parseInt((b?.KODE_GUDANG || '').replace(/\D/g, '') || 0, 10);
            return numB - numA;
        });

        const lastKode = sortedList[0]?.KODE_GUDANG || '';
        const numericPart = parseInt(lastKode.replace(/\D/g, '') || 0, 10);
        const nextNumber = isNaN(numericPart) ? 1 : numericPart + 1;

        return `GDG${nextNumber.toString().padStart(3, '0')}`;
    };

    useEffect(() => {
        const fetchGudangIfNeeded = async () => {
            if (gudangList && gudangList.length > 0) {
                setLatestList(gudangList);
            } else {
                try {
                    const res = await axios.get('/api/master-gudang', { withCredentials: true });
                    setLatestList(res.data.data || []);
                } catch (err) {
                    console.error('Gagal mengambil list gudang otomatis:', err);
                    setLatestList([]);
                }
            }
        };

        if (visible) {
            fetchGudangIfNeeded();
        }
    }, [visible, gudangList]);

    useEffect(() => {
        if (!visible) return;

        if (selectedGudang) {
            // Mode EDIT
            setKodeGudang(selectedGudang.KODE_GUDANG || '');
            setNamaGudang(selectedGudang.NAMA_GUDANG || '');
            setAlamat(selectedGudang.ALAMAT || '');
            setStatus(selectedGudang.STATUS || 'Aktif');
        } else {
            // Mode TAMBAH - Tetap di-generate otomatis sebagai saran awal, tapi sekarang BISA DIKETIK/DIUBAH
            setKodeGudang(generateNewCode(latestList));
            setNamaGudang('');
            setAlamat('');
            setStatus('Aktif');
        }
        setErrors({});
    }, [visible, selectedGudang, latestList]);

    const validateForm = () => {
        const newErrors = {};
        if (!kodeGudang.trim()) {
            newErrors.kodeGudang = 'Kode gudang wajib diisi';
        }
        if (!namaGudang.trim()) {
            newErrors.namaGudang = 'Nama gudang wajib diisi';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = {
            KODE_GUDANG: kodeGudang.trim(),
            NAMA_GUDANG: namaGudang.trim(),
            ALAMAT: alamat.trim(),
            STATUS: status
        };

        setLoading(true);
        await onSave(data);
        setLoading(false);
        onHide();
    };

    return (
        <Dialog header={selectedGudang ? `Edit Gudang: ${selectedGudang.NAMA_GUDANG}` : 'Tambah Gudang Baru'} visible={visible} style={{ width: '450px' }} modal onHide={onHide} draggable={false} dismissableMask>
            <div className="p-fluid">
                {/* Kode Gudang (Sekarang Bisa Diedit/Diisi Manual) */}
                <div className="field mb-4">
                    <label htmlFor="kodeGudang" className="font-bold block mb-2">
                        Kode Gudang <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="kodeGudang"
                        value={kodeGudang}
                        onChange={(e) => {
                            setKodeGudang(e.target.value);
                            if (errors.kodeGudang) setErrors({ ...errors, kodeGudang: null });
                        }}
                        placeholder="Contoh: GDG001"
                        className={errors.kodeGudang ? 'p-invalid' : ''}
                    />
                    {errors.kodeGudang && <small className="p-error">{errors.kodeGudang}</small>}
                </div>

                {/* Nama Gudang */}
                <div className="field mb-4">
                    <label htmlFor="namaGudang" className="font-bold block mb-2">
                        Nama Gudang <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="namaGudang"
                        value={namaGudang}
                        onChange={(e) => {
                            setNamaGudang(e.target.value);
                            if (errors.namaGudang) setErrors({ ...errors, namaGudang: null });
                        }}
                        placeholder="Contoh: Gudang Utama"
                        className={errors.namaGudang ? 'p-invalid' : ''}
                    />
                    {errors.namaGudang && <small className="p-error">{errors.namaGudang}</small>}
                </div>

                {/* Alamat */}
                <div className="field mb-4">
                    <label htmlFor="alamat" className="font-bold block mb-2">
                        Alamat Gudang
                    </label>
                    <InputTextarea id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} rows={3} autoResize placeholder="Masukkan alamat lengkap..." />
                </div>

                {/* Status */}
                <div className="field mb-4">
                    <label htmlFor="status" className="font-bold block mb-2">
                        Status
                    </label>
                    <Dropdown id="status" value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-content-end gap-2 mt-5">
                    <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={onHide} disabled={loading} />
                    <Button label={selectedGudang ? 'Simpan Perubahan' : 'Simpan Gudang'} icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'} onClick={handleSubmit} disabled={loading} />
                </div>
            </div>
        </Dialog>
    );
};

export default FormGudang;
