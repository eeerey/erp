'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        snap: any;
    }
}

type BillingKey = 'monthly' | 'biannual' | 'annual';
type PlanKey = 'Essential' | 'Intermediate' | 'Executive' | 'Enterprise' | 'Exclusive';

export default function VoucherPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [snapReady, setSnapReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState<BillingKey>('monthly');

    const [paymentModal, setPaymentModal] = useState<{
        open: boolean;
        type: 'loading' | 'success' | 'error' | 'pending' | 'close';
        title: string;
        message: string;
    }>({
        open: false,
        type: 'loading',
        title: '',
        message: ''
    });

    const billingOptions: { key: BillingKey; label: string; badge: string | null }[] = [
        { key: 'monthly', label: 'Bulanan', badge: null },
        { key: 'biannual', label: '6 Bulan', badge: 'Hemat 4%' },
        { key: 'annual', label: '1 Tahun', badge: 'Hemat 8%' }
    ];

    const planParam = searchParams.get('plan');

    const planMap: Record<string, PlanKey> = {
        Essential: 'Essential',
        Intermediate: 'Intermediate',
        Executive: 'Executive',
        'Intermediate Executive': 'Executive',
        Enterprise: 'Enterprise',
        Exclusive: 'Exclusive'
    };

    const currentPlanKey: PlanKey = planMap[planParam || ''] || 'Executive';

    const plans = [
        {
            key: 'Essential',
            name: 'Essential',
            tagColor: 'indigo',
            highlight: false,
            desc: 'Untuk UMKM yang baru mulai go-digital. Fondasi pencatatan yang kuat.',
            prices: { monthly: 'Rp 75.000', biannual: 'Rp 430.000', annual: 'Rp 828.000' },
            rawPrices: { monthly: 75000, biannual: 430000, annual: 828000 },
            perLabel: { monthly: '/bulan', biannual: '/6 bulan', annual: '/tahun' },
            features: ['HR & Penggajian Otomatis', 'Inventory (Inbound & Outbound)', 'Laporan Laba Rugi', 'Multiple User Account', '1x Pelatihan Gratis', 'Buku Panduan Digital'],
            cta: 'Mulai Sekarang'
        },
        {
            key: 'Intermediate',
            name: 'Intermediate',
            tagColor: 'purple',
            highlight: false,
            desc: 'Untuk UMKM yang siap scale-up dengan kontrol produksi lebih ketat.',
            prices: { monthly: 'Rp 89.000', biannual: 'Rp 511.000', annual: 'Rp 982.000' },
            rawPrices: { monthly: 89000, biannual: 511000, annual: 982000 },
            perLabel: { monthly: '/bulan', biannual: '/6 bulan', annual: '/tahun' },
            features: ['Semua fitur Essential', 'Produksi (Batch Number)', 'Product Movement Tracking', 'Multiple User Account', '1x Pelatihan Gratis', 'Buku Panduan Digital'],
            cta: 'Mulai Sekarang'
        },
        {
            key: 'Executive',
            name: 'Intermediate Executive',
            tagColor: 'blue',
            highlight: true,
            badge: 'Terpopuler',
            desc: 'Paket terfavorit. Fitur lengkap dengan laporan analitik penjualan mendalam.',
            prices: { monthly: 'Rp 129.000', biannual: 'Rp 741.000', annual: 'Rp 1.424.000' },
            rawPrices: { monthly: 129000, biannual: 741000, annual: 1424000 },
            perLabel: { monthly: '/bulan', biannual: '/6 bulan', annual: '/tahun' },
            features: ['Semua fitur Intermediate', 'Laporan Penjualan Produk', 'Laporan Profitabilitas Pelanggan', 'Multiple User Account', '1x Pelatihan Gratis', 'Buku Panduan Digital'],
            cta: 'Pilih Paket Ini'
        },
        {
            key: 'Enterprise',
            name: 'Enterprise',
            tagColor: 'orange',
            highlight: false,
            desc: 'Operasional dan penjualan dalam satu ekosistem. Siap dominasi pasar.',
            prices: { monthly: 'Rp 159.000', biannual: 'Rp 913.000', annual: 'Rp 1.751.000' },
            rawPrices: { monthly: 159000, biannual: 913000, annual: 1751000 },
            perLabel: { monthly: '/bulan', biannual: '/6 bulan', annual: '/tahun' },
            features: ['Semua fitur Int. Executive', 'Modul Marketing & Sales', 'Multiple User Account', '2x Pelatihan Gratis', 'Buku Panduan Digital', 'Prioritas Support'],
            cta: 'Mulai Sekarang'
        },
        {
            key: 'Exclusive',
            name: 'Enterprise Exclusive',
            tagColor: 'slate',
            highlight: false,
            isCustom: true,
            desc: 'Solusi fully custom untuk bisnis besar dengan kebutuhan spesifik dan kompleks.',
            prices: { monthly: 'Custom', biannual: 'Custom', annual: 'Custom' },
            rawPrices: { monthly: 0, biannual: 0, annual: 0 },
            perLabel: { monthly: '', biannual: '', annual: '' },
            features: ['Semua Fitur Fully Custom', 'Dedicated Account Manager', 'Integrasi API Kustom', 'Pelatihan Intensif Tim', 'SLA & Dukungan 24/7', 'Keamanan Level Enterprise'],
            cta: 'Hubungi Sales'
        }
    ];

    const colorMap: Record<string, { border: string; tag: string; tagText: string; check: string }> = {
        indigo: { border: '#4f46e5', tag: '#eef2ff', tagText: '#4f46e5', check: '#4f46e5' },
        purple: { border: '#7c3aed', tag: '#f5f3ff', tagText: '#7c3aed', check: '#7c3aed' },
        blue: { border: '#2563eb', tag: '#eff6ff', tagText: '#2563eb', check: '#2563eb' },
        orange: { border: '#ea580c', tag: '#fff7ed', tagText: '#ea580c', check: '#ea580c' },
        slate: { border: '#475569', tag: '#f1f5f9', tagText: '#475569', check: '#475569' }
    };

    const data = plans.find((p) => p.key === currentPlanKey) || plans[2];
    const activeColor = colorMap[data.tagColor] || colorMap.blue;

    const currentPriceFormatted = data.prices[selectedBilling];
    const currentPriceRaw = data.rawPrices[selectedBilling];
    const currentPerLabel = data.perLabel[selectedBilling];

    const handlePayment = async () => {
        try {
            if (data.isCustom) {
                const message = encodeURIComponent(`Halo Sales ERP, saya tertarik dengan paket Custom: ${data.name}`);
                window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
                return;
            }

            if (!snapReady || !window.snap) {
                setPaymentModal({
                    open: true,
                    type: 'pending',
                    title: 'Menyiapkan Payment Gateway',
                    message: 'Sistem pembayaran sedang dimuat. Silakan coba lagi dalam 1-2 detik.'
                });
                return;
            }

            setLoading(true);
            setPaymentModal({
                open: true,
                type: 'loading',
                title: 'Memproses Pesanan...',
                message: 'Mohon tunggu sebentar, kami sedang membuatkan invoice pembayaran Anda.'
            });

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            const res = await fetch(`${API_URL}/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plan: `${data.name} (${selectedBilling})`,
                    price: currentPriceRaw,
                    billingPeriod: selectedBilling
                })
            });

            const result = await res.json();

            if (!res.ok || !result.data?.token) {
                setLoading(false);
                setPaymentModal({
                    open: true,
                    type: 'error',
                    title: 'Gagal Membuat Invoice',
                    message: result.message || 'Token transaksi tidak ditemukan. Pastikan endpoint server pembayaran berjalan.'
                });
                return;
            }

            // Tutup modal loading saat popup Midtrans muncul
            setPaymentModal((prev) => ({ ...prev, open: false }));

            window.snap.pay(result.data.token, {
                onSuccess: () => {
                    setLoading(false);
                    setPaymentModal({
                        open: true,
                        type: 'success',
                        title: 'Pembayaran Berhasil! 🎉',
                        message: 'Langganan modul ERP Anda telah diaktifkan. Anda akan dialihkan ke dashboard.'
                    });
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                },
                onPending: () => {
                    setLoading(false);
                    setPaymentModal({
                        open: true,
                        type: 'pending',
                        title: 'Menunggu Pembayaran',
                        message: 'Silakan selesaikan tagihan Anda sesuai metode pembayaran yang dipilih.'
                    });
                },
                onError: () => {
                    setLoading(false);
                    setPaymentModal({
                        open: true,
                        type: 'error',
                        title: 'Pembayaran Gagal',
                        message: 'Transaksi gagal diproses. Silakan coba menggunakan metode pembayaran lain.'
                    });
                },
                onClose: () => {
                    setLoading(false);
                    setPaymentModal({
                        open: true,
                        type: 'close',
                        title: 'Pembayaran Dibatalkan',
                        message: 'Anda menutup jendela pembayaran sebelum transaksi selesai.'
                    });
                }
            });
        } catch (err) {
            console.error('Payment Error:', err);
            setLoading(false);
            setPaymentModal({
                open: true,
                type: 'error',
                title: 'Koneksi Bermasalah',
                message: 'Gagal terhubung ke server backend. Pastikan server backend Anda berjalan di port yang benar.'
            });
        }
    };

    return (
        <>
            <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="afterInteractive" onLoad={() => setSnapReady(true)} />

            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '5rem' }}>
                {/* HEADER */}
                <header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e2e8f0',
                        padding: '1rem 2rem'
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1380px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className="flex align-items-center gap-3">
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(79,70,229,0.35)'
                                }}
                            >
                                <i className="pi pi-prime text-white" style={{ fontSize: '1rem' }} />
                            </div>
                            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.35rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                                RINTISKU<span style={{ color: '#4f46e5' }}>.</span>
                            </span>
                        </div>
                        <button
                            onClick={() => router.back()}
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#64748b',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            ← Kembali
                        </button>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main style={{ maxWidth: '1380px', margin: '2rem auto 0 auto', padding: '0 2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Konfirmasi & Pembayaran</h1>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Tingkatkan efisiensi bisnis Anda dengan mengaktifkan langganan modul ERP.</p>
                    </div>

                    <div className="grid">
                        {/* KIRI: SELEKSI DURASI & DETAIL FITUR */}
                        <div className="col-12 lg:col-7">
                            {/* PILIHAN DURASI LANGGANAN */}
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                                    marginBottom: '1.25rem'
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '700',
                                        color: '#0f172a',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Pilih Periode Pembayaran:
                                </h3>

                                <div className="grid">
                                    {billingOptions.map((opt) => {
                                        const isSelected = selectedBilling === opt.key;
                                        return (
                                            <div key={opt.key} className="col-12 md:col-4">
                                                <div
                                                    onClick={() => setSelectedBilling(opt.key)}
                                                    style={{
                                                        border: isSelected ? `2px solid ${activeColor.border}` : '1px solid #e2e8f0',
                                                        backgroundColor: isSelected ? activeColor.tag : '#ffffff',
                                                        borderRadius: '0.75rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {opt.badge && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                top: '-10px',
                                                                right: '10px',
                                                                backgroundColor: '#10b981',
                                                                color: '#ffffff',
                                                                fontSize: '0.625rem',
                                                                fontWeight: 'bold',
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '9999px'
                                                            }}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0f172a' }}>{opt.label}</div>
                                                    <div
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            color: activeColor.tagText,
                                                            marginTop: '0.25rem'
                                                        }}
                                                    >
                                                        {data.prices[opt.key]}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DETAIL FITUR PAKET */}
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: `1px solid ${data.highlight ? activeColor.border : '#e2e8f0'}`,
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                                    marginBottom: '1.25rem',
                                    position: 'relative'
                                }}
                            >
                                {data.badge && (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: activeColor.tag,
                                            color: activeColor.tagText,
                                            border: `1px solid ${activeColor.border}40`,
                                            borderRadius: '9999px',
                                            marginBottom: '0.75rem'
                                        }}
                                    >
                                        {data.badge}
                                    </span>
                                )}

                                <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.25rem 0' }}>Paket {data.name}</h2>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{data.desc}</p>

                                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.25rem 0' }} />

                                <div>
                                    <h3
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            letterSpacing: '0.05em',
                                            color: '#94a3b8',
                                            textTransform: 'uppercase',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Fitur Unggulan Termasuk:
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {data.features.map((feature, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span
                                                    style={{
                                                        width: '1.25rem',
                                                        height: '1.25rem',
                                                        borderRadius: '50%',
                                                        backgroundColor: activeColor.tag,
                                                        border: `1px solid ${activeColor.border}40`,
                                                        color: activeColor.check,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    ✓
                                                </span>
                                                <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: '500' }}>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SECURITY ASSURANCE */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.75rem',
                                    color: '#64748b'
                                }}
                            >
                                <span style={{ fontSize: '1rem' }}>🔒</span>
                                <span>Transaksi diproses secara aman & terenkripsi oleh Midtrans Payment Gateway.</span>
                            </div>
                        </div>

                        {/* KANAN: RINGKASAN BIAYA */}
                        <div className="col-12 lg:col-5">
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem'
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 'bold',
                                        color: '#0f172a',
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: '0.75rem',
                                        margin: 0
                                    }}
                                >
                                    Ringkasan Biaya
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                                        <span>Paket</span>
                                        <span style={{ color: '#0f172a', fontWeight: '600' }}>Paket {data.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                                        <span>Periode</span>
                                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{billingOptions.find((b) => b.key === selectedBilling)?.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                                        <span>Biaya Layanan</span>
                                        <span style={{ color: '#059669', fontWeight: '600' }}>Gratis</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                                        <span>Pajak (PPN)</span>
                                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Termasuk</span>
                                    </div>

                                    <div
                                        style={{
                                            borderTop: '1px solid #f1f5f9',
                                            paddingTop: '1rem',
                                            marginTop: '0.25rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'baseline'
                                        }}
                                    >
                                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>Total Bayar</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: activeColor.border }}>{currentPriceFormatted}</span>
                                            <span style={{ display: 'block', fontSize: '0.625rem', color: '#94a3b8' }}>{currentPerLabel}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        backgroundColor: loading ? '#93c5fd' : activeColor.border,
                                        color: '#ffffff',
                                        padding: '0.875rem 1.5rem',
                                        borderRadius: '0.75rem',
                                        fontWeight: '600',
                                        border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {loading ? 'Memproses...' : `${data.cta} →`}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL STATUS PEMBAYARAN */}
            {paymentModal.open && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '1.25rem',
                            padding: '2rem',
                            maxWidth: '420px',
                            width: '100%',
                            textAlign: 'center',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <div style={{ marginBottom: '1.25rem' }}>
                            {paymentModal.type === 'loading' && (
                                <div
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        border: '4px solid #dbeafe',
                                        borderTopColor: '#2563eb',
                                        borderRadius: '50%',
                                        margin: '0 auto',
                                        animation: 'spin 1s linear infinite'
                                    }}
                                />
                            )}
                            {paymentModal.type === 'success' && (
                                <div
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        backgroundColor: '#d1fae5',
                                        color: '#059669',
                                        borderRadius: '50%',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.75rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✓
                                </div>
                            )}
                            {paymentModal.type === 'error' && (
                                <div
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        backgroundColor: '#fee2e2',
                                        color: '#dc2626',
                                        borderRadius: '50%',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✕
                                </div>
                            )}
                            {(paymentModal.type === 'pending' || paymentModal.type === 'close') && (
                                <div
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        backgroundColor: '#fef3c7',
                                        color: '#d97706',
                                        borderRadius: '50%',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    ⚠️
                                </div>
                            )}
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{paymentModal.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{paymentModal.message}</p>

                        {paymentModal.type !== 'loading' && paymentModal.type !== 'success' && (
                            <button
                                onClick={() => setPaymentModal((prev) => ({ ...prev, open: false }))}
                                style={{
                                    marginTop: '1.5rem',
                                    width: '100%',
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Mengerti
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    );
}
