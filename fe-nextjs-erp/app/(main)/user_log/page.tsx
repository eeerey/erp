'use client';

import React, { useEffect, useState } from 'react';
import { ActivityLog, ActivityLogApiResponse } from '../../../types/activityLog';

export default function UserLogPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Helper untuk mengubah detik menjadi format Jam, Menit, Detik
    const formatDuration = (seconds: number | null): React.ReactNode => {
        if (seconds === null) {
            return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Sedang Aktif</span>;
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours} jam`);
        if (minutes > 0) parts.push(`${minutes} menit`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs} detik`);

        return parts.join(' ');
    };

    // Helper untuk format tanggal Indonesia
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const token = localStorage.getItem('TOKEN');

                // 👈 PERBAIKAN 1: Cegah pengiriman token null / undefined ke backend
                if (!token || token === 'null' || token === 'undefined') {
                    throw new Error('Sesi tidak ditemukan atau kamu belum login. Silakan login kembali.');
                }

                const baseUrl = process.env.NEXT_PUBLIC_API_URL;

                // 👈 PERBAIKAN 2: Ditambahkan prefix /api (menjadi /api/admin/activity-logs)
                const response = await fetch(`${baseUrl}/admin/activity-logs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                // Validasi tipe konten agar tidak crash "Unexpected token '<'" saat server return HTML 404/500
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Server bermasalah (${response.status}). Pastikan URL backend sudah benar.`);
                }

                const result: ActivityLogApiResponse = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Gagal mengambil data log');
                }

                setLogs(result.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Terjadi kesalahan yang tidak diketahui');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchActivityLogs();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Memuat log aktivitas...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Rekap Log Aktivitas User</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 border-collapse">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 border-b">ID User</th>
                            <th className="px-4 py-3 border-b">Nama User</th>
                            <th className="px-4 py-3 border-b">Perusahaan</th>
                            <th className="px-4 py-3 border-b">Masuk (Login At)</th>
                            <th className="px-4 py-3 border-b">Keluar (Logout At)</th>
                            <th className="px-4 py-3 border-b">Total Durasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                    Belum ada riwayat aktivitas.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.log_id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{log.user_id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-800">{log.nama_user}</div>
                                        <div className="text-xs text-gray-400">{log.email_user}</div>
                                    </td>
                                    <td className="px-4 py-3">{log.nama_perusahaan || '-'}</td>
                                    <td className="px-4 py-3">{formatDate(log.login_at)}</td>
                                    <td className="px-4 py-3">{formatDate(log.logout_at)}</td>
                                    <td className="px-4 py-3">{formatDuration(log.duration_seconds)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
