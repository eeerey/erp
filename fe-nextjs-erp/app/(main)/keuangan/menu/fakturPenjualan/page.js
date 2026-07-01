"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { AutoComplete } from "primereact/autocomplete";
import api from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PenjualanPage() {
  const [data, setData] = useState([]);

  const [products, setProducts] = useState([]);
  const [hargaList, setHargaList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomer, setFilteredCustomer] = useState([]);

  const [details, setDetails] = useState([]);
  const [dialog, setDialog] = useState(false);
  

 

  const [form, setForm] = useState({
    NO_FAKTUR: "",
    ID_CUSTOMER: "",
    NAMA_CUSTOMER: "",
    TGL_FAKTUR: new Date(),
    STATUS_BAYAR: "Belum Lunas",

    PRODUK_ID: "",
    PRODUK_NAMA: "",
    QTY: 1,
    HARGA_JUAL: 0,
  });

  // =========================
  // LOAD DATA
  // =========================
  const getData = async () => {
    const res = await api.get(`${API}/fakturPenjualan`);
    setData(res.data.data || []);
  };

  // =========================
  // NO FAKTUR
  // =========================
  const getNoFaktur = async () => {
  const res = await api.get(`${API}/fakturPenjualan/generate-no-faktur`);
    console.log(res.data);

    return res.data.noFaktur;
  };

  // =========================
  // MASTER
  // =========================
  const getMaster = async () => {
   const [p, h, c] = await Promise.all([
  api.get(`${API}/produk-hpp`),
  api.get(`${API}/harga-jual`),
  api.get(`${API}/master-customer`)
]);
    setProducts(p.data.data || []);
    setHargaList(h.data.data || []);
    setCustomers(c.data.data || []);
  };

const searchCustomer = (event) => {
  const query = event.query.toLowerCase();

  const filtered = customers.filter((c) =>
    c.NAMA_CUSTOMER
      ?.toLowerCase()
      .includes(query)
  );

  setFilteredCustomer(filtered);
};

  useEffect(() => {
    getData();
    getMaster();
  }, []);

  // =========================
  // HITUNG TOTAL
  // =========================
  const hitungTotal = (qty, harga) =>
    Number(qty || 0) * Number(harga || 0);

  const grandTotal = () =>
    details.reduce((a, b) => a + b.SUBTOTAL, 0);

  // =========================
  // OPEN ADD
  // =========================
  const openAdd = async () => {
    const no = await getNoFaktur();
    console.log("NO FAKTUR =", no);

    setForm({
      NO_FAKTUR: no,
      ID_CUSTOMER: "",
      NAMA_CUSTOMER: "",
      TGL_FAKTUR: new Date(),
      STATUS_BAYAR: "Belum Lunas",
      PRODUK_ID: "",
      PRODUK_NAMA: "",
      QTY: 1,
      HARGA_JUAL: 0,
    });

    setDetails([]);
    setDialog(true);
  };

  // =========================
  // ADD ITEM
  // =========================
  const addItem = () => {
    const item = {
      PRODUK_ID: form.PRODUK_ID,
      PRODUK_NAMA: form.PRODUK_NAMA,
      QTY: form.QTY,
      HARGA_JUAL: form.HARGA_JUAL,
      SUBTOTAL: hitungTotal(form.QTY, form.HARGA_JUAL),
    };

    setDetails([...details, item]);
  };

  // =========================
  // DELETE ITEM (FIX BARU)
  // =========================
  const removeItem = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  // =========================
  // SAVE
  // =========================
  const saveData = async () => {
  if (!form.NAMA_CUSTOMER) {
    alert("Customer wajib diisi");
    return;
  }

  if (details.length === 0) {
    alert("Produk belum ditambahkan");
    return;
  }

  const payload = {
    header: {
      NO_FAKTUR: form.NO_FAKTUR,
      ID_CUSTOMER: form.ID_CUSTOMER,
      NAMA_CUSTOMER: form.NAMA_CUSTOMER,
      TGL_FAKTUR: form.TGL_FAKTUR,
      STATUS_BAYAR: form.STATUS_BAYAR,
      TOTAL_PENJUALAN: grandTotal(),
    },
    details,
  };
 
    console.log("PAYLOAD", payload);
  await api.post(
    `${API}/fakturPenjualan`,
    payload
  );

  setDialog(false);

  getData();
};
  // =========================
  // DELETE HEADER
  // =========================
  const deleteData = async (no) => {
    await api.delete(`${API}/fakturPenjualan/${no}`);
    getData();
  };

  // =========================
  // PRINT (FIXED)
  // =========================
  const handlePrint = async (no) => {
  const res = await api.get(
    `${API}/fakturPenjualan/detail/${no}`
  );

  const result = res.data.data;
  const header = result.header || {};
  const detail = result.detail || [];

  const subtotal = detail.reduce((a, b) => a + (b.SUBTOTAL || 0), 0);

  const w = window.open("", "_blank");

  w.document.write(`
    <html>
    <head>
      <title>Invoice ${no}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #000;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .info {
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .line {
          border-top: 1px dashed #000;
          margin: 15px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th, td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }

        th {
          text-align: left;
        }

        .right {
          text-align: right;
        }

        .total-box {
          margin-top: 15px;
          text-align: right;
          font-weight: bold;
          font-size: 15px;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
        }
      </style>
    </head>

    <body>

      <div class="title">FAKTUR PENJUALAN</div>

      <div class="info">
        <div><b>No Faktur :</b> ${header.NO_FAKTUR || "-"}</div>
        <div><b>Tanggal :</b> ${
          header.TGL_FAKTUR
            ? new Date(header.TGL_FAKTUR).toLocaleDateString("id-ID")
            : "-"
        }</div>
        <div><b>Customer :</b> ${header.NAMA_CUSTOMER || "-"}</div>
        <div><b>Status :</b> ${header.STATUS_BAYAR || "-"}</div>
      </div>

      <div class="line"></div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Qty</th>
            <th>Harga</th>
            <th class="right">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          ${detail
            .map(
              (d, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${d.PRODUK_NAMA || "-"}</td>
              <td>${d.QTY}</td>
              <td>${new Intl.NumberFormat("id-ID").format(
                d.HARGA_JUAL
              )}</td>
              <td class="right">${new Intl.NumberFormat("id-ID").format(
                d.SUBTOTAL
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="line"></div>

      <div class="total-box">
        Subtotal : ${new Intl.NumberFormat("id-ID").format(subtotal)}
      </div>

      <div class="footer">
        Terima kasih atas pembelian Anda
      </div>

    </body>
    </html>
  `);

  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
};

  // =========================
  // UI
  // =========================
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-content-between mb-3">
        <h2>Manajemen Faktur Penjualan</h2>

        <Button
          label="Tambah Data"
          icon="pi pi-plus"
          onClick={openAdd}
        />
      </div>

      {/* TABLE HEADER */}
      <table className="w-full border-1 border-300">
        <thead>
          <tr>
            <th>No Faktur</th>
            <th>Customer</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td>{r.NO_FAKTUR}</td>
              <td>{r.NAMA_CUSTOMER}</td>
              <td>
                {new Date(r.TGL_FAKTUR).toLocaleDateString("id-ID")}
              </td>
              <td>{r.STATUS_BAYAR}</td>
              <td>
                {new Intl.NumberFormat("id-ID").format(
                  r.TOTAL_PENJUALAN
                )}
              </td>

              <td className="flex gap-2">
                <Button
                  icon="pi pi-print"
                  text
                  onClick={() => handlePrint(r.NO_FAKTUR)}
                />

                <Button
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  onClick={() => deleteData(r.NO_FAKTUR)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM */}
      <Dialog
        header="Transaksi Penjualan"
        visible={dialog}
        onHide={() => setDialog(false)}
        style={{ width: "600px" }}
      >
        <div className="p-fluid">

          {/* CUSTOMER */}
          <label>Customer</label>
        <AutoComplete
            value={form.NAMA_CUSTOMER}
            suggestions={filteredCustomer}
            completeMethod={searchCustomer}
            field="NAMA_CUSTOMER"
            dropdown
            onChange={(e) => {
            setForm({
              ...form,
              NAMA_CUSTOMER:
                typeof e.value === "string"
                  ? e.value
                  : e.value?.NAMA_CUSTOMER || "",
            });
          }}
            onSelect={(e) => {
              setForm({
                ...form,
                NAMA_CUSTOMER: e.value.NAMA_CUSTOMER,
                ID_CUSTOMER: e.value.ID_CUSTOMER,
              });
            }}
          />    
          {/* PRODUK */}
          <label>Produk</label>
          <Dropdown
            value={form.PRODUK_ID}
            options={products}
            optionLabel="nama_produk_jadi"
            optionValue="id"
            onChange={(e) => {
              const p = products.find(
                (x) => x.id === e.value
              );

              const h = hargaList.find(
                (x) => x.produk_id === e.value
              );

              setForm({
                ...form,
                PRODUK_ID: e.value,
                PRODUK_NAMA: p?.nama_produk_jadi,
                HARGA_JUAL: h?.harga_jual || 0,
              });
            }}
          />

          {/* QTY */}
          <label>Qty</label>
          <InputNumber
            value={form.QTY}
            onValueChange={(e) =>
              setForm({ ...form, QTY: e.value })
            }
          />

          {/* ADD ITEM */}
          <Button
            label="Tambah Produk"
            className="mt-2"
            onClick={addItem}
          />

          {/* LIST ITEM */}
          <table className="w-full mt-3">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td>{d.PRODUK_NAMA}</td>
                  <td>{d.QTY}</td>
                  <td>{d.SUBTOTAL}</td>

                  <td>
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() => removeItem(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <h3 className="mt-3">
            Grand Total: {grandTotal()}
          </h3>

          {/* SAVE */}
          <Button
            label="Simpan"
            className="mt-3"
            onClick={saveData}
          />
        </div>
      </Dialog>
    </div>
  );
}