// src/components/student/register/VerifyReview.jsx
import useAuthStore from "@/store/authStore";
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

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* ===================== Data Pribadi ===================== */}
        <section className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Data Pribadi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 text-sm relative">
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
              <p>Asal Sekolah</p>
              {renderValue(student.school_origin)}
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
              <p>Jenis Pendaftaran</p>
              {renderValue(
                student.registration_type === "baru"
                  ? "Siswa Baru"
                  : "Pindahan"
              )}
            </div>

            {/* Foto Profil */}
            {student.avatar && (
              <div className="absolute top-0 right-16 flex flex-col items-center">
                <img
                  src={student.image}
                  alt="Foto Siswa"
                  className="w-40 h-44 rounded-md object-cover border"
                />
              </div>
            )}
          </div>
        </section>

        {/* ===================== Alamat Domisili ===================== */}
        <section className="border-b pb-4">
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
              {renderValue(student.address)}{", "}{renderValue(student.postal_code)}
            </div>
          </div>
        </section>

        {/* ===================== Dokumen ===================== */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Dokumen</h2>
          {docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm">
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
