"use client";

const { useEffect, useState, useMemo } = require("react");
const { Plus, Trash2, Package, Users, Layers } = require("lucide-react");
const axios = require("axios");

const ICONS = { bahan: Package, tenaga: Users, overhead: Layers };

function HppTable({ title, data, setData, color, type }) {
  // ======================
  // STATE DROPDOWN
  // ======================
  const [barangList, setBarangList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [karyawanList, setKaryawanList] = useState([]);

  // ======================
  // FETCH FORM DATA (1x)
  // ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, barangRes] = await Promise.all([
          axios.get("http://localhost:8000/api/hppErp/form-data"),
          axios.get("http://localhost:8000/api/hppErp/master-barang"),
        ]);

        setSatuanList(formRes.data.data.satuan || []);
        setKaryawanList(formRes.data.data.karyawan || []);
        setBarangList(barangRes.data.data || []);
      } catch (err) {
        console.error("Gagal fetch form data:", err);
      }
    };

    fetchData();
  }, []);

  // ======================
  // ADD ROW
  // ======================
  const addRow = () => {
    setData([
      ...data,
      {
        barangKode: "",
        nama: "",
        harga: 0,
        satuan: "",
        jumlah: 0,
        jam: 0,
      },
    ]);
  };

  // ======================
  // REMOVE ROW
  // ======================
  const removeRow = (index) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
  };

  // ======================
  // UPDATE ROW
  // ======================
  const updateRow = (index, field, value) => {
  const updated = [...data];

  if (field === "harga" || field === "jumlah" || field === "jam") {
    updated[index][field] = value === "" ? "" : Number(value);
  } else {
    updated[index][field] = value;
  }

  setData(updated);
};

  // ======================
  // TOTAL CALC
  // ======================
  const total = (item) => {
    if (type === "tenaga" || type === "overhead") {
      return (
        Number(item.harga || 0) *
        Number(item.jumlah || 0) *
        Number(item.jam || 0)
      );
    }
    return Number(item.harga || 0) * Number(item.jumlah || 0);
  };

  const sectionTotal = useMemo(
    () => data.reduce((acc, item) => acc + total(item), 0),
    [data, type]
  );

  // ======================
  // RENDER NAMA
  // ======================
  const renderNama = (item, index) => {
    if (type === "bahan" || type === "bahan_tambahan") {
       if (item.fromFase1) {
        return (
            <input
                type="text"
                value={item.nama}
                readOnly
                className="hpp-field"
                style={{
                    background: "#f8fafc",
                    cursor: "not-allowed",
                    fontWeight: 600,
                }}
            />
        );
    }

      return (
        <select
          value={item.barangKode || ""}
          onChange={(e) => {
            const selected = barangList.find(
              (barang) => barang.BARANG_KODE === e.target.value
            );
            if (!selected) return;

            const updated = [...data];
            updated[index] = {
              ...updated[index],
              barangKode: selected.BARANG_KODE,
              nama: selected.NAMA_BARANG,
              harga: Number(selected.HARGA_JUAL) || 0,
              satuan: selected.NAMA_SATUAN || "",
            };
            setData(updated);
          }}
          className="hpp-field"
        >
          <option value="">Pilih Barang</option>
          {barangList.map((barang) => (
            <option key={barang.ID} value={barang.BARANG_KODE}>
              {barang.NAMA_BARANG}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={item.nama}
        onChange={(e) => updateRow(index, "nama", e.target.value)}
        className="hpp-field"
        placeholder="Nama item"
      />
    );
  };

  const isTenagaOrOverhead = type === "tenaga" || type === "overhead";

  const theme = {
    indigo: { accent: "#4f46e5", soft: "#eef0ff" },
    emerald: { accent: "#0d9f6e", soft: "#e7f8f1" },
    orange: { accent: "#d97706", soft: "#fef3e2" },
  };
  const colorKey = color?.includes("indigo")
    ? "indigo"
    : color?.includes("emerald")
    ? "emerald"
    : "orange";
  const t = theme[colorKey];
  const Icon = ICONS[type] || Package;

  return (
    <div className="hpp-table-card" style={{ "--accent": t.accent, "--accent-soft": t.soft }}>
      <style>{`
        .hpp-table-card {
          background: #fff;
          border: 1px solid #edeef1;
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .hpp-table-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .hpp-table-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hpp-table-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--accent-soft);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hpp-table-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1d1f;
          margin: 0;
        }

        .hpp-table-count {
          font-size: 11.5px;
          color: #8b95a1;
          font-weight: 500;
        }

        .hpp-add-btn {
          background: var(--accent);
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .hpp-add-btn:hover { transform: translateY(-1px); opacity: 0.92; }

        .hpp-table-wrap {
          overflow: auto;
          border: 1px solid #f0f1f3;
          border-radius: 14px;
        }

        .hpp-table {
          width: 100%;
          font-size: 13px;
          border-collapse: collapse;
        }

        .hpp-table thead tr {
          background: #fafafb;
        }

        .hpp-table th {
          padding: 11px 12px;
          text-align: left;
          font-size: 10.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #98a2ac;
          font-weight: 700;
          border-bottom: 1px solid #f0f1f3;
        }

        .hpp-table td {
          padding: 9px 12px;
          border-bottom: 1px solid #f5f6f7;
        }

        .hpp-table tbody tr {
          transition: background 0.12s ease;
        }
        .hpp-table tbody tr:hover { background: #fafbfc; }
        .hpp-table tbody tr:last-child td { border-bottom: none; }

        .hpp-field {
          width: 100%;
          border: 1.5px solid #e7e9ec;
          border-radius: 10px;
          padding: 7px 10px;
          font-size: 13px;
          color: #1a1d1f;
          background: #fff;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .hpp-field:focus { border-color: var(--accent); }

        .hpp-unit-suffix {
          font-size: 11px;
          color: #aab1ba;
          white-space: nowrap;
        }

        .hpp-total-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: var(--accent);
          white-space: nowrap;
        }

        .hpp-del-btn {
          color: #d9614f;
          background: #fdeae7;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hpp-del-btn:hover { background: #f9d4cd; }

        .hpp-empty-row {
          text-align: center;
          padding: 26px 12px;
          color: #aab1ba;
          font-size: 12.5px;
        }

        .hpp-footer-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          padding: 12px 4px 2px;
          font-size: 13px;
        }

        .hpp-footer-label {
          color: #8b95a1;
          font-weight: 600;
        }

        .hpp-footer-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 15px;
          color: var(--accent);
        }
      `}</style>

      {/* HEADER */}
      <div className="hpp-table-head">
        <div className="hpp-table-title-row">
          <div className="hpp-table-icon">
            <Icon size={16} />
          </div>
          <div>
            <h2 className="hpp-table-title">{title}</h2>
            <span className="hpp-table-count">{data.length} item</span>
          </div>
        </div>

        <button onClick={addRow} className="hpp-add-btn">
          <Plus size={13} />
          Tambah
        </button>
      </div>

      {/* TABLE */}
      <div className="hpp-table-wrap">
        <table className="hpp-table">
          <thead>
            <tr>
              <th>Nama</th>

              {isTenagaOrOverhead ? (
                <>
                  <th>Harga Satuan</th>
                  <th>Jumlah</th>
                  <th>Jam Kerja</th>
                </>
              ) : (
                <>
                  <th>Satuan</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan</th>
                </>
              )}

              <th>Total</th>
              <th style={{ textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>  
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="hpp-empty-row">
                  Belum ada item. Klik "Tambah" untuk mulai mengisi.
                </td>
              </tr>
            )}

            {data.map((item, index) => (
        <tr key={index}>
          <td>{renderNama(item, index)}</td>

          {isTenagaOrOverhead ? (
            <>
              {/* Harga Satuan */}
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.harga}
                  onChange={(e) => updateRow(index, "harga", e.target.value)}
                  className="hpp-field"
                />
              </td>

              {/* Jumlah Orang */}
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.jumlah === "" ? "" : item.jumlah}
                  onChange={(e) => updateRow(index, "jumlah", e.target.value)}
                  className="hpp-field"
                  placeholder="Jumlah"
                />
              </td>

              {/* Jam Kerja */}
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    min="0"
                    value={item.jam === "" ? "" : item.jam}
                    onChange={(e) => updateRow(index, "jam", e.target.value)}
                    className="hpp-field"
                    placeholder="Jam"
                  />
                  <span className="hpp-unit-suffix">jam</span>
                </div>
              </td>
            </>
          ) : (
            <>
              {/* Satuan */}
              <td>
                <select
                  value={item.satuan}
                  onChange={(e) => updateRow(index, "satuan", e.target.value)}
                  className="hpp-field"
                >
                  <option value="">Pilih Satuan</option>
                  {satuanList.map((s) => (
                    <option key={s.ID} value={s.NAMA_SATUAN}>
                      {s.NAMA_SATUAN}
                    </option>
                  ))}
                </select>
              </td>

              {/* Jumlah */}
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.jumlah}
                  onChange={(e) => updateRow(index, "jumlah", e.target.value)}
                  className="hpp-field"
                />
              </td>

              {/* Harga Satuan */}
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.harga}
                  onChange={(e) => updateRow(index, "harga", e.target.value)}
                  className="hpp-field"
                />
              </td>
            </>
          )}

                {/* Total */}
                <td>
                  <span className="hpp-total-val">
                    Rp {total(item).toLocaleString("id-ID")}
                  </span>
                </td>

                {/* Aksi */}
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => removeRow(index)}
                    className="hpp-del-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="hpp-footer-row">
          <span className="hpp-footer-label">Subtotal {title}</span>
          <span className="hpp-footer-val">Rp {sectionTotal.toLocaleString("id-ID")}</span>
        </div>
      )}
    </div>
  );
}

module.exports = HppTable;