import React, { useState } from 'react';
import LandingPageLayout from '@/layouts/LandingPageLayout';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router';
{/* <MapPin /> */}

const LandingPage = () => {
    const [year, setYear] = useState('2024 / 2025');
  // Dummy data; replace with API calls
  const stats = { districts: 147, schools: 7924 };
  const topRegions = [
    { name: 'Prov. Jawa Tengah', count: 596 },
    { name: 'Provinsi DKI Jakarta', count: 2173 },
    { name: 'Prov. Banten', count: 256 }
  ];
  const longest = [
    { name: 'Provinsi DKI Jakarta', years: 19 },
    { name: 'Kota Yogyakarta', years: 18 },
    { name: 'Kabupaten Gresik', years: 13 }
  ];
  const easternmost = [
    'Kota Jayapura',
    'Provinsi Maluku Utara',
    'Kabupaten Biak Numfor'
  ];
  const summary = { provinces: 14, cities: 36, schools: 5454 };

  return (
    <LandingPageLayout>
      {/* Stats Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Peserta SIAP PPDB Online</h2>
          <p className="mt-4 text-gray-600">Total Dinas Pendidikan: <span className="font-bold text-orange-600">{stats.districts}</span></p>
          <p className="mt-2 text-gray-600">Total Sekolah: <span className="font-bold text-orange-600">{stats.schools}</span></p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Daerah dengan jumlah sekolah terbanyak</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topRegions.map(r => (
              <div key={r.name} className="p-4 bg-white rounded-lg shadow text-center">
                <MapPin className="text-orange-600 text-2xl mx-auto" />
                <h4 className="mt-2 font-medium text-gray-800">{r.name}</h4>
                <p className="text-orange-600 font-semibold">{r.count} sekolah</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side Lists & Summary */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">3 Daerah Terlama</h4>
            <ul className="space-y-2">
              {longest.map(u => (
                <li key={u.name} className="flex justify-between bg-white px-4 py-2 rounded-lg">
                  <span>{u.name}</span>
                  <span>{u.years} Tahun</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">3 Daerah Paling Timur</h4>
            <ul className="space-y-2">
              {easternmost.map(name => (
                <li key={name} className="flex items-center bg-white px-4 py-2 rounded-lg">
                  <MapPin className="text-orange-600 mr-2" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">SIAP PPDB Online {year}</h4>
            <p className="text-gray-600 mb-4">Melayani sejak tahun 2003 dengan layanan maksimal.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="block text-2xl font-bold text-orange-600">{summary.provinces}</span>
                <span className="block text-gray-700">Provinsi</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-orange-600">{summary.cities}</span>
                <span className="block text-gray-700">Kab./Kota</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-orange-600">{summary.schools}</span>
                <span className="block text-gray-700">Sekolah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Arsip Peserta PPDB Online Indonesia</h4>
          <Link to="/arsip" className="inline-block bg-orange-soft-800 text-white px-6 py-3 rounded-lg hover:bg-orange-soft-500 transition">
            Lihat disini
          </Link>
        </div>
      </section>
    </LandingPageLayout>
  );
}

export default LandingPage;