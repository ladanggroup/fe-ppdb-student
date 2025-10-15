import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import useStudentStore from "@/store/useStudentStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";

const Show = () => {
  const { id } = useParams(); // id dari route /admin/student/:id
  const navigate = useNavigate();
  const { currentStudent, showStudentAdmin, loading, error } = useStudentStore();

  useEffect(() => {
    if (id) {
      showStudentAdmin(id);
    }
  }, [id, showStudentAdmin]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600 dark:text-gray-300">
          Memuat data siswa...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  if (!currentStudent) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Data siswa tidak ditemukan
        </div>
      </DashboardLayout>
    );
  }

  const student = currentStudent;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-teal-600" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Detail Siswa
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer gap-1"
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
        </div>

        {/* Biodata */}
        <Card className="border-0 shadow-sm bg-teal-200 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Biodata Siswa
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-4 items-center">
              <img
                src={
                  student.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="Avatar"
                className="w-20 h-20 rounded-full border"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {student.name}
                </p>
                <p className="text-sm text-gray-500">{student.nisn}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">Status</p>
              <p>: {student.status === "active" ? "Aktif" : student.status === "inactive" ? "Tidak Aktif" : "Diblokir"}</p>
              <p className="font-medium">Jenis Kelamin</p>
              <p>: {student.gender}</p>
              <p className="font-medium">Tempat Lahir</p>
              <p>: {student.birth_place}</p>
              <p className="font-medium">Tanggal Lahir</p>
              <p>
                : {student.birth_date
                  ? new Date(student.birth_date).toLocaleDateString('id', { year: 'numeric', month: 'long', day: 'numeric' })
                  : "-"}
              </p>
              <p className="font-medium">Agama</p>
              <p>: {student.religion || "-"}</p>
              <p className="font-medium">Telepon</p>
              <p>: {student.phone || "-"}</p>
              <p className="font-medium">Asal Sekolah</p>
              <p>: {student.school_origin || "-"}</p>
              <p className="font-medium">Jenis Pendaftaran</p>
              <p>: {student.registration_type === "pindahan" ? "Pindahan" : "Baru"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Alamat */}
        <Card className="border-0 shadow-sm bg-teal-200 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Alamat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>{student.address}</p>
            <p>
              {student.districts?.name}, {student.cities?.name},{" "}
              {student.provinces?.name}, {student.postal_code}
            </p>
          </CardContent>
        </Card>

        {/* Sekolah dan Gelombang */}
        <Card className="border-0 shadow-sm bg-teal-200 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Sekolah & Gelombang Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.school_students?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sekolah</TableHead>
                    <TableHead>Jenjang</TableHead>
                    <TableHead>Gelombang</TableHead>
                    <TableHead>Biaya</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.school_students.map((ss) => (
                    <TableRow key={ss.id}>
                      <TableCell>{ss.school?.name}</TableCell>
                      <TableCell>{ss.school?.education_level?.toUpperCase()}</TableCell>
                      <TableCell>{ss.wave?.name || "-"}</TableCell>
                      <TableCell>{ss.wave?.price ? formatIdr(ss?.wave?.price) : "-"}</TableCell>
                      <TableCell>
                        <SelectionStatusBadge status={ss.selection_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Belum terdaftar di sekolah manapun.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Show;
