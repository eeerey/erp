"use client";

import { Package, Users, Layers, Receipt } from "lucide-react";

export default function SummaryCard({
  materials,
  labor,
  overhead,
  totalHPP,
  formatRupiah,
  sectionTotal,
  totalCone,
}) {
  const items = [
    {
      label: "Bahan Baku",
      value: sectionTotal(materials),
      icon: Package,
      accent: "#4f46e5",
      soft: "#eef0ff",
    },
    {
      label: "Tenaga Kerja",
      value: sectionTotal(labor, true),
      icon: Users,
      accent: "#0d9f6e",
      soft: "#e7f8f1",
    },
    {
      label: "Overhead",
      value: sectionTotal(overhead, true),
      icon: Layers,
      accent: "#d97706",
      soft: "#fef3e2",
    },
  ];

   const safeTotal = totalHPP > 0 ? totalHPP : 1;

const hppBatch = totalHPP;

const hppPerCone =
  totalCone > 0 ? totalHPP / totalCone : 0;

const results = [
  {
    label: "HPP / Batch",
    value: hppBatch,
  },
  {
    label: "HPP / Pcs",
    value: hppPerCone,
    highlight: true,
  },
];

  return (
    <div className="summary-card">
      <style>{`
        .summary-card {
          background: #fff;
          border: 1px solid #ece9f7;
          border-radius: 26px;
          padding: 28px;
        }

        .summary-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }

        .summary-icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #f3f0fb;
          color: #6d28d9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 800;
          color: #1a1d1f;
          margin: 0;
        }

        .summary-sub {
          font-size: 12px;
          color: #98a2ac;
          margin-top: 1px;
        }

        .summary-bar {
          display: flex;
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 22px;
          background: #f1f1f5;
        }

        .summary-bar-seg {
          height: 100%;
          transition: width 0.3s ease;
        }

        .summary-rows {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 4px;
          border-bottom: 1px solid #f3f3f6;
        }

        .summary-row-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .summary-row-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-row-label {
          font-size: 13.5px;
          color: #5b6670;
          font-weight: 600;
        }

        .summary-row-pct {
          font-size: 11px;
          color: #aab1ba;
        }

        .summary-row-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 14px;
        }

        .summary-total-row {
          margin-top: 12px;
          padding: 18px;
          border-radius: 18px;
          background: linear-gradient(135deg, #4338ca, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .summary-total-label {
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          font-weight: 600;
        }

        .summary-total-value {
          font-family: 'JetBrains Mono', monospace;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

      .summary-extra {
  margin-top: 18px;
  border-top: 1px solid #ececec;
  padding-top: 18px;
}

.summary-extra-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.summary-extra-label {
  font-size: 13px;
  color: #5b6670;
  font-weight: 600;
}

.summary-extra-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 17px;
  font-weight: 800;
  color: #4f46e5;
}

      `}</style>

      <div className="summary-head">
        <div className="summary-icon">
          <Receipt size={17} />
        </div>
        <div>
          <h2 className="summary-title">Ringkasan HPP</h2>
          <p className="summary-sub">Komposisi biaya produksi</p>
        </div>
      </div>

      {/* PROPORTION BAR */}
      <div className="summary-bar">
        {items.map((item) => {
          const pct = (item.value / safeTotal) * 100;
          return (
            <div
              key={item.label}
              className="summary-bar-seg"
              style={{ width: `${pct}%`, background: item.accent }}
              title={`${item.label}: ${pct.toFixed(0)}%`}
            />
          );
        })}
      </div>

      <div className="summary-rows">
        {items.map((item) => {
          const Icon = item.icon;
          const pct = (item.value / safeTotal) * 100;
          return (
            <div className="summary-row" key={item.label}>
              <div className="summary-row-left">
                <div
                  className="summary-row-icon"
                  style={{ background: item.soft, color: item.accent }}
                >
                  <Icon size={14} />
                </div>
                <div>
                  <div className="summary-row-label">{item.label}</div>
                  <div className="summary-row-pct">{pct.toFixed(0)}% dari total</div>
                </div>
              </div>
              <span className="summary-row-value" style={{ color: item.accent }}>
                Rp {formatRupiah(item.value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="summary-total-row">
        <span className="summary-total-label">Total HPP</span>
        <span className="summary-total-value">Rp {formatRupiah(totalHPP)}</span>
      </div>
      <div className="summary-extra">
  {results.map((r) => (
    <div
      key={r.label}
      className={`summary-extra-row ${r.highlight ? "highlight" : ""}`}
    >
      <span className="summary-extra-label">
        {r.label}
      </span>

      <span className="summary-extra-value">
        Rp {formatRupiah(r.value)}
      </span>
    </div>
  ))}

</div>
    </div>
  );
}