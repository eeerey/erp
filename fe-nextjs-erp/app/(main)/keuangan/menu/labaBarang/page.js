"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LabaBarangPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/labaBarang`
      );

      setData(res.data.data || []);
    } catch (err) {
      console.error("Frontend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID").format(
      value || 0
    );
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">

        <h1 className="text-2xl font-bold mb-5">
          Laba Per Barang
        </h1>

        <div className="overflow-auto">

          <table className="w-full border border-gray-200">

            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">
                  Kode Barang
                </th>

                <th className="border p-3">
                  Nama Barang
                </th>

                <th className="border p-3">
                  Harga Beli
                </th>

                <th className="border p-3">
                  Harga Jual
                </th>

                <th className="border p-3">
                  Laba / Unit
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-5"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-5"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index}>

                    <td className="border p-3">
                      {row.BARANG_KODE}
                    </td>

                    <td className="border p-3">
                      {row.NAMA_BARANG}
                    </td>

                    <td className="border p-3 text-right">
                      Rp{" "}
                      {formatRupiah(
                        row.HARGA_BELI_TERAKHIR
                      )}
                    </td>

                    <td className="border p-3 text-right">
                      Rp{" "}
                      {formatRupiah(
                        row.HARGA_JUAL
                      )}
                    </td>

                    <td className="border p-3 text-right font-bold">
                      Rp{" "}
                      {formatRupiah(
                        row.laba_per_unit
                      )}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}