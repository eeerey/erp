'use client';

import { useState, useEffect } from 'react';
import { Save, Sliders } from 'lucide-react';

export default function InfoCard({
    totalBBL = 0,
    totalBBTL = 0,
    totalTK = 0,
    totalOH = 0,
    totalBiayaProduksi = 0,
    hppPerPorsi = 0,
    targetMargin = 50,
    setTargetMargin,
    rekomendasiHargaJual = 0,
    hargaJualFinal = '',
    setHargaJualFinal,
    hargaJualDipakai = 0,
    profitPerPorsi = 0,
    totalProfit = 0,
    onSave
}) {
    const [gajiPegawai, setGajiPegawai] = useState(2500000);
    const [jamKerjaHarian, setJamKerjaHarian] = useState(8);
    const [hariKerja, setHariKerja] = useState(22);
    const [totalLiterProduksi, setTotalLiterProduksi] = useState(5);
    const [gajiPerJam, setGajiPerJam] = useState(0);

    const formatNum = (number) => new Intl.NumberFormat('id-ID').format(Math.round(number || 0));

    useEffect(() => {
        const resultGajiPerJam = gajiPegawai / (jamKerjaHarian * hariKerja);
        setGajiPerJam(resultGajiPerJam || 0);
    }, [gajiPegawai, jamKerjaHarian, hariKerja]);

    const results = [
        {
            label: 'Gaji Pegawai / Jam',
            value: gajiPerJam
        }
    ];

    const fields = [
        {
            label: 'Gaji Pegawai',
            value: gajiPegawai,
            set: setGajiPegawai,
            suffix: '/ bulan'
        },
        {
            label: 'Jam Kerja Harian',
            value: jamKerjaHarian,
            set: setJamKerjaHarian,
            suffix: 'jam'
        },
        {
            label: 'Hari Kerja / Bulan',
            value: hariKerja,
            set: setHariKerja,
            suffix: 'hari'
        },
        {
            label: 'Total (Liter, kg)',
            value: totalLiterProduksi,
            set: setTotalLiterProduksi,
            suffix: ''
        }
    ];

    const cssStyles = `
    .info-card {
      background: #fff;
      border: 1px solid #edeef1;
      border-radius: 20px;
      padding: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 16px;
    }
    .info-card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .info-card-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #eef0ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .info-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #1a1d1f;
      margin: 0;
    }
    .info-card-sub {
      font-size: 11.5px;
      color: #8b95a1;
      font-weight: 500;
    }
    .info-section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1a1d1f;
      margin: 20px 0 12px 0;
      border-bottom: 1px solid #f0f1f3;
      padding-bottom: 8px;
    }
    .info-field-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width:540px){
      .info-field-grid{
        grid-template-columns:1fr;
      }
    }
    .info-field label{
      display:block;
      margin-bottom:6px;
      font-size:10.5px;
      text-transform: uppercase;
      color: #98a2ac;
      font-weight: 700;
    }
    .info-field-wrap{
      position:relative;
    }
    .hpp-field {
      width: 100%;
      border: 1.5px solid #e7e9ec;
      border-radius: 10px;
      padding: 7px 10px;
      font-size: 13px;
      outline: none;
      background: #fff;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .hpp-field:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px #eef0ff;
    }
    .info-field-suffix{
      position:absolute;
      right:12px;
      top:50%;
      transform:translateY(-50%);
      font-size:12px;
      color:#8b95a1;
    }
    .info-results{
      margin-top:16px;
      background:#fafafb;
      border:1px solid #f0f1f3;
      border-radius:14px;
      padding:4px 16px;
    }
    .info-result-row{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:10px 0;
    }
    .info-result-label{
      font-size:13px;
      font-weight:600;
      color:#5b6670;
    }
    .info-result-value{
      font-size:14px;
      font-weight:700;
      color:#4f46e5;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 10px;
    }
    .summary-box {
      background: #fafafb;
      border: 1px solid #f0f1f3;
      border-radius: 14px;
      padding: 12px 14px;
    }
    .summary-box-label {
      color: #8b95a1;
      font-size: 10.5px;
      text-transform: uppercase;
      margin-bottom: 4px;
      font-weight: 700;
    }
    .summary-box-val {
      font-size: 14px;
      font-weight: 700;
      color: #1a1d1f;
    }
    .hpp-save-btn {
      background: #4f46e5;
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
      width: 100%;
      margin-top: 20px;
    }
    .hpp-save-btn:hover {
      opacity: 0.9;
    }
  `;

    return (
        <div className="info-card">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

            <div className="info-card-head">
                <div className="info-card-icon">
                    <Sliders size={16} />
                </div>
                <div>
                    <h2 className="info-card-title">Parameter & Ringkasan HPP</h2>
                    <span className="info-card-sub">Parameter produksi, kalkulasi otomatis, dan ringkasan biaya</span>
                </div>
            </div>

            {/* PARAMETER PRODUKSI */}
            <h3 className="info-section-title" style={{ marginTop: 0 }}>
                Parameter Tambahan
            </h3>
            <div className="info-field-grid">
                {fields.map((f) => (
                    <div className="info-field" key={f.label}>
                        <label>{f.label}</label>
                        <div className="info-field-wrap">
                            <input
                                type="number"
                                value={f.value ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const finalVal = val === '' ? 0 : Number(val);
                                    if (typeof f.set === 'function') {
                                        f.set(finalVal);
                                    }
                                }}
                                className="hpp-field"
                            />
                            {f.suffix && <span className="info-field-suffix">{f.suffix}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="info-results">
                {results.map((r) => (
                    <div className="info-result-row" key={r.label}>
                        <span className="info-result-label">{r.label}</span>
                        <span className="info-result-value">Rp {formatNum(r.value)}</span>
                    </div>
                ))}
            </div>

            {/* RINGKASAN HPP */}
            <h3 className="info-section-title">Ringkasan HPP</h3>
            <div className="summary-grid">
                <div className="summary-box">
                    <div className="summary-box-label">Bahan Baku Langsung</div>
                    <div className="summary-box-val">Rp {formatNum(totalBBL)}</div>
                </div>
                <div className="summary-box">
                    <div className="summary-box-label">Bahan Baku Tidak Langsung</div>
                    <div className="summary-box-val">Rp {formatNum(totalBBTL)}</div>
                </div>
                <div className="summary-box">
                    <div className="summary-box-label">Tenaga Kerja</div>
                    <div className="summary-box-val">Rp {formatNum(totalTK)}</div>
                </div>
                <div className="summary-box">
                    <div className="summary-box-label">Overhead</div>
                    <div className="summary-box-val">Rp {formatNum(totalOH)}</div>
                </div>
            </div>

            <div className="info-results" style={{ background: '#fafafb', borderColor: '#f0f1f3', marginTop: '12px' }}>
                <div className="info-result-row">
                    <span className="info-result-label" style={{ fontWeight: 700 }}>
                        Total Biaya Produksi
                    </span>
                    <span className="info-result-value" style={{ fontSize: '15px' }}>
                        Rp {formatNum(totalBiayaProduksi)}
                    </span>
                </div>
                <div className="info-result-row" style={{ borderTop: '1px solid #f0f1f3' }}>
                    <span className="info-result-label" style={{ fontWeight: 700, color: '#4f46e5' }}>
                        HPP per Porsi
                    </span>
                    <span className="info-result-value" style={{ fontSize: '16px', color: '#4f46e5' }}>
                        Rp {formatNum(hppPerPorsi)}
                    </span>
                </div>
            </div>

            {/* HARGA JUAL & PROFIT */}
            <h3 className="info-section-title">Harga Jual & Profit</h3>
            <div className="info-field-grid" style={{ marginBottom: '14px' }}>
                <div className="info-field">
                    <label>Target Margin (%)</label>
                    <div className="info-field-wrap">
                        <input
                            type="number"
                            min="0"
                            value={targetMargin ?? ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTargetMargin(val === '' ? '' : Number(val));
                            }}
                            className="hpp-field"
                        />
                        <span className="info-field-suffix">%</span>
                    </div>
                </div>
                <div className="info-field">
                    <label>Rekomendasi Harga Jual</label>
                    <div className="info-field-wrap">
                        <input type="text" readOnly value={`Rp ${formatNum(rekomendasiHargaJual)}`} className="hpp-field" style={{ background: '#fafafb', color: '#1a1d1f', fontWeight: 700 }} />
                    </div>
                </div>
            </div>

            <div className="info-field" style={{ marginBottom: '14px' }}>
                <label>Harga Jual Final</label>
                <div className="info-field-wrap">
                    <input
                        type="number"
                        min="0"
                        value={hargaJualFinal ?? ''}
                        placeholder="Kosongkan untuk menggunakan rekomendasi"
                        onChange={(e) => {
                            const val = e.target.value;
                            setHargaJualFinal(val === '' ? '' : Number(val));
                        }}
                        className="hpp-field"
                    />
                </div>
            </div>

            <div className="summary-grid">
                <div className="summary-box">
                    <div className="summary-box-label">Harga Jual Digunakan</div>
                    <div className="summary-box-val">Rp {formatNum(hargaJualDipakai)}</div>
                </div>
                <div className="summary-box">
                    <div className="summary-box-label">Profit per Porsi</div>
                    <div className="summary-box-val">Rp {formatNum(profitPerPorsi)}</div>
                </div>
                <div className="summary-box">
                    <div className="summary-box-label">Total Profit</div>
                    <div className="summary-box-val">Rp {formatNum(totalProfit)}</div>
                </div>
            </div>

            <button onClick={onSave} className="hpp-save-btn" type="button">
                <Save size={16} />
                Simpan HPP
            </button>
        </div>
    );
}
