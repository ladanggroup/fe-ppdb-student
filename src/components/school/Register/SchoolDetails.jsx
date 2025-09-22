import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
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
}) => {
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
  const { uploadedUrl, handleFileChange } = useFile({
    fieldName: "file",
    folder: "school-documents",
    onSuccess: (response) => {
      setFormData({
        ...formData,
        school_document_file: response.path,
      });
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const getFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("?")[0];
  };

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">
        1. Informasi Detail Sekolah
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Detail mengenai sekolah yang akan didaftarkan.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">NPSN</Label>
          <Input
            type="text"
            name="npsn"
            id="npsn"
            value={formData.npsn}
            onChange={handleChange}
            className="focus:ring-ppdb-orange focus:border-ppdb-orange block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          {formErrors.npsn && <ErrorLabel message={formErrors.npsn} />}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Nama Sekolah</Label>
          <Input
            type="text"
            name="school_name"
            id="school_name"
            value={formData.school_name}
            onChange={handleChange}
            className="focus:ring-ppdb-orange focus:border-ppdb-orange block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          {formErrors.school_name && (
            <ErrorLabel message={formErrors.school_name} />
          )}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Email Sekolah</Label>
          <Input
            type="email"
            name="school_email"
            id="school_email"
            value={formData.school_email}
            onChange={handleChange}
            className="focus:ring-ppdb-orange focus:border-ppdb-orange block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          {formErrors.school_email && (
            <ErrorLabel message={formErrors.school_email} />
          )}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Nomor Telepon Sekolah</Label>
          <Input
            type="number"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="focus:ring-ppdb-orange focus:border-ppdb-orange block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
        </div>

        <div className="col-span-full">
          <Label className="block text-left mb-2">Alamat Sekolah</Label>
          <Textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="focus:ring-ppdb-orange focus:border-ppdb-orange block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          {formErrors.address && <ErrorLabel message={formErrors.address} />}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Jenjang Pendidikan</Label>
          <Select
            name="education_level"
            id="education_level"
            value={formData.education_level}
            onValueChange={(value) =>
              handleChange({ target: { name: "education_level", value } })
            }
          >
            <SelectTrigger className="focus:ring-ppdb-orange focus:border-ppdb-orange">
              <SelectValue placeholder="Pilih Jenjang" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionEducationLevel?.map((level) => (
                <SelectItem key={level.id} value={level.value}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.education_level && (
            <ErrorLabel message={formErrors.education_level} />
          )}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Provinsi</Label>
          <SelectModalUrl
            label={
              provinces.find((province) => province.id === formData.province_id)
                ?.name || "Pilih Provinsi"
            }
            apiUrl={"/regions/provinces"}
            onSelect={(id) =>
              handleChange({ target: { name: "province_id", value: id } })
            }
          />
          {formErrors.province_id && (
            <ErrorLabel message={formErrors.province_id} />
          )}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Kota/Kabupaten</Label>
          <SelectModalUrl
            label={
              cities.find((city) => city.id === formData.city_id)?.name ||
              "Pilih Kota/Kabupaten"
            }
            apiUrl={`/regions/cities?province_id=${formData.province_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "city_id", value: id } })
            }
          />
          {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
        </div>

        <div className="sm:col-span-3">
          <Label className="block text-left mb-2">Kecamatan</Label>
          <SelectModalUrl
            label={
              districts.find((district) => district.id === formData.district_id)
                ?.name || "Pilih Kecamatan"
            }
            apiUrl={`/regions/districts?city_id=${formData.city_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "district_id", value: id } })
            }
          />
          {formErrors.district_id && (
            <ErrorLabel message={formErrors.district_id} />
          )}
        </div>

        <div className="col-span-full">
          <label
            htmlFor="school_document_file"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Dokumen Bukti Sekolah (misal: Akta Pendirian, SK Izin Operasional)
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {uploadedUrl || formData?.school_document_file ? (
                <Link
                  to={uploadedUrl || formData?.school_document_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lihat Dokumen
                </Link>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.69a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="school_document_file"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Unggah file</span>
                  <input
                    id="school_document_file"
                    name="school_document_file"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                </label>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                JPG, PNG, PDF hingga 10MB
              </p>
              {formData.school_document_file && (
                <p className="mt-2 text-sm text-gray-500">
                  File terpilih: {getFileName(formData.school_document_file)}
                </p>
              )}
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
