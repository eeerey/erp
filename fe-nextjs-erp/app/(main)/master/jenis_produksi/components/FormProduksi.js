"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const FormProduksi = ({ visible, onHide, onSave, selectedData }) => {
  const [idJenisProduksi, setIdJenisProduksi] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [barangKode, setBarangKode] = useState(""); // 🔥 TAMBAHAN
  const [noBatchProduksi, setNoBatchProduksi] = useState("");
  const [targetProduksi, setTargetProduksi] = useState("");
  const [hasilProduksi, setHasilProduksi] = useState("");
  const [gagal, setGagal] = useState("");
  const [skalaProduksi, setSkalaProduksi] = useState("");
  const [tujuanProduk, setTujuanProduk] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const skalaOptions = [
    { label: "Kecil", value: "kecil" },
    { label: "Sedang", value: "sedang" },
    { label: "Massal", value: "massal" },
  ];

  const tujuanOptions = [
    { label: "Gudang", value: "gudang" },
    { label: "Customer / Pemesanan", value: "customer" },
  ];

  useEffect(() => {
    if (!visible) return;

    if (selectedData) {
      setIdJenisProduksi(selectedData.ID_JENIS_PRODUKSI || "");
      setNamaProduk(selectedData.NAMA_PRODUK || "");
      setBarangKode(selectedData.BARANG_KODE || ""); // 🔥 TAMBAHAN
      setNoBatchProduksi(selectedData.NO_BATCH || "");
      setTargetProduksi(selectedData.TARGET || "");
      setHasilProduksi(selectedData.HASIL || "");
      setGagal(selectedData.GAGAL || "");
      setSkalaProduksi(selectedData.SKALA || "");
      setTujuanProduk(selectedData.TUJUAN || "");
    } else {
      setIdJenisProduksi("JP-" + Date.now());
      setNamaProduk("");
      setBarangKode(""); // 🔥 TAMBAHAN
      setNoBatchProduksi("");
      setTargetProduksi("");
      setHasilProduksi("");
      setGagal("");
      setSkalaProduksi("");
      setTujuanProduk("");
    }

    setErrors({});
  }, [visible, selectedData]);

  const validateForm = () => {
    const newErrors = {};
    if (!namaProduk.trim()) newErrors.namaProduk = "Nama produk wajib diisi";
    if (!barangKode.trim()) newErrors.barangKode = "Kode barang wajib diisi"; // 🔥 TAMBAHAN
    if (!noBatchProduksi.trim()) newErrors.noBatchProduksi = "No batch wajib diisi";
    if (!targetProduksi) newErrors.targetProduksi = "Target wajib diisi";
    if (!hasilProduksi) newErrors.hasilProduksi = "Hasil wajib diisi";
    if (!gagal) newErrors.gagal = "Jumlah gagal wajib diisi";
    if (!skalaProduksi) newErrors.skalaProduksi = "Pilih skala produksi";
    if (!tujuanProduk) newErrors.tujuanProduk = "Pilih tujuan produk";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      ID_JENIS_PRODUKSI: idJenisProduksi,
      NAMA_PRODUK: namaProduk.trim(),
      BARANG_KODE: barangKode.trim().toUpperCase(), // 🔥 TAMBAHAN
      NO_BATCH: noBatchProduksi.trim().toUpperCase(),
      TARGET: Number(targetProduksi),
      HASIL: Number(hasilProduksi),
      GAGAL: Number(gagal),
      SKALA: skalaProduksi,
      TUJUAN: tujuanProduk,
    };

    setLoading(true);
    await onSave(data);
    setLoading(false);
  };

  return (
    <Dialog
      header={selectedData ? "Edit Produksi" : "Tambah Produksi"}
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
          <label className="font-bold">Nama Produk *</label>
          <InputText
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
            className={errors.namaProduk ? "p-invalid" : ""}
          />
          {errors.namaProduk && <small className="p-error">{errors.namaProduk}</small>}
        </div>

        {/* 🔥 INPUT BARANG KODE */}
        <div className="field mb-4">
          <label className="font-bold">Kode Barang *</label>
          <InputText
            value={barangKode}
            onChange={(e) => setBarangKode(e.target.value)}
            className={errors.barangKode ? "p-invalid" : ""}
            placeholder="Contoh: BRG001"
          />
          {errors.barangKode && <small className="p-error">{errors.barangKode}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">No Batch *</label>
          <InputText
            value={noBatchProduksi}
            onChange={(e) => setNoBatchProduksi(e.target.value)}
            className={errors.noBatchProduksi ? "p-invalid" : ""}
          />
          {errors.noBatchProduksi && <small className="p-error">{errors.noBatchProduksi}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">Target Produksi *</label>
          <InputText
            value={targetProduksi}
            onChange={(e) => setTargetProduksi(e.target.value)}
            keyfilter="int"
            className={errors.targetProduksi ? "p-invalid" : ""}
          />
          {errors.targetProduksi && <small className="p-error">{errors.targetProduksi}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">Hasil Produksi *</label>
          <InputText
            value={hasilProduksi}
            onChange={(e) => setHasilProduksi(e.target.value)}
            keyfilter="int"
            className={errors.hasilProduksi ? "p-invalid" : ""}
          />
          {errors.hasilProduksi && <small className="p-error">{errors.hasilProduksi}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">Gagal *</label>
          <InputText
            value={gagal}
            onChange={(e) => setGagal(e.target.value)}
            keyfilter="int"
            className={errors.gagal ? "p-invalid" : ""}
          />
          {errors.gagal && <small className="p-error">{errors.gagal}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">Skala Produksi *</label>
          <Dropdown
            value={skalaProduksi}
            options={skalaOptions}
            onChange={(e) => setSkalaProduksi(e.value)}
            className={errors.skalaProduksi ? "p-invalid" : ""}
          />
          {errors.skalaProduksi && <small className="p-error">{errors.skalaProduksi}</small>}
        </div>

        <div className="field mb-4">
          <label className="font-bold">Tujuan Produk *</label>
          <Dropdown
            value={tujuanProduk}
            options={tujuanOptions}
            onChange={(e) => setTujuanProduk(e.value)}
            className={errors.tujuanProduk ? "p-invalid" : ""}
          />
          {errors.tujuanProduk && <small className="p-error">{errors.tujuanProduk}</small>}
        </div>

        <div className="flex justify-content-end gap-2 mt-5">
          <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Simpan" icon="pi pi-check" loading={loading} onClick={handleSubmit} />
        </div>

      </div>
    </Dialog>
  );
};

export default FormProduksi;