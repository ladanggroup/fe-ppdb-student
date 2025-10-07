// src/pages/school/SchoolDashboard.jsx
import { useEffect } from "react";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import useAuthStore from "../../store/authStore";
import useSchoolStore from "../../store/useSchoolStore";
import useSchoolStudents from "../../hooks/useSchoolStudents";

const Dashboard = () => {
  const authStore = useAuthStore();
  const schoolStore = useSchoolStore();
  const { students, handleVerify } = useSchoolStudents();

  useEffect(() => {
    // Pastikan user adalah sekolah
    if (
      authStore.isAuthenticated &&
      (authStore.role?.includes("admin") ||
        authStore.role?.includes("school"))
    ) {
      authStore.meSchool();
      // schoolStore?.fetchStudents();
    }
  }, [authStore.isAuthenticated, authStore.abilities, schoolStore.school]);

  if (!authStore.isAuthenticated) {
    return <div>Silakan login terlebih dahulu</div>;
  }
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Dashboard Sekolah - {schoolStore.school?.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded shadow">
            <h3 className="font-semibold">Total Pendaftar</h3>
            <p className="text-3xl mt-2">{students?.length}</p>
          </div>

          <div className="p-4 rounded shadow">
            <h3 className="font-semibold">Gelombang Aktif</h3>
            <p className="text-3xl mt-2">
              {
                schoolStore.waves?.filter(
                  (w) =>
                    new Date(w.start_date) <= new Date() &&
                    new Date(w.end_date) >= new Date()
                ).length
              }
            </p>
          </div>

          <div className="p-4 rounded shadow">
            <h3 className="font-semibold">Kuota Tersedia</h3>
            <p className="text-3xl mt-2">
              {schoolStore.waves?.reduce((sum, wave) => sum + wave.quota, 0)}
            </p>
          </div>
        </div>

        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pendaftar Terbaru</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Nama</th>
                <th className="text-left">Sekolah Asal</th>
                <th className="text-left">Status</th>
                <th className="text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students?.slice(0, 5).map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.school_origin}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded ${
                        student.selection_status === "lolos"
                          ? "bg-green-100 text-green-800"
                          : student.selection_status === "tidak_lolos"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.selection_status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleVerify(student.id, "lolos")}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Lolos
                    </button>
                    <button
                      onClick={() => handleVerify(student.id, "tidak_lolos")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Tidak Lolos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <h1 className="text-2xl font-bold">Selamat Datang!</h1> */}
    </DashboardLayout>
  );
};

export default Dashboard;
