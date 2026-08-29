'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import axios from 'axios';
import ToastNotifier from '../../../components/ToastNotifier';

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

// Disamakan dengan Backend (15 menit = 900 detik)
const INITIAL_TIMER_SECONDS = 15 * 60;

function ResendVerificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toastRef = useRef<ToastNotifierHandle>(null);

    const [email, setEmail] = useState('');
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(INITIAL_TIMER_SECONDS);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        } else if (typeof window !== 'undefined') {
            // Fallback membaca email dari localStorage jika query param tidak ada
            const storedEmail = localStorage.getItem('pending_verify_email');
            if (storedEmail) setEmail(storedEmail);
        }
    }, [searchParams]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otpValues];
        newOtp[index] = value.slice(-1);
        setOtpValues(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtpValues(digits);
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otpValues.join('');

        if (timeLeft <= 0) {
            toastRef.current?.showToast('01', 'Kode OTP telah kadaluwarsa, silakan kirim ulang OTP');
            return;
        }

        if (!email || fullOtp.length < 6) {
            toastRef.current?.showToast('01', 'Silakan isi 6 digit kode OTP secara lengkap');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
                email,
                otp: fullOtp
            });

            if (res.data.status === 'SUKSES' || res.status === 200) {
                toastRef.current?.showToast('00', 'Verifikasi akun berhasil! Silakan login.');

                // Bersihkan temp storage setelah verifikasi sukses
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('pending_verify_email');
                }

                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Kode OTP salah atau sudah expired';
            toastRef.current?.showToast('01', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toastRef.current?.showToast('01', 'Email tidak ditemukan');
            return;
        }

        setResendLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, { email });

            if (res.data.status === 'SUKSES' || res.status === 200) {
                toastRef.current?.showToast('00', 'Kode OTP baru berhasil dikirim ke email!');
                setTimeLeft(INITIAL_TIMER_SECONDS);
                setOtpValues(Array(6).fill(''));
                inputRefs.current[0]?.focus();
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
                        <div className="mb-4 flex flex-column align-items-center">
                            <label className="block text-900 font-medium mb-3">Masukkan Kode OTP</label>

                            <div className="flex gap-2 justify-content-center mb-3">
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        disabled={timeLeft <= 0}
                                        className="w-3rem h-3rem text-center text-xl font-bold border-round border-1 border-300 focus:border-primary surface-border outline-none shadow-1"
                                    />
                                ))}
                            </div>

                            <div className="text-sm">
                                {timeLeft > 0 ? (
                                    <p className="text-600 m-0">
                                        Kode aktif selama: <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
                                    </p>
                                ) : (
                                    <p className="text-red-500 font-medium m-0">Kode OTP sudah kedaluwarsa. Silakan kirim ulang.</p>
                                )}
                            </div>
                        </div>

                        <Button type="submit" label="Verifikasi Akun" icon="pi pi-check" loading={loading} disabled={timeLeft <= 0} className="mb-3" />
                    </form>

                    <div className="border-top-1 surface-border pt-3">
                        <p className="text-600 text-sm mb-1">Belum menerima / OTP kadaluwarsa?</p>
                        <Button label="Kirim Ulang OTP" icon="pi pi-refresh" className="p-button-text p-button-sm" loading={resendLoading} disabled={timeLeft > 0} onClick={handleResendOtp} />
                    </div>
                </div>
            </div>
        </>
    );
}

// Bungkus dengan Suspense untuk keamanan useSearchParams di Next.js App Router
export default function ResendVerificationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex align-items-center justify-content-center text-white">Loading...</div>}>
            <ResendVerificationForm />
        </Suspense>
    );
}
