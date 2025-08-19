import React, { useState } from "react";
import LandingPageLayout from "@/layouts/LandingPageLayout";
import { MapPin } from "lucide-react";

const LandingPage = () => {
  const [year, setYear] = useState("Tahun Ajaran 2024 / 2025");

  const stats = { districts: 147, schools: 7924 };
  const topRegions = [
    { name: "Prov. Jawa Tengah", count: 596 },
    { name: "Provinsi DKI Jakarta", count: 2173 },
    { name: "Prov. Banten", count: 256 },
  ];

  const longest = [
    { name: "Provinsi DKI Jakarta", years: 19 },
    { name: "Kota Yogyakarta", years: 18 },
    { name: "Kabupaten Gresik", years: 13 },
  ];
  const easternmost = [
    "Kota Jayapura",
    "Provinsi Maluku Utara",
    "Kabupaten Biak Numfor",
  ];
  const summary = { provinces: 14, cities: 36, schools: 5454 };

  return (
    <LandingPageLayout>
      <div className="overflow-y-auto">
        {/* Hero Section */}
        <section className="bg-[#FFF4EE] flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-16 gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-snug">
              Situs <span className="text-orange-soft">PPDB Online</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Menampilkan rekam jejak daerah pengguna PPDB Online di tahun
              sebelumnya. Pilih tahun ajaran:
            </p>
            <div className="mt-6 inline-block relative">
              <select
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option>Tahun Ajaran 2020 / 2021</option>
                <option>Tahun Ajaran 2021 / 2022</option>
                <option>Tahun Ajaran 2022 / 2023</option>
                <option>Tahun Ajaran 2023 / 2024</option>
                <option>Tahun Ajaran 2024 / 2025</option>
              </select>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/assets/landing-illustration.svg"
              alt="Illustration"
              className="w-full max-w-xs sm:max-w-md md:max-w-lg"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Peserta SIAP PPDB Online
            </h2>
            <p className="mt-4 text-gray-600">
              Total Dinas Pendidikan:{" "}
              <span className="font-bold text-orange-600">
                {stats.districts}
              </span>
            </p>
            <p className="mt-2 text-gray-600">
              Total Sekolah:{" "}
              <span className="font-bold text-orange-600">{stats.schools}</span>
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              Daerah dengan jumlah sekolah terbanyak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topRegions.map((r) => (
                <div
                  key={r.name}
                  className="p-4 bg-white rounded-lg shadow text-center"
                >
                  <MapPin className="text-orange-600 text-2xl mx-auto" />
                  <h4 className="mt-2 font-medium text-gray-800">{r.name}</h4>
                  <p className="text-orange-600 font-semibold">
                    {r.count} sekolah
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Side Lists & Summary */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                3 Daerah Terlama
              </h4>
              <ul className="space-y-2">
                {longest.map((u) => (
                  <li
                    key={u.name}
                    className="flex justify-between bg-white px-4 py-2 rounded-lg"
                  >
                    <span>{u.name}</span>
                    <span>{u.years} Tahun</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                3 Daerah Paling Timur
              </h4>
              <ul className="space-y-2">
                {easternmost.map((name) => (
                  <li
                    key={name}
                    className="flex items-center bg-white px-4 py-2 rounded-lg"
                  >
                    <MapPin className="text-orange-600 mr-2" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                SIAP PPDB Online {year}
              </h4>
              <p className="text-gray-600 mb-4">
                Melayani sejak tahun 2003 dengan layanan maksimal.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-2xl font-bold text-orange-600">
                    {summary.provinces}
                  </span>
                  <span className="block text-gray-700">Provinsi</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-orange-600">
                    {summary.cities}
                  </span>
                  <span className="block text-gray-700">Kab./Kota</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-orange-600">
                    {summary.schools}
                  </span>
                  <span className="block text-gray-700">Sekolah</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default LandingPage;
