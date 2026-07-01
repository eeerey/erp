"use client";

const { useState, useEffect } = require("react");
const { Save, Sliders } = require("lucide-react");

function InfoCard({
  totalHPP = 0,
  totalCone,
  setTotalCone,
  onSave,
}) {
  // ======================
  // INPUT
  // ======================
  const [gajiPegawai, setGajiPegawai] = useState(2500000);
  const [jamKerjaHarian, setJamKerjaHarian] = useState(8);
  const [hariKerja, setHariKerja] = useState(22);
  const [totalLiterProduksi, setTotalLiterProduksi] = useState(5);

  // ======================
  // HASIL
  // ======================
  const [gajiPerJam, setGajiPerJam] = useState(0);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID").format(number || 0);

  useEffect(() => {
    const resultGajiPerJam =
      gajiPegawai / (jamKerjaHarian * hariKerja);

    setGajiPerJam(resultGajiPerJam);
  }, [gajiPegawai, jamKerjaHarian, hariKerja]);

  const results = [
    {
      label: "Gaji Pegawai / Jam",
      value: gajiPerJam,
    },
  ];

  const fields = [
    {
      label: "Gaji Pegawai",
      value: gajiPegawai,
      set: setGajiPegawai,
      suffix: "/ bulan",
    },
    {
      label: "Jam Kerja Harian",
      value: jamKerjaHarian,
      set: setJamKerjaHarian,
      suffix: "jam",
    },
    {
      label: "Hari Kerja / Bulan",
      value: hariKerja,
      set: setHariKerja,
      suffix: "hari",
    },
    {
      label: "Total (Liter, kg)",
      value: totalLiterProduksi,
      set: setTotalLiterProduksi,
      suffix: "",
    },
    {
      label: "Total Pcs",
      value: totalCone,
      set: setTotalCone,
      suffix: "pcs",
    },
  ];

  return (
    <div className="info-card">
      <style>{`
        .info-card {
          background: #fff;
          border: 1px solid #ece9f7;
          border-radius: 26px;
          padding: 28px;
          box-shadow: 0 4px 18px -10px rgba(79,70,229,0.18);
        }

        .info-card-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }

        .info-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #eef0ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #1a1d1f;
          margin: 0;
        }

        .info-card-sub {
          font-size: 12px;
          color: #98a2ac;
          margin-top: 1px;
        }

        .info-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width:540px){
          .info-field-grid{
            grid-template-columns:1fr;
          }
        }

        .info-field label{
          display:block;
          margin-bottom:6px;
          font-size:12.5px;
          font-weight:600;
          color:#5b6670;
        }

        .info-field-wrap{
          position:relative;
        }

        .info-field-wrap input{
          width:100%;
          border:1.5px solid #e7e9ec;
          border-radius:14px;
          padding:11px 14px;
          font-size:14px;
          font-family:'JetBrains Mono', monospace;
          outline:none;
          transition:.2s;
        }

        .info-field-wrap input:focus{
          border-color:#4f46e5;
          box-shadow:0 0 0 4px #eef0ff;
        }

        .info-field-suffix{
          position:absolute;
          right:14px;
          top:50%;
          transform:translateY(-50%);
          font-size:11px;
          color:#aab1ba;
        }

        .info-results{
          margin-top:26px;
          background:#fafafd;
          border:1px solid #f0f0f5;
          border-radius:20px;
          padding:8px 18px;
        }

        .info-result-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 0;
        }

        .info-result-label{
          font-size:13px;
          font-weight:600;
          color:#5b6670;
        }

        .info-result-value{
          font-family:'JetBrains Mono', monospace;
          font-size:15px;
          font-weight:700;
          color:#4f46e5;
        }

        .info-save-btn{
          margin-top:24px;
          width:100%;
          border:none;
          border-radius:16px;
          padding:16px;
          background:linear-gradient(135deg,#4338ca,#4f46e5);
          color:white;
          font-size:14px;
          font-weight:700;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:8px;
          cursor:pointer;
          transition:.2s;
        }

        .info-save-btn:hover{
          transform:translateY(-2px);
        }
      `}</style>

      <div className="info-card-head">
        <div className="info-card-icon">
          <Sliders size={17} />
        </div>

        <div>
          <h2 className="info-card-title">
            Informasi Tambahan
          </h2>

          <p className="info-card-sub">
            Parameter produksi & kalkulasi otomatis
          </p>
        </div>
      </div>

      <div className="info-field-grid">
        {fields.map((f) => (
          <div className="info-field" key={f.label}>
            <label>{f.label}</label>

            <div className="info-field-wrap">
              <input
                type="number"
                value={f.value}
                onChange={(e) => f.set(Number(e.target.value))}
              />

              {f.suffix && (
                <span className="info-field-suffix">
                  {f.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="info-results">
        {results.map((r) => (
          <div className="info-result-row" key={r.label}>
            <span className="info-result-label">
              {r.label}
            </span>

            <span className="info-result-value">
              Rp {formatRupiah(r.value)}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        className="info-save-btn"
      >
        <Save size={18} />
        Simpan HPP
      </button>
    </div>
  );
}

module.exports = InfoCard;