// src/pages/school/Student/Show.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import useSchoolStudent from "@/store/useSchoolStudent";
import useAuthStore from "@/store/authStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import RejectDialog from "@/components/RejectDialog";
import { confirmToast } from "@/components/ui/confirmToast";
import VerifySelectionDialog from "@/components/school/VerifySelectionDialog";
import { X } from "lucide-react";
import { Pencil } from "lucide-react";

const Show = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    detailStudent,
    verifyRegistration,
    rejectRegistration,
    verifySelection,
    rejectSelection,
    loading,
  } = useSchoolStudent();
  const { user } = useAuthStore();

  const [student, setStudent] = useState(null);
  const [schoolStudent, setSchoolStudent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await detailStudent(id, user.school_id);
      if (data) {
        setStudent(data);
        setSchoolStudent(data.school_students?.[0] || null);
      } else {
        setStudent(null);
        setSchoolStudent(null);
      }
    };
    loadData();
  }, [id, detailStudent, user.school_id]);

  const handleVerify = async () => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await verifyRegistration(schoolStudent.id);
        navigate("/school/student");
      },
      onCancel: () => {
        console.log("cancel");
      },
    });
  };

  const handleReject = async (note) => {
    await rejectRegistration(schoolStudent.id, note);
    navigate("/school/student");
  };

  const handleVerifySelection = async (destinationClass) => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await verifySelection(schoolStudent.id, destinationClass);
        navigate("/school/student");
      },
      onCancel: () => {
        console.log("cancel");
      },
    });
  };

  const handleRejectSelection = async (note) => {
    await rejectSelection(schoolStudent.id, note);
    navigate("/school/student");
  };
  console.log(student);

  if (loading || !student) {
    return (
      <DashboardLayout>
        <LoadingOverlay isLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detail Siswa</h1>
        <Button
          className="bg-sky-500 text-white hover:bg-sky-400 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Kembali
        </Button>
      </div>

      {/* Informasi Biodata */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Biodata Siswa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-start">
          <span className="font-medium">Nama:</span>
          <p>{student.name}</p>
          <span className="font-medium">NISN:</span>
          <p>{student.nisn}</p>
          <span className="font-medium">Email:</span>
          <p>{student.email}</p>
          <span className="font-medium">Telepon:</span>
          <p>{student.phone}</p>
          <span className="font-medium">Tempat/Tgl Lahir:</span>
          <p>
            {student.birth_place}, {student.birth_date}
          </p>
          <span className="font-medium">Jenis Kelamin:</span>
          <p>{student.gender}</p>
          <span className="font-medium">Asal Sekolah:</span>
          <p>{student.school_origin}</p>
          <span className="font-medium">Jenis Pendaftaran:</span>
          <p>
            {student.registration_type === "new"
              ? "Siswa Baru"
              : "Siswa Pindahan"}
          </p>
          <span className="font-medium">No. Registrasi:</span>
          <p>{student.school_students?.[0]?.registration_number}</p>
          <span className="font-medium">Status:</span>
          {schoolStudent.selection_status === "verify" ? (
            <p className="text-blue-500 flex items-center gap-2">
              Menunggu Verifikasi
            </p>
          ) : schoolStudent.selection_status ===
            "data_received_awaiting_selection" ? (
            <p className="text-yellow-500 flex items-center gap-2">
              Data Diterima, Menunggu Seleksi
            </p>
          ) : schoolStudent.selection_status === "passed_selection" ? (
            <p className="text-green-500 flex items-center gap-2">
              Lulus Seleksi
            </p>
          ) : schoolStudent.selection_status ===
            "rejected_data_does_not_match" ? (
            <p className="text-red-500 flex items-center gap-2">
              Ditolak, Data Tidak Sesuai
            </p>
          ) : (
            <p className="text-gray-500 flex items-center gap-2">
              Gagal Seleksi
            </p>
          )}
          <span className="font-medium">Alamat:</span>
          <p>
            {student.address}
            <br />
            {student?.districts?.name}, {student?.cities?.name},{" "}
            {student?.provinces?.name}
          </p>
          <span className="font-medium">Catatan:</span>
          <p className="text-red-500">{schoolStudent.note || "-"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dokumen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dokumen</h2>
          {student.documents?.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {student.documents.map((doc) => (
                <li key={doc.id}>
                  <Link
                    to={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {doc.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Belum ada dokumen diunggah</p>
          )}
        </div>

        {/* {Pembayaran} */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Pembayaran
          </h2>
          {student.payments?.length > 0 ? (
            <>
              {/* Pembayaran Melalui Bank */}
              <div className="text-left grid grid-cols-2 mb-4">
                {student.payments?.map((payment) => (
                  <div key={payment.id}>
                    <p className="text-md">
                      <span className="font-semibold">Bank:</span>{" "}
                      {payment.bank?.name}
                    </p>
                    <p className="text-md">
                      <span className="font-semibold">No. Rekening:</span>{" "}
                      {payment.bank?.account_number}
                    </p>
                    <p className="text-md">
                      <span className="font-semibold">Atas Nama:</span>{" "}
                      {payment.bank?.account_name}
                    </p>
                  </div>
                ))}
                <ul className="list-disc pl-6 space-y-2">
                  {student.payments?.map((payment) => (
                    <li key={payment.id}>
                      {payment.payment_number}
                      <Link
                        to={payment.document?.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-2"
                      >
                        {payment.document?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Belum ada pembayaran diunggah</p>
          )}
        </div>
      </div>

      {/* Info Gelombang */}
      {schoolStudent.wave && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Informasi Gelombang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-start">
            <span className="font-medium">Nama:</span>{" "}
            <p className="">{schoolStudent.wave.name}</p>
            <span className="font-medium">Periode:</span>{" "}
            <p className="">
              {schoolStudent.wave.start_date} - {schoolStudent.wave.end_date}
            </p>
            <span className="font-medium">Kuota:</span>{" "}
            <p className="">{schoolStudent.wave.quota}</p>
            <span className="font-medium">Harga:</span>{" "}
            <p className="">{formatIdr(schoolStudent.wave.price)}</p>
            <span className="font-medium">Keterangan:</span>{" "}
            <p className="">{schoolStudent.wave.description}</p>
          </div>
        </div>
      )}

      {/* Tombol Aksi */}
      {(student.status === "active" && schoolStudent.selection_status === "verify") && (
        <div className="flex justify-end gap-4">
          <Button
            className="bg-sky-500 text-white hover:bg-sky-400 flex items-center gap-2"
            onClick={handleVerify}
          >
            Verifikasi
          </Button>
          <RejectDialog onConfirm={(note) => handleReject(note)} />
        </div>
      )}
      {schoolStudent.selection_status === "rejected_data_does_not_match" && (
        <div className="flex justify-end gap-4">
          <Button
            className="bg-sky-500 text-white hover:bg-sky-400 flex items-center gap-2"
            onClick={handleVerify}
          >
            Verifikasi
          </Button>
        </div>
      )}
      {schoolStudent.selection_status ===
        "data_received_awaiting_selection" && (
        <div className="flex justify-end gap-4">
          <VerifySelectionDialog
            triggerLabel={
              <Button className="bg-teal-500 text-white hover:bg-teal-400">
                Verifikasi
              </Button>
            }
            onConfirm={(destinationClass) =>
              handleVerifySelection(destinationClass)
            }
          />
          <RejectDialog onConfirm={(note) => handleRejectSelection(note)} />
        </div>
      )}
      {student.status === "inactive" && (
        <Link
          to={`/school/student/${student.id}/edit`}
          className="flex items-center justify-center bg-sky-500 text-white hover:bg-sky-400 px-4 py-2 rounded-md gap-2 mb-4"
        >
          <Pencil className="w-4 h-4" />  Edit
        </Link>
      )}
    </DashboardLayout>
  );
};

export default Show;
