import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";

const Price = () => {
  const paket = [
    {
      nama: "Dasar",
      harga: "Rp500.000 / Tahun",
      fitur: ["1 Jalur Pendaftaran", "500 Pendaftar", "Verifikasi Manual"],
    },
    {
      nama: "Standar",
      harga: "Rp1.000.000 / Tahun",
      fitur: [
        "Semua Jalur",
        "2000 Pendaftar",
        "Dashboard Statistik",
        "Laporan Excel & PDF",
      ],
    },
    {
      nama: "Premium",
      harga: "Rp2.500.000 / Tahun",
      fitur: ["Tak Terbatas", "Integrasi API", "Support WA Prioritas"],
    },
  ];

  return (
    <LandingPageLayout>
      <section className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Harga Paket</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {paket.map((p, i) => (
            <div key={i} className="border p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold">{p.nama}</h2>
              <p className="text-orange-500 font-bold">{p.harga}</p>
              <ul className="mt-4 list-disc ml-6">
                {p.fitur.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </LandingPageLayout>
  );
};

export default Price;
