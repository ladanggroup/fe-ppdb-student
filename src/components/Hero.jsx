import React, { useState } from 'react';

export default function Hero() {
  const [year, setYear] = useState('Tahun Ajaran 2024 / 2025');
  return (
    <section className="bg-[#FFF4EE] flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl px-4 py-16 gap-8">
      <div className="md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Situs <span className="text-orange-soft">PPDB Online</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Menampilkan rekam jejak daerah pengguna PPDB Online di tahun sebelumnya. Pilih tahun ajaran:
        </p>
        <div className="mt-6 inline-block relative">
          <select
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700"
            value={year}
            onChange={e => setYear(e.target.value)}
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
        <img src="/assets/landing-illustration.svg" alt="Illustration" className="w-full max-w-md" />
      </div>
    </section>
  );
}