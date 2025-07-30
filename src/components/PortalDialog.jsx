import { useState } from "react";
import { Link } from "react-router";

export default function PortalDialog({ onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Simulate a delay for loading
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm">
      {/* Header */}
      <div className="bg-orange-soft p-5">
        <h2 className="text-xl font-bold text-black text-center">
          Masuk Portal Sebagai
        </h2>
      </div>

      {/* Options */}
      <div className="p-6 space-y-4">
        {/* Sekolah Option */}
        <Link
          to="/login/school"
          onClick={() => handleOptionSelect("sekolah")}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedOption === "sekolah"
              ? "border-orange-soft-700 bg-orange-soft-100"
              : "border-gray-200 hover:border-orange-soft"
          }`}
        >
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="ml-4">
            <h3 className="font-bold text-lg text-gray-800">Sekolah</h3>
            <p className="text-gray-600 mt-1">Admin sekolah dan operator</p>
          </div>
        </Link>

        {/* Siswa Option */}
        <Link
          to="/login/student"
          onClick={() => handleOptionSelect("siswa")}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedOption === "siswa"
              ? "border-orange-soft-700 bg-orange-soft-100"
              : "border-gray-200 hover:border-orange-soft"
          }`}
        >
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="ml-4">
            <h3 className="font-bold text-lg text-gray-800">Siswa</h3>
            <p className="text-gray-600 mt-1">Calon peserta didik baru</p>
          </div>
        </Link>
        {/* <div
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedOption === "siswa"
              ? "border-orange-soft-700 bg-orange-soft-100"
              : "border-gray-200 hover:border-orange-soft"
          }`}
          onClick={() => handleOptionSelect("siswa")}
        >
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="ml-4">
            <h3 className="font-bold text-lg text-gray-800">Siswa</h3>
            <p className="text-gray-600 mt-1">Calon peserta didik baru</p>
          </div>
        </div> */}
      </div>

      {/* Loading Indicator */}
      {selectedOption && (
        <div className="p-4 bg-gray-50 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-soft"></div>
        </div>
      )}
    </div>
  );
}
