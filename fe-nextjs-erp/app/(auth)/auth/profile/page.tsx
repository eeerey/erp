'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import axios from 'axios';
import ToastNotifier from '@/app/components/ToastNotifier';
import { roleRoutes } from 'utils/roleRoutes';

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

interface CompanyData {
    id: number;
    nama_perusahaan: string;
    alamat?: string;
    nib?: string;
    npwp?: string;
    no_telp?: string;
}

interface KaryawanData {
    ID: number;
    KARYAWAN_ID: string;
    NIK: string;
    NAMA: string;
    GENDER: string;
    TEMPAT_LAHIR?: string;
    TGL_LAHIR?: string;
    ALAMAT?: string;
    NO_TELP?: string;
    DEPARTEMEN: string;
    JABATAN: string;
    TANGGAL_MASUK: string;
    STATUS_KARYAWAN: string;
    STATUS_AKTIF: string;
    SHIFT?: string;
    PENDIDIKAN_TERAKHIR?: string;
    FOTO?: string | null;
    FOTO_KTP?: string | null;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id: number;
    is_verified: boolean;
    company?: CompanyData | null;
    karyawan?: KaryawanData | null;
}

const ProfilePage = () => {
    const router = useRouter();
    const toastRef = useRef<ToastNotifierHandle>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // State Modal Edit Profil
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        nik: '',
        gender: 'L',
        tempat_lahir: '',
        tgl_lahir: null as Date | null,
        no_telp: '',
        alamat: '',
        pendidikan_terakhir: ''
    });

    const handleGoToDashboard = () => {
        // Ambil role dari state profile, atau fallback ke LocalStorage
        const userRole = profile?.role || localStorage.getItem('ROLE') || '';

        // Dapatkan rute sesuai role, default ke '/' jika role tidak ditemukan
        const targetRoute = roleRoutes[userRole] || '/';

        router.push(targetRoute);
    };

    const pendidikanOptions = [
        { label: 'SMA / SMK / Sederajat', value: 'SMA/SMK' },
        { label: 'D1 (Diploma 1)', value: 'D1' },
        { label: 'D2 (Diploma 2)', value: 'D2' },
        { label: 'D3 (Diploma 3)', value: 'D3' },
        { label: 'D4 (Diploma 4)', value: 'D4' },
        { label: 'S1 (Sarjana)', value: 'S1' },
        { label: 'S2 (Magister)', value: 'S2' },
        { label: 'S3 (Doktor)', value: 'S3' }
    ];

    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    // State Modal Ubah Password Normal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [savingPassword, setSavingPassword] = useState(false);

    // State Modal Lupa Password (OTP 3 Step)
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [loadingForgot, setLoadingForgot] = useState(false);

    const genderOptions = [
        { label: 'Laki-laki', value: 'L' },
        { label: 'Perempuan', value: 'P' }
    ];

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('TOKEN');
            if (!token) {
                toastRef.current?.showToast('01', 'Token tidak ditemukan');
                router.push('/auth/login');
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200 && res.data?.user) {
                const u = res.data.user;
                const k = u.karyawan;

                setProfile(u);
                setForgotEmail(u.email || '');
                setEditForm({
                    name: u.name || '',
                    nik: k?.NIK || '',
                    gender: k?.GENDER || 'L',
                    tempat_lahir: k?.TEMPAT_LAHIR || '',
                    tgl_lahir: k?.TGL_LAHIR ? new Date(k.TGL_LAHIR) : null,
                    no_telp: k?.NO_TELP || '',
                    alamat: k?.ALAMAT || '',
                    pendidikan_terakhir: k?.PENDIDIKAN_TERAKHIR || ''
                });
            }
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal mengambil data profil');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handler Submit Edit Profil
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        try {
            const token = localStorage.getItem('TOKEN');
            const formData = new FormData();

            formData.append('name', editForm.name);
            formData.append('nik', editForm.nik);
            formData.append('gender', editForm.gender);
            formData.append('tempat_lahir', editForm.tempat_lahir);
            if (editForm.tgl_lahir) {
                formData.append('tgl_lahir', editForm.tgl_lahir.toISOString().split('T')[0]);
            }
            formData.append('no_telp', editForm.no_telp);
            formData.append('alamat', editForm.alamat);
            formData.append('pendidikan_terakhir', editForm.pendidikan_terakhir);

            if (fotoFile) formData.append('foto_karyawan', fotoFile);
            if (fotoKtpFile) formData.append('foto_ktp', fotoKtpFile);

            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Profil berhasil diperbarui!');
                setShowEditModal(false);
                setFotoFile(null);
                setFotoKtpFile(null);
                fetchProfile();
            }
        } catch (err: any) {
            console.error('Update profile error:', err);
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setSavingProfile(false);
        }
    };

    // Handler Ubah Password Normal
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toastRef.current?.showToast('01', 'Konfirmasi password baru tidak cocok');
            return;
        }

        setSavingPassword(true);
        try {
            const token = localStorage.getItem('TOKEN');
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
                {
                    oldPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Password berhasil diubah!');
                setShowPasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setSavingPassword(false);
        }
    };

    // Step 1: Kirim OTP
    const handleSendForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingForgot(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/send-otp`, {
                email: forgotEmail
            });
            if (res.status === 200) {
                toastRef.current?.showToast('00', 'OTP berhasil dikirim ke email!');
                setForgotStep(2);
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal mengirim OTP');
        } finally {
            setLoadingForgot(false);
        }
    };

    // Step 2: Verifikasi OTP
    const handleVerifyForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingForgot(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/verify-otp`, {
                email: forgotEmail,
                otp: forgotOtp
            });
            if (res.status === 200) {
                toastRef.current?.showToast('00', 'OTP Valid! Silakan buat password baru');
                setForgotStep(3);
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Kode OTP Salah atau Kedaluwarsa');
        } finally {
            setLoadingForgot(false);
        }
    };

    // Step 3: Reset Password Baru
    const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (forgotNewPassword !== forgotConfirmPassword) {
            toastRef.current?.showToast('01', 'Konfirmasi password tidak cocok');
            return;
        }

        setLoadingForgot(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/reset`, {
                email: forgotEmail,
                otp: forgotOtp,
                newPassword: forgotNewPassword
            });

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Password berhasil di-reset!');
                setShowForgotModal(false);
                setShowPasswordModal(false);
                setForgotStep(1);
                setForgotOtp('');
                setForgotNewPassword('');
                setForgotConfirmPassword('');
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal me-reset password');
        } finally {
            setLoadingForgot(false);
        }
    };

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
        );
    }

    const karyawan = profile?.karyawan;
    const company = profile?.company;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <>
            <ToastNotifier ref={toastRef} />

            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex align-items-center justify-content-between mb-4">
                    <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text p-button-secondary" onClick={() => router.back()} />
                    <Button label="Ke Dashboard" icon="pi pi-home" className="p-button-outlined p-button-primary border-round-lg" onClick={handleGoToDashboard} />
                </div>

                <div className="surface-card shadow-4 border-round-2xl p-5 mb-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)' }}>
                    <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-4 relative z-1">
                        <div className="flex flex-column md:flex-row align-items-center gap-4 text-center md:text-left">
                            {karyawan?.FOTO ? (
                                <Avatar image={`${baseUrl}${karyawan.FOTO}`} size="xlarge" shape="circle" className="w-7rem h-7rem shadow-4 border-2 border-white" />
                            ) : (
                                <Avatar label={profile?.name?.charAt(0).toUpperCase() || 'U'} size="xlarge" shape="circle" className="w-7rem h-7rem bg-white-alpha-20 text-white text-4xl shadow-4 border-2 border-white" />
                            )}
                            <div>
                                <h2 className="text-3xl font-bold m-0 mb-2">{profile?.name}</h2>
                                <div className="flex flex-wrap justify-content-center md:justify-content-start gap-2 align-items-center mb-2">
                                    <Tag value={profile?.role} severity="info" className="px-3 py-1 text-xs" />
                                    {karyawan?.KARYAWAN_ID && <Tag value={karyawan.KARYAWAN_ID} severity="warning" className="px-3 py-1 text-xs" />}
                                    <Tag value={profile?.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'} severity={profile?.is_verified ? 'success' : 'danger'} className="px-3 py-1 text-xs" />
                                </div>
                                <p className="text-white-alpha-80 m-0 flex align-items-center justify-content-center md:justify-content-start gap-2">
                                    <i className="pi pi-envelope" />
                                    {profile?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-column sm:flex-row gap-2 w-full md:w-auto">
                            <Button label="Edit Profil Lengkap" icon="pi pi-user-edit" className="p-button-white p-button-outlined border-round-pill w-full sm:w-auto" onClick={() => setShowEditModal(true)} />
                            <Button label="Ubah Password" icon="pi pi-key" className="p-button-warning border-round-pill w-full sm:w-auto" onClick={() => setShowPasswordModal(true)} />
                        </div>
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <Card title="Data Pribadi" className="shadow-2 border-round-2xl mb-4">
                            <div className="grid">
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">NIK</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.NIK || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Jenis Kelamin</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.GENDER === 'L' ? 'Laki-laki' : karyawan?.GENDER === 'P' ? 'Perempuan' : '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Tempat, Tanggal Lahir</span>
                                    <span className="text-900 font-medium text-lg">
                                        {karyawan?.TEMPAT_LAHIR || '-'}, {formatDate(karyawan?.TGL_LAHIR)}
                                    </span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">No. Telepon / WhatsApp</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.NO_TELP || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Pendidikan Terakhir</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.PENDIDIKAN_TERAKHIR || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Alamat Lengkap</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.ALAMAT || '-'}</span>
                                </div>

                                <Divider />

                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Departemen</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.DEPARTEMEN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Jabatan</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.JABATAN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Status Karyawan</span>
                                    <span className="text-900 font-medium text-lg">{karyawan?.STATUS_KARYAWAN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Tanggal Masuk</span>
                                    <span className="text-900 font-medium text-lg">{formatDate(karyawan?.TANGGAL_MASUK)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Informasi Perusahaan" className="shadow-2 border-round-2xl">
                            <div className="grid">
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Nama Perusahaan</span>
                                    <span className="text-900 font-medium text-lg">{company?.nama_perusahaan || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">No. Telp Perusahaan</span>
                                    <span className="text-900 font-medium text-lg">{company?.no_telp || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">NPWP Perusahaan</span>
                                    <span className="text-900 font-medium text-lg">{company?.npwp || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">NIB Perusahaan</span>
                                    <span className="text-900 font-medium text-lg">{company?.nib || '-'}</span>
                                </div>
                                <div className="col-12 mb-3">
                                    <span className="text-500 block text-xs uppercase font-semibold mb-1">Alamat Perusahaan</span>
                                    <span className="text-900 font-medium text-lg">{company?.alamat || '-'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12 lg:col-4">
                        <Card title="Dokumen KTP" className="shadow-2 border-round-2xl mb-4">
                            {karyawan?.FOTO_KTP ? (
                                <div className="text-center">
                                    <img src={`${baseUrl}${karyawan.FOTO_KTP}`} alt="Foto KTP" className="w-full border-round-xl shadow-2 surface-border border-1 mb-3" style={{ maxHeight: '220px', objectFit: 'cover' }} />
                                    <Button label="Lihat KTP Utuh" icon="pi pi-external-link" className="p-button-outlined p-button-sm w-full border-round-lg" onClick={() => window.open(`${baseUrl}${karyawan.FOTO_KTP}`, '_blank')} />
                                </div>
                            ) : (
                                <div className="surface-100 p-5 border-round-xl text-center text-500">
                                    <i className="pi pi-id-card text-5xl mb-3 block" />
                                    Foto KTP belum diunggah
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Edit Profile Lengkap */}
            <Dialog header="Edit Profil & Berkas" visible={showEditModal} style={{ width: '90%', maxWidth: '650px' }} onHide={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdateProfile} className="flex flex-column gap-3 mt-2">
                    <div className="grid">
                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label htmlFor="edit-name" className="font-semibold text-sm">
                                Nama Lengkap
                            </label>
                            <InputText id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                        </div>
                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label htmlFor="edit-nik" className="font-semibold text-sm">
                                NIK KTP
                            </label>
                            <InputText id="edit-nik" value={editForm.nik} onChange={(e) => setEditForm({ ...editForm, nik: e.target.value })} required />
                        </div>

                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Jenis Kelamin</label>
                            <Dropdown value={editForm.gender} options={genderOptions} onChange={(e) => setEditForm({ ...editForm, gender: e.value })} placeholder="Pilih Gender" />
                        </div>
                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label htmlFor="edit-phone" className="font-semibold text-sm">
                                No. Telp / WA
                            </label>
                            <InputText id="edit-phone" value={editForm.no_telp} onChange={(e) => setEditForm({ ...editForm, no_telp: e.target.value })} />
                        </div>

                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label htmlFor="edit-tempat" className="font-semibold text-sm">
                                Tempat Lahir
                            </label>
                            <InputText id="edit-tempat" value={editForm.tempat_lahir} onChange={(e) => setEditForm({ ...editForm, tempat_lahir: e.target.value })} />
                        </div>
                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Tanggal Lahir</label>
                            <Calendar value={editForm.tgl_lahir} onChange={(e) => setEditForm({ ...editForm, tgl_lahir: e.value as Date })} dateFormat="yy-mm-dd" showIcon />
                        </div>

                        <div className="col-12 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Pendidikan Terakhir</label>
                            <Dropdown value={editForm.pendidikan_terakhir} options={pendidikanOptions} onChange={(e) => setEditForm({ ...editForm, pendidikan_terakhir: e.value })} placeholder="Pilih Pendidikan Terakhir" className="w-full" />
                        </div>

                        <div className="col-12 flex flex-column gap-2">
                            <label htmlFor="edit-alamat" className="font-semibold text-sm">
                                Alamat Lengkap
                            </label>
                            <InputText id="edit-alamat" value={editForm.alamat} onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })} />
                        </div>

                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Ganti Foto Profil</label>
                            <FileUpload mode="basic" accept="image/*" maxFileSize={2000000} chooseLabel="Pilih Foto Profil" onSelect={(e: FileUploadSelectEvent) => setFotoFile(e.files[0])} className="w-full" />
                            {fotoFile && <small className="text-primary font-medium">Terpilih: {fotoFile.name}</small>}
                        </div>

                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Ganti Berkas KTP</label>
                            <FileUpload mode="basic" accept="image/*" maxFileSize={2000000} chooseLabel="Pilih Foto KTP" onSelect={(e: FileUploadSelectEvent) => setFotoKtpFile(e.files[0])} className="w-full" />
                            {fotoKtpFile && <small className="text-primary font-medium">Terpilih: {fotoKtpFile.name}</small>}
                        </div>
                    </div>

                    <div className="flex justify-content-end gap-2 mt-4">
                        <Button type="button" label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => setShowEditModal(false)} />
                        <Button type="submit" label="Simpan Perubahan" icon="pi pi-check" loading={savingProfile} />
                    </div>
                </form>
            </Dialog>

            {/* Modal Ubah Password Normal */}
            <Dialog header="Ubah Password" visible={showPasswordModal} style={{ width: '90%', maxWidth: '450px' }} onHide={() => setShowPasswordModal(false)}>
                <form onSubmit={handleChangePassword} className="flex flex-column gap-3 mt-2">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="currentPassword" className="font-semibold text-sm">
                            Password Saat Ini
                        </label>
                        <Password
                            id="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            toggleMask
                            feedback={false}
                            required
                            className="w-full"
                            inputClassName="w-full"
                        />
                    </div>

                    <div className="text-right">
                        <a href="/auth/forgot-password" className="text-primary text-sm cursor-pointer hover:underline font-medium" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
                            Lupa Password? Reset via OTP Email
                        </a>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="newPassword" className="font-semibold text-sm">
                            Password Baru
                        </label>
                        <Password id="newPassword" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} toggleMask required className="w-full" inputClassName="w-full" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="confirmPassword" className="font-semibold text-sm">
                            Konfirmasi Password Baru
                        </label>
                        <Password
                            id="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            toggleMask
                            feedback={false}
                            required
                            className="w-full"
                            inputClassName="w-full"
                        />
                    </div>
                    <div className="flex justify-content-end gap-2 mt-3">
                        <Button type="button" label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => setShowPasswordModal(false)} />
                        <Button type="submit" label="Ubah Password" icon="pi pi-key" severity="warning" loading={savingPassword} />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ProfilePage;
