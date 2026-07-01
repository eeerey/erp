"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Script from "next/script";

// TYPE SNAP
declare global {
  interface Window {
    snap: any;
  }
}

type PlanType = "Essential" | "Intermediate" | "Enterprise" | "Executive";

export default function VoucherPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [snapReady, setSnapReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const planParam = searchParams.get("plan");

  const plan: PlanType =
    planParam === "Essential" ||
    planParam === "Intermediate" ||
    planParam === "Enterprise" ||
    planParam === "Executive"
      ? planParam
      : "Executive";

  const packageData: Record<
    PlanType,
    {
      name: string;
      desc: string;
      price: number;
      features: string[];
    }
  > = {
    Essential: {
      name: "Paket Essential",
      desc: "Untuk UMKM yang baru mulai go-digital.",
      price: 75000,
      features: [
        "HR & Penggajian Otomatis",
        "Inventory",
        "Laporan Laba Rugi",
        "Multiple User",
      ],
    },
    Intermediate: {
      name: "Paket Intermediate",
      desc: "Untuk UMKM berkembang.",
      price: 89000,
      features: ["Semua Essential", "Produksi", "Tracking"],
    },
    Enterprise: {
      name: "Paket Enterprise",
      desc: "Fitur lengkap bisnis.",
      price: 159000,
      features: ["Semua fitur", "Analitik penjualan", "Support prioritas"],
    },
    Executive: {
      name: "Paket Intermediate Executive",
      desc: "Fitur lengkap bisnis.",
      price: 129000,
      features: ["Semua fitur", "Analitik penjualan", "Support prioritas"],
    },
  };

  const data = packageData[plan];

  const formattedPrice = useMemo(() => {
    return data.price.toLocaleString("id-ID");
  }, [data.price]);

  // HANDLE PAYMENT
  const handlePayment = async () => {
    try {
      if (!snapReady || !window.snap) {
        alert("Payment belum siap, tunggu 1-2 detik");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:8000/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: data.name,
          price: data.price,
        }),
      });

      const result = await res.json();

      console.log("MIDTRANS RESPONSE:", result);

      if (!result.data?.token) {
        alert("Token Midtrans tidak ditemukan");
        setLoading(false);
        return;
      }

      window.snap.pay(result.data.token, {
        onSuccess: () => {
          alert("Pembayaran berhasil!");
          router.push("/dashboard");
        },
        onPending: () => {
          alert("Menunggu pembayaran...");
          setLoading(false);
        },
        onError: () => {
          alert("Pembayaran gagal!");
          setLoading(false);
        },
        onClose: () => {
          alert("Kamu menutup pembayaran");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <>
      {/* MIDTRANS SNAP */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onLoad={() => setSnapReady(true)}
      />

      <div className="min-h-screen bg-gray-100 pb-32">

        {/* HEADER */}
        <div className="bg-white shadow-sm px-6 py-4 text-lg font-semibold">
          Premium ERP
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto p-4 space-y-4">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold">{data.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{data.desc}</p>

            <div className="mt-4 text-blue-600 font-bold text-xl">
              Rp {formattedPrice}
            </div>

            <ul className="mt-4 space-y-1 text-sm">
              {data.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">

            {/* KIRI (opsional tetap total summary bisa juga di sini kalau mau) */}
            <div></div>

            {/* KANAN */}
            <div className="flex flex-col items-end gap-1">

              {/* TOTAL DI ATAS */}
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-bold text-lg">
                Rp {formattedPrice}
              </div>

              {/* BUTTON DI BAWAH */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>

            </div>

          </div>
        </div>

      </div>
    </>
  );
}