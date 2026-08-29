'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Steps } from 'primereact/steps';
import { MenuItem } from 'primereact/menuitem';
import axios from 'axios';
import ToastNotifier from '../../../../components/ToastNotifier';
import { RegisterPageSkeleton } from '../../../../components/SkeletonLoader';

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

const RegisterKaryawanPage = () => {
    const router = useRouter();
    const toastRef = useRef<ToastNotifierHandle>(null);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State Skeleton
    const [isPageLoading, setIsPageLoading] = useState(true);

    // State Form
    const [formData, setFormData] = useState({
        // Akun Login
        email: '',
        password: '',
        confirmPassword: '',

        // Data Pribadi
        nik: '',
        nama: '',
        gender: 'L',
        tempat_lahir: '',
        tgl_lahir: null as Date | null,
        alamat: '',
        no_telp: '',
        agama: '',
        status_pernikahan: 'Lajang',
        npwp: '',
        kontak_darurat_nama: '',
        kontak_darurat_hub: '',
        kontak_darurat_telp: '',

        // Data Perusahaan (Diperbarui)
        nama_perusahaan: '',
        npwp_perusahaan: '',
        nib: '',
        alamat_perusahaan: '',
        no_telp_perusahaan: ''
    });

    // State File
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);

    // Effect Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Steps Configuration (Diubah label step 3)
    const steps: MenuItem[] = [
        { label: 'Akun Login', icon: 'pi pi-user' },
        { label: 'Data Pribadi', icon: 'pi pi-id-card' },
        { label: 'Data Perusahaan', icon: 'pi pi-building' },
        { label: 'Foto & Konfirmasi', icon: 'pi pi-check-circle' }
    ];

    const genderOptions = [
        { label: 'Laki-laki', value: 'L' },
        { label: 'Perempuan', value: 'P' }
    ];

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleDropdownChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 0:
                if (!formData.email || !formData.password || !formData.confirmPassword) {
                    toastRef.current?.showToast('01', 'Semua field akun login wajib diisi');
                    return false;
                }
                if (formData.password.length < 8) {
                    toastRef.current?.showToast('01', 'Password minimal 8 karakter');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    toastRef.current?.showToast('01', 'Konfirmasi password tidak cocok');
                    return false;
                }
                return true;

            case 1:
                if (!formData.nama || !formData.gender) {
                    toastRef.current?.showToast('01', 'Nama, dan Gender wajib diisi');
                    return false;
                }
                return true;

            case 2:
                if (!formData.nama_perusahaan || !formData.npwp_perusahaan || !formData.nib) {
                    toastRef.current?.showToast('01', 'Nama Perusahaan, NPWP Perusahaan, dan NIB wajib diisi');
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        if (!validateStep(activeStep)) return;

        setLoading(true);

        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'confirmPassword') return;

                if (value instanceof Date) {
                    const formattedDate = value.toLocaleDateString('en-CA');
                    data.append(key, formattedDate);
                } else if (value !== null && value !== undefined && value !== '') {
                    data.append(key, value as string);
                }
            });

            if (foto) data.append('foto_karyawan', foto);
            if (fotoKtp) data.append('foto_ktp', fotoKtp);

            const token = localStorage.getItem('TOKEN');
            const headers: Record<string, string> = {
                'Content-Type': 'multipart/form-data'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-owner`, data, { headers });

            if (res.data.status === '00' || res.status === 201) {
                toastRef.current?.showToast('00', 'Registrasi berhasil! Mengalihkan ke halaman verifikasi...');

                // simpan email sementara jika dibutuhkan di halaman verifikasi
                if (typeof window !== 'undefined') {
                    localStorage.setItem('pending_verify_email', formData.email);
                }

                // langsung redirect ke halaman verifikasi dengan membawa email via query param
                setTimeout(() => {
                    router.push(`/auth/resend-verification?email=${encodeURIComponent(formData.email)}`);
                }, 1200);
            }
        } catch (err: any) {
            console.error('Error:', err.response?.data);
            const msg = err.response?.data?.message || 'Gagal mendaftar';
            toastRef.current?.showToast('01', msg);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="p-fluid">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-900 font-medium mb-2">
                                Email (Username) *
                            </label>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-envelope text-400"></i>
                                <InputText id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="yourname@gmail.com" className="w-full" style={{ paddingLeft: '2.5rem' }} />
                            </span>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-900 font-medium mb-2">
                                Password *
                            </label>
                            <span className="p-input-icon-left p-input-icon-right w-full">
                                <i className="pi pi-lock text-400"></i>
                                <InputText
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} cursor-pointer text-400 hover:text-700`} onClick={() => setShowPassword(!showPassword)}></i>
                            </span>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
                                Konfirmasi Password *
                            </label>
                            <span className="p-input-icon-left p-input-icon-right w-full">
                                <i className="pi pi-lock text-400"></i>
                                <InputText
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Ulangi password"
                                    className="w-full"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <i className={`pi ${showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'} cursor-pointer text-400 hover:text-700`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                            </span>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="p-fluid">
                        <div className="grid">
                            <div className="col-12">
                                <label htmlFor="nama" className="block text-900 font-medium mb-2">
                                    Nama Lengkap *
                                </label>
                                <InputText id="nama" value={formData.nama} onChange={handleInputChange} placeholder="Nama sesuai KTP" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="tempat_lahir" className="block text-900 font-medium mb-2">
                                    Tempat Lahir
                                </label>
                                <InputText id="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} placeholder="Kota kelahiran" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="tgl_lahir" className="block text-900 font-medium mb-2">
                                    Tanggal Lahir
                                </label>
                                <Calendar id="tgl_lahir" value={formData.tgl_lahir} onChange={(e) => handleDropdownChange('tgl_lahir', e.value)} showIcon dateFormat="dd/mm/yy" placeholder="Pilih tanggal" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="no_telp" className="block text-900 font-medium mb-2">
                                    No. Telepon / WhatsApp
                                </label>
                                <InputText id="no_telp" value={formData.no_telp} onChange={handleInputChange} placeholder="08xxxxxxxxxx" />
                            </div>
                            <div className="col-12 md:col-6">
                                <label htmlFor="gender" className="block text-900 font-medium mb-2">
                                    Jenis Kelamin *
                                </label>
                                <Dropdown id="gender" value={formData.gender} options={genderOptions} onChange={(e) => handleDropdownChange('gender', e.value)} />
                            </div>

                            <div className="col-12">
                                <label htmlFor="alamat" className="block text-900 font-medium mb-2">
                                    Alamat Lengkap
                                </label>
                                <InputTextarea id="alamat" value={formData.alamat} onChange={handleInputChange} rows={3} placeholder="Alamat domisili sesuai KTP" />
                            </div>

                            {/* Section Upload Foto KTP */}
                            <div className="col-12 mt-2">
                                <label className="block text-900 font-medium mb-2">
                                    <i className="pi pi-id-card mr-2"></i>
                                    Upload Foto KTP
                                </label>
                                <FileUpload mode="basic" accept="image/*" maxFileSize={2000000} onSelect={(e) => setFotoKtp(e.files[0])} chooseLabel="Pilih Foto KTP" className="w-full" />
                                {fotoKtp && (
                                    <div className="mt-2 p-2 surface-100 border-round flex align-items-center">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-green-700 font-medium text-sm">{fotoKtp.name}</span>
                                    </div>
                                )}
                                <small className="text-500 block mt-1">Format gambar JPG, PNG. Maksimal 2MB</small>
                            </div>

                            {/* Section Kontak Darurat */}
                            <div className="col-12 mt-3">
                                <span className="block text-900 font-semibold mb-2">Kontak Darurat</span>
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="kontak_darurat_nama" className="block text-900 font-medium mb-2">
                                    Nama Kontak
                                </label>
                                <InputText id="kontak_darurat_nama" value={formData.kontak_darurat_nama} onChange={handleInputChange} placeholder="Nama kerabat" />
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="kontak_darurat_hub" className="block text-900 font-medium mb-2">
                                    Hubungan
                                </label>
                                <InputText id="kontak_darurat_hub" value={formData.kontak_darurat_hub} onChange={handleInputChange} placeholder="Contoh: Orang Tua / Pasangan" />
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="kontak_darurat_telp" className="block text-900 font-medium mb-2">
                                    No. Telepon Darurat
                                </label>
                                <InputText id="kontak_darurat_telp" value={formData.kontak_darurat_telp} onChange={handleInputChange} placeholder="08xxxxxxxxxx" />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="p-fluid">
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <label htmlFor="nama_perusahaan" className="block text-900 font-medium mb-2">
                                    Nama Perusahaan *
                                </label>
                                <InputText id="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleInputChange} placeholder="Contoh: PT Rahman Textile" />
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
                    </div>
                );

            case 3:
                return (
                    <div className="p-fluid">
                        <div className="mb-5">
                            <label className="block text-900 font-medium mb-3">
                                <i className="pi pi-image mr-2"></i>
                                Foto Profil (Opsional)
                            </label>
                            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} onSelect={(e) => setFoto(e.files[0])} chooseLabel="Pilih Foto" className="w-full" />
                            {foto && (
                                <div className="mt-3 p-3 surface-100 border-round">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span className="text-green-700 font-medium">{foto.name}</span>
                                </div>
                            )}
                            <small className="text-500 block mt-2">Format: JPG, PNG, GIF. Maksimal 1MB</small>
                        </div>

                        <div className="surface-100 border-round p-4">
                            <h3 className="text-900 font-bold mb-3">
                                <i className="pi pi-info-circle mr-2"></i>
                                Ringkasan Data
                            </h3>
                            <div className="grid">
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">Email</p>
                                    <p className="text-900 font-medium">{formData.email}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">Alamat</p>
                                    <p className="text-900 font-medium">{formData.alamat}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">Nama Lengkap</p>
                                    <p className="text-900 font-medium">{formData.nama}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">Foto KTP</p>
                                    <p className="text-900 font-medium">{fotoKtp ? fotoKtp.name : 'Belum diunggah'}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">Nama Perusahaan</p>
                                    <p className="text-900 font-medium">{formData.nama_perusahaan}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">NIB Perusahaan</p>
                                    <p className="text-900 font-medium">{formData.nib}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">NPWP Perusahaan</p>
                                    <p className="text-900 font-medium">{formData.npwp_perusahaan}</p>
                                </div>
                                <div className="col-6">
                                    <p className="text-600 mb-1 text-sm">No. Telp Perusahaan</p>
                                    <p className="text-900 font-medium">{formData.no_telp_perusahaan || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (isPageLoading) {
        return <RegisterPageSkeleton />;
    }

    return (
        <>
            <ToastNotifier ref={toastRef} />

            <div
                className="min-h-screen flex align-items-center justify-content-center p-4"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    animation: 'fadeIn 0.5s ease-in'
                }}
            >
                <div className="surface-card shadow-8 border-round-2xl overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
                    <div className="p-5 border-bottom-1 surface-border" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                        <div className="flex align-items-center justify-content-between">
                            <div>
                                <h2 className="text-white text-3xl font-bold m-0 mb-2">Registrasi Karyawan</h2>
                                <p className="text-white-alpha-80 m-0">Lengkapi data Anda untuk membuat akun karyawan</p>
                            </div>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-plain hover:bg-black-alpha-20 hover:text-red-400" style={{ color: 'white', transition: '0.3s' }} onClick={() => router.push('/auth/login')} />
                        </div>
                    </div>

                    <div className="p-5 border-bottom-1 surface-border">
                        <Steps model={steps} activeIndex={activeStep} readOnly className="mb-0" />
                    </div>

                    <div className="p-6">{renderStepContent()}</div>

                    <div className="p-5 border-top-1 surface-border flex justify-content-between">
                        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={handleBack} disabled={activeStep === 0 || loading} />

                        {activeStep < steps.length - 1 ? (
                            <Button label="Selanjutnya" icon="pi pi-arrow-right" iconPos="right" onClick={handleNext} disabled={loading} />
                        ) : (
                            <Button
                                label={loading ? 'Memproses...' : 'Daftar Sekarang'}
                                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                iconPos="right"
                                onClick={handleSubmit}
                                loading={loading}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterKaryawanPage;
