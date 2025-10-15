// // src/pages/school/Setting.jsx
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ErrorLabel from "@/components/ErrorLabel";
// import useAuthStore from "@/store/authStore";
// import DashboardLayout from "@/layouts/school/DashboardLayout";
// import useSchoolStore from "@/store/useSchoolStore";
// import SelectModalUrl from "@/components/SelectModalUrl";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectValue,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { showError, showSuccess } from "@/components/ui/toastSonner";
// import useFile from "@/hooks/useFile";

// const Setting = () => {
//   const { user } = useAuthStore((state) => state);
//   const { updateSchoolProfile } = useSchoolStore();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     npsn: "",
//     education_level: user?.school?.education_level ?? "",
//     roles: "",
//     school_name: "",
//     school_email: "",
//     province_id: "",
//     city_id: "",
//     district_id: "",
//     postal_code: "",
//     logo: "",
//     logo_url: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Hook upload file
//   const {
//     preview,
//     uploadedUrl,
//     handleFileChange,
//     isUploading,
//     errors: fileErrors,
//   } = useFile({
//     folder: "school/logo",
//     onSuccess: (data) => {
//       setForm((prev) => ({
//         ...prev,
//         logo: data.path, // simpan path dari backend
//       }));
//     },
//     onError: (err) => {
//       console.error("Upload gagal:", err);
//     },
//   });

//   useEffect(() => {
//     if (user) {
//       setForm((prev) => ({
//         ...prev,
//         name: user.name ?? "",
//         email: user.email ?? "",
//         phone: user.school?.phone ?? "",
//         address: user.school?.address ?? "",
//         npsn: user.school?.npsn ?? "",
//         education_level: user?.school?.education_level ?? "",
//         roles: user.roles ?? "",
//         school_name: user.school?.name ?? "",
//         school_email: user.school?.email ?? "",
//         province_id: user.school?.province_id ?? "",
//         city_id: user.school?.city_id ?? "",
//         district_id: user.school?.district_id ?? "",
//         postal_code: user.school?.postal_code ?? "",
//         logo: user.school?.logo ?? "",
//         logo_url: user.school?.logo_url ?? "",
//       }));
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});
//     try {
//       const response = await updateSchoolProfile(user.id, form);
//       showSuccess(response.message || "Profil berhasil diperbarui.");
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (err) {
//       if (err.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         showError(err.response?.data?.message || "Terjadi kesalahan.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const optionEducationLevel = [
//     { id: 1, name: "PAUD", value: "paud" },
//     { id: 2, name: "TK/RA", value: "tk/ra" }, //RA(Raudhatul Athfal)
//     { id: 3, name: "SD/MI", value: "sd/mi" },
//     { id: 4, name: "SMP/MTs", value: "smp/mts" },
//     { id: 5, name: "SMA/MA/SMK/MAK", value: "sma/ma/smk/mak" },
//   ];

//   return (
//     <DashboardLayout>
//       <div className="p-6 max-w-4xl mx-auto">
//         <h2 className="text-2xl font-semibold mb-6">
//           Pengaturan Profil Sekolah
//         </h2>
//         <Card className="bg-blue-100 dark:bg-[#1f2d3a] border border-slate-300 dark:border-white/10">
//           <CardHeader className="border-slate-300 dark:border-white/10 border-b mb-3">
//             <CardTitle>Data Sekolah</CardTitle>
//           </CardHeader>
//           <CardContent className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white">
//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-4"
//             >
//               {/* Logo */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">Logo Sekolah</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {isUploading && (
//                   <p className="text-sm text-gray-500">Mengupload...</p>
//                 )}
//               </div>
//               <div className="md:col-span-1">
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="Preview Logo"
//                     className="h-20 mt-2 rounded-md"
//                   />
//                 ) : form.logo ? (
//                   <img
//                     src={uploadedUrl || form.logo_url}
//                     alt="Logo Sekolah"
//                     className="h-20 mt-2 rounded-md"
//                   />
//                 ) : null}
//                 {fileErrors?.logo && (
//                   <ErrorLabel message={fileErrors.logo[0]} />
//                 )}
//               </div>

//               {/* Nama Sekolah */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">Nama Sekolah</Label>
//                 <Input
//                   value={user?.school?.name}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                   readOnly
//                 />
//               </div>

//               {/* Nama Penanggung Jawab */}
//               <div>
//                 <Label className="mb-2 block text-left">
//                   Nama Penanggung Jawab
//                 </Label>
//                 <Input
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.name && <ErrorLabel message={errors.name[0]} />}
//               </div>

//               {/* Email Sekolah */}
//               <div>
//                 <Label className="mb-2 block text-left">Email Sekolah</Label>
//                 <Input
//                   name="school_email"
//                   value={form.school_email}
//                   onChange={handleChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.school_email && (
//                   <ErrorLabel message={errors.school_email[0]} />
//                 )}
//               </div>

//               {/* Telepon */}
//               <div>
//                 <Label className="mb-2 block text-left">Telepon Sekolah</Label>
//                 <Input
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.phone && <ErrorLabel message={errors.phone[0]} />}
//               </div>

//               {/* NPSN */}
//               <div>
//                 <Label className="mb-2 block text-left">NPSN</Label>
//                 <Input
//                   name="npsn"
//                   value={form.npsn}
//                   onChange={handleChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.npsn && <ErrorLabel message={errors.npsn[0]} />}
//               </div>

//               {/* Jenjang */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">
//                   Jenjang Pendidikan
//                 </Label>
//                 <Select
//                   name="education_level"
//                   value={form.education_level ?? ""}
//                   onValueChange={(value) =>
//                     handleChange({ target: { name: "education_level", value } })
//                   }
//                 >
//                   <SelectTrigger className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white">
//                     <SelectValue placeholder="Pilih Jenjang" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white">
//                     {optionEducationLevel.map((level) => (
//                       <SelectItem
//                         key={level.id}
//                         value={level.value}
//                         className="hover:bg-blue-200 dark:hover:bg-gray-700 text-slate-800 dark:text-white"
//                       >
//                         {level.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.education_level && (
//                   <ErrorLabel message={errors.education_level[0]} />
//                 )}
//               </div>

//               {/* Alamat */}
//               <div className="md:col-span-2">
//                 <Label>Alamat</Label>
//                 <Textarea
//                   name="address"
//                   value={form.address}
//                   onChange={handleChange}
//                   className="block w-full bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
//                 />
//                 {errors.address && <ErrorLabel message={errors.address[0]} />}
//               </div>

//               {/* Provinsi */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">Provinsi</Label>
//                 <SelectModalUrl
//                   id="province_id"
//                   name="province_id"
//                   label={user?.school?.provinces?.name || "Pilih Provinsi"}
//                   apiUrl="/api/regions/provinces"
//                   onSelect={(value) =>
//                     setForm({
//                       ...form,
//                       province_id: value,
//                     })
//                   }
//                   classDialogTrigger="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.province_id && (
//                   <ErrorLabel message={errors.province_id[0]} />
//                 )}
//               </div>

//               {/* Kota */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">Kabupaten / Kota</Label>
//                 <SelectModalUrl
//                   id="city_id"
//                   name="city_id"
//                   label={user?.school?.cities?.name || "Pilih Kota"}
//                   apiUrl={`/api/regions/cities?province_id=${form.province_id}`}
//                   onSelect={(value) =>
//                     setForm({
//                       ...form,
//                       city_id: value,
//                     })
//                   }
//                   classDialogTrigger="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.city_id && <ErrorLabel message={errors.city_id[0]} />}
//               </div>

//               {/* Kecamatan */}
//               <div className="md:col-span-1">
//                 <Label>Kecamatan</Label>
//                 <SelectModalUrl
//                   id="district_id"
//                   name="district_id"
//                   label={user?.school?.districts?.name || "Pilih Kecamatan"}
//                   apiUrl={`/api/regions/districts?city_id=${form.city_id}`}
//                   onSelect={(value) =>
//                     setForm({
//                       ...form,
//                       district_id: value,
//                     })
//                   }
//                   classDialogTrigger="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.district_id && (
//                   <ErrorLabel message={errors.district_id[0]} />
//                 )}
//               </div>

//               {/* Kode Pos */}
//               <div className="md:col-span-1">
//                 <Label className="mb-2 block text-left">Kode Pos</Label>
//                 <Input
//                   name="postal_code"
//                   value={form.postal_code}
//                   onChange={handleChange}
//                   className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
//                 />
//                 {errors.postal_code && (
//                   <ErrorLabel message={errors.postal_code[0]} />
//                 )}
//               </div>

//               <div className="md:col-span-2 text-right mt-4">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-blue-300 dark:bg-gray-500 text-slate-800 dark:text-white hover:bg-blue-400 dark:hover:bg-gray-600 border border-blue-300 dark:border-gray-500 rounded-lg px-4 py-2"
//                 >
//                   {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Setting;

// src/pages/school/Setting.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorLabel from "@/components/ErrorLabel";
import useAuthStore from "@/store/authStore";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import useSchoolStore from "@/store/useSchoolStore";
import SelectModalUrl from "@/components/SelectModalUrl";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import useFile from "@/hooks/useFile";

const Setting = () => {
  const { user } = useAuthStore((state) => state);
  const { updateSchoolProfile } = useSchoolStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    npsn: "",
    education_level: user?.school?.education_level ?? "",
    roles: "",
    school_name: "",
    school_email: "",
    province_id: "",
    city_id: "",
    district_id: "",
    postal_code: "",
    logo: "",
    logo_url: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    preview,
    uploadedUrl,
    handleFileChange,
    isUploading,
    errors: fileErrors,
  } = useFile({
    folder: "school/logo",
    onSuccess: (data) => {
      setForm((prev) => ({
        ...prev,
        logo: data.path,
      }));
    },
    onError: (err) => console.error("Upload gagal:", err),
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.school?.phone ?? "",
        address: user.school?.address ?? "",
        npsn: user.school?.npsn ?? "",
        education_level: user?.school?.education_level ?? "",
        roles: user.roles ?? "",
        school_name: user.school?.name ?? "",
        school_email: user.school?.email ?? "",
        province_id: user.school?.province_id ?? "",
        city_id: user.school?.city_id ?? "",
        district_id: user.school?.district_id ?? "",
        postal_code: user.school?.postal_code ?? "",
        logo: user.school?.logo ?? "",
        logo_url: user.school?.logo_url ?? "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await updateSchoolProfile(user.id, form);
      showSuccess(response.message || "Profil berhasil diperbarui.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else showError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionEducationLevel = [
    { id: 1, name: "PAUD", value: "paud" },
    { id: 2, name: "TK/RA", value: "tk/ra" },
    { id: 3, name: "SD/MI", value: "sd/mi" },
    { id: 4, name: "SMP/MTs", value: "smp/mts" },
    { id: 5, name: "SMA/MA/SMK/MAK", value: "sma/ma/smk/mak" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center text-slate-800 dark:text-white">
          Pengaturan Profil Sekolah
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Profil Sekolah */}
          <Card className="bg-gradient-to-br from-sky-200 to-sky-200 dark:from-slate-800 dark:to-slate-800 border-none shadow-lg text-center p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Label className="font-semibold">
                  Logo
                </Label>
                <img
                  src={
                    preview ||
                    uploadedUrl ||
                    form.logo_url ||
                    "assets/Group 1078.png"
                  }
                  alt="Logo Sekolah"
                  className="w-36 h-36 rounded-lg object-cover border-4 border-white shadow-md"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm text-blue-700 font-medium rounded-lg">
                    Mengupload...
                  </div>
                )}
              </div>

              <div className="mt-4 w-full">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 text-sm bg-white"
                />
                {fileErrors?.logo && (
                  <ErrorLabel message={fileErrors.logo[0]} />
                )}
              </div>
            </div>
          </Card>

          {/* Form Data Sekolah */}
          <Card className="col-span-2 bg-sky-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-md">
            <CardHeader className="border-b border-slate-200 dark:border-slate-600 mb-2">
              <CardTitle className="text-xl font-semibold text-slate-700 dark:text-white">
                Data Sekolah
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Sekolah</Label>
                    <Input
                      value={form.school_name}
                      className="bg-gray-200 dark:bg-slate-500 text-gray-800 dark:text-white"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>NPSN</Label>
                    <Input
                      name="npsn"
                      value={form.npsn}
                      className="bg-gray-200 dark:bg-slate-500 text-gray-800 dark:text-white"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Nama Penanggung Jawab</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name && <ErrorLabel message={errors.name[0]} />}
                  </div>

                  <div>
                    <Label>Email Sekolah</Label>
                    <Input
                      name="school_email"
                      value={form.school_email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Telepon Sekolah</Label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Jenjang Pendidikan</Label>
                    <Select
                      name="education_level"
                      value={form.education_level}
                      onValueChange={(value) =>
                        handleChange({
                          target: { name: "education_level", value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white text-slate-800">
                        <SelectValue placeholder="Pilih Jenjang" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-800">
                        {optionEducationLevel.map((level) => (
                          <SelectItem
                            className="hover:bg-sky-100"
                            key={level.id}
                            value={level.value}
                          >
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Alamat Lengkap</Label>
                  <Textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="bg-white text-slate-800"
                  />
                </div>

                {/* Wilayah */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Provinsi</Label>
                    <SelectModalUrl
                      id="province_id"
                      name="province_id"
                      label={user?.school?.provinces?.name || "Pilih Provinsi"}
                      apiUrl="/api/regions/provinces"
                      onSelect={(v) => setForm({ ...form, province_id: v })}
                    />
                  </div>
                  <div>
                    <Label>Kota/Kabupaten</Label>
                    <SelectModalUrl
                      id="city_id"
                      name="city_id"
                      label={user?.school?.cities?.name || "Pilih Kota"}
                      apiUrl={`/api/regions/cities?province_id=${form.province_id}`}
                      onSelect={(v) => setForm({ ...form, city_id: v })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Kecamatan</Label>
                    <SelectModalUrl
                      id="district_id"
                      name="district_id"
                      label={user?.school?.districts?.name || "Pilih Kecamatan"}
                      apiUrl={`/api/regions/districts?city_id=${form.city_id}`}
                      onSelect={(v) => setForm({ ...form, district_id: v })}
                    />
                  </div>

                  <div className="">
                    <Label>Kode Pos</Label>
                    <Input
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="text-right pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-medium rounded-lg shadow-md"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Setting;
