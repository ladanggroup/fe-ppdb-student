// src/components/student/SchoolSelection.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErrorLabel from "@/components/ErrorLabel";
import { Plus, X } from "lucide-react"; // Import Plus and X icons
import formatIdr from "@/utils/formatIdr";
import SelectModalUrl from "../SelectModalUrl";
import useWaveStore from "@/store/useWaveStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import Pagination from "../Pagination";
import { useSearchParams } from "react-router";

const SchoolSelection = ({
  formData,
  formErrors,
  provinces,
  cities,
  districts,
  onSchoolSelectionChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
  const [filters, setFilters] = useState({
    province_id: searchParams.get("province_id") || null,
    city_id: searchParams.get("city_id") || null,
    district_id: searchParams.get("district_id") || null,
    education_level: searchParams.get("education_level") || "",
  });
  const { fetchPublicWaves, waves, loading: wavesLoading } = useWaveStore();

    // update params url setiap kali filter berubah
  useEffect(() => {
    const params = {};
    if (filters.education_level) params.education_level = filters.education_level;
    if (filters.province_id) params.province_id = filters.province_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.district_id) params.district_id = filters.district_id;
    if (page) params.page = page;

    setSearchParams(params);
  }, [filters, page, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPublicWaves(
          filters.province_id,
          filters.city_id,
          filters.district_id,
          filters.education_level === "all" ? null : filters.education_level
        );
      } catch (error) {
        console.error("Error fetching waves:", error);
      }
    };

    fetchData();
  }, [filters, fetchPublicWaves]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSchoolSelection = (wave) => {
    const schoolId = wave.school.id;
    const isCurrentlySelected = formData.selected_schools.some(
      (s) => s.school_id === schoolId
    );

    onSchoolSelectionChange(wave, !isCurrentlySelected); // Pass wave object and selection status
  };

  const isSchoolSelected = (schoolId) => {
    return formData.selected_schools.some((s) => s.school_id === schoolId);
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());
      return { ...params, page: newPage };
    });
  };

  const optionEducationLevel = [
    { value: "all", name: "Semua" },
    { value: "sd/mi", name: "SD/MI" },
    { value: "smp/mts", name: "SMP/MTs" },
    { value: "sma/ma/smk/mak", name: "SMA/MA/SMK/MAK" },
  ];
  console.log(waves);

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <LoadingOverlay isLoading={wavesLoading} />
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        2. Pemilihan Sekolah & Gelombang
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Pilih satu atau lebih sekolah yang ingin Anda daftar.
      </p>

      <div className="mt-4 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="dark:text-white">Jenjang Pendidikan</Label>
            <Select
              value={filters.education_level}
              onValueChange={(value) =>
                handleFilterChange({
                  target: { name: "education_level", value },
                })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Pilih Jenjang" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {optionEducationLevel.map((level) => (
                  <SelectItem
                    className="focus:bg-ppdb-soft hover:bg-ppdb-soft"
                    key={level.value}
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
          {/* Add more filters for Province, City, District using SelectModalUrl if needed */}
          {/* Example for Province (requires fetching provinces in parent and passing down) */}
          <div>
            <Label className="dark:text-white">Provinsi</Label>
            <SelectModalUrl
              label={
                provinces.find((p) => p.id === filters.province_id)?.name ||
                "Pilih Provinsi"
              }
              apiUrl={"/api/regions/provinces"}
              onSelect={(id) =>
                handleFilterChange({
                  target: { name: "province_id", value: id },
                })
              }
            />
          </div>
          <div>
            <Label className="dark:text-white">Kota/Kabupaten</Label>
            <SelectModalUrl
              label={
                cities.find((c) => c.id === filters.city_id)?.name ||
                "Pilih Kota"
              }
              apiUrl={`/api/regions/cities?province_id=${filters.province_id}`}
              onSelect={(id) =>
                handleFilterChange({ target: { name: "city_id", value: id } })
              }
            />
          </div>
          <div>
            <Label className="dark:text-white">Kecamatan</Label>
            <SelectModalUrl
              label={
                districts.find((d) => d.id === filters.district_id)?.name ||
                "Pilih Kecamatan"
              }
              apiUrl={`/api/regions/districts?city_id=${filters.city_id}`}
              onSelect={(id) =>
                handleFilterChange({
                  target: { name: "district_id", value: id },
                })
              }
            />
          </div>
        </div>

        {/* Available Schools */}
        <h4 className="text-md font-semibold dark:text-white mt-6">
          Sekolah Tersedia:
        </h4>
        {waves.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada sekolah yang tersedia dengan gelombang aktif saat ini atau
            sesuai filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waves.data?.map((wave) => (
              <Card
                key={wave.id}
                className={`relative ${
                  isSchoolSelected(wave.school.id)
                    ? "border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-500/10"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600/50"
                }`}
              >
                <CardHeader>
                  <CardTitle>{wave.school.name}</CardTitle>
                  <CardDescription>
                    {wave.school.education_level.toUpperCase()} -{" "}
                    {wave.school.address}, {wave.school.districts?.name},{" "}
                    {wave.school.cities?.name}, {wave.school.provinces?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium dark:text-white">
                    Gelombang: {wave.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(wave.start_date).toLocaleDateString()} -{" "}
                    {new Date(wave.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium dark:text-white mt-2">
                    Biaya Pendaftaran: {formatIdr(wave?.price)}
                  </p>
                  <p className="text-sm font-medium dark:text-white mt-2">
                    Kuota Tersisa: {wave?.quota}
                  </p>
                  <p className="text-sm font-medium dark:text-white mt-2">
                    Keterangan: {wave?.description || "Tidak ada deskripsi"}
                  </p>
                  <Button
                    type="button"
                    variant={
                      isSchoolSelected(wave.school.id)
                        ? "destructive"
                        : "default"
                    }
                    size="icon" // Make it a small icon button
                    className="absolute top-3 right-3 rounded-full"
                    onClick={() => handleToggleSchoolSelection(wave)}
                  >
                    {isSchoolSelected(wave.school.id) ? (
                      <X size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Pagination
          className={"bg-ppdb-orange hover:bg-ppdb-orange-dark"}
          pagination={waves}
          onPageChange={handlePageChange}
        />

        {formErrors.selected_schools && (
          <ErrorLabel message={formErrors.selected_schools} />
        )}

        {/* Selected Schools */}
        <h4 className="text-md font-semibold dark:text-white mt-6">
          Sekolah Pilihan Anda:
        </h4>
        {formData.selected_schools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada sekolah yang dipilih.
          </p>
        ) : (
          <div className="space-y-2">
            {formData.selected_schools.map((school) => (
              <div
                key={school.school_id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div>
                  <p className="text-left font-medium dark:text-white">
                    {school.school_name}
                  </p>
                  <p className="text-left text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Gelombang: {school.wave_name}
                  </p>
                  <p className="text-left text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Biaya Pendaftaran: {formatIdr(school.product_price)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon" // Make it a small icon button
                  onClick={() =>
                    handleToggleSchoolSelection({
                      school: { id: school.school_id },
                      id: school.wave_id,
                    })
                  } // Pass minimal data to deselect
                >
                  <X size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolSelection;
