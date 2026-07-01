import { useState } from "react";
import { Tag } from "lucide-react";

function ProductInput({ productName, setProductName }) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    setProductName(e.target.value);
  };

  const filled = !!productName;

  return (
    <div className="prod-input-card">
      <style>{`
        .prod-input-card {
          background: #fff;
          border: 1px solid #ece9f7;
          border-radius: 24px;
          padding: 22px 24px;
          margin-bottom: 24px;
        }

        .prod-input-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .prod-input-icon {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #eef0ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .prod-input-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a1d1f;
        }

        .prod-input-wrap {
          position: relative;
        }

        .prod-input-wrap input {
          width: 100%;
          border: 1.5px solid #e7e9ec;
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 500;
          color: #1a1d1f;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          background: #fafafd;
        }

        .prod-input-wrap input::placeholder {
          color: #b3b9c2;
          font-weight: 400;
        }

        .prod-input-wrap input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px #eef0ff;
          background: #fff;
        }

        .prod-input-wrap.filled input {
          border-color: #c9cdfb;
          background: #fff;
        }

        .prod-input-bar {
          position: absolute;
          left: 16px;
          bottom: -1px;
          height: 2px;
          background: #4f46e5;
          border-radius: 2px;
          width: 0;
          transition: width 0.25s ease;
        }
        .prod-input-bar.active {
          width: calc(100% - 32px);
        }

        .prod-input-hint {
          font-size: 11.5px;
          color: #98a2ac;
          margin-top: 8px;
        }
      `}</style>

      <div className="prod-input-label-row">
        <div className="prod-input-icon">
          <Tag size={14} />
        </div>
        <label className="prod-input-label">Nama Produk</label>
      </div>

      <div className={`prod-input-wrap ${filled ? "filled" : ""}`}>
        <input
          type="text"
          value={productName || ""}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Masukkan nama produk baru"
        />
        <div className={`prod-input-bar ${focused ? "active" : ""}`} />
      </div>

      <p className="prod-input-hint">
        Nama ini akan dipakai sebagai identitas produk di seluruh perhitungan HPP.
      </p>
    </div>
  );
}

export default ProductInput;