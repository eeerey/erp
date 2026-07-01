"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const FormProduksi = ({ visible, onHide, onSave, selectedData }) => {
  const [idJenisProduksi, setIdJenisProduksi] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [barangKode, setBarangKode] = useState("");
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
    { label: "Customer", value: "customer" },
  ];

  useEffect(() => {
    if (!visible) return;

    if (selectedData) {
      setIdJenisProduksi(selectedData.ID_JENIS_PRODUKSI || "");
      setNamaProduk(selectedData.NAMA_PRODUK || "");
      setBarangKode(selectedData.BARANG_KODE || "");
      setNoBatchProduksi(selectedData.NO_BATCH || "");
      setTargetProduksi(selectedData.TARGET || "");
      setHasilProduksi(selectedData.HASIL || "");
      setGagal(selectedData.GAGAL || "");
      setSkalaProduksi(selectedData.SKALA || "");
      setTujuanProduk(selectedData.TUJUAN || "");
    } else {
      setIdJenisProduksi("JP-" + Date.now());
      setNamaProduk("");
      setBarangKode("");
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

    if (!namaProduk.trim()) newErrors.namaProduk = "Wajib diisi";
    if (!barangKode.trim()) newErrors.barangKode = "Wajib diisi";
    if (!noBatchProduksi.trim()) newErrors.noBatchProduksi = "Wajib diisi";
    if (!targetProduksi) newErrors.targetProduksi = "Wajib diisi";
    if (!hasilProduksi) newErrors.hasilProduksi = "Wajib diisi";
    if (!gagal) newErrors.gagal = "Wajib diisi";
    if (!skalaProduksi) newErrors.skalaProduksi = "Pilih";
    if (!tujuanProduk) newErrors.tujuanProduk = "Pilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      ID_JENIS_PRODUKSI: idJenisProduksi,
      NAMA_PRODUK: namaProduk.trim(),
      BARANG_KODE: barangKode.trim().toUpperCase(),
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

        <div className="field mb-3">
          <label>ID</label>
          <InputText value={idJenisProduksi} readOnly />
        </div>

        <div className="field mb-3">
          <label>Nama Produk *</label>
          <InputText value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>Kode Barang *</label>
          <InputText value={barangKode} onChange={(e) => setBarangKode(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>No Batch *</label>
          <InputText value={noBatchProduksi} onChange={(e) => setNoBatchProduksi(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>Target</label>
          <InputText value={targetProduksi} onChange={(e) => setTargetProduksi(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>Hasil</label>
          <InputText value={hasilProduksi} onChange={(e) => setHasilProduksi(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>Gagal</label>
          <InputText value={gagal} onChange={(e) => setGagal(e.target.value)} />
        </div>

        <div className="field mb-3">
          <label>Skala</label>
          <Dropdown value={skalaProduksi} options={skalaOptions} onChange={(e) => setSkalaProduksi(e.value)} />
        </div>

        <div className="field mb-3">
          <label>Tujuan</label>
          <Dropdown value={tujuanProduk} options={tujuanOptions} onChange={(e) => setTujuanProduk(e.value)} />
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Batal" onClick={onHide} />
          <Button label="Simpan" loading={loading} onClick={handleSubmit} />
        </div>

      </div>
    </Dialog>
  );
};

export default FormProduksi;