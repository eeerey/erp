'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import ToastNotifier from '../../../components/ToastNotifier'; // Sesuaikan path

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

export default function ResendVerificationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toastRef = useRef<ToastNotifierHandle>(null);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        // Tangkap query email dari URL
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    // Submit Form Verifikasi OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !otp) {
            toastRef.current?.showToast('01', 'Email dan Kode OTP wajib diisi');
            return;
        }

        setLoading(true);

        try {
            // Panggil API verify-email sesuai BE kamu
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, { email, otp });

            if (res.data.status === '00' || res.status === 200) {
                toastRef.current?.showToast('00', 'Verifikasi akun berhasil! Silakan login.');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Kode OTP salah atau sudah expired';
            toastRef.current?.showToast('01', msg);
        } finally {
            setLoading(false);
        }
    };

    // Kirim Ulang OTP
    const handleResendOtp = async () => {
        if (!email) {
            toastRef.current?.showToast('01', 'Email tidak ditemukan');
            return;
        }

        setResendLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, { email });

            if (res.data.status === '00' || res.status === 200) {
                toastRef.current?.showToast('00', 'Kode OTP baru berhasil dikirim ke email!');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Gagal mengirim ulang OTP';
            toastRef.current?.showToast('01', msg);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <>
            <ToastNotifier ref={toastRef} />

            <div
                className="min-h-screen flex align-items-center justify-content-center p-4"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <div className="surface-card shadow-8 border-round-2xl p-5 w-full max-w-29rem text-center">
                    <div className="mb-4">
                        <i className="pi pi-envelope text-primary text-5xl mb-3" />
                        <h2 className="text-2xl font-bold text-900 mb-2">Verifikasi OTP</h2>
                        <p className="text-600 text-sm mb-1">Kode OTP telah dikirimkan ke email:</p>
                        <span className="font-bold text-900">{email || 'Email Anda'}</span>
                    </div>

                    <form onSubmit={handleVerify} className="p-fluid">
                        <div className="mb-4 text-left">
                            <label htmlFor="otp" className="block text-900 font-medium mb-2">
                                Masukkan Kode OTP
                            </label>
                            <InputText id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 Digit OTP" className="text-center font-bold text-xl tracking-widest" maxLength={6} />
                        </div>

                        <Button type="submit" label="Verifikasi Akun" icon="pi pi-check" loading={loading} className="mb-3" />
                    </form>

                    <div className="border-top-1 surface-border pt-3">
                        <p className="text-600 text-sm mb-1">Belum menerima / OTP kadaluwarsa?</p>
                        <Button label="Kirim Ulang OTP" icon="pi pi-refresh" className="p-button-text p-button-sm" loading={resendLoading} onClick={handleResendOtp} />
                    </div>
                </div>
            </div>
        </>
    );
}
