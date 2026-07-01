"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH DATA
  // ======================
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `${API_URL}/productPerformance`
      );

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

  // ======================
  // FORMAT RUPIAH
  // ======================
  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID").format(val || 0);

  return (
    <div className="p-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4 text-left">
        Product Selling Performance
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">

        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-indigo-600 text-white">
            <tr>

              <th className="px-4 py-3 text-left font-semibold">
                Product
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Total Qty
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Total Harga
              </th>

            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Data kosong
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* PRODUCT */}
                  <td className="px-4 py-3 text-left font-medium">
                    {item.NAMA_BARANG}
                  </td>

                  {/* QTY */}
                  <td className="px-4 py-3 text-left">
                    {item.TOTAL_QTY}
                  </td>

                  {/* SALES */}
                  <td className="px-4 py-3 text-left font-semibold text-green-600">
                    Rp {formatRupiah(item.TOTAL_SUBTOTAL)}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}