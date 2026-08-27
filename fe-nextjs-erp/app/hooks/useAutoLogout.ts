'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // 👈 1. Import useRouter dari Next.js

export const useAutoLogout = (timeoutInMinutes: number = 15) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter(); // 👈 2. Inisialisasi router

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('TOKEN') || localStorage.getItem('token');
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            if (token && baseUrl) {
                await fetch(`${baseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (err) {
            console.error('Auto logout error:', err);
        } finally {
            // 3. Bersihkan storage
            localStorage.clear();

            // 4. Gunakan setTimeout minimal agar React selesai membersihkan DOM sebelum pindah halaman
            setTimeout(() => {
                router.push('/auth/login');
            }, 0);
        }
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(handleLogout, timeoutInMinutes * 60 * 1000);
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        resetTimer();

        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);
};
