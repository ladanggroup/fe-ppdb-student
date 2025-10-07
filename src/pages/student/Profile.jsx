// src/pages/student/Profile.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import useRegionStore from "@/store/regionStore";
import useStudentStore from "@/store/useStudentStore";
import { Camera } from "lucide-react";
import SelectModalUrl from "@/components/SelectModalUrl";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import useFile from "@/hooks/useFile";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router";
import { User } from "lucide-react";
import { KeyRound } from "lucide-react";

export default function Profile() {
  const { user, meStudent } = useAuthStore();
  const {
    provinces,
    cities,
    districts,
    fetchProvinces,
    fetchCities,
    fetchDistricts,
  } = useRegionStore();
  const { update } = useStudentStore();

  const [student, setStudent] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // === Avatar Upload Hook ===
  const { handleFileChange, uploadedUrl, isUploading, deleteFile } = useFile({
    fieldName: "file",
    folder: "student/avatar",
    onSuccess: async (result) => {
      try {
        setStudent((prev) => ({ ...prev, avatar: result.path }));
        showSuccess("Avatar berhasil diperbarui");
      } catch (err) {
        showError(err.message || "Gagal memperbarui avatar");
      }
    },
    onError: () => {
      showError("Gagal mengunggah avatar");
    },
  });

  // Fetch initial data
  useEffect(() => {
    if (user) {
      setStudent(user);
    }
    fetchProvinces();
  }, [fetchProvinces, user]);

  // Fetch cities when province changes
  useEffect(() => {
    if (student.province_id) {
      fetchCities(student.province_id);
    }
  }, [student.province_id, fetchCities]);

  // Fetch districts when city changes
  useEffect(() => {
    if (student.city_id) {
      fetchDistricts(student.city_id);
    }
  }, [student.city_id, fetchDistricts]);

  // Simpan perubahan profil umum
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user.avatar && student.avatar !== user.avatar) {
        deleteFile(user.avatar);
      }
      await update(user.id, student);
      showSuccess("Data berhasil diperbarui");
      meStudent();
      setIsEditing(false);
    } catch (err) {
      showError("Gagal memperbarui data");
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
          <div className="relative group w-40 h-40">
            {uploadedUrl || student.image ? (
              <img
                src={
                  uploadedUrl ||
                  student.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="avatar"
                className="w-40 h-40 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg border flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                No Image
              </div>
            )}

            {isEditing && (
              <>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-lg 
                   opacity-100 md:opacity-0 md:group-hover:opacity-100 transition cursor-pointer z-10"
                >
                  {isUploading ? (
                    <span className="text-sm">Mengunggah...</span>
                  ) : (
                    <>
                      <Camera size={20} />
                      <span className="text-sm mt-1">Ganti Foto</span>
                    </>
                  )}
                </label>

                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </>
            )}
          </div>

          <div className="mt-6 w-full">
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-md bg-orange-100 text-orange-700 font-medium">
                <User className="inline mr-2" />
                Informasi Pribadi
              </button>
              <Link
                to="/student/change-password"
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              >
                <KeyRound className="inline mr-2" />
                Ubah Password
              </Link>
            </nav>
          </div>
        </div>

        {/* Form Utama */}
        <div className="flex-1 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gender */}
            <div className="flex items-center gap-6">
              <Label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  checked={student.gender === "Laki-laki"}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, gender: e.target.value })
                  }
                />
                Laki - laki
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={student.gender === "Perempuan"}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, gender: e.target.value })
                  }
                />
                Perempuan
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div>
                <Label>Nama Lengkap</Label>
                <Input
                  type="text"
                  value={student.name || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, name: e.target.value })
                  }
                />
              </div>
              {/* NISN */}
              <div>
                <Label>NISN</Label>
                <Input type="text" value={student.nisn || ""} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={student.email || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                />
              </div>
              {/* Telepon */}
              <div>
                <Label>No. Telepon</Label>
                <Input
                  type="text"
                  value={student.phone || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Asal Sekolah */}
            <div>
              <Label>Asal Sekolah</Label>
              <Input
                type="text"
                value={student.school_origin || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setStudent({ ...student, school_origin: e.target.value })
                }
              />
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tempat Lahir</Label>
                <Input
                  type="text"
                  value={student.birth_place || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, birth_place: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Tanggal Lahir</Label>
                <Input
                  type="date"
                  value={student.birth_date || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, birth_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <Label>Alamat</Label>
              <Textarea
                value={student.address || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setStudent({ ...student, address: e.target.value })
                }
                rows={3}
                className="block w-full bg-gray-50 text-gray-900"
              />
            </div>

            {/* Provinsi, Kota, Kecamatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Provinsi</Label>
                <SelectModalUrl
                  label={
                    provinces.find((p) => p.id === student.province_id)?.name ||
                    "Pilih Provinsi"
                  }
                  apiUrl="/api/regions/provinces"
                  onSelect={(id) => setStudent({ ...student, province_id: id })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Kabupaten / Kota</Label>
                <SelectModalUrl
                  label={
                    cities.find((c) => c.id === student.city_id)?.name ||
                    "Pilih Kota/Kabupaten"
                  }
                  apiUrl={`/api/regions/cities?province_id=${student.province_id}`}
                  onSelect={(id) => setStudent({ ...student, city_id: id })}
                  disabled={!student.province_id || !isEditing}
                />
              </div>
              <div>
                <Label>Kecamatan</Label>
                <SelectModalUrl
                  label={
                    districts.find((d) => d.id === student.district_id)?.name ||
                    "Pilih Kecamatan"
                  }
                  apiUrl={`/api/regions/districts?city_id=${student.city_id}`}
                  onSelect={(id) => setStudent({ ...student, district_id: id })}
                  disabled={!student.city_id || !isEditing}
                />
              </div>
              <div>
                <Label>Kode Pos</Label>
                <Input
                  type="text"
                  value={student.postal_code || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setStudent({ ...student, postal_code: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button type="submit" disabled={isUploading}>
                  Simpan
                </Button>
              )}
              {!isEditing && (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Data
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
