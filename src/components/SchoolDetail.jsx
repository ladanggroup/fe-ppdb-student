import { Button } from "@/components/ui/button";
import formatIdr from "@/utils/formatIdr";
import { capitalizeWords } from "@/utils/string";
import { Link } from "react-router";

export default function SchoolDetail({ school, wave, onBack }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 bg-gray-50 min-h-screen">
      {/* Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-lg font-semibold text-center border-b border-gray-200 pb-2 text-gray-700 mb-6">
          Detail Sekolah
        </h1>
        {/* Header Sekolah */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-orange-soft-100 rounded-full">
            <img
              src={school.logo_url || "/src/assets/Group 1078.png"}
              alt={school.name}
              className="w-14 h-14 object-cover rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{school.name}</h2>
        </div>

        {/* Alamat */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800">Alamat</h3>
          <p className="text-sm text-gray-600">
            {school.address}, {capitalizeWords(school.districts?.name)}
          </p>
          <p className="text-sm text-gray-600">
            {capitalizeWords(school.cities?.name)}, {capitalizeWords(school.provinces?.name)}, {school.postal_code}
          </p>
        </div>

        {/* Info Biaya, Gelombang, Pagu */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-600">Biaya Pendaftaran</p>
            <p className="text-orange-600 font-bold text-lg">
              {formatIdr(wave.price)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{wave.name}</p>
            <p className="font-medium">
              {new Date(wave.start_date).toLocaleDateString("id")} - {new Date(wave.end_date).toLocaleDateString("id")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Kuota Tersisa</p>
            <p className="font-medium">{wave.quota} Murid</p>
          </div>
        </div>

        {/* Dokumen */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800">
            Dokumen Yang Perlu Disiapkan
          </h3>
          <ul
            className={`ml-6 text-sm text-gray-600 ${
              school.document_requirements?.length > 3
                ? "grid grid-cols-2 gap-x-8 list-disc list-inside"
                : "list-disc"
            }`}
          >
            {school.document_requirements?.map((doc, i) => (
              <li key={i}>{doc.name}</li>
            ))}
          </ul>
        </div>

        {/* Keterangan */}
        <div>
          <h3 className="font-semibold text-gray-800">Keterangan</h3>
          <p className="text-sm text-gray-600">{wave.description || "Tidak ada deskripsi"}</p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex w-full max-w-3xl justify-between mt-6">
        <Button
          variant="secondary"
          onClick={onBack}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-1/3"
        >
          Kembali
        </Button>
        <Link
          to={"/student/complete-registration"}
          className="bg-orange-soft-700 hover:bg-orange-600 text-white w-1/3 flex items-center justify-center rounded-lg"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
