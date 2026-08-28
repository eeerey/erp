'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import axios from 'axios';
import ToastNotifier from '@/app/components/ToastNotifier';

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const toastRef = useRef<ToastNotifierHandle>(null);

    // State Alur Wizard (1 -> 2 -> 3)
    const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);

    // State Input Form
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [loadingForgot, setLoadingForgot] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Penanda apakah user sedang login

    // State Timer OTP (600 Detik = 10 Menit)
    const [timer, setTimer] = useState(600);
    const [isTimerActive, setIsTimerActive] = useState(false);

    // Effect Auto-fill Email jika user sudah login
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('TOKEN');
            if (!token) return;

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 200 && res.data?.user?.email) {
                    setForgotEmail(res.data.user.email);
                    setIsLoggedIn(true); // Tandai user sedang login
                }
            } catch (err) {
                // Token tidak valid/kadaluwarsa, biarkan isLoggedIn false
                console.log('User belum login atau token invalid');
            }
        };

        fetchUserData();
    }, []);

    // Effect Countdown Timer
    useEffect(() => {
        let interval: any = null;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // STEP 1: User memasukkan Email & Kirim OTP
    const handleSendForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingForgot(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/send-otp`, {
                email: forgotEmail
            });

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Kode OTP berhasil dikirim ke email!');
                setForgotStep(2);

                // Reset dan Aktifkan Timer (10 Menit)
                setTimer(600);
                setIsTimerActive(true);
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Email tidak ditemukan atau gagal mengirim OTP');
        } finally {
            setLoadingForgot(false);
        }
    };

    // STEP 2: Verifikasi Kode OTP
    const handleVerifyForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingForgot(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/verify-otp`, {
                email: forgotEmail,
                otp: forgotOtp
            });

            if (res.status === 200) {
                toastRef.current?.showToast('00', 'Kode OTP Valid! Silakan buat password baru.');
                setForgotStep(3);
                setIsTimerActive(false); // Stop timer saat verifikasi berhasil
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Kode OTP salah atau telah kedaluwarsa');
        } finally {
            setLoadingForgot(false);
        }
    };

    // STEP 3: Reset Password Baru & Redirect
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

                setTimeout(() => {
                    // Jika user sudah login kembalikan ke profile, jika belum kembalikan ke login
                    if (isLoggedIn) {
                        router.push('/auth/profile');
                    } else {
                        router.push('/auth/login');
                    }
                }, 1500);
            }
        } catch (err: any) {
            toastRef.current?.showToast('01', err.response?.data?.message || 'Gagal me-reset password');
        } finally {
            setLoadingForgot(false);
        }
    };

    return (
        <>
            <ToastNotifier ref={toastRef} />

            <div className="min-h-screen flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Card className="shadow-4 border-round-2xl w-full max-w-26rem">
                    <div className="text-center mb-4">
                        <i className="pi pi-lock-open text-4xl text-primary mb-2" />
                        <h2 className="text-2xl font-bold text-900 m-0">Lupa Password</h2>
                        <span className="text-600 text-sm">Langkah {forgotStep} dari 3</span>
                    </div>

                    {/* STEP 1: Input Email */}
                    {forgotStep === 1 && (
                        <form onSubmit={handleSendForgotOtp} className="flex flex-column gap-3">
                            <p className="text-sm text-600 m-0">{isLoggedIn ? 'Kami akan mengirimkan 5 digit kode OTP ke email akun Anda.' : 'Masukkan alamat email terdaftar Anda. Kami akan mengirimkan 5 digit kode OTP untuk verifikasi.'}</p>

                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-sm">Email Anda</label>
                                <InputText
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    type="email"
                                    required
                                    disabled={isLoggedIn} // Otomatis disabled jika user sudah terautentikasi
                                    placeholder="contoh@email.com"
                                    className={`w-full ${isLoggedIn ? 'bg-200' : ''}`}
                                />
                            </div>

                            <div className="flex justify-content-between align-items-center mt-3">
                                <Button type="button" label="Kembali" icon="pi pi-arrow-left" className="p-button-text p-button-sm text-secondary" onClick={() => router.back()} />
                                <Button type="submit" label="Kirim OTP" icon="pi pi-send" loading={loadingForgot} />
                            </div>
                        </form>
                    )}

                    {/* STEP 2: Verifikasi 5 Digit OTP */}
                    {forgotStep === 2 && (
                        <form onSubmit={handleVerifyForgotOtp} className="flex flex-column gap-3">
                            <p className="text-sm text-600 m-0 text-center">
                                Masukkan 5 digit kode OTP yang dikirim ke email:
                                <br />
                                <strong className="text-900">{forgotEmail}</strong>
                            </p>

                            <div className="flex justify-content-center gap-2 my-2">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <InputText
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={forgotOtp[index] || ''}
                                        className="w-3rem h-3rem text-center text-xl font-bold p-0 border-round-lg"
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            const otpArr = forgotOtp.split('');
                                            otpArr[index] = val;
                                            const newOtp = otpArr.join('');
                                            setForgotOtp(newOtp);

                                            if (val && index < 4) {
                                                document.getElementById(`otp-input-${index + 1}`)?.focus();
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !forgotOtp[index] && index > 0) {
                                                document.getElementById(`otp-input-${index - 1}`)?.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Countdown Timer */}
                            <div className="text-center my-1">
                                {isTimerActive ? (
                                    <span className="text-xs text-600 font-medium">
                                        Waktu tersisa: <strong className="text-primary">{formatTime(timer)}</strong>
                                    </span>
                                ) : (
                                    <span className="text-xs text-red-500 font-medium">Kode OTP telah kedaluwarsa. Silakan kirim ulang.</span>
                                )}
                            </div>

                            <div className="flex justify-content-between align-items-center mt-2">
                                <Button
                                    type="button"
                                    label={isTimerActive ? `Kirim Ulang (${formatTime(timer)})` : 'Kirim Ulang'}
                                    className="p-button-text p-button-sm text-primary font-medium p-0"
                                    onClick={handleSendForgotOtp}
                                    disabled={loadingForgot || isTimerActive}
                                />
                                <Button type="submit" label="Verifikasi" severity="info" loading={loadingForgot} disabled={forgotOtp.length !== 5} />
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Masukkan Password Baru */}
                    {forgotStep === 3 && (
                        <form onSubmit={handleResetPasswordWithOtp} className="flex flex-column gap-3">
                            <p className="text-sm text-600 m-0">OTP Valid! Silakan buat password baru Anda.</p>

                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-sm">Password Baru</label>
                                <Password value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} toggleMask required className="w-full" inputClassName="w-full" />
                            </div>

                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-sm">Konfirmasi Password Baru</label>
                                <Password value={forgotConfirmPassword} onChange={(e) => setForgotConfirmPassword(e.target.value)} toggleMask feedback={false} required className="w-full" inputClassName="w-full" />
                            </div>

                            <Button type="submit" label="Reset Password" severity="success" loading={loadingForgot} className="mt-2 w-full" />
                        </form>
                    )}
                </Card>
            </div>
        </>
    );
}
