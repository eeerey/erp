"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Save, Search, TrendingUp, PackageSearch, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import api from "@/lib/api";

/**
 * Signature element: a soft, rounded "cost -> price" gauge per card.
 * Cards float with shadow instead of sitting in a rigid grid/ledger —
 * friendlier, more product-y feel while keeping the data dense and scannable.
 */

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

export default function HargaJualPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await api.get("http://localhost:8000/api/harga-jual");

      const formatted = res.data.data.map((item) => ({
        ...item,
        margin: item.margin || 100,
        harga_jual:
          item.hpp_per_pcs + (item.hpp_per_pcs * (item.margin || 100)) / 100,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarginChange = (produk_id, value) => {
  const updated = [...data];
  const index = updated.findIndex(i => i.produk_id === produk_id);

  const margin = parseFloat(value) || 0;

  updated[index].margin = margin;
  updated[index].harga_jual =
    updated[index].hpp_per_pcs + (updated[index].hpp_per_pcs * margin) / 100;

  setData(updated);
};

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("http://localhost:8000/api/harga-jual", data);
      setSavedAt(new Date());
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(
    () =>
      data.filter((item) =>
        `${item.nama_produk_jadi} ${item.produk_id}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [data, query]
  );

  const stats = useMemo(() => {
    if (!data.length) return { count: 0, avgMargin: 0, totalProfit: 0 };
    const avgMargin =
      data.reduce((sum, i) => sum + (i.margin || 0), 0) / data.length;
    const totalProfit = data.reduce(
      (sum, i) => sum + (i.harga_jual - i.hpp_per_pcs),
      0
    );
    return { count: data.length, avgMargin, totalProfit };
  }, [data]);

  const fmt = (n) => Number(n || 0).toLocaleString("id-ID");

  return (
    <div className="pricing-page">
      <style>{`
        ${FONT_IMPORT}

        .pricing-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-soft: #f6f7f5;
          --border: #ebebe8;
          --ink: #181c1a;
          --ink-soft: #6b7670;
          --muted: #9aa39e;
          --amber: #d98a32;
          --amber-deep: #b9762a;
          --amber-soft: #fdf1e2;
          --mint: #2f8f6a;
          --mint-soft: #e8f5ef;
          --terracotta: #d9614f;
          --terracotta-soft: #fdeae7;

          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: 'Sora', system-ui, sans-serif;
          padding: 36px 24px 72px;
        }

        .mono { font-family: 'JetBrains Mono', monospace; }

        .header-card {
          max-width: 1180px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, var(--amber-soft) 0%, #fff 60%);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 28px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 11px;
          color: var(--amber-deep);
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .subtitle {
          color: var(--ink-soft);
          font-size: 14px;
          margin-top: 8px;
          max-width: 420px;
        }

        .save-btn {
          background: var(--ink);
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 14px;
          padding: 14px 24px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 10px 24px -10px rgba(24,28,26,0.5);
        }
        .save-btn:hover { transform: translateY(-2px) scale(1.02); }
        .save-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .saved-note {
          font-size: 12px;
          color: var(--mint);
          margin-top: 10px;
          text-align: right;
          font-weight: 600;
        }

        .stat-row {
          max-width: 1180px;
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 0 4px 14px -8px rgba(0,0,0,0.08);
          transition: transform 0.18s ease;
        }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card:nth-child(2) { transform: rotate(-0.4deg); }
        .stat-card:nth-child(2):hover { transform: rotate(-0.4deg) translateY(-3px); }

        .stat-icon {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .stat-icon.amber { background: var(--amber-soft); color: var(--amber-deep); }
        .stat-icon.mint { background: var(--mint-soft); color: var(--mint); }

        .stat-label {
          font-size: 12px;
          color: var(--ink-soft);
          margin-bottom: 4px;
        }

        .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 600;
        }

        .toolbar {
          max-width: 1180px;
          margin: 0 auto 18px;
        }

        .search-wrap {
          position: relative;
          max-width: 320px;
        }

        .search-wrap svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }

        .search-wrap input {
          width: 100%;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 12px 14px 12px 42px;
          color: var(--ink);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .search-wrap input:focus {
          border-color: var(--amber);
          background: #fff;
        }
        .search-wrap input::placeholder { color: var(--muted); }

        .cards {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 18px 22px;
          display: grid;
          grid-template-columns: 1.8fr 1.1fr 1fr 1.6fr;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 10px -6px rgba(0,0,0,0.06);
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -10px rgba(0,0,0,0.14);
          border-color: var(--amber);
        }
        .product-card.warn { border-left: 4px solid var(--terracotta); }
        .product-card:not(.warn) { border-left: 4px solid var(--mint); }

        .id-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: var(--ink-soft);
          background: var(--surface-soft);
          padding: 3px 9px;
          border-radius: 999px;
          display: inline-block;
        }

        .prod-name {
          font-weight: 700;
          font-size: 15px;
          margin-top: 7px;
        }

        .col-label {
          font-size: 10.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 5px;
        }

        .hpp-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          color: var(--ink-soft);
        }

        .margin-input-wrap { position: relative; width: fit-content; }

        .margin-input {
          width: 90px;
          background: var(--surface-soft);
          border: 1.5px solid var(--border);
          color: var(--ink);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 9px 26px 9px 12px;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .margin-input:focus { border-color: var(--amber); background: #fff; }
        .margin-input.warn { border-color: var(--terracotta); background: var(--terracotta-soft); }

        .pct-suffix {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: var(--muted);
          pointer-events: none;
        }

        .warn-note {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          color: var(--terracotta);
          margin-top: 7px;
          font-weight: 600;
        }

        .price-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 700;
          color: var(--amber-deep);
        }

        .gauge {
          margin-top: 10px;
          height: 7px;
          border-radius: 999px;
          background: var(--surface-soft);
          overflow: hidden;
        }

        .gauge-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--mint), #5fb98c);
          transition: width 0.25s ease;
        }
        .gauge-fill.warn { background: linear-gradient(90deg, var(--terracotta), #e08274); }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: var(--muted);
          background: var(--surface-soft);
          border-radius: 20px;
        }

        @media (max-width: 860px) {
          .product-card { grid-template-columns: 1fr; }
          .header-card { flex-direction: column; align-items: flex-start; }
          .stat-row { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .save-btn, .gauge-fill, .product-card, .stat-card { transition: none; }
        }
      `}</style>

      <div className="header-card">
        <div>
          <p className="eyebrow"><Sparkles size={12} /> Buku Harga · Produksi</p>
          <h1 className="title">Harga Jual Produk</h1>
          <p className="subtitle">
            Atur margin tiap produk — harga jual dihitung otomatis dari HPP.
          </p>
        </div>
        <div>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
          {savedAt && (
            <p className="saved-note">
              ✓ Tersimpan {savedAt.toLocaleTimeString("id-ID")}
            </p>
          )}
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon amber"><PackageSearch size={17} /></div>
          <p className="stat-label">Total Produk</p>
          <p className="stat-value">{stats.count}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon mint"><TrendingUp size={17} /></div>
          <p className="stat-label">Rata-rata Margin</p>
          <p className="stat-value">{stats.avgMargin.toFixed(0)}%</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><TrendingUp size={17} /></div>
          <p className="stat-label">Potensi Profit/Pcs</p>
          <p className="stat-value">Rp {fmt(stats.totalProfit)}</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} />
          <input
            placeholder="Cari produk atau ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="empty-state">Memuat data...</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          Belum ada produk yang cocok. Coba kata kunci lain.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="cards">
          {filtered.map((item) => {
            const realIndex = data.indexOf(item);
            const isLow = item.margin <= 100;
            const fillPct = Math.min(100, Math.max(8, (item.margin / 300) * 100));

            return (
              <div className={`product-card ${isLow ? "warn" : ""}`} key={item.produk_id}>
                <div>
                  <span className="id-pill">{item.produk_id}</span>
                  <div className="prod-name">{item.nama_produk_jadi}</div>
                </div>

                <div>
                  <p className="col-label">HPP / Pcs</p>
                  <span className="hpp-val">Rp {fmt(item.hpp_per_pcs)}</span>
                </div>

                <div>
                  <p className="col-label">Margin</p>
                  <div className="margin-input-wrap">
                    <input
                      type="number"
                      min="100"
                      className={`margin-input ${isLow ? "warn" : ""}`}
                      value={item.margin}
                      onChange={(e) => handleMarginChange(item.produk_id, e.target.value)}
                    />
                    <span className="pct-suffix">%</span>
                  </div>
                  {isLow && (
                    <div className="warn-note">
                      <AlertTriangle size={11} /> Min 100%
                    </div>
                  )}
                </div>

                <div>
                  <p className="col-label">Harga Jual</p>
                  <span className="price-val">Rp {fmt(item.harga_jual)}</span>
                  <div className="gauge">
                    <div
                      className={`gauge-fill ${isLow ? "warn" : ""}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}