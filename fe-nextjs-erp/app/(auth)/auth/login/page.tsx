'use client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roleRoutes } from 'utils/roleRoutes';
import ToastNotifier from '../../../components/ToastNotifier';
import axios from 'axios';
import Script from 'next/script';

declare global {
    interface Window {
        google: any;
    }
}

type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

const LoginPage = () => {
    const router = useRouter();
    const toastRef = useRef<ToastNotifierHandle>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 1. Callback Login via Google Button
    const handleGoogleResponse = async (response: any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, { credential: response.credential }, { headers: { 'Content-Type': 'application/json' } });

            const data = res.data;

            if (res.status !== 200 || !data.token || !data.user) {
                toastRef.current?.showToast('01', data.message || 'Login Google gagal');
                setLoading(false);
                return;
            }

            // Simpan Session ke LocalStorage
            localStorage.setItem('TOKEN', data.token);
            localStorage.setItem('ROLE', data.user.role);
            localStorage.setItem('USER_NAME', data.user.name);
            localStorage.setItem('USER_EMAIL', data.user.email);
            localStorage.setItem('USER_ID', data.user.id.toString());

            toastRef.current?.showToast('00', `Selamat datang, ${data.user.name}!`);

            setTimeout(() => {
                const redirect = roleRoutes[data.user.role] || '/';
                router.push(redirect);
            }, 1000);
        } catch (err: any) {
            console.error('Google login error:', err);
            const errorMessage = err.response?.data?.message || 'Gagal login menggunakan akun Google';
            toastRef.current?.showToast('01', errorMessage);
            setLoading(false);
        }
    };

    // 2. Inisialisasi Google SDK Button
    const initializeGoogleAuth = () => {
        if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse
            });

            const targetDiv = document.getElementById('googleBtnDiv');
            if (targetDiv) {
                window.google.accounts.id.renderButton(targetDiv, {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: 'signin_with',
                    shape: 'pill'
                });
            }
        }
    };

    // 3. Submit Login Form Biasa (Email & Password)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } });

            const data = res.data;

            if (res.status !== 200 || !data.token || !data.user) {
                toastRef.current?.showToast('01', data.message || 'Login gagal');
                setLoading(false);
                return;
            }

            localStorage.setItem('TOKEN', data.token);
            localStorage.setItem('ROLE', data.user.role);
            localStorage.setItem('USER_NAME', data.user.name);
            localStorage.setItem('USER_EMAIL', data.user.email);
            localStorage.setItem('USER_ID', data.user.id.toString());

            toastRef.current?.showToast('00', `Selamat datang, ${data.user.name}!`);

            setTimeout(() => {
                const redirect = roleRoutes[data.user.role] || '/';
                router.push(redirect);
            }, 1000);
        } catch (err: any) {
            console.error('Login error:', err);
            const statusErr = err.response?.status;
            const messageErr = err.response?.data?.message || 'Terjadi kesalahan koneksi ke server';

            // Jika Backend merespon status 403 (Perlu Verifikasi OTP), otomatis redirect ke Halaman OTP
            if (statusErr === 403) {
                toastRef.current?.showToast('01', messageErr);
                setTimeout(() => {
                    router.push(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
                }, 1500);
            } else {
                toastRef.current?.showToast('01', messageErr);
            }

            setLoading(false);
        }
    };

    return (
        <>
            <ToastNotifier ref={toastRef} />
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleAuth} />

            <div className="min-h-screen flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="surface-card shadow-8 border-round-2xl overflow-hidden" style={{ maxWidth: '1000px', width: '100%' }}>
                    <div className="grid m-0">
                        {/* Left Side - Welcome Section */}
                        <div
                            className="col-12 lg:col-6 p-0 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
                                minHeight: '500px'
                            }}
                        >
                            <div className="flex flex-column justify-content-center h-full px-6 py-8">
                                <div className="mb-4">
                                    <div className="flex align-items-center gap-2 mb-2">
                                        <i className="pi pi-building text-white text-2xl"></i>
                                        <span className="text-white text-sm font-medium uppercase tracking-wider">{process.env.NEXT_PUBLIC_COMPANY_NAME || 'PT. Garapan Indonesia Sukses'}</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h2 className="text-white text-4xl font-light mb-3">Nice to see you again</h2>
                                    <h1 className="text-white text-6xl font-bold mb-4">WELCOME BACK</h1>
                                    <div className="bg-white" style={{ width: '80px', height: '4px' }}></div>
                                </div>

                                <p className="text-white-alpha-80 text-lg line-height-3 max-w-30rem">{process.env.NEXT_PUBLIC_APP_NAME || 'Enterprise Resource Planning'} - Manage your business operations efficiently with our integrated system.</p>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="col-12 lg:col-6 p-6 lg:p-8">
                            <div className="flex flex-column h-full justify-content-center">
                                <div className="mb-5">
                                    <h2 className="text-900 text-4xl font-bold mb-2">Login Account</h2>
                                    <p className="text-600 text-sm line-height-3 mt-0 mb-4">Enter your credentials to access your account.</p>
                                </div>

                                {/* Google Button Mount Point */}
                                <div className="mb-4">
                                    <div id="googleBtnDiv" style={{ width: '100%', minHeight: '44px' }}></div>
                                </div>

                                <div className="flex align-items-center mb-4">
                                    <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
                                    <span className="px-3 text-500 font-medium text-sm">OR</span>
                                    <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-900 font-medium mb-2">
                                            Email Address
                                        </label>
                                        <span className="p-input-icon-left w-full">
                                            <i className="pi pi-envelope text-400"></i>
                                            <InputText
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="yourname@gmail.com"
                                                className="w-full"
                                                style={{ paddingLeft: '2.5rem' }}
                                                disabled={loading}
                                                required
                                            />
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-900 font-medium mb-2">
                                            Password
                                        </label>
                                        <span className="p-input-icon-left p-input-icon-right w-full">
                                            <i className="pi pi-lock text-400"></i>
                                            <InputText
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full"
                                                style={{ paddingLeft: '2.5rem' }}
                                                disabled={loading}
                                                required
                                            />
                                            <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} cursor-pointer text-400 hover:text-700`} onClick={() => setShowPassword(!showPassword)}></i>
                                        </span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between mb-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputId="keepSignedIn" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.checked || false)} className="mr-2" disabled={loading} />
                                            <label htmlFor="keepSignedIn" className="text-900 font-medium cursor-pointer">
                                                Keep me signed in
                                            </label>
                                        </div>
                                        <a href="/auth/forgot-password" className="text-primary font-medium no-underline hover:underline" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
                                            Forgot password?
                                        </a>
                                    </div>

                                    <Button
                                        type="submit"
                                        label={loading ? 'Logging in...' : 'LOGIN'}
                                        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
                                        iconPos="right"
                                        className="w-full p-3 text-xl font-bold"
                                        loading={loading}
                                        disabled={loading}
                                        style={{
                                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '50px'
                                        }}
                                    />
                                </form>

                                <div className="text-center mt-4">
                                    <span className="text-700 font-medium">Don't have an account? </span>
                                    <a href="/auth/register/owner" className="text-primary font-bold no-underline hover:underline cursor-pointer" style={{ color: '#764ba2' }}>
                                        Register here
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
