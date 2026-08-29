"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";

export default function Fase1ResultCard({
  productName,
  qty,
  satuan,
  setSatuan,
  totalHPP,
  hppPerPcs,
  formatRupiah,
}) {

 const [satuanList, setSatuanList] = useState([]);

  useEffect(() => {
    const fetchSatuan = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/hppErp/form-data`
        );

        setSatuanList(res.data.data.satuan || []);
      } catch (err) {
        console.error(err);
      }
    };

  fetchSatuan();
}, []);


  if (!productName) return null;

  return (
    <div className="summary-card">
      <style>{`
        .fase-table{
          width:100%;
          border-collapse:collapse;
          margin-top:20px;
        }

        .fase-table th{
          background:#f8fafc;
          padding:12px;
          text-align:left;
          font-size:13px;
          color:#64748b;
        }

        .fase-table td{
          padding:14px 12px;
          border-top:1px solid #e5e7eb;
          font-size:14px;
        }

        .formula{
          margin-top:18px;
          background:#eef2ff;
          border:1px solid #c7d2fe;
          border-radius:14px;
          padding:18px;
        }

        .formula-title{
          font-weight:700;
          margin-bottom:8px;
          color:#4338ca;
        }

        .formula-result{
          margin-top:8px;
          font-size:16px;
          font-weight:bold;
          color:#4338ca;
        }
      `}</style>

      <div className="summary-head">
        <div className="summary-icon">
          <CheckCircle2 size={18} />
        </div>

        <div>
          <h2 className="summary-title">
            Informasi Hasil Fase 1
          </h2>

          <div className="summary-sub">
            Hasil produksi setelah proses fase pertama
          </div>
        </div>
      </div>

      <table className="fase-table">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Satuan</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{productName}</td>
            <td>
              <select
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                className="hpp-field"
              >
                <option value="">Pilih Satuan</option>

                {satuanList.map((item) => (
                  <option
                    key={item.ID}
                    value={item.NAMA_SATUAN}
                  >
                    {item.NAMA_SATUAN}
                  </option>
                ))}
              </select>
            </td>
            <td>{qty}</td>
            <td>Rp {formatRupiah(hppPerPcs)}</td>
          </tr>
        </tbody>
      </table>

      <div className="formula">
        <div className="formula-title">
          Rumus Harga Satuan
        </div>

        <div>
          Total HPP per Batch ÷ Jumlah Produksi
        </div>

        <div className="formula-result">
          Rp {formatRupiah(totalHPP)} ÷ {qty} = Rp {formatRupiah(hppPerPcs)}
        </div>
      </div>
    </div>
  );
}