"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";

import ToastNotifier from "../../../../components/ToastNotifier";
import CustomDataTable from "../../../../components/DataTable";
import HeaderBar from "../../../../components/headerbar";
import FormProduksi from "./components/FormProduksi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // ✅ FIX: tambahin /api
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jenis-produksi`);
      if (res.data.status === "00") {
        setDataList(res.data.data || []);
        setOriginalData(res.data.data || []);
      }
    } catch (err) {
      toastRef.current?.showToast("01", "Gagal memuat data produksi");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setDataList(originalData);
      return;
    }
    const filtered = originalData.filter(v => 
      v.NAMA_PRODUK?.toLowerCase().includes(keyword.toLowerCase()) || 
      v.NO_BATCH?.toLowerCase().includes(keyword.toLowerCase()) ||
      v.BARANG_KODE?.toLowerCase().includes(keyword.toLowerCase())
    );
    setDataList(filtered);
  };

  // ✅ FIX: semua endpoint pakai /api
  const handleSubmit = async (payload) => {
    try {
      let res;
      if (selectedData) {
        res = await axios.put(`${API_URL}/api/jenis-produksi/${selectedData.ID}`, payload);
      } else {
        res = await axios.post(`${API_URL}/api/jenis-produksi`, payload);
      }

      if (res.data.status === "00") {
        toastRef.current?.showToast("00", "Data produksi berhasil disimpan");
        setDialogVisible(false);
        fetchData();
      }
    } catch (err) {
      console.error(err); // 🔥 biar keliatan error aslinya
      toastRef.current?.showToast("01", "Gagal menyimpan data produksi");
    }
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Yakin hapus produksi batch "${rowData.NO_BATCH}"?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya, Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await axios.delete(`${API_URL}/api/jenis-produksi/${rowData.ID}`);

          if (res.data.status === "00") {
            toastRef.current?.showToast("00", "Data berhasil dihapus");
            fetchData();
          }
        } catch (err) {
          console.error(err);
          toastRef.current?.showToast("01", "Data tidak bisa dihapus");
        }
      }
    });
  };

  const columns = [
    { field: "ID_JENIS_PRODUKSI", header: "ID", sortable: true },
    { field: "NAMA_PRODUK", header: "Nama Produk", sortable: true },
    { field: "BARANG_KODE", header: "Kode Barang", sortable: true },
    { field: "NO_BATCH", header: "No Batch", sortable: true },
    { field: "TARGET", header: "Target", sortable: true },
    { field: "HASIL", header: "Hasil", sortable: true },
    { field: "GAGAL", header: "Gagal", sortable: true },
    { 
      field: "SKALA", 
      header: "Skala", 
      body: (row) => (
        <Tag 
          value={row.SKALA} 
          severity={
            row.SKALA === "massal" ? "danger" :
            row.SKALA === "sedang" ? "warning" : "success"
          } 
        />
      )
    },
    { field: "TUJUAN", header: "Tujuan", sortable: true },
    {
      header: "Aksi",
      body: (rowData) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-pencil"
            size="small"
            severity="warning"
            tooltip="Edit"
            onClick={() => {
              setSelectedData(rowData);
              setDialogVisible(true);
            }}
          />
          <Button
            icon="pi pi-trash"
            size="small"
            severity="danger"
            tooltip="Hapus"
            onClick={() => handleDelete(rowData)}
          />
        </div>
      ),
      style: { width: "120px" },
    },
  ];

  return (
    <div className="card p-4">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Data Produksi</h3>

      <HeaderBar 
        onSearch={handleSearch} 
        onAddClick={() => { 
          setSelectedData(null); 
          setDialogVisible(true); 
        }} 
        showAddButton={true} 
        placeholder="Cari nama produk, kode barang, atau batch..."
      />

      <CustomDataTable 
        data={dataList} 
        loading={isLoading} 
        columns={columns} 
        emptyMessage="Data produksi tidak ditemukan."
      />

      <FormProduksi 
        visible={dialogVisible} 
        onHide={() => setDialogVisible(false)} 
        onSave={handleSubmit} 
        selectedData={selectedData} 
      />
    </div>
  );
}