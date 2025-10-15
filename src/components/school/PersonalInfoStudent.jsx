// import { Label } from "@/components/ui/label";
// import SelectModalUrl from "@/components/SelectModalUrl";
// import {
//   Select,
//   SelectGroup,
//   SelectValue,
//   SelectTrigger,
//   SelectContent,
//   SelectLabel,
//   SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import ErrorLabel from "../ErrorLabel";

// const PersonalInfoStudent = ({
//   formData,
//   handleChange,
//   formErrors,
//   provinces,
//   cities,
//   districts,
// }) => {
//   return (
//     <div className="border-b border-gray-900/10 pb-6">
//       <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
//         1. Informasi Pribadi Siswa
//       </h3>
//       <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
//         Lengkapi data pribadi Anda.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="name">
//             Nama Siswa
//           </Label>
//           <Input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Nama Siswa"
//             required
//           />
//           {formErrors.name && <ErrorLabel message={formErrors.name} />}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="email">
//             Email
//           </Label>
//           <Input
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             required
//           />
//           {formErrors.email && <ErrorLabel message={formErrors.email} />}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="nisn">
//             NISN
//           </Label>
//           <Input
//             name="nisn"
//             value={formData.nisn}
//             onChange={handleChange}
//             placeholder="NISN"
//             required
//           />
//           {formErrors.nisn && <ErrorLabel message={formErrors.nisn} />}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="school_origin">
//             Asal Sekolah
//           </Label>
//           <Input
//             name="school_origin"
//             value={formData.school_origin}
//             onChange={handleChange}
//             placeholder="Asal Sekolah"
//             required
//           />
//           {formErrors.school_origin && (
//             <ErrorLabel message={formErrors.school_origin} />
//           )}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="phone">
//             Telepon
//           </Label>
//           <Input
//             name="phone"
//             type="number"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="Telepon"
//             required
//           />
//           {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="birth_place">
//             Tempat Lahir
//           </Label>
//           <Input
//             name="birth_place"
//             value={formData.birth_place}
//             onChange={handleChange}
//             placeholder="Tempat Lahir"
//             required
//           />
//           {formErrors.birth_place && (
//             <ErrorLabel message={formErrors.birth_place} />
//           )}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="birth_date">
//             Tanggal Lahir
//           </Label>
//           <Input
//             name="birth_date"
//             type="date"
//             value={formData.birth_date}
//             onChange={handleChange}
//             required
//           />
//           {formErrors.birth_date && (
//             <ErrorLabel message={formErrors.birth_date} />
//           )}
//         </div>
//         <div className="md:col-span-1">
//           <Label className="block text-left mb-2" htmlFor="gender">
//             Jenis Kelamin
//           </Label>
//           <Select
//             name="gender"
//             value={formData.gender || ""}
//             onValueChange={(value) =>
//               handleChange({ target: { name: "gender", value } })
//             }
//             required
//           >
//             <SelectTrigger className="bg-white text-gray-900">
//               <SelectValue placeholder="Jenis Kelamin" />
//             </SelectTrigger>
//             <SelectContent className="bg-white text-gray-900">
//               <SelectItem className="hover:bg-sky-100" value="Laki-laki">
//                 Laki-laki
//               </SelectItem>
//               <SelectItem className="hover:bg-sky-100" value="Perempuan">
//                 Perempuan
//               </SelectItem>
//             </SelectContent>
//           </Select>
//           {formErrors.gender && <ErrorLabel message={formErrors.gender} />}
//         </div>
//         <div className="md:col-span-2">
//           <Label className="block mb-2" htmlFor="Alamat">
//             Alamat
//           </Label>
//           <Textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="text-gray-900 bg-white"
//             rows={3}
//             placeholder="Alamat"
//             required
//           />
//           {formErrors.address && <ErrorLabel message={formErrors.address} />}
//         </div>
//         <div className="md:col-span-1">
//           <Label
//             htmlFor="province_id"
//             className="block text-left mb-2 dark:text-white"
//           >
//             Provinsi
//           </Label>
//           <SelectModalUrl
//             label={
//               provinces.find((p) => p.id === formData.province_id)?.name ||
//               "Pilih Provinsi"
//             }
//             apiUrl={"/api/regions/provinces"}
//             onSelect={(id) =>
//               handleChange({ target: { name: "province_id", value: id } })
//             }
//             required
//           />
//           {formErrors.province_id && (
//             <ErrorLabel message={formErrors.province_id} />
//           )}
//         </div>
//         <div className="md:col-span-1">
//           <Label
//             htmlFor="city_id"
//             className="block text-left mb-2 dark:text-white"
//           >
//             Kota/Kabupaten
//           </Label>
//           <SelectModalUrl
//             label={
//               cities.find((c) => c.id === formData.city_id)?.name ||
//               "Pilih Kota/Kabupaten"
//             }
//             apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
//             onSelect={(id) =>
//               handleChange({ target: { name: "city_id", value: id } })
//             }
//             disabled={!formData.province_id}
//             required
//           />
//           {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
//         </div>
//         <div className="md:col-span-2">
//           <Label
//             htmlFor="district_id"
//             className="block text-center mb-2 dark:text-white"
//           >
//             Kecamatan
//           </Label>
//           <SelectModalUrl
//             label={
//               districts.find((d) => d.id === formData.district_id)?.name ||
//               "Pilih Kecamatan"
//             }
//             apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
//             onSelect={(id) =>
//               handleChange({ target: { name: "district_id", value: id } })
//             }
//             disabled={!formData.city_id}
//             required
//           />
//           {formErrors.district_id && (
//             <ErrorLabel message={formErrors.district_id} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoStudent;

// src/components/student/PersonalInfo.jsx
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SelectModalUrl from "@/components/SelectModalUrl";
import ErrorLabel from "@/components/ErrorLabel";
import useFile from "@/hooks/useFile";

const PersonalInfoStudent = ({
  formData,
  handleChange,
  formErrors,
  provinces,
  cities,
  districts,
  setFormData,
}) => {
  const optionGender = [
    { id: "Laki-laki", name: "Laki-laki" },
    { id: "Perempuan", name: "Perempuan" },
  ];

  const optionReligion = [
    { id: "Islam", name: "Islam" },
    { id: "Kristen", name: "Kristen" },
    { id: "Katolik", name: "Katolik" },
    { id: "Hindu", name: "Hindu" },
    { id: "Budha", name: "Budha" },
    { id: "Konghucu", name: "Konghucu" },
  ];

  const { uploadedUrl, isUploading, handleFileChange, deleteFile } = useFile({
    folder: "student/avatars",
    onSuccess: (res) => {
      setFormData((prev) => ({ ...prev, avatar: res.path }));
    },
    onError: (err) => {
      console.error("Upload error:", err);
    },
  });

  const fileInputRef = useRef(null);

  return (
    <div className="border border-gray-900/10 dark:border-gray-500 p-5 space-y-5 rounded-xl">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        Informasi Pribadi Siswa
      </h3>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
        Lengkapi data siswa anda.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          {/* Nama Lengkap */}
          <div className="mb-4">
            <Label htmlFor="name" className="block dark:text-white mb-2">
              Nama Lengkap
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              disabled
            />
            {formErrors.name && <ErrorLabel message={formErrors.name} />}
          </div>

          {/* Nomor Telepon */}
          <div className="mb-4">
            <Label htmlFor="phone" className="block dark:text-white mb-2">
              Nomor Telepon
            </Label>
            <Input
              type="number"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
            />
            {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
          </div>

          {/* Asal Sekolah */}
          <div className="mb-4">
            <Label
              htmlFor="school_origin"
              className="block dark:text-white mb-2"
            >
              Asal Sekolah
            </Label>
            <Input
              type="text"
              name="school_origin"
              id="school_origin"
              value={formData.school_origin}
              onChange={handleChange}
              placeholder="Masukkan asal sekolah"
            />
            {formErrors.school_origin && (
              <ErrorLabel message={formErrors.school_origin} />
            )}
          </div>

          {/* Jenis Kelamin */}
          <div className="sm:col-span-3">
            <Label htmlFor="gender" className="block dark:text-white mb-2">
              Jenis Kelamin
            </Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) =>
                handleChange({ target: { name: "gender", value } })
              }
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {optionGender.map((option) => (
                  <SelectItem className="hover:bg-sky-100 focus:bg-sky-100" key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.gender && <ErrorLabel message={formErrors.gender} />}
          </div>
        </div>

        {/* Upload Foto */}
        <div className="sm:col-span-3 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-6">
          <Label htmlFor="avatar" className="dark:text-white mb-2">
            Upload Foto
          </Label>
          <Input
            type="file"
            id="avatar"
            name="avatar"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isUploading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Unggah file JPG/PNG hingga 10MB
          </p>
          {formErrors.avatar && <ErrorLabel message={formErrors.avatar} />}

          {/* Wrapper dengan tinggi & lebar tetap */}
          <div className="mt-3 flex flex-col items-center w-24 h-32">
            {uploadedUrl || formData.avatar ? (
              <>
                <img
                  src={uploadedUrl || formData.image}
                  alt="Preview Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <button
                  type="button"
                  className="mt-2 text-red-500 text-sm cursor-pointer"
                  onClick={() => {
                    deleteFile(formData.avatar);
                    setFormData((prev) => ({ ...prev, avatar: null }));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // reset input file
                    }
                  }}
                >
                  Hapus Foto
                </button>
              </>
            ) : (
              <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400 text-xs">
                No Foto
              </div>
            )}
          </div>

          {isUploading && (
            <p className="text-sm text-gray-500 mt-2">Mengunggah foto...</p>
          )}
        </div>

        {/* Tempat Lahir */}
        <div className="sm:col-span-3">
          <Label htmlFor="birth_place" className="block dark:text-white mb-2">
            Tempat Lahir
          </Label>
          <Input
            type="text"
            name="birth_place"
            id="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Masukkan tempat lahir"
          />
          {formErrors.birth_place && (
            <ErrorLabel message={formErrors.birth_place} />
          )}
        </div>

        {/* Tanggal Lahir */}
        <div className="sm:col-span-3">
          <Label htmlFor="birth_date" className="block dark:text-white mb-2">
            Tanggal Lahir
          </Label>
          <Input
            type="date"
            name="birth_date"
            id="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
          {formErrors.birth_date && (
            <ErrorLabel message={formErrors.birth_date} />
          )}
        </div>

        {/* Agama */}
        <div className="sm:col-span-3">
          <Label htmlFor="religion" className="block dark:text-white mb-2">
            Agama
          </Label>
          <Select
            value={formData.religion || ""}
            onValueChange={(value) =>
              handleChange({ target: { name: "religion", value } })
            }
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Pilih Agama" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionReligion.map((option) => (
                <SelectItem className="hover:bg-sky-100 focus:bg-sky-100" key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.religion && <ErrorLabel message={formErrors.religion} />}
        </div>

        {/* Kode Pos */}
        <div className="sm:col-span-3">
          <Label htmlFor="postal_code" className="block dark:text-white mb-2">
            Kode Pos
          </Label>
          <Input
            type="number"
            name="postal_code"
            id="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Masukkan kode pos"
          />
          {formErrors.postal_code && (
            <ErrorLabel message={formErrors.postal_code} />
          )}
        </div>

        {/* Alamat Lengkap */}
        <div className="col-span-full">
          <Label htmlFor="address" className="block dark:text-white mb-2">
            Alamat Lengkap
          </Label>
          <Textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="bg-white text-gray-900"
            placeholder="Masukkan alamat lengkap"
          />
          {formErrors.address && <ErrorLabel message={formErrors.address} />}
        </div>

        {/* Provinsi */}
        <div className="sm:col-span-2">
          <Label htmlFor="province_id" className="block dark:text-white mb-2">
            Provinsi
          </Label>
          <SelectModalUrl
            label={
              provinces.find((p) => p.id === formData.province_id)?.name ||
              "Pilih Provinsi"
            }
            apiUrl="/api/regions/provinces"
            onSelect={(id) =>
              handleChange({ target: { name: "province_id", value: id } })
            }
          />
          {formErrors.province_id && (
            <ErrorLabel message={formErrors.province_id} />
          )}
        </div>

        {/* Kota/Kabupaten */}
        <div className="sm:col-span-2">
          <Label htmlFor="city_id" className="block dark:text-white mb-2">
            Kota/Kabupaten
          </Label>
          <SelectModalUrl
            label={
              cities.find((c) => c.id === formData.city_id)?.name ||
              "Pilih Kota/Kabupaten"
            }
            apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "city_id", value: id } })
            }
            disabled={!formData.province_id}
          />
          {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
        </div>

        {/* Kecamatan */}
        <div className="sm:col-span-2">
          <Label htmlFor="district_id" className="block dark:text-white mb-2">
            Kecamatan
          </Label>
          <SelectModalUrl
            label={
              districts.find((d) => d.id === formData.district_id)?.name ||
              "Pilih Kecamatan"
            }
            apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "district_id", value: id } })
            }
            disabled={!formData.city_id}
          />
          {formErrors.district_id && (
            <ErrorLabel message={formErrors.district_id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStudent;
