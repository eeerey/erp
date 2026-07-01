"use client";

import CustomDataTable from "../../../../components/DataTable";

export default function LabaTable({ data = [], loading }) {
  const columns = [
    { field: "KODE_CUSTOMER", header: "Customer" },
    { field: "revenue", header: "Revenue" },
    { field: "hpp", header: "HPP" },
    { field: "laba", header: "Laba" },
    {
      field: "margin",
      header: "Margin (%)",
      body: (row) => {
        const margin = Number(row.margin || 0);
        return margin.toFixed(2) + "%";
      },
    },
    { field: "transaksi", header: "Transaksi" },
  ];

  return (
    <CustomDataTable
      data={Array.isArray(data) ? data : []}
      loading={loading}
      columns={columns}
      emptyMessage="Tidak ada data laba"
    />
  );
}