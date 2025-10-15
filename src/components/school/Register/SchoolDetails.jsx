// src/components/school/Register/SchoolDetails.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import SelectModalUrl from "../../SelectModalUrl";
import useFile from "@/hooks/useFile";
import ErrorLabel from "../../ErrorLabel";
import { Link } from "react-router";

const SchoolDetails = ({
  setFormData,
  formData,
  formErrors,
  handleChange,
  provinces,
  cities,
  districts,
  disabled,
}) => {
  const optionEducationLevel = [
    { id: 1, name: "PAUD", value: "paud" },
    { id: 2, name: "TK/RA", value: "tk/ra" }, //RA(Raudhatul Athfal)
    { id: 3, name: "SD/MI", value: "sd/mi" },
    { id: 4, name: "SMP/MTs", value: "smp/mts" },
    { id: 5, name: "SMA/MA/SMK/MAK", value: "sma/ma/smk/mak" },
  ];

  // Upload dokumen sekolah
  const { uploadedUrl: docUrl, handleFileChange: handleDocChange } = useFile({
    fieldName: "file",
    folder: "school/documents",
    onSuccess: (res) =>
      setFormData({ ...formData, school_document_file: res.path }),
    onError: (err) => console.error("Upload dokumen gagal", err),
  });

  // Upload logo sekolah
  const { uploadedUrl: logoUrl, handleFileChange: handleLogoChange } = useFile({
    fieldName: "file",
    folder: "school/logo",
    onSuccess: (res) => setFormData({ ...formData, school_logo: res.path }),
    onError: (err) => console.error("Upload logo gagal", err),
  });

  const getFileName = (path) =>
    !path ? "" : path.split("/").pop().split("?")[0];

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 text-center">
        1. Informasi Detail Sekolah
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
        Isi informasi dasar sekolah beserta dokumen pendukung.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Logo */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Logo Sekolah</Label>
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4">
            {logoUrl || formData?.school_logo ? (
              <>
                <img
                  src={logoUrl || formData?.school_logo_url}
                  alt="Logo Sekolah"
                  className="h-20 w-20 object-contain mb-2"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Logo terpilih: {getFileName(formData?.school_logo)}
                </p>
              </>
            ) : (
              <svg
                className="h-12 w-12 text-gray-300 mb-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7h20L12 2zm0 18c-4.97 0-9-1.79-9-4V9l9 5 9-5v7c0 2.21-4.03 4-9 4z" />
              </svg>
            )}
            <label
              htmlFor="school_logo"
              className="cursor-pointer text-indigo-600 hover:underline text-sm"
            >
              Pilih Logo
              <input
                id="school_logo"
                name="school_logo"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={disabled}
              />
            </label>
            {formErrors.school_logo && (
              <ErrorLabel message={formErrors.school_logo} />
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          {/* Nama Sekolah */}
          <div className="sm:col-span-3 mb-4">
            <Label className="block text-left mb-2">Nama Sekolah</Label>
            <Input
              type="text"
              name="school_name"
              id="school_name"
              value={formData.school_name}
              onChange={handleChange}
              placeholder="Masukkan nama sekolah"
              disabled={disabled}
            />
            {formErrors.school_name && (
              <ErrorLabel message={formErrors.school_name} />
            )}
          </div>

          {/* NPSN */}
          <div className="sm:col-span-3 mb-4">
            <Label className="block text-left mb-2">NPSN</Label>
            <Input
              type="number"
              name="npsn"
              id="npsn"
              value={formData.npsn}
              onChange={handleChange}
              placeholder="Masukkan NPSN"
              disabled={disabled}
            />
            {formErrors.npsn && <ErrorLabel message={formErrors.npsn} />}
          </div>

          {/* Email */}
          <div className="sm:col-span-3">
            <Label className="block text-left mb-2">Email Sekolah</Label>
            <Input
              type="email"
              name="school_email"
              id="school_email"
              value={formData.school_email}
              onChange={handleChange}
              placeholder="Masukkan email sekolah"
              disabled={disabled}
            />
            {formErrors.school_email && (
              <ErrorLabel message={formErrors.school_email} />
            )}
          </div>
        </div>

        {/* Telepon */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Nomor Telepon</Label>
          <Input
            type="number"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Masukkan nomor telepon sekolah"
            disabled={disabled}
          />
          {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
        </div>

        {/* Jenjang Pendidikan */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Jenjang Pendidikan</Label>
          <Select
            value={formData.education_level}
            onValueChange={(value) =>
              handleChange({ target: { name: "education_level", value } })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenjang" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionEducationLevel.map((level) => (
                <SelectItem
                  className="hover:bg-orange-soft-200"
                  key={level.id}
                  value={level.value}
                >
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.education_level && (
            <ErrorLabel message={formErrors.education_level} />
          )}
        </div>

        {/* Alamat */}
        <div className="col-span-full">
          <Label className="block text-left mb-2">Alamat</Label>
          <Textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            disabled={disabled}
            placeholder="Masukkan alamat sekolah"
          />
          {formErrors.address && <ErrorLabel message={formErrors.address} />}
        </div>

        {/* Provinsi */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Provinsi</Label>
          <SelectModalUrl
            label={
              provinces.find((p) => p.id === formData.province_id)?.name ||
              "Pilih Provinsi"
            }
            apiUrl={"/api/regions/provinces"}
            name="province_id"
            onSelect={(id) =>
              handleChange({ target: { name: "province_id", value: id } })
            }
            disabled={disabled}
          />
          {formErrors.province_id && (
            <ErrorLabel message={formErrors.province_id} />
          )}
        </div>

        {/* Kota */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Kota/Kabupaten</Label>
          <SelectModalUrl
            label={
              cities.find((c) => c.id === formData.city_id)?.name ||
              "Pilih Kota"
            }
            name="city_id"
            apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "city_id", value: id } })
            }
            disabled={!formData.province_id || disabled}
          />
          {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
        </div>

        {/* Kecamatan */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Kecamatan</Label>
          <SelectModalUrl
            label={
              districts.find((d) => d.id === formData.district_id)?.name ||
              "Pilih Kecamatan"
            }
            name="district_id"
            apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "district_id", value: id } })
            }
            disabled={!formData.city_id || disabled}
          />
          {formErrors.district_id && (
            <ErrorLabel message={formErrors.district_id} />
          )}
        </div>

        {/* Kode Pos */}
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Kode Pos</Label>
          <Input
            type="text"
            name="postal_code"
            id="postal_code"
            value={formData.postal_code || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Masukkan kode pos sekolah"
          />
          {formErrors.postal_code && (
            <ErrorLabel message={formErrors.postal_code} />
          )}
        </div>

        {/* Dokumen Sekolah */}
        <div className="col-span-full">
          <Label className="block text-sm font-medium text-gray-900">
            Dokumen Bukti Sekolah (Akta Pendirian / SK Izin Operasional)
          </Label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8">
            <div className="text-center">
              {docUrl || formData?.school_document_file ? (
                <Link
                  to={docUrl || formData?.school_document_file}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Lihat Dokumen
                </Link>
              ) : (
                <p className="text-gray-400">Belum ada file</p>
              )}
              <div className="mt-3">
                <label className="cursor-pointer text-indigo-600 hover:underline text-sm">
                  Unggah File
                  <input
                    id="school_document_file"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleDocChange}
                    disabled={disabled}
                  />
                </label>
              </div>
              {formErrors.school_document_file && (
                <ErrorLabel message={formErrors.school_document_file} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;
