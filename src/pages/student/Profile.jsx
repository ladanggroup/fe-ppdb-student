// // src/pages/student/Profile.jsx
// import { useState, useEffect } from "react";
// import DashboardLayout from "@/layouts/student/DashboardLayout";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import useAuthStore from "@/store/authStore";
// import useRegionStore from "@/store/regionStore";
// import useStudentStore from "@/store/useStudentStore";
// import { Camera } from "lucide-react";
// import SelectModalUrl from "@/components/SelectModalUrl";
// import { showError, showSuccess } from "@/components/ui/toastSonner";
// import useFile from "@/hooks/useFile";
// import { Textarea } from "@/components/ui/textarea";
// import { Link } from "react-router";
// import { User } from "lucide-react";
// import { KeyRound } from "lucide-react";

// export default function Profile() {
//   const { user, meStudent } = useAuthStore();
//   const {
//     provinces,
//     cities,
//     districts,
//     fetchProvinces,
//     fetchCities,
//     fetchDistricts,
//   } = useRegionStore();
//   const { update } = useStudentStore();

//   const [student, setStudent] = useState({});
//   const [isEditing, setIsEditing] = useState(false);

//   // === Avatar Upload Hook ===
//   const { handleFileChange, uploadedUrl, isUploading, deleteFile } = useFile({
//     fieldName: "file",
//     folder: "student/avatar",
//     onSuccess: async (result) => {
//       try {
//         setStudent((prev) => ({ ...prev, avatar: result.path }));
//         showSuccess("Avatar berhasil diperbarui");
//       } catch (err) {
//         showError(err.message || "Gagal memperbarui avatar");
//       }
//     },
//     onError: () => {
//       showError("Gagal mengunggah avatar");
//     },
//   });

//   // Fetch initial data
//   useEffect(() => {
//     if (user) {
//       setStudent(user);
//     }
//     fetchProvinces();
//   }, [fetchProvinces, user]);

//   // Fetch cities when province changes
//   useEffect(() => {
//     if (student.province_id) {
//       fetchCities(student.province_id);
//     }
//   }, [student.province_id, fetchCities]);

//   // Fetch districts when city changes
//   useEffect(() => {
//     if (student.city_id) {
//       fetchDistricts(student.city_id);
//     }
//   }, [student.city_id, fetchDistricts]);

//   // Simpan perubahan profil umum
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (user.avatar && student.avatar !== user.avatar) {
//         deleteFile(user.avatar);
//       }
//       await update(user.id, student);
//       showSuccess("Data berhasil diperbarui");
//       meStudent();
//       setIsEditing(false);
//     } catch (err) {
//       showError("Gagal memperbarui data");
//       console.error(err);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100">
//         {/* Sidebar */}
//         <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-6 flex flex-col items-center">
//           <div className="relative group w-40 h-40">
//             {uploadedUrl || student.image ? (
//               <img
//                 src={
//                   uploadedUrl ||
//                   student.image ||
//                   "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
//                 }
//                 alt="avatar"
//                 className="w-40 h-40 rounded-lg object-cover border"
//               />
//             ) : (
//               <div className="w-40 h-40 rounded-lg border flex items-center justify-center bg-gray-200 text-gray-500">
//                 No Image
//               </div>
//             )}

//             {isEditing && (
//               <>
//                 <label
//                   htmlFor="avatar-upload"
//                   className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-lg
//                    opacity-100 md:opacity-0 md:group-hover:opacity-100 transition cursor-pointer z-10"
//                 >
//                   {isUploading ? (
//                     <span className="text-sm">Mengunggah...</span>
//                   ) : (
//                     <>
//                       <Camera size={20} />
//                       <span className="text-sm mt-1">Ganti Foto</span>
//                     </>
//                   )}
//                 </label>

//                 <Input
//                   id="avatar-upload"
//                   type="file"
//                   accept="image/png,image/jpeg"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   disabled={isUploading}
//                 />
//               </>
//             )}
//           </div>

//           <div className="mt-6 w-full">
//             <nav className="space-y-2">
//               <button className="w-full text-left px-4 py-2 rounded-md bg-orange-100 text-orange-700 font-medium">
//                 <User className="inline mr-2" />
//                 Informasi Pribadi
//               </button>
//               <Link
//                 to="/student/change-password"
//                 className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
//               >
//                 <KeyRound className="inline mr-2" />
//                 Ubah Password
//               </Link>
//             </nav>
//           </div>
//         </div>

//         {/* Form Utama */}
//         <div className="flex-1 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Gender */}
//             <div className="flex items-center gap-6">
//               <Label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Laki-laki"
//                   checked={student.gender === "Laki-laki"}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, gender: e.target.value })
//                   }
//                 />
//                 Laki - laki
//               </Label>
//               <Label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Perempuan"
//                   checked={student.gender === "Perempuan"}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, gender: e.target.value })
//                   }
//                 />
//                 Perempuan
//               </Label>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Nama */}
//               <div>
//                 <Label>Nama Lengkap</Label>
//                 <Input
//                   type="text"
//                   value={student.name || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, name: e.target.value })
//                   }
//                 />
//               </div>
//               {/* NISN */}
//               <div>
//                 <Label>NISN</Label>
//                 <Input type="text" value={student.nisn || ""} disabled />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Email */}
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={student.email || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, email: e.target.value })
//                   }
//                 />
//               </div>
//               {/* Telepon */}
//               <div>
//                 <Label>No. Telepon</Label>
//                 <Input
//                   type="text"
//                   value={student.phone || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, phone: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             {/* Asal Sekolah */}
//             <div>
//               <Label>Asal Sekolah</Label>
//               <Input
//                 type="text"
//                 value={student.school_origin || ""}
//                 disabled={!isEditing}
//                 onChange={(e) =>
//                   setStudent({ ...student, school_origin: e.target.value })
//                 }
//               />
//             </div>

//             {/* Tempat & Tanggal Lahir */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Tempat Lahir</Label>
//                 <Input
//                   type="text"
//                   value={student.birth_place || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, birth_place: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Tanggal Lahir</Label>
//                 <Input
//                   type="date"
//                   value={student.birth_date || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, birth_date: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             {/* Alamat */}
//             <div>
//               <Label>Alamat</Label>
//               <Textarea
//                 value={student.address || ""}
//                 disabled={!isEditing}
//                 onChange={(e) =>
//                   setStudent({ ...student, address: e.target.value })
//                 }
//                 rows={3}
//                 className="block w-full bg-gray-50 text-gray-900"
//               />
//             </div>

//             {/* Provinsi, Kota, Kecamatan */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Provinsi</Label>
//                 <SelectModalUrl
//                   label={
//                     provinces.find((p) => p.id === student.province_id)?.name ||
//                     "Pilih Provinsi"
//                   }
//                   apiUrl="/api/regions/provinces"
//                   onSelect={(id) => setStudent({ ...student, province_id: id })}
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div>
//                 <Label>Kabupaten / Kota</Label>
//                 <SelectModalUrl
//                   label={
//                     cities.find((c) => c.id === student.city_id)?.name ||
//                     "Pilih Kota/Kabupaten"
//                   }
//                   apiUrl={`/api/regions/cities?province_id=${student.province_id}`}
//                   onSelect={(id) => setStudent({ ...student, city_id: id })}
//                   disabled={!student.province_id || !isEditing}
//                 />
//               </div>
//               <div>
//                 <Label>Kecamatan</Label>
//                 <SelectModalUrl
//                   label={
//                     districts.find((d) => d.id === student.district_id)?.name ||
//                     "Pilih Kecamatan"
//                   }
//                   apiUrl={`/api/regions/districts?city_id=${student.city_id}`}
//                   onSelect={(id) => setStudent({ ...student, district_id: id })}
//                   disabled={!student.city_id || !isEditing}
//                 />
//               </div>
//               <div>
//                 <Label>Kode Pos</Label>
//                 <Input
//                   type="text"
//                   value={student.postal_code || ""}
//                   disabled={!isEditing}
//                   onChange={(e) =>
//                     setStudent({ ...student, postal_code: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             {/* Tombol */}
//             <div className="flex justify-end gap-2">
//               {isEditing && (
//                 <Button type="submit" disabled={isUploading}>
//                   Simpan
//                 </Button>
//               )}
//               {!isEditing && (
//                 <Button type="button" onClick={() => setIsEditing(true)}>
//                   Edit Data
//                 </Button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

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
import formatIdr from "@/utils/formatIdr";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [student, setStudent] = useState({
    // default shape
    avatar: null,
    name: "",
    nisn: "",
    email: "",
    phone: "",
    gender: "",
    birth_place: "",
    birth_date: "",
    school_origin: "",
    address: "",
    province_id: "",
    city_id: "",
    district_id: "",
    postal_code: "",
    // parents fields (map to backend keys)
    father_name: "",
    father_phone: "",
    father_job: "",
    father_education: "",
    father_income: "",
    father_address: "",
    mother_name: "",
    mother_phone: "",
    mother_job: "",
    mother_education: "",
    mother_income: "",
    mother_address: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_job: "",
    guardian_education: "",
    guardian_income: "",
    guardian_address: "",
  });

  const lastEducationOptions = [
    "Tidak Sekolah",
    "SD / Sederajat",
    "SMP / Sederajat",
    "SMA / Sederajat",
    "D1 / D2 / D3",
    "D4 / S1",
    "S2 / S3",
    "Lainnya",
  ];

  // === Avatar Upload Hook ===
  const { handleFileChange, uploadedUrl, isUploading, deleteFile } = useFile({
    fieldName: "file",
    folder: "student/avatar",
    onSuccess: async (result) => {
      try {
        const newAvatar = result.path;
        setStudent((prev) => ({
          ...prev,
          avatar: result.path,
          image: result.url || prev.image,
        }));
        if (newAvatar && newAvatar !== user.avatar) {
          await deleteFile(user.avatar);
          await update(user.id, { avatar: newAvatar });
          showSuccess("Avatar berhasil diperbarui");
        }
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
      // prefill student state and parents
      const parents = (() => {
        try {
          return user.parents ? JSON.parse(user.parents) : {};
        } catch (e) {
          console.error(e);
          return showError("Gagal memuat data orang tua/wali");
        }
      })();

      setStudent((prev) => ({
        ...prev,
        ...user,
        // make sure avatar/image/ids etc copied
        avatar: user.avatar || prev.avatar,
        image: user.image || prev.image,
        // parents mapping (guard null/undefined)
        father_name: parents?.father?.name || "",
        father_phone: parents?.father?.phone || "",
        father_job: parents?.father?.job || "",
        father_education: parents?.father?.education || "",
        father_income: parents?.father?.income || "",
        father_address: parents?.father?.address || "",
        mother_name: parents?.mother?.name || "",
        mother_phone: parents?.mother?.phone || "",
        mother_job: parents?.mother?.job || "",
        mother_education: parents?.mother?.education || "",
        mother_income: parents?.mother?.income || "",
        mother_address: parents?.mother?.address || "",
        guardian_name: parents?.guardian?.name || "",
        guardian_phone: parents?.guardian?.phone || "",
        guardian_job: parents?.guardian?.job || "",
        guardian_education: parents?.guardian?.education || "",
        guardian_income: parents?.guardian?.income || "",
        guardian_address: parents?.guardian?.address || "",
      }));
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

  // Simpan perubahan profil (selalu editable)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(user.id, student);
      showSuccess("Data berhasil diperbarui");
      await meStudent();
    } catch (err) {
      showError("Gagal memperbarui data");
      console.error(err);
    }
  };

  // helper for updating simple fields
  const setField = (key, value) => {
    setStudent((prev) => ({ ...prev, [key]: value }));
  };

  // copy address helper for parent/guardian
  const copyAddress = (role) => {
    const addrKey = `${role}_address`;
    setStudent((prev) => ({
      ...prev,
      [addrKey]: prev.address || "",
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-6 flex flex-col items-center">
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
              <div className="w-40 h-40 rounded-lg border flex items-center justify-center bg-gray-200 text-gray-500">
                No Image
              </div>
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-lg opacity-100 hover:opacity-100 transition cursor-pointer z-10"
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
          </div>

          <div className="mt-6 w-full">
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-md bg-orange-100 text-orange-700 font-medium">
                <User className="inline mr-2" />
                Informasi Pribadi
              </button>
              <Link
                to="/student/change-password"
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <KeyRound className="inline mr-2" />
                Ubah Password
              </Link>
            </nav>
          </div>
        </div>

        {/* Form Utama */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
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
                  onChange={(e) => setField("gender", e.target.value)}
                />
                Laki - laki
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={student.gender === "Perempuan"}
                  onChange={(e) => setField("gender", e.target.value)}
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
                  onChange={(e) => setField("name", e.target.value)}
                />
              </div>
              {/* NISN (read only) */}
              <div>
                <Label>NISN</Label>
                <Input type="text" value={student.nisn || ""} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={student.email || ""}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>
              {/* Telepon */}
              <div>
                <Label>No. Telepon</Label>
                <Input
                  type="text"
                  value={student.phone || ""}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>
            </div>

            {/* Asal Sekolah */}
            <div>
              <Label>Asal Sekolah</Label>
              <Input
                type="text"
                value={student.school_origin || ""}
                onChange={(e) => setField("school_origin", e.target.value)}
              />
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tempat Lahir</Label>
                <Input
                  type="text"
                  value={student.birth_place || ""}
                  onChange={(e) => setField("birth_place", e.target.value)}
                />
              </div>
              <div>
                <Label>Tanggal Lahir</Label>
                <Input
                  type="date"
                  value={student.birth_date || ""}
                  onChange={(e) => setField("birth_date", e.target.value)}
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <Label>Alamat</Label>
              <Textarea
                value={student.address || ""}
                onChange={(e) => setField("address", e.target.value)}
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
                  onSelect={(id) => {
                    setField("province_id", id);
                    // clear city/district when province changes
                    setField("city_id", null);
                    setField("district_id", null);
                  }}
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
                  onSelect={(id) => {
                    setField("city_id", id);
                    setField("district_id", null);
                  }}
                  disabled={!student.province_id}
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
                  onSelect={(id) => setField("district_id", id)}
                  disabled={!student.city_id}
                />
              </div>
              <div>
                <Label>Kode Pos</Label>
                <Input
                  type="text"
                  value={student.postal_code || ""}
                  onChange={(e) => setField("postal_code", e.target.value)}
                />
              </div>
            </div>

            {/* Orang Tua / Wali */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Informasi Orang Tua / Wali
              </h3>

              {/* AYAH */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Data Ayah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Ayah</Label>
                    <Input
                      name="father_name"
                      value={student.father_name || ""}
                      onChange={(e) => setField("father_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>No. Telepon Ayah</Label>
                    <Input
                      name="father_phone"
                      value={student.father_phone || ""}
                      onChange={(e) => setField("father_phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Pekerjaan Ayah</Label>
                    <Input
                      name="father_job"
                      value={student.father_job || ""}
                      onChange={(e) => setField("father_job", e.target.value)}
                    />
                  </div>
                  <div>
                    <SelectGroup>
                      <SelectLabel>Pendidikan Ayah</SelectLabel>
                      <Select
                        name="father_income"
                        value={student.father_education || ""}
                        onValueChange={(value) =>
                          setField("father_education", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-gray-900">
                          <SelectValue placeholder="Pilih Pendidikan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {lastEducationOptions.map((option) => (
                            <SelectItem
                              className="hover:bg-sky-100"
                              key={option}
                              value={option}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </SelectGroup>
                  </div>
                  <div>
                    <Label>Penghasilan Ayah</Label>
                    <Input
                      name="father_income"
                      type="number"
                      value={student.father_income || ""}
                      onChange={(e) =>
                        setField("father_income", e.target.value)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {student.father_income
                        ? formatIdr(student.father_income)
                        : "Rp 0"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Alamat Ayah</Label>
                    <Textarea
                      name="father_address"
                      value={student.father_address || ""}
                      onChange={(e) =>
                        setField("father_address", e.target.value)
                      }
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="father_copy"
                        onChange={() => copyAddress("father")}
                      />
                      <label
                        htmlFor="father_copy"
                        className="text-sm text-gray-700"
                      >
                        Alamat sama dengan siswa
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* IBU */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Data Ibu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Ibu</Label>
                    <Input
                      name="mother_name"
                      value={student.mother_name || ""}
                      onChange={(e) => setField("mother_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>No. Telepon Ibu</Label>
                    <Input
                      name="mother_phone"
                      value={student.mother_phone || ""}
                      onChange={(e) => setField("mother_phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Pekerjaan Ibu</Label>
                    <Input
                      name="mother_job"
                      value={student.mother_job || ""}
                      onChange={(e) => setField("mother_job", e.target.value)}
                    />
                  </div>
                  <div>
                    <SelectGroup>
                      <SelectLabel>Pendidikan Ibu</SelectLabel>
                      <Select
                        name="mother_education"
                        value={student.mother_education || ""}
                        onValueChange={(value) =>
                          setField("mother_education", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-gray-900">
                          <SelectValue placeholder="Pilih Pendidikan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {lastEducationOptions.map((option) => (
                            <SelectItem
                              className="hover:bg-sky-100"
                              key={option}
                              value={option}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </SelectGroup>
                  </div>
                  <div>
                    <Label>Penghasilan Ibu</Label>
                    <Input
                      name="mother_income"
                      type="number"
                      value={student.mother_income || ""}
                      onChange={(e) =>
                        setField("mother_income", e.target.value)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {student.mother_income
                        ? formatIdr(student.mother_income)
                        : "Rp 0"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Alamat Ibu</Label>
                    <Textarea
                      name="mother_address"
                      value={student.mother_address || ""}
                      onChange={(e) =>
                        setField("mother_address", e.target.value)
                      }
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="mother_copy"
                        onChange={() => copyAddress("mother")}
                      />
                      <label
                        htmlFor="mother_copy"
                        className="text-sm text-gray-700"
                      >
                        Alamat sama dengan siswa
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* WALI */}
              <div>
                <h4 className="font-medium mb-3">Data Wali (Opsional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Wali</Label>
                    <Input
                      name="guardian_name"
                      value={student.guardian_name || ""}
                      onChange={(e) =>
                        setField("guardian_name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>No. Telepon Wali</Label>
                    <Input
                      name="guardian_phone"
                      value={student.guardian_phone || ""}
                      onChange={(e) =>
                        setField("guardian_phone", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Pekerjaan Wali</Label>
                    <Input
                      name="guardian_job"
                      value={student.guardian_job || ""}
                      onChange={(e) => setField("guardian_job", e.target.value)}
                    />
                  </div>
                  <div>
                    <SelectGroup>
                      <SelectLabel>Pendidikan Wali</SelectLabel>
                      <Select
                        name="guardian_education"
                        value={student.guardian_education || ""}
                        onValueChange={(value) =>
                          setField("guardian_education", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-gray-900">
                          <SelectValue placeholder="Pilih Pendidikan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {lastEducationOptions.map((option) => (
                            <SelectItem
                              className="hover:bg-sky-100"
                              key={option}
                              value={option}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </SelectGroup>
                  </div>
                  <div>
                    <Label>Penghasilan Wali</Label>
                    <Input
                      name="guardian_income"
                      type="number"
                      value={student.guardian_income || ""}
                      onChange={(e) =>
                        setField("guardian_income", e.target.value)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {student.guardian_income
                        ? formatIdr(student.guardian_income)
                        : "Rp 0"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Alamat Wali</Label>
                    <Textarea
                      name="guardian_address"
                      value={student.guardian_address || ""}
                      onChange={(e) =>
                        setField("guardian_address", e.target.value)
                      }
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="guardian_copy"
                        onChange={() => copyAddress("guardian")}
                      />
                      <label
                        htmlFor="guardian_copy"
                        className="text-sm text-gray-700"
                      >
                        Alamat sama dengan siswa
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isUploading}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
