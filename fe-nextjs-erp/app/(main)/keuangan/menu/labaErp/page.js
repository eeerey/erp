"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function LabaErpPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await api.get("/labaErp");

      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const rupiah = (value) =>
    new Intl.NumberFormat("id-ID").format(
      Number(value || 0)
    );

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center mb-8">
          LAPORAN LABA ERP
        </h1>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Total Penjualan</span>
            <span>
              Rp {rupiah(data.total_penjualan)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>(-) Total HPP</span>
            <span>
              Rp {rupiah(data.total_hpp)}
            </span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Laba Kotor</span>
            <span>
              Rp {rupiah(data.laba_kotor)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>(-) Beban Gaji</span>
            <span>
              Rp {rupiah(data.beban_gaji)}
            </span>
          </div>

          <hr className="border-2" />

          <div className="flex justify-between text-xl font-bold text-blue-700">
            <span>Laba Operasional</span>
            <span>
              Rp {rupiah(data.laba_operasional)}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}