"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";

import ToastNotifier from "../../../../components/ToastNotifier";
import CustomDataTable from "../../../../components/DataTable";
import HeaderBar from "../../../../components/headerbar";
import FormProduksi from "./components/FormProduksi";
import api from "@/lib/api";

export default function ProduksiPage() {
  const toastRef = useRef(null);
  const isMounted = useRef(true);

  const [dataList, setDataList] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/jenis-produksi");

      if (res.data.status === "00") {
        setDataList(res.data.data || []);
        setOriginalData(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toastRef.current?.showToast(
        "01",
        err.response?.data?.message || "Gagal memuat data produksi"
      );
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setDataList(originalData);
      return;
    }

    const lowerKeyword = keyword.toLowerCase();

    const filtered = originalData.filter(
      (v) =>
        v.NAMA_PRODUK?.toLowerCase().includes(lowerKeyword) ||
        v.NO_BATCH?.toLowerCase().includes(lowerKeyword) ||
        v.BARANG_KODE?.toLowerCase().includes(lowerKeyword)
    );

    setDataList(filtered);
  };

  const handleSubmit = async (payload) => {
    try {
      let res;

      if (selectedData) {
        res = await api.put(
          `/jenis-produksi/${selectedData.ID}`,
          payload
        );
      } else {
        res = await api.post(
          "/jenis-produksi",
          payload
        );
      }

      if (res.data.status === "00") {
        toastRef.current?.showToast(
          "00",
          selectedData
            ? "Data berhasil diperbarui"
            : "Data berhasil ditambahkan"
        );

        setDialogVisible(false);
        setSelectedData(null);

        fetchData();
      } else {
        toastRef.current?.showToast(
          "01",
          res.data.message || "Gagal menyimpan data"
        );
      }
    } catch (err) {
      console.error(err);

      toastRef.current?.showToast(
        "01",
        err.response?.data?.message || "Terjadi kesalahan server"
      );
    }
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Yakin hapus produksi batch "${rowData.NO_BATCH}"?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",

      accept: async () => {
        try {
          const res = await api.delete(
            `/jenis-produksi/${rowData.ID}`
          );

          if (res.data.status === "00") {
            toastRef.current?.showToast(
              "00",
              "Data berhasil dihapus"
            );

            fetchData();
          }
        } catch (err) {
          console.error(err);

          toastRef.current?.showToast(
            "01",
            err.response?.data?.message || "Gagal menghapus data"
          );
        }
      },
    });
  };

  const columns = [
    {
      field: "ID_JENIS_PRODUKSI",
      header: "ID",
      sortable: true,
    },
    {
      field: "NAMA_PRODUK",
      header: "Nama Produk",
      sortable: true,
    },
    {
      field: "BARANG_KODE",
      header: "Kode Barang",
      sortable: true,
    },
    {
      field: "NO_BATCH",
      header: "No Batch",
      sortable: true,
    },
    {
      field: "TARGET",
      header: "Target",
      sortable: true,
    },
    {
      field: "HASIL",
      header: "Hasil",
      sortable: true,
    },
    {
      field: "GAGAL",
      header: "Gagal",
      sortable: true,
    },
    {
      field: "SKALA",
      header: "Skala",
      body: (row) => (
        <Tag
          value={row.SKALA}
          severity={
            row.SKALA === "massal"
              ? "danger"
              : row.SKALA === "sedang"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      field: "TUJUAN",
      header: "Tujuan",
      sortable: true,
    },
    {
      header: "Aksi",
      body: (rowData) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-pencil"
            severity="warning"
            size="small"
            tooltip="Edit"
            onClick={() => {
              setSelectedData(rowData);
              setDialogVisible(true);
            }}
          />

          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            tooltip="Hapus"
            onClick={() => handleDelete(rowData)}
          />
        </div>
      ),
      style: {
        width: "120px",
      },
    },
  ];

  return (
    <div className="card p-4">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">
        Data Produksi
      </h3>

      <HeaderBar
        placeholder="Cari nama produk, kode barang, atau batch..."
        onSearch={handleSearch}
        onAddClick={() => {
          setSelectedData(null);
          setDialogVisible(true);
        }}
        showAddButton={true}
      />

      <CustomDataTable
        data={dataList}
        loading={isLoading}
        columns={columns}
        emptyMessage="Data produksi tidak ditemukan."
      />

      <FormProduksi
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setSelectedData(null);
        }}
        selectedData={selectedData}
        onSave={handleSubmit}
      />
    </div>
  );
}