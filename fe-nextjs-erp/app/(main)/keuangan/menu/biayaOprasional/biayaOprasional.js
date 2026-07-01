"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Badge } from "primereact/badge";
import ToastNotifier from "../../../../components/ToastNotifier";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/+$/g, "");

export default function BiayaOperasionalPage() {
  const toastRef = useRef(null);

  const [biayaOperasional, setBiayaOperasional] = useState(0);
  const [jumlahKaryawan, setJumlahKaryawan] = useState(0);
  const [avgGaji, setAvgGaji] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const now = new Date();

  const [filterPeriode, setFilterPeriode] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );

  // ✅ FIX AUTH (AMAN SSR + browser only)
  const auth = () => {
    if (typeof window === "undefined") return {};

    const token = localStorage.getItem("TOKEN");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  const periodeStr = () => {
    if (!filterPeriode) return "";

    const d = new Date(filterPeriode);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-01`;
  };

  useEffect(() => {
    fetchBiayaOperasional();
  }, [filterPeriode]);

  const fetchBiayaOperasional = async () => {
    try {
      setIsLoading(true);

      const token = typeof window !== "undefined"
        ? localStorage.getItem("TOKEN")
        : null;

      const res = await axios.get(
        `${API_URL}/master-payroll/biaya-operasional`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: {
            periode: periodeStr(),
          },
        }
      );

      if (res.data.status === "SUKSES") {
        const data = res.data.data;

        setBiayaOperasional(data.total_biaya_operasional || 0);
        setJumlahKaryawan(data.jumlah_karyawan || 0);
        setAvgGaji(data.rata_rata_gaji || 0);
      } else {
        toastRef.current?.showToast("01", "Gagal mengambil data");
      }
    } catch (err) {
      console.log(err?.response?.data || err.message);

      toastRef.current?.showToast(
        "01",
        err?.response?.data?.message || "Gagal memuat biaya operasional"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="card p-4">
      <ToastNotifier ref={toastRef} />

      {/* HEADER */}
      <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold m-0">
            Biaya Operasional
          </h2>
          <p className="text-600 text-sm mt-2">
            Ringkasan biaya operasional berdasarkan total payroll karyawan
          </p>
        </div>

        <Calendar
          value={filterPeriode}
          onChange={(e) => setFilterPeriode(e.value)}
          view="month"
          dateFormat="MM yy"
          showIcon
        />
      </div>

      {/* SUMMARY */}
      <div className="grid">

        {/* Total Biaya */}
        <div className="col-12 md:col-4">
          <div className="surface-card shadow-2 border-round p-4 bg-red-50 h-full">
            <span className="text-600 text-sm font-medium">
              Total Biaya Operasional
            </span>

            <div className="text-900 text-2xl font-bold mt-2">
              {formatRupiah(biayaOperasional)}
            </div>

            <Badge value="Payroll" severity="danger" />
          </div>
        </div>

        {/* Karyawan */}
        <div className="col-12 md:col-4">
          <div className="surface-card shadow-2 border-round p-4 bg-blue-50 h-full">
            <span className="text-600 text-sm font-medium">
              Jumlah Karyawan
            </span>

            <div className="text-900 text-2xl font-bold mt-2">
              {jumlahKaryawan}
            </div>

            <Badge value="Aktif" severity="info" />
          </div>
        </div>

        {/* Rata-rata */}
        <div className="col-12 md:col-4">
          <div className="surface-card shadow-2 border-round p-4 bg-green-50 h-full">
            <span className="text-600 text-sm font-medium">
              Rata-rata THP
            </span>

            <div className="text-900 text-2xl font-bold mt-2">
              {formatRupiah(avgGaji)}
            </div>

            <Badge value="Average" severity="success" />
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="mt-5">
        <div className="surface-card shadow-2 border-round p-4">
          <h4 className="mt-0 mb-3">Detail Perhitungan</h4>

          <div className="flex justify-content-between border-bottom-1 surface-border py-3">
            <span>Total Take Home Pay</span>
            <span className="font-bold">{formatRupiah(biayaOperasional)}</span>
          </div>

          <div className="flex justify-content-between border-bottom-1 surface-border py-3">
            <span>Jumlah Karyawan</span>
            <span className="font-bold">{jumlahKaryawan}</span>
          </div>

          <div className="flex justify-content-between py-3">
            <span>Rata-rata THP</span>
            <span className="font-bold text-green-600">
              {formatRupiah(avgGaji)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}