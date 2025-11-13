import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import useSchoolStore from "@/store/useSchoolStore";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { showError } from "@/components/ui/toastSonner";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";
import formatIdr from "@/utils/formatIdr";
import Pagination from "@/components/pagination";

const ITEMS_PER_PAGE = 5;

const Show = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const location = useLocation();
  const { currentSchool, showSchoolAdmin, loading, error } = useSchoolStore();

  // State pagination
  const [userPage, setUserPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [subscriptionPage, setSubscriptionPage] = useState(1);

  useEffect(() => {
    const id = schoolId || location.state?.school?.id;
    if (id) showSchoolAdmin(id);
  }, [schoolId, location, showSchoolAdmin]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading || !currentSchool) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">Memuat data sekolah...</div>
      </DashboardLayout>
    );
  }

  const school = currentSchool;
  const users = school.users || [];
  const students = school.school_students || [];
  const subscriptions = school.subscriptions || [];

  // slice data per halaman
  const paginatedUsers = users.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE
  );
  const paginatedStudents = students.slice(
    (studentPage - 1) * ITEMS_PER_PAGE,
    studentPage * ITEMS_PER_PAGE
  );
  const paginatedSubscriptions = subscriptions.slice(
    (subscriptionPage - 1) * ITEMS_PER_PAGE,
    subscriptionPage * ITEMS_PER_PAGE
  );

  const totalUserPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const totalStudentPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const totalSubscriptionPages = Math.ceil(subscriptions.length / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detail Sekolah
            </h1>
          </div>
        </div>

        {/* Data Sekolah */}
        <div className="bg-teal-200 dark:bg-[#1f2d3a] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={school.logo_url || "/src/assets/Group 1078.png"}
              alt="Logo Sekolah"
              className="w-16 h-16 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mb-4">{school.name}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-semibold text-gray-800 dark:text-white">NPSN:</span> {school.npsn}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Email:</span> {school.email}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Telepon:</span> {school.phone || "-"}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Jenjang:</span> {school.education_level}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Provinsi:</span> {school.provinces?.name || "-"}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Kab/Kota:</span> {school.cities?.name || "-"}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Kecamatan:</span> {school.districts?.name || "-"}</p>
            <p><span className="font-semibold text-gray-800 dark:text-white">Kode Pos:</span> {school.postal_code}</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Alamat:</p>
            <p className="text-gray-700 dark:text-gray-400 mt-1">{school.address}</p>
          </div>
        </div>

        {/* Pengguna Sekolah */}
        <div className="bg-teal-200 dark:bg-[#1f2d3a] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Pengguna Sekolah</h3>
          {users.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, i) => (
                    <TableRow key={user.id}>
                      <TableCell>{(userPage - 1) * ITEMS_PER_PAGE + i + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.nip || "-"}</TableCell>
                      <TableCell className="capitalize">{user.roles.replace("_", " ")}</TableCell>
                      <TableCell>{user.status === "active" ? "Aktif" : "Tidak Aktif"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                pagination={{
                  current_page: userPage,
                  last_page: totalUserPages,
                }}
                onPageChange={setUserPage}
                className="mt-4"
              />
            </>
          ) : (
            <p className="text-gray-500">Belum ada pengguna sekolah.</p>
          )}
        </div>

        {/* Siswa Terdaftar */}
        <div className="bg-teal-200 dark:bg-[#1f2d3a] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Siswa Terdaftar</h3>
          {students.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Gelombang</TableHead>
                    <TableHead>Status Seleksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((item, i) => (
                    <TableRow key={item.id}>
                      <TableCell>{(studentPage - 1) * ITEMS_PER_PAGE + i + 1}</TableCell>
                      <TableCell>{item.student?.name || "-"}</TableCell>
                      <TableCell>{item.student?.nisn || "-"}</TableCell>
                      <TableCell>{item.wave?.name || "-"}</TableCell>
                      <TableCell>
                        <SelectionStatusBadge status={item.selection_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                pagination={{
                  current_page: studentPage,
                  last_page: totalStudentPages,
                }}
                onPageChange={setStudentPage}
                className="mt-4"
              />
            </>
          ) : (
            <p className="text-gray-500">Belum ada siswa yang terdaftar.</p>
          )}
        </div>

        {/* Subscription Aktif */}
        <div className="bg-teal-200 dark:bg-[#1f2d3a] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <h3 className="text-lg font-semibold mb-4">Langganan Sekolah</h3>
          {subscriptions.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Periode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscriptions.map((sub, i) => (
                    <TableRow key={sub.id}>
                      <TableCell>{(subscriptionPage - 1) * ITEMS_PER_PAGE + i + 1}</TableCell>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell>{sub.duration} bulan</TableCell>
                      <TableCell>{formatIdr(sub.price)}</TableCell>
                      <TableCell className="capitalize">
                        {sub.status === "verify" ? (
                          <span className="text-yellow-600 dark:text-yellow-400">Menunggu Verifikasi</span>
                        ) : sub.status === "active" ? (
                          <span className="text-green-600 dark:text-green-400">Aktif</span>
                        ) : sub.status === "expired" ? (
                          <span className="text-red-600 dark:text-red-400">Kadaluarsa</span>
                        ) : sub.status === "canceled" ? (
                          <span className="text-gray-600 dark:text-gray-300">Dibatalkan</span>
                        ) : sub.status === "rejected" ? (
                          <span className="text-red-600 dark:text-red-400">Ditolak</span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.start_date).toLocaleDateString("id")} s.d.{" "}
                        {new Date(sub.end_date).toLocaleDateString("id")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                pagination={{
                  current_page: subscriptionPage,
                  last_page: totalSubscriptionPages,
                }}
                onPageChange={setSubscriptionPage}
                className="mt-4"
              />
            </>
          ) : (
            <p className="text-gray-500">Belum ada langganan aktif.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Show;
