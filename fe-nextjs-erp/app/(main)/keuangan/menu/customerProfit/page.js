"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API_URL}/customerProfit`);

      if (res.data.status === "00") {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID").format(val || 0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Customer Profit
      </h1>

      {/* CARD */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        
        <table className="w-full">
          
          {/* TABLE HEAD */}
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">Jumlah Transaksi</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-indigo-50 transition"
              >
               <td className="p-3">
                  <div className="font-medium text-gray-700">
                    {item.NAMA_CUSTOMER}
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.KODE_CUSTOMER}
                  </div>
                </td>

                <td className="p-3 text-gray-600">
                  <span className="font-semibold text-green-600">
                    Rp {formatRupiah(item.TOTAL_SUBTOTAL)}
                  </span>
                </td>

                <td className="p-3 text-gray-700">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg">
                    {item.JUMLAH_TRANSAKSI}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* EMPTY STATE */}
        {data.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data customer
          </div>
        )}

      </div>
    </div>
  );
}