"use client";

import { Card } from "primereact/card";

export default function LabaChart({ data }) {
  if (!data) return <p>Loading...</p>;

  const formatRupiah = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const safeNumber = (val) => Number(val || 0);

  return (
    <div className="grid">

      {/* REVENUE */}
      <div className="col-12 md:col-3">
        <Card title="Revenue">
          <h3 className="text-green-600">
            {formatRupiah(safeNumber(data.revenue))}
          </h3>
        </Card>
      </div>

      {/* HPP */}
      <div className="col-12 md:col-3">
        <Card title="HPP">
          <h3 className="text-blue-600">
            {formatRupiah(safeNumber(data.hpp))}
          </h3>
        </Card>
      </div>

      {/* LABA */}
      <div className="col-12 md:col-3">
        <Card title="Laba">
          <h3
            className={
              safeNumber(data.laba) >= 0
                ? "text-green-700"
                : "text-red-600"
            }
          >
            {formatRupiah(safeNumber(data.laba))}
          </h3>
        </Card>
      </div>

      {/* MARGIN */}
      <div className="col-12 md:col-3">
        <Card title="Margin">
          <h3 className="text-purple-600">
            {safeNumber(data.margin).toFixed(2)}%
          </h3>
        </Card>
      </div>

    </div>
  );
}