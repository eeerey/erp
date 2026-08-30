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
    FOTO_UMKM?: string[] | null; // Tambahan properti array foto UMKM
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

    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoUmkmFiles, setFotoUmkmFiles] = useState<File[]>([]); // 👈 Ubah jadi Array File (1 - 3)
    const [savingProfile, setSavingProfile] = useState(false);

    // State Modal Ubah Password Normal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [savingPassword, setSavingPassword] = useState(false);

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

    const genderOptions = [
        { label: 'Laki-laki', value: 'L' },
        { label: 'Perempuan', value: 'P' }
    ];

    const handleGoToDashboard = () => {
        const userRole = profile?.role || localStorage.getItem('ROLE') || '';
        const targetRoute = roleRoutes[userRole] || '/';
        router.push(targetRoute);
    };

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

    // Handler Submit Edit Profil (SUDAH DISESUAIKAN UNTUK FOTO UMKM)
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (fotoFile && fotoFile.size > MAX_FILE_SIZE) {
            toastRef.current?.showToast('01', 'Ukuran foto profil terlalu besar (Maksimal 5 MB)');
            return;
        }

        setSavingProfile(true);

        try {
            const token = localStorage.getItem('TOKEN');
            const formData = new FormData();

            formData.append('name', editForm.name ? editForm.name.trim() : '');
            formData.append('nik', editForm.nik ? editForm.nik.trim() : '');
            formData.append('gender', editForm.gender);
            formData.append('tempat_lahir', editForm.tempat_lahir ? editForm.tempat_lahir.trim() : '');

            if (editForm.tgl_lahir) {
                const year = editForm.tgl_lahir.getFullYear();
                const month = String(editForm.tgl_lahir.getMonth() + 1).padStart(2, '0');
                const day = String(editForm.tgl_lahir.getDate()).padStart(2, '0');
                formData.append('tgl_lahir', `${year}-${month}-${day}`);
            }

            formData.append('no_telp', editForm.no_telp ? editForm.no_telp.trim() : '');
            formData.append('alamat', editForm.alamat ? editForm.alamat.trim() : '');
            formData.append('pendidikan_terakhir', editForm.pendidikan_terakhir || '');

            if (fotoFile) formData.append('foto_karyawan', fotoFile);

            // 👈 Append Multiple Foto UMKM ke field 'foto_umkm'
            fotoUmkmFiles.forEach((file) => {
                formData.append('foto_umkm', file);
            });

            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Profil berhasil diperbarui!');
                setShowEditModal(false);
                setFotoFile(null);
                setFotoUmkmFiles([]);
                await fetchProfile();
            }
        } catch (err: any) {
            console.error('Update profile error:', err);
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setSavingProfile(false);
        }
    };

    // Handler Ubah Password
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

    // Ambil daftar foto UMKM (dari FOTO_UMKM atau parse FOTO_KTP)
    let fotoUmkmList: string[] = [];
    if (karyawan?.FOTO_UMKM && Array.isArray(karyawan.FOTO_UMKM)) {
        fotoUmkmList = karyawan.FOTO_UMKM;
    } else if (karyawan?.FOTO_KTP) {
        try {
            fotoUmkmList = JSON.parse(karyawan.FOTO_KTP);
        } catch (e) {
            fotoUmkmList = [karyawan.FOTO_KTP];
        }
    }

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

                    {/* Rendering Multiple Foto UMKM */}
                    <div className="col-12 lg:col-4">
                        <Card title="Foto Dokumen UMKM" className="shadow-2 border-round-2xl mb-4">
                            {fotoUmkmList.length > 0 ? (
                                <div className="flex flex-column gap-3">
                                    {fotoUmkmList.map((path, idx) => (
                                        <div key={idx} className="text-center surface-50 p-2 border-round-xl border-1 surface-border">
                                            <img src={`${baseUrl}${path}`} alt={`Foto UMKM ${idx + 1}`} className="w-full border-round-lg shadow-1 mb-2" style={{ maxHeight: '180px', objectFit: 'cover' }} />
                                            <Button label={`Lihat Foto ${idx + 1}`} icon="pi pi-external-link" className="p-button-outlined p-button-sm w-full border-round-lg" onClick={() => window.open(`${baseUrl}${path}`, '_blank')} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="surface-100 p-5 border-round-xl text-center text-500">
                                    <i className="pi pi-images text-5xl mb-3 block" />
                                    Foto UMKM belum diunggah
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
                            <FileUpload mode="basic" accept="image/*" maxFileSize={5000000} chooseLabel="Pilih Foto Profil" onSelect={(e: FileUploadSelectEvent) => setFotoFile(e.files[0])} className="w-full" />
                            {fotoFile && <small className="text-primary font-medium">Terpilih: {fotoFile.name}</small>}
                        </div>

                        {/* Input Upload Foto UMKM (Multiple Files) */}
                        <div className="col-12 md:col-6 flex flex-column gap-2">
                            <label className="font-semibold text-sm">Ganti Foto UMKM (Maks. 3)</label>
                            <FileUpload
                                mode="basic"
                                accept="image/*"
                                multiple
                                maxFileSize={5000000}
                                chooseLabel={fotoUmkmFiles.length >= 3 ? 'Batas Foto Tercapai' : 'Pilih Foto UMKM'}
                                disabled={fotoUmkmFiles.length >= 3}
                                onSelect={(e: FileUploadSelectEvent) => {
                                    const selected = Array.from(e.files);
                                    setFotoUmkmFiles([...fotoUmkmFiles, ...selected].slice(0, 3));
                                }}
                                className="w-full"
                            />
                            {fotoUmkmFiles.length > 0 && (
                                <div className="flex flex-column gap-1">
                                    {fotoUmkmFiles.map((file, idx) => (
                                        <div key={idx} className="flex align-items-center justify-content-between surface-100 p-1 border-round">
                                            <small className="text-primary font-medium text-xs truncate">{file.name}</small>
                                            <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text p-button-sm p-0" onClick={() => setFotoUmkmFiles(fotoUmkmFiles.filter((_, i) => i !== idx))} />
                                        </div>
                                    ))}
                                </div>
                            )}
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
