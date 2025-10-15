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
import { X } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import SelectModalUrl from "../SelectModalUrl";
import useWaveStore from "@/store/useWaveStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useSearchParams } from "react-router";
import PaginationSlidingWindow from "../PaginationSlidingWindow";

const SchoolSelection = ({
  formData,
  formErrors,
  provinces,
  cities,
  districts,
  onSchoolSelectionChange,
}) => {
  const { fetchPublicWaves, waves, loading: wavesLoading } = useWaveStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [filters, setFilters] = useState({
    province_id: null,
    city_id: null,
    district_id: null,
    education_level: "",
    page: page,
  });

  // reset filter function
  const resetFilters = () => {
    setFilters({
      province_id: null,
      city_id: null,
      district_id: null,
      education_level: "",
      page: 1,
    });
    setSearchParams({});
  };

  // hapus semua filter saat pertama kali komponen mount (refresh halaman)
  useEffect(() => {
    setFilters({
      province_id: null,
      city_id: null,
      district_id: null,
      education_level: "",
      page: 1,
    });
    setSearchParams({});
  }, []);

  // update params url setiap kali filter berubah
  useEffect(() => {
    const params = {};
    if (filters.education_level)
      params.education_level = filters.education_level;
    if (filters.province_id) params.province_id = filters.province_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.district_id) params.district_id = filters.district_id;
    if (filters.page) params.page = filters.page;

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleToggleSchoolSelection = (wave) => {
    const schoolId = wave.school.id;
    const isCurrentlySelected = formData.selected_schools.some(
      (s) => s.school_id === schoolId
    );

    onSchoolSelectionChange(wave, !isCurrentlySelected);
  };

  const isSchoolSelected = (schoolId) => {
    return formData.selected_schools.some((s) => s.school_id === schoolId);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const optionEducationLevel = [
    { value: "all", name: "Semua" },
    { value: "paud", name: "PAUD" },
    { value: "tk/ra", name: "TK/RA" },
    { value: "sd/mi", name: "SD/MI" },
    { value: "smp/mts", name: "SMP/MTs" },
    { value: "sma/ma/smk/mak", name: "SMA/MA/SMK/MAK" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPublicWaves(
          filters.province_id,
          filters.city_id,
          filters.district_id,
          filters.education_level === "all" ? null : filters.education_level,
          filters.page
        );
      } catch (error) {
        console.error("Error fetching waves:", error);
      }
    };

    fetchData();
  }, [filters, fetchPublicWaves]);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
              disabled={!filters.province_id}
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
              disabled={!filters.city_id}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={resetFilters}>
              Reset Filter
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {waves.data?.map((wave) => (
              <Card
                key={wave.id}
                className={`flex flex-col justify-between ${
                  isSchoolSelected(wave.school.id)
                    ? "border-orange-500 ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-500/10"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src={wave.school.logo_url}
                      alt={wave.school.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <CardTitle>{wave.school.name}</CardTitle>
                      <CardDescription>
                        {wave.school.cities?.name} -{" "}
                        {wave.school.provinces?.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 mb-2">
                    <p className="text-sm font-medium dark:text-white">
                      {wave.name}
                    </p>
                    <p className="text-sm font-medium dark:text-white">
                      Kuota Tersisa:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">
                      {new Date(wave.start_date).toLocaleDateString("id")} -{" "}
                      {new Date(wave.end_date).toLocaleDateString("id")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {wave?.quota}
                    </p>
                  </div>
                  <p className="text-sm font-medium dark:text-white">
                    Keterangan:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {wave?.description || "Tidak ada deskripsi"}
                  </p>
                  <p className="text-sm font-medium dark:text-white">
                    Biaya Pendaftaran:
                  </p>
                  <p className="text-sm font-medium dark:text-ppdb-orange">
                    Rp {formatIdr(wave?.price)}
                  </p>

                  <Button
                    type="button"
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handleToggleSchoolSelection(wave)}
                  >
                    {isSchoolSelected(wave.school.id)
                      ? "Batalkan Pilihan"
                      : "Pilih Sekolah"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PaginationSlidingWindow
          currentPage={waves?.current_page || 1}
          totalPages={waves?.last_page || 1}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {school.wave_name}
                  </p>
                  <p className="text-left text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Biaya Pendaftaran: {formatIdr(school.product_price)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex items-center"
                  onClick={() =>
                    handleToggleSchoolSelection({
                      school: { id: school.school_id },
                      id: school.wave_id,
                    })
                  }
                >
                  <X size={16} className="mr-1" /> Batal
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
