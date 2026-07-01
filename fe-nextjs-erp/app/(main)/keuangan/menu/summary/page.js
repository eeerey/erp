"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Badge } from "primereact/badge";
import ToastNotifier from "../../../../components/ToastNotifier";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
  .replace(/\/+$/, "");

export default function Page() {
  const toastRef = useRef(null);

  const [summary, setSummary] = useState({
    revenue: 0,
    hpp: 0,
    laba: 0,
    margin: 0,
    total_transaksi: 0,
    total_customer: 0,
  });

  const [loading, setLoading] = useState(false);

  const auth = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("TOKEN");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/laba/dashboard`, {
        headers: auth(),
      });

      setSummary(res.data?.data || {});
    } catch (err) {
      toastRef.current?.showToast("01", "Gagal memuat summary laba");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  return (
    <div className="card p-4">

      <ToastNotifier ref={toastRef} />

      {/* HEADER */}
      <div className="flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="text-xl font-semibold m-0">
            Summary Laba (Profit Engine)
          </h3>
          <p className="text-600 text-sm mt-1">
            Ringkasan performa keuntungan perusahaan
          </p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid">

        {/* REVENUE */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round bg-green-50">
            <span className="block text-500 font-medium mb-2">
              Total Revenue
            </span>
            <div className="text-900 font-bold text-2xl">
              {formatRupiah(summary.revenue)}
            </div>
            <Badge value="Income" severity="success" />
          </div>
        </div>

        {/* HPP */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round bg-blue-50">
            <span className="block text-500 font-medium mb-2">
              Total HPP
            </span>
            <div className="text-900 font-bold text-2xl">
              {formatRupiah(summary.hpp)}
            </div>
            <Badge value="Cost" severity="info" />
          </div>
        </div>

        {/* LABA */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round bg-yellow-50">
            <span className="block text-500 font-medium mb-2">
              Total Laba
            </span>
            <div
              className={`text-2xl font-bold ${
                (summary.laba || 0) >= 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {formatRupiah(summary.laba)}
            </div>
            <Badge value="Profit" severity="warning" />
          </div>
        </div>

        {/* MARGIN */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round bg-purple-50">
            <span className="block text-500 font-medium mb-2">
              Margin
            </span>
            <div className="text-900 font-bold text-2xl">
              {(summary.margin || 0).toFixed(2)}%
            </div>
            <Badge value="Efficiency" severity="secondary" />
          </div>
        </div>

        {/* TRANSAKSI */}
        <div className="col-12 md:col-6 lg:col-6">
          <div className="surface-card shadow-2 p-3 border-round bg-indigo-50">
            <span className="block text-500 font-medium mb-2">
              Total Transaksi
            </span>
            <div className="text-900 font-bold text-2xl">
              {summary.total_transaksi}
            </div>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="col-12 md:col-6 lg:col-6">
          <div className="surface-card shadow-2 p-3 border-round bg-teal-50">
            <span className="block text-500 font-medium mb-2">
              Customer Aktif
            </span>
            <div className="text-900 font-bold text-2xl">
              {summary.total_customer}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}