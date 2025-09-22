// src/components/student/PersonalInfo.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem } from "@/components/ui/select";
import SelectModalUrl from "@/components/SelectModalUrl";
import ErrorLabel from "@/components/ErrorLabel";

const PersonalInfo = ({ formData, handleChange, formErrors, provinces, cities, districts }) => {
  const optionGender = [
    { id: "Laki-laki", name: "Laki-laki" },
    { id: "Perempuan", name: "Perempuan" },
  ];

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        1. Informasi Pribadi Siswa
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Lengkapi data pribadi Anda.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label htmlFor="name" className="block text-left mb-2 dark:text-white">Nama Lengkap</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            disabled
          />
          {formErrors.name && <ErrorLabel message={formErrors.name} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="school_origin" className="block text-left mb-2 dark:text-white">Asal Sekolah</Label>
          <Input
            type="text"
            name="school_origin"
            id="school_origin"
            value={formData.school_origin}
            onChange={handleChange}
            placeholder="Masukkan asal sekolah Anda"
          />
          {formErrors.school_origin && <ErrorLabel message={formErrors.school_origin} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="phone" className="block text-left mb-2 dark:text-white">Nomor Telepon</Label>
          <Input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Masukkan nomor telepon Anda"
          />
          {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="birth_date" className="block text-left mb-2 dark:text-white">Tanggal Lahir</Label>
          <Input
            type="date"
            name="birth_date"
            id="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            placeholder="Masukkan tanggal lahir Anda"
          />
          {formErrors.birth_date && <ErrorLabel message={formErrors.birth_date} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="birth_place" className="block text-left mb-2 dark:text-white">Tempat Lahir</Label>
          <Input
            type="text"
            name="birth_place"
            id="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Masukkan tempat lahir Anda"
          />
          {formErrors.birth_place && <ErrorLabel message={formErrors.birth_place} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="gender" className="block text-left mb-2 dark:text-white">Jenis Kelamin</Label>
          <Select
            name="gender"
            id="gender"
            value={formData.gender || undefined}
            onValueChange={(value) => handleChange({ target: { name: "gender", value } })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionGender.map((option) => (
                <SelectItem className="hover:bg-ppdb-soft focus:bg-ppdb-soft" key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.gender && <ErrorLabel message={formErrors.gender} />}
        </div>

        <div className="col-span-full">
          <Label htmlFor="address" className="block text-left mb-2 dark:text-white">Alamat Lengkap</Label>
          <Textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="min-h-[5rem] bg-white"
            placeholder="Masukkan alamat lengkap Anda"
          />
          {formErrors.address && <ErrorLabel message={formErrors.address} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="province_id" className="block text-left mb-2 dark:text-white">Provinsi</Label>
          <SelectModalUrl
            label={provinces.find((p) => p.id === formData.province_id)?.name || "Pilih Provinsi"}
            apiUrl={"/api/regions/provinces"}
            onSelect={(id) => handleChange({ target: { name: "province_id", value: id } })}
          />
          {formErrors.province_id && <ErrorLabel message={formErrors.province_id} />}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="city_id" className="block text-left mb-2 dark:text-white">Kota/Kabupaten</Label>
          <SelectModalUrl
            label={cities.find((c) => c.id === formData.city_id)?.name || "Pilih Kota/Kabupaten"}
            apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
            onSelect={(id) => handleChange({ target: { name: "city_id", value: id } })}
            disabled={!formData.province_id}
          />
          {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
        </div>

        <div className="sm:col-span-full">
          <Label htmlFor="district_id" className="block text-center mb-2 dark:text-white">Kecamatan</Label>
          <SelectModalUrl
            label={districts.find((d) => d.id === formData.district_id)?.name || "Pilih Kecamatan"}
            apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
            onSelect={(id) => handleChange({ target: { name: "district_id", value: id } })}
            disabled={!formData.city_id}
          />
          {formErrors.district_id && <ErrorLabel message={formErrors.district_id} />}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
