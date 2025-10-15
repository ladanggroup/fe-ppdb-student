import { useState, useEffect } from "react";
import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import useProductStore from "@/store/useProductStore";
import formatIdr from "@/utils/formatIdr";

const Price = () => {
  const { products, fetchProducts } = useProductStore();
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const faqs = [
    {
      q: "Apakah bisa upgrade paket?",
      a: "Ya, Anda dapat upgrade paket kapan saja sesuai kebutuhan sekolah.",
    },
    {
      q: "Apakah harga berlaku per siswa?",
      a: "Tidak, harga paket berlaku per sekolah, bukan per siswa.",
    },
    {
      q: "Apakah ada support teknis?",
      a: "Ya, semua paket mendapatkan dukungan teknis selama masa langganan.",
    },
  ];

  return (
    <LandingPageLayout>
      <section className="bg-gradient-to-b from-orange-100 to-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Siap <span className="text-orange-500">Digitalisasi</span> PPDB di
            Sekolah Anda?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Sesuaikan kebutuhan PPDB digital Anda dengan paket yang fleksibel
            untuk berbagai skala sekolah.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {products?.length > 0 ? (
          products.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`relative bg-white border rounded-2xl shadow-md hover:shadow-lg transition-all ${
                i === 1 ? "border-orange-500 scale-105" : "border-gray-200"
              }`}
            >
              {i === 1 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
                  Favorit Sekolah
                </div>
              )}

              <div className="p-8 text-center">
                <h3 className="text-xl font-bold mb-3">{pkg.name}</h3>
                <p className="text-3xl font-extrabold text-orange-500">
                  {formatIdr(pkg.price)}
                </p>
                <p className="text-gray-600 mb-4">/{pkg.duration} Tahun</p>

                <ul className="text-left text-gray-700 mb-8 space-y-2">
                  {pkg.features && pkg.features.length > 0 ? (
                    pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{f.name}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">
                      Fitur belum ditentukan
                    </li>
                  )}
                </ul>

                <Link
                  to="/school/register"
                  className={`w-full ${
                    i === 1
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-orange-400 hover:bg-orange-500"
                  } text-white font-semibold py-2 px-4 rounded-lg transition`}
                >
                  Langganan Sekarang
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            Memuat paket harga...
          </p>
        )}
      </section>

      <section className="container mx-auto px-6 py-12">
        <h3 className="text-center text-2xl font-semibold mb-6">
          Tabel Perbandingan Paket
        </h3>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="w-full border-collapse text-center text-gray-800">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                <th className="py-4 px-6 text-left font-semibold">Fitur</th>
                {products.map((p) => (
                  <th key={p.id} className="py-4 px-6 font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(() => {
                const allFeatures = [
                  ...new Set(
                    products.flatMap((p) =>
                      p.features ? p.features.map((f) => f.name) : []
                    )
                  ),
                ];

                return allFeatures.map((fitur, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-orange-50 transition`}
                  >
                    <td className="py-3 px-4 text-left font-medium text-gray-700">
                      {fitur}
                    </td>
                    {products.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        {p.features?.some((f) => f.name === fitur) ? (
                          <CheckCircle2 className="text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="text-red-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 bg-gray-50 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              FAQ Singkat
            </h3>
            <p className="text-gray-600 mb-6">
              Berikut beberapa jawaban mengenai langganan yang mungkin Anda
              butuhkan.
            </p>
            <Link
              to="/#"
              className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-xl"
            >
              Hubungi Kami
            </Link>
          </div>
          <div>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="mb-3 border rounded-lg bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-700"
                >
                  {faq.q}
                  <ChevronDown
                    className={`w-5 h-5 transform transition ${
                      openFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
};

export default Price;
