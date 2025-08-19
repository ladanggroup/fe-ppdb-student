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
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const Setting = () => {
  const { user } = useAuthStore((state) => state);
  const { updateSchoolProfile } = useSchoolStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.school?.email || "",
    phone: user?.school?.phone || "",
    address: user?.school?.address || "",
    npsn: user?.npsn || "",
    education_level: user?.school?.education_level || "",
    roles: user?.roles || "",
    school_name: user?.school?.name || "",
    province_id: user?.school?.province_id || "",
    city_id: user?.school?.city_id || "",
    district_id: user?.school?.district_id || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      await updateSchoolProfile(user.id, form);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Gagal memperbarui profil.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const optionEducationLevel = [
    {
      id: 1,
      name: "SD/MI",
      value: "sd/mi",
    },
    {
      id: 2,
      name: "SMP/MTs",
      value: "smp/mts",
    },
    {
      id: 3,
      name: "SMA/MA/SMK/MAK",
      value: "sma/ma/smk/mak",
    },
  ];
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Pengaturan Profil Sekolah
        </h2>
        <Card className="bg-blue-100 dark:bg-[#1f2d3a] border border-slate-300 dark:border-white/10">
          <CardHeader className="border-slate-300 dark:border-white/10 border-b mb-3">
            <CardTitle className="text-blue-500 dark:text-blue-50">
              Data Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-blue-100 dark:bg-[#1f2d3a] text-slate-800 dark:text-white">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-1">
                <Label className="mb-2 block text-left">Nama Sekolah</Label>
                <Input
                 value={user?.school?.name}
                 className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <Label className="mb-2 block text-left">
                  Nama Penanggung Jawab
                </Label>
                <Input 
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.name && <ErrorLabel message={errors.name[0]} />}
              </div>
              <div>
                <Label className="mb-2 block text-left">Email Sekolah</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.email && <ErrorLabel message={errors.email[0]} />}
              </div>
              <div>
                <Label className="mb-2 block text-left">Telepon Sekolah</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.phone && <ErrorLabel message={errors.phone[0]} />}
              </div>
              <div>
                <Label className="mb-2 block text-left">NPSN</Label>
                <Input name="npsn"
                value={form.npsn}
                onChange={handleChange}
                className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.npsn && <ErrorLabel message={errors.npsn[0]} />}
              </div>
              <div className="md:col-span-1">
                <Label className="mb-2 block text-left">
                  Jenjang Pendidikan
                </Label>
                <Select
                  name="education_level"
                  id="education_level"
                  value={form.education_level}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "education_level", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenjang" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white">
                    {optionEducationLevel?.map((level) => (
                      <SelectItem key={level.id} value={level.value}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.education_level && (
                  <ErrorLabel message={errors.education_level[0]} />
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Alamat</Label>
                <Textarea
                  name="address"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.address && <ErrorLabel message={errors.address[0]} />}
              </div>
              <div className="md:col-span-1">
                <Label className="mb-2 block text-left">Provinsi</Label>
                <SelectModalUrl
                  id="province_id"
                  name="province_id"
                  label={user?.school?.provinces?.name || "Pilih Provinsi"}
                  apiUrl={"/api/regions/provinces"}
                  onSelect={(value) =>
                    setForm({
                      ...form,
                      province_id: value,
                    })
                  }
                  classDialogTrigger="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.province_id && (
                  <ErrorLabel message={errors.province_id[0]} />
                )}
              </div>
              <div className="md:col-span-1">
                <Label className="mb-2 block text-left">Kabupaten / Kota</Label>
                <SelectModalUrl
                  id="city_id"
                  name="city_id"
                  label={user?.school?.cities?.name || "Pilih Kota"}
                  apiUrl={"/api/regions/cities?province_id=" + form.province_id}
                  onSelect={(value) =>
                    setForm({
                      ...form,
                      city_id: value,
                    })
                  }
                  classDialogTrigger="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.city_id && <ErrorLabel message={errors.city_id[0]} />}
              </div>
              <div className="md:col-span-2">
                <Label>Kecamatan</Label>
                <SelectModalUrl
                  id="district_id"
                  name="district_id"
                  label={user?.school?.districts?.name || "Pilih Kecamatan"}
                  apiUrl={"/api/regions/districts?city_id=" + form.city_id}
                  onSelect={(value) =>
                    setForm({
                      ...form,
                      district_id: value,
                    })
                  }
                  classDialogTrigger="bg-slate-300 dark:bg-[#1f2d3a] text-slate-800 dark:text-white"
                />
                {errors.district_id && (
                  <ErrorLabel message={errors.district_id[0]} />
                )}
              </div>

              <div className="md:col-span-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Setting;
