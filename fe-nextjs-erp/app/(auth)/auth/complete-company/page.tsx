'use client';
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import ToastNotifier from '../../../components/ToastNotifier';
import axios from 'axios';

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

const CompleteCompanyPage = () => {
    const router = useRouter();
    const toastRef = useRef<ToastNotifierHandle>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nama_perusahaan: '',
        npwp_perusahaan: '',
        nib: '',
        no_telp_perusahaan: '',
        alamat_perusahaan: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nama_perusahaan) {
            toastRef.current?.showToast('01', 'Nama Perusahaan wajib diisi!');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('TOKEN');
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/complete-company`, formData, { headers: { Authorization: `Bearer ${token}` } });

            toastRef.current?.showToast('00', 'Data Perusahaan berhasil disimpan!');
            setTimeout(() => {
                router.push('/');
            }, 1200);
        } catch (err: any) {
            console.error(err);
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal menyimpan data perusahaan');
            setLoading(false);
        }
    };

    return (
        <>
            <ToastNotifier ref={toastRef} />
            <div className="min-h-screen flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="surface-card shadow-8 border-round-2xl p-6 lg:p-8" style={{ maxWidth: '700px', width: '100%' }}>
                    <div className="mb-5 text-center">
                        <h2 className="text-900 text-3xl font-bold mb-2">Lengkapi Data Perusahaan</h2>
                        <p className="text-600 text-sm">Selamat datang! Silakan lengkapi informasi bisnis kamu untuk melanjutkan ke sistem.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <label htmlFor="nama_perusahaan" className="block text-900 font-medium mb-2">
                                    Nama Perusahaan *
                                </label>
                                <InputText id="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleInputChange} placeholder="Contoh: PT Rahman Textile" required />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="npwp_perusahaan" className="block text-900 font-medium mb-2">
                                    NPWP Perusahaan *
                                </label>
                                <InputText id="npwp_perusahaan" value={formData.npwp_perusahaan} onChange={handleInputChange} placeholder="Masukkan nomor NPWP Perusahaan" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="nib" className="block text-900 font-medium mb-2">
                                    NIB (Nomor Induk Berusaha) *
                                </label>
                                <InputText id="nib" value={formData.nib} onChange={handleInputChange} placeholder="Masukkan nomor NIB Perusahaan" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="no_telp_perusahaan" className="block text-900 font-medium mb-2">
                                    No. Telepon Perusahaan
                                </label>
                                <InputText id="no_telp_perusahaan" value={formData.no_telp_perusahaan} onChange={handleInputChange} placeholder="Contoh: 021-xxxxxxxx" />
                            </div>

                            <div className="col-12">
                                <label htmlFor="alamat_perusahaan" className="block text-900 font-medium mb-2">
                                    Alamat Perusahaan
                                </label>
                                <InputTextarea id="alamat_perusahaan" value={formData.alamat_perusahaan} onChange={handleInputChange} rows={3} placeholder="Alamat lengkap operasional/kantor perusahaan" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label={loading ? 'Menyimpan...' : 'SIMPAN & MASUK DASHBOARD'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                            className="w-full mt-4 p-3 text-lg font-bold"
                            loading={loading}
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '50px' }}
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default CompleteCompanyPage;
