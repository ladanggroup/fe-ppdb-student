// src/components/student/register/PersonalInfo.jsx
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectModalUrl from "@/components/SelectModalUrl";
import useRegionStore from "@/store/regionStore";
import useFile from "@/hooks/useFile";
import ErrorLabel from "@/components/ErrorLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import formatIdr from "@/utils/formatIdr";

/**
 * Props:
 * - formData, setFormData, formErrors, setFormErrors
 */
export default function PersonalInfo({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  waves,
  disabled,
}) {
  const {
    fetchProvinces,
    provinces,
    fetchCities,
    cities,
    fetchDistricts,
    districts,
  } = useRegionStore();

  useEffect(() => {
    if (waves.length > 0 && !formData.wave_id) {
      setFormData((prev) => ({
        ...prev,
        wave_id: waves?.[0].id,
      }));
    }
  }, [waves, formData.wave_id, setFormData]);

  const optionReligion = [
    { id: "Islam", name: "Islam" },
    { id: "Kristen", name: "Kristen" },
    { id: "Katolik", name: "Katolik" },
    { id: "Hindu", name: "Hindu" },
    { id: "Budha", name: "Budha" },
    { id: "Konghucu", name: "Konghucu" },
  ];

  const optionGender = [
    { id: "Laki-laki", name: "Laki-laki" },
    { id: "Perempuan", name: "Perempuan" },
  ];

  useEffect(() => {
    fetchProvinces?.();
  }, [fetchProvinces]);

  useEffect(() => {
    if (formData.province_id) fetchCities?.(formData.province_id);
  }, [formData.province_id, fetchCities]);

  useEffect(() => {
    if (formData.city_id) fetchDistricts?.(formData.city_id);
  }, [formData.city_id, fetchDistricts]);

  // useFile untuk avatar (lokal untuk step ini)
  const { preview, handleFileChange, uploadedUrl, isUploading, deleteFile } =
    useFile({
      folder: "student/avatar",
      onSuccess: (res) => {
        // backend should return path
        setFormData((prev) => ({
          ...prev,
          avatar: res.path || res.url || prev.avatar,
        }));
        setFormErrors((prev) => ({ ...prev, avatar: null }));
      },
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Data Pribadi</h3>
      <p className="text-sm text-gray-500 mb-4">Lengkapi data pribadi Anda.</p>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        {/* Upload Foto */}
        <div className="sm:col-span-3">
          <Label className="block mb-2">Upload Foto</Label>
          <div className="flex flex-col items-center justify-center">
            <label className="w-52 h-64 rounded-md border-2 border-dashed flex items-center justify-center p-2 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e)}
                disabled={isUploading || disabled}
              />
              {preview || uploadedUrl || formData.avatar ? (
                <img
                  src={preview || uploadedUrl || formData.image}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="text-xs text-gray-500 text-center">
                  Unggah foto (JPG/PNG) <br /> hingga 10MB
                </div>
              )}
            </label>
            {formData.avatar && (
              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm text-red-500 cursor-pointer"
                  onClick={() => {
                    deleteFile?.(formData.avatar);
                    setFormData((prev) => ({ ...prev, avatar: null }));
                  }}
                  disabled={isUploading || disabled}
                >
                  Hapus Foto
                </button>
              </div>
            )}
            {formErrors.avatar && <ErrorLabel message={formErrors.avatar} />}
          </div>
        </div>
        <div className="sm:col-span-3 mb-4">
          <div className="mb-6">
            <Label className="block mb-2">Nama Lengkap</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan Nama Lengkap"
              disabled
            />
            {formErrors.name && <ErrorLabel message={formErrors.name} />}
          </div>

          <div className="mb-6">
            <Label className="block mb-2">NISN</Label>
            <Input
              name="nisn"
              value={formData.nisn}
              onChange={handleChange}
              disabled
            />
            {formErrors.nisn && <ErrorLabel message={formErrors.nisn} />}
          </div>

          <div className="mb-6">
            <Label className="block mb-2">No. Telepon</Label>
            <Input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Masukkan No. Telepon"
              disabled={disabled}
            />
            {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="gender" className="block mb-2">
              Jenis Kelamin
            </Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) =>
                handleChange({ target: { name: "gender", value } })
              }
              disabled={disabled}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {optionGender.map((option) => (
                  <SelectItem
                    className="hover:bg-[#3897F0] focus:bg-[#3897F0]"
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.gender && <ErrorLabel message={formErrors.gender} />}
          </div>
        </div>

        <div className="sm:col-span-3 mb-4">
          <Label htmlFor="religion" className="block mb-2">
            Agama
          </Label>
          <Select
            value={formData.religion || ""}
            onValueChange={(value) =>
              handleChange({ target: { name: "religion", value } })
            }
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Pilih Agama" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionReligion.map((option) => (
                <SelectItem
                  className="hover:bg-[#3897F0] focus:bg-[#3897F0]"
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.religion && <ErrorLabel message={formErrors.religion} />}
        </div>

        <div className="sm:col-span-3 mb-4">
          <Label className="block mb-2">Asal Sekolah</Label>
          <Input
            name="school_origin"
            value={formData.school_origin}
            onChange={handleChange}
            placeholder="Masukkan Asal Sekolah"
            disabled={disabled}
          />
          {formErrors.school_origin && (
            <ErrorLabel message={formErrors.school_origin} />
          )}
        </div>

        <div className="sm:col-span-3 mb-4">
          <Label className="block mb-2">Tempat Lahir</Label>
          <Input
            name="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Masukkan Tempat Lahir"
            disabled={disabled}
          />
          {formErrors.birth_place && (
            <ErrorLabel message={formErrors.birth_place} />
          )}
        </div>

        <div className="sm:col-span-3 mb-4">
          <Label className="block mb-2">Tanggal Lahir</Label>
          <Input
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            disabled={disabled}
          />
          {formErrors.birth_date && (
            <ErrorLabel message={formErrors.birth_date} />
          )}
        </div>

        <div className="w-full sm:col-span-6 mb-4">
          <Label className="block mb-2">Gelombang</Label>
          <span className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 block w-full text-gray-700">
            {waves.length > 0
              ? `${
                  waves.find((w) => w.id === formData.wave_id)?.name
                } - ${formatIdr(
                  waves.find((w) => w.id === formData.wave_id)?.price || 0
                )}`
              : "Tidak ada gelombang tersedia"}
          </span>
        </div>

        <div className="sm:col-span-6 mt-4 border-t border-gray-900/10 pt-4">
          <h4 className="font-medium mb-2">Alamat Domisili</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative space-y-4">
              <div>
                <Label className="block mb-2">Provinsi</Label>
                <SelectModalUrl
                  label={
                    provinces.find((p) => p.id === formData.province_id)
                      ?.name || "Pilih Provinsi"
                  }
                  apiUrl="/api/regions/provinces"
                  onSelect={(id) => {
                    setFormData((prev) => ({
                      ...prev,
                      province_id: id,
                      city_id: null,
                      district_id: null,
                    }));
                  }}
                  disabled={disabled}
                />
                {formErrors.province_id && (
                  <ErrorLabel message={formErrors.province_id} />
                )}
              </div>

              <div>
                <Label className="block mb-2">Kecamatan</Label>
                <SelectModalUrl
                  label={
                    districts.find((d) => d.id === formData.district_id)
                      ?.name || "Pilih Kecamatan"
                  }
                  apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
                  onSelect={(id) =>
                    setFormData((prev) => ({ ...prev, district_id: id }))
                  }
                  disabled={!formData.city_id || disabled}
                />
                {formErrors.district_id && (
                  <ErrorLabel message={formErrors.district_id} />
                )}
              </div>
            </div>

            <div className="relative space-y-4">
              <div>
                <Label className="block mb-2">Kota / Kabupaten</Label>
                <SelectModalUrl
                  label={
                    cities.find((c) => c.id === formData.city_id)?.name ||
                    "Pilih Kota/Kabupaten"
                  }
                  apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
                  onSelect={(id) =>
                    setFormData((prev) => ({
                      ...prev,
                      city_id: id,
                      district_id: null,
                    }))
                  }
                  disabled={!formData.province_id || disabled}
                />
                {formErrors.city_id && (
                  <ErrorLabel message={formErrors.city_id} />
                )}
              </div>

              <div>
                <Label className="block mb-2">Kode Pos</Label>
                <Input
                  type="number"
                  name="postal_code"
                  value={formData?.postal_code || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                  placeholder="Kode Pos"
                  disabled={disabled}
                />
                {formErrors.postal_code && (
                  <ErrorLabel message={formErrors.postal_code} />
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label className="block mb-2">Alamat Lengkap</Label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="min-h-[6rem]"
                placeholder="Alamat Lengkap"
                disabled={disabled}
                required
              />
              {formErrors.address && (
                <ErrorLabel message={formErrors.address} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
