import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// =========================
// FORMAT RUPIAH
// =========================
const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// =========================
// GENERATE PDF
// =========================
export const generateFakturPDF = (header, details = []) => {
  const doc = new jsPDF();

  // =========================
  // TITLE
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FAKTUR PENJUALAN", 105, 15, { align: "center" });

  // =========================
  // BOX INFO
  // =========================
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const tgl = header.TGL_FAKTUR
    ? new Date(header.TGL_FAKTUR).toLocaleDateString("id-ID")
    : "-";

  doc.text(`No Faktur : ${header.NO_FAKTUR || "-"}`, 15, 30);
  doc.text(`Tanggal   : ${tgl}`, 15, 36);
  doc.text(`Customer  : ${header.NAMA_CUSTOMER || "-"}`, 15, 42);
  doc.text(`Status    : ${header.STATUS_BAYAR || "-"}`, 15, 48);

  // =========================
  // TABLE
  // =========================
  autoTable(doc, {
    startY: 55,
    head: [["No", "Produk", "Qty", "Harga", "Subtotal"]],

    body: details.map((item, index) => [
      index + 1,
      item.PRODUK_NAMA ||
        item.NAMA_PRODUK ||
        item.nama_produk_jadi ||
        `ID:${item.PRODUK_ID}`,
      item.QTY,
      formatRupiah(item.HARGA_JUAL),
      formatRupiah(item.SUBTOTAL),
    ]),

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [30, 144, 255],
      textColor: 255,
      halign: "center",
    },

    columnStyles: {
      0: { halign: "center", width: 10 },
      1: { width: 70 },
      2: { halign: "center", width: 15 },
      3: { halign: "right", width: 40 },
      4: { halign: "right", width: 40 },
    },
  });

  // =========================
  // TOTAL
  // =========================
  const total = details.reduce(
    (sum, d) => sum + Number(d.SUBTOTAL || 0),
    0
  );

  const y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: ${formatRupiah(total)}`, 140, y);

  // =========================
  // FOOTER
  // =========================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Terima kasih atas pembelian Anda", 105, 285, {
    align: "center",
  });

  return doc;
};