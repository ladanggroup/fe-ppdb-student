// src/components/student/register/VerifyReview.jsx
import useAuthStore from "@/store/authStore";
import formatIdr from "@/utils/formatIdr";
import React, { useEffect } from "react";
import { Link } from "react-router";

export default function VerifyReview({ formData }) {
  const docs = formData.uploaded_documents || [];
  const { user: student, meStudent } = useAuthStore();

  useEffect(() => {
    const fetchStudentData = async () => {
      await meStudent();
    };
    fetchStudentData();
  }, [meStudent]);

  const renderValue = (value) =>
    value ? (
      <span className="font-medium text-gray-900">{value}</span>
    ) : (
      <span className="text-gray-400 italic">-</span>
    );

  function renderWrappedText(text) {
    if (!text) return null;

    const words = text.trim().split(/\s+/);
    if (words.length < 3) {
      // kurang dari 3 kata => tampil apa adanya
      return <span>{text}</span>;
    }

    const third = words[2];
    const isThirdNumber = /^\d+$/.test(third); // murni angka (02, 2, 123)
    // treat short tokens like "and", "&", "dan" as "keep with first line"
    const isShortToken = third.length <= 3;

    // jika tepat 3 kata dan kata ke-3 angka -> jangan pisah (tetap satu baris)
    if (words.length === 3 && isThirdNumber) {
      return <span>{text}</span>;
    }

    // tentukan jumlah kata di baris pertama: 2 atau 3
    const firstLineCount = isThirdNumber || isShortToken ? 3 : 2;

    const firstPart = words.slice(0, firstLineCount).join(" ");
    const remaining = words.slice(firstLineCount);

    // bagi remaining menjadi baris maksimal 3 kata per baris
    const lines = [];
    for (let i = 0; i < remaining.length; i += 3) {
      lines.push(remaining.slice(i, i + 3).join(" "));
    }

    return (
      <div className="flex flex-col leading-tight">
        <span>{firstPart}</span>
        {lines.map((line, idx) => (
          <span key={idx}>{line}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 p-4">
        {/* ===================== Data Pribadi ===================== */}
        <section className="border-b pb-14">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Data Pribadi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 text-sm relative">
            <div>
              <p>Nama Lengkap</p>
              {renderValue(student.name)}
            </div>
            <div>
              <p>Jenis Kelamin</p>
              {renderValue(student.gender)}
            </div>
            <div>
              <p>Agama</p>
              {renderValue(student.religion)}
            </div>
            <div>
              <p>Nomor Telepon</p>
              {renderValue(student.phone)}
            </div>
            <div>
              <p>NISN</p>
              {renderValue(student.nisn)}
            </div>
                        <div>
              <p>Jenis Pendaftaran</p>
              {renderValue(
                student.registration_type === "baru" ? "Siswa Baru" : "Pindahan"
              )}
            </div>
            <div>
              <p>Tempat Lahir</p>
              {renderValue(student.birth_place)}
            </div>
            <div>
              <p>Tanggal Lahir</p>
              {renderValue(
                student.birth_date
                  ? new Date(student.birth_date).toLocaleDateString("id-ID")
                  : null
              )}
            </div>
            <div>
              <p>Asal Sekolah</p>
              {renderWrappedText(student.school_origin)}
            </div>

            {/* Foto Profil */}
            {student.avatar && (
              <div className="md:absolute md:top-0 md:right-0 lg:right-1 flex flex-col items-center md:mt-0 mt-4">
                <img
                  src={student.image}
                  alt="Foto Siswa"
                  className="w-56 h-56 rounded-md object-cover border"
                />
              </div>
            )}
          </div>
        </section>

        {/* ===================== Alamat Domisili ===================== */}
        <section className="border-b pb-14 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Alamat Domisili
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 text-sm">
            <div>
              <p>Provinsi</p>
              {renderValue(student.provinces?.name)}
            </div>
            <div>
              <p>Kota / Kabupaten</p>
              {renderValue(student.cities?.name)}
            </div>
            <div>
              <p>Kecamatan</p>
              {renderValue(student.districts?.name)}
            </div>
            <div>
              <p>Alamat Lengkap</p>
              {renderValue(student.address)}
              {", "}
              {renderValue(student.postal_code)}
            </div>
          </div>
        </section>

        {/* ===================== Data Orang Tua / Wali ===================== */}
        <section className="border-b pb-14 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Data Orang Tua / Wali
          </h2>

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            <span className="inline-block border-b-2 border-gray-600 pb-1 px-2">
              Ayah
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 text-sm mb-10">
            <div>
              <p className="font-semibold text-gray-700">Nama Ayah</p>
              {renderValue(formData?.father_name) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Telepon Ayah</p>
              {renderValue(formData?.father_phone) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pekerjaan Ayah</p>
              {renderValue(formData?.father_job) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pendidikan Ayah</p>
              {renderValue(formData?.father_education) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Penghasilan Ayah</p>
              {renderValue(formatIdr(formData?.father_income)) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Alamat Ayah</p>
              {renderValue(formData?.father_address) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            <span className="inline-block border-b-2 border-gray-600 pb-1 px-2">
              Ibu
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Nama Ibu</p>
              {renderValue(formData?.mother_name) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Telepon Ibu</p>
              {renderValue(formData?.mother_phone) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pekerjaan Ibu</p>
              {renderValue(formData?.mother_job) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pendidikan Ibu</p>
              {renderValue(formData?.mother_education) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Penghasilan Ibu</p>
              {renderValue(formatIdr(formData?.mother_income)) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Alamat Ibu</p>
              {renderValue(formData?.mother_address) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-6 mt-8">
            <span className="inline-block border-b-2 border-gray-600 pb-1 px-2">
              Wali
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Nama Wali</p>
              {renderValue(formData?.guardian_name)}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Telepon Wali</p>
              {renderValue(formData?.guardian_phone) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pekerjaan Wali</p>
              {renderValue(formData?.guardian_job) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pendidikan Wali</p>
              {renderValue(formData?.guardian_education) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Penghasilan Wali</p>
              {renderValue(formatIdr(formData?.guardian_income)) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Alamat Wali</p>
              {renderValue(formData?.guardian_address) || (
                <span className="text-red-500">Belum diisi</span>
              )}
            </div>
          </div>
        </section>

        {/* ===================== Dokumen ===================== */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Dokumen</h2>
          {docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 text-sm">
              {docs.map((doc, index) => (
                <div key={index}>
                  <p className="font-medium text-gray-800">{doc.doc_name}</p>
                  <p className="text-gray-600">
                    {doc.path ? doc.path.split("/").pop() : "-"}
                  </p>
                  {doc.path && (
                    <Link
                      to={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Lihat Dokumen
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              Tidak ada dokumen yang diunggah.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}