"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const FormProduksiGudang = ({ visible, onHide, selectedData, onDelete }) => {
  const [idJenisProduksi, setIdJenisProduksi] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [barangKode, setBarangKode] = useState("");
  const [noBatchProduksi, setNoBatchProduksi] = useState("");
  const [hasilProduksi, setHasilProduksi] = useState("");
  const [skalaProduksi, setSkalaProduksi] = useState("");
  const [tujuanProduk, setTujuanProduk] = useState("");

  useEffect(() => {
    if (!visible) return;

    if (selectedData) {
      setIdJenisProduksi(selectedData.ID_JENIS_PRODUKSI || "");
      setNamaProduk(selectedData.NAMA_PRODUK || "");
      setBarangKode(selectedData.BARANG_KODE || "");
      setNoBatchProduksi(selectedData.NO_BATCH || "");
      setHasilProduksi(selectedData.HASIL || "");
      setSkalaProduksi(selectedData.SKALA || "");
      setTujuanProduk(selectedData.TUJUAN || "");
    }
  }, [visible, selectedData]);

  return (
    <Dialog
      header="Detail Produksi Gudang"
      visible={visible}
      style={{ width: "500px" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">

        <div className="field mb-4">
          <label className="font-bold">ID Jenis Produksi</label>
          <InputText value={idJenisProduksi} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Nama Produk</label>
          <InputText value={namaProduk} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Kode Barang</label>
          <InputText value={barangKode} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">No Batch</label>
          <InputText value={noBatchProduksi} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Hasil Produksi</label>
          <InputText value={hasilProduksi} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Skala Produksi</label>
          <InputText value={skalaProduksi} readOnly />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Tujuan</label>
          <InputText value={tujuanProduk} readOnly />
        </div>

        <div className="flex justify-content-end gap-2 mt-5">
          <Button 
            label="Tutup" 
            icon="pi pi-times" 
            className="p-button-text" 
            onClick={onHide} 
          />

          <Button 
            label="Hapus" 
            icon="pi pi-trash" 
            severity="danger"
            onClick={() => onDelete(selectedData)}
          />
        </div>

      </div>
    </Dialog>
  );
};

export default FormProduksiGudang;