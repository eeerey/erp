'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import ToastNotifier from '@/app/components/ToastNotifier';

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
    NPWP?: string | null;
    NIB?: string | null;
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

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('TOKEN');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.status === '00' || res.status === 200) {
                setProfile(res.data.user);
            }
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            const msg = err.response?.data?.message || 'Gagal mengambil data profil';
            toastRef.current?.showToast('01', msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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

            <div className="p-4 max-w-6xl mx-auto">
                {/* Navigation Bar / Action Buttons */}
                <div className="flex align-items-center justify-content-between mb-4">
                    <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined p-button-secondary border-round-lg" onClick={() => router.back()} />
                    <Button label="Ke Dashboard" icon="pi pi-home" className="p-button-primary border-round-lg" onClick={() => router.push('/superadmin/dashboard')} />
                </div>

                {/* Header Profil */}
                <div className="surface-card shadow-2 border-round-xl p-4 mb-4 flex flex-column md:flex-row align-items-center justify-content-between gap-4">
                    <div className="flex align-items-center gap-4">
                        {karyawan?.FOTO ? (
                            <Avatar image={`${baseUrl}${karyawan.FOTO}`} size="xlarge" shape="circle" className="w-8rem h-8rem shadow-3" />
                        ) : (
                            <Avatar label={profile?.name?.charAt(0).toUpperCase() || 'U'} size="xlarge" shape="circle" className="w-8rem h-8rem bg-primary text-white text-4xl shadow-3" />
                        )}
                        <div>
                            <h2 className="text-3xl font-bold text-900 m-0 mb-2">{profile?.name}</h2>
                            <div className="flex flex-wrap gap-2 align-items-center mb-2">
                                <Tag value={profile?.role} severity="info" />
                                {karyawan?.KARYAWAN_ID && <Tag value={karyawan.KARYAWAN_ID} severity="warning" />}
                                <Tag value={profile?.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'} severity={profile?.is_verified ? 'success' : 'danger'} />
                            </div>
                            <p className="text-600 m-0 flex align-items-center gap-2">
                                <i className="pi pi-envelope text-primary" />
                                {profile?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    {/* Column Kiri: Data Pribadi & Kepegawaian */}
                    <div className="col-12 lg:col-8">
                        <Card title="Data Pribadi & Kepegawaian" className="shadow-2 border-round-xl mb-4">
                            <div className="grid">
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">NIK</span>
                                    <span className="text-900 font-medium">{karyawan?.NIK || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Jenis Kelamin</span>
                                    <span className="text-900 font-medium">{karyawan?.GENDER === 'L' ? 'Laki-laki' : karyawan?.GENDER === 'P' ? 'Perempuan' : '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Tempat, Tanggal Lahir</span>
                                    <span className="text-900 font-medium">
                                        {karyawan?.TEMPAT_LAHIR || '-'}, {formatDate(karyawan?.TGL_LAHIR)}
                                    </span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">No. Telepon / WhatsApp</span>
                                    <span className="text-900 font-medium">{karyawan?.NO_TELP || '-'}</span>
                                </div>
                                <div className="col-12 mb-3">
                                    <span className="text-500 block text-sm mb-1">Alamat Lengkap</span>
                                    <span className="text-900 font-medium">{karyawan?.ALAMAT || '-'}</span>
                                </div>

                                <Divider />

                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Departemen</span>
                                    <span className="text-900 font-medium">{karyawan?.DEPARTEMEN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Jabatan</span>
                                    <span className="text-900 font-medium">{karyawan?.JABATAN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Status Karyawan</span>
                                    <span className="text-900 font-medium">{karyawan?.STATUS_KARYAWAN || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Tanggal Masuk</span>
                                    <span className="text-900 font-medium">{formatDate(karyawan?.TANGGAL_MASUK)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Info Perusahaan */}
                        <Card title="Informasi Perusahaan" className="shadow-2 border-round-xl">
                            <div className="grid">
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">Nama Perusahaan</span>
                                    <span className="text-900 font-medium">{company?.nama_perusahaan || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">No. Telp Perusahaan</span>
                                    <span className="text-900 font-medium">{company?.no_telp || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">NPWP Perusahaan</span>
                                    <span className="text-900 font-medium">{company?.npwp || '-'}</span>
                                </div>
                                <div className="col-12 md:col-6 mb-3">
                                    <span className="text-500 block text-sm mb-1">NIB Perusahaan</span>
                                    <span className="text-900 font-medium">{company?.nib || '-'}</span>
                                </div>
                                <div className="col-12 mb-3">
                                    <span className="text-500 block text-sm mb-1">Alamat Perusahaan</span>
                                    <span className="text-900 font-medium">{company?.alamat || '-'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Column Kanan: Dokumen Identitas (KTP) */}
                    <div className="col-12 lg:col-4">
                        <Card title="Dokumen KTP" className="shadow-2 border-round-xl mb-4">
                            {karyawan?.FOTO_KTP ? (
                                <div className="text-center">
                                    <img src={`${baseUrl}${karyawan.FOTO_KTP}`} alt="Foto KTP" className="w-full border-round-lg shadow-2 surface-border border-1 mb-3" style={{ maxHeight: '220px', objectFit: 'cover' }} />
                                    <Button label="Lihat KTP Utuh" icon="pi pi-external-link" className="p-button-outlined p-button-sm w-full" onClick={() => window.open(`${baseUrl}${karyawan.FOTO_KTP}`, '_blank')} />
                                </div>
                            ) : (
                                <div className="surface-100 p-4 border-round-lg text-center text-500">
                                    <i className="pi pi-id-card text-4xl mb-2 block" />
                                    Foto KTP belum diunggah
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
