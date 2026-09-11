'use client';

import React from 'react';

export default function HeaderHpp() {
    const cssStyles = `
    .hpp-header {
      position: relative;
      background: linear-gradient(135deg, #4338ca 0%, #4f46e5 45%, #6366f1 100%);
      border-radius: 28px;
      padding: 36px 40px;
      margin-bottom: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px -16px rgba(67, 56, 202, 0.45);
    }
    .hpp-header::before {
      content: "";
      position: absolute;
      top: -60px;
      right: -40px;
      width: 220px;
      height: 220px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
    }
    .hpp-header::after {
      content: "";
      position: absolute;
      bottom: -80px;
      right: 120px;
      width: 160px;
      height: 160px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
    }
    .hpp-header-inner {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 24px;
    }
    .hpp-header-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .hpp-icon-box {
      background: rgba(255,255,255,0.16);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 16px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hpp-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.75);
      margin-bottom: 6px;
    }
    .hpp-header-title {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .hpp-header-sub {
      color: rgba(255,255,255,0.78);
      font-size: 14px;
      margin-top: 6px;
    }
    .hpp-header-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.22);
      backdrop-filter: blur(6px);
      padding: 12px 18px;
      border-radius: 16px;
      color: #fff;
    }
    .hpp-header-badge-label {
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7);
    }
    .hpp-header-badge-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 700;
    }
    @media (max-width: 640px) {
      .hpp-header { padding: 28px 24px; }
      .hpp-header-title { font-size: 22px; }
    }
  `;

    return (
        <div className="hpp-header">
            {/* Menggunakan dangerouslySetInnerHTML mencegah React salah menerjemahkan string CSS menjadi HTML entities */}
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

            <div className="hpp-header-inner">
                <div className="hpp-header-left">
                    <div>
                        <span className="hpp-eyebrow">Modul Produksi</span>
                        <h1 className="hpp-header-title">Kalkulasi Harga Pokok Produksi</h1>
                        <p className="hpp-header-sub">Kelola dan hitung HPP produk dengan akurat dan efisien.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
