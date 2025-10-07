import { useEffect, useState } from "react";
import { useWaveStore } from "@/store/useWaveStore";
import useRegionStore from "@/store/regionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "../../../components/ui/label";
import SelectModalUrl from "../../../components/SelectModalUrl";
import { Search } from "lucide-react";
import { useSearchParams, Link } from "react-router";
import SchoolDetail from "@/components/SchoolDetail";
import PaginationSlidingWindow from "../../../components/PaginationSlidingWindow";
import { capitalizeWords } from "@/utils/string";

export default function SchoolList() {
  const { waves, fetchPublicWaves, loading } = useWaveStore();
  const {
    fetchProvinces,
    provinces,
    fetchCities,
    cities,
    fetchDistricts,
    districts,
  } = useRegionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [filters, setFilters] = useState({
    province_id: searchParams.get("province_id") || null,
    city_id: searchParams.get("city_id") || null,
    district_id: searchParams.get("district_id") || null,
    education_level: searchParams.get("education_level") || "",
    search: searchParams.get("search") || "",
  });

  const optionEducationLevel = [
    { value: "all", name: "Semua" },
    { value: "sd/mi", name: "SD/MI" },
    { value: "smp/mts", name: "SMP/MTs" },
    { value: "sma/ma/smk/mak", name: "SMA/MA/SMK/MAK" },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());
      return { ...params, page: newPage };
    });
  };

  const reset = () => {
    setFilters({
      province_id: null,
      city_id: null,
      district_id: null,
      education_level: "",
      search: "",
    });
  };

  // load provinsi sekali
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // load kota saat pilih provinsi
  useEffect(() => {
    if (filters.province_id) fetchCities(filters.province_id);
  }, [filters.province_id, fetchCities]);

  // load kecamatan saat pilih kota
  useEffect(() => {
    if (filters.city_id) fetchDistricts(filters.city_id);
  }, [filters.city_id, fetchDistricts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPublicWaves(
          filters.province_id,
          filters.city_id,
          filters.district_id,
          filters.education_level === "all" ? null : filters.education_level,
          page,
          filters.search
        );
      } catch (error) {
        console.error("Error fetching waves:", error);
      }
    };

    fetchData();
  }, [filters, fetchPublicWaves, page]);

  // update params url setiap kali filter berubah
  useEffect(() => {
    const params = {};
    if (filters.education_level)
      params.education_level = filters.education_level;
    if (filters.province_id) params.province_id = filters.province_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.district_id) params.district_id = filters.district_id;
    if (page) params.page = page;

    setSearchParams(params);
  }, [filters, page, setSearchParams]);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedWave, setSelectedWave] = useState(null);

  if (selectedSchool) {
    return (
      <SchoolDetail
        school={selectedSchool}
        wave={selectedWave}
        onBack={() => {
          setSelectedSchool(null);
          setSelectedWave(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col p-6 items-center bg-gray-50 border border-gray-200 dark:bg-gray-400 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold dark:text-white mb-6">
        Pendaftaran Sekolah Tersedia
      </h1>

      {/* Search & Filter */}
      <div className="mb-6">
        <div className="flex items-center relative mb-4">
          <Search className="absolute left-2 top-2 dark:text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari sekolah..."
            value={filters.search}
            onChange={(e) => handleFilterChange(e)}
            className="pl-8"
          />
          <Button
            type="button"
            onClick={reset}
            className="ml-4 text-ppdb-gray-dark dark:text-white text-sm"
          >
            reset
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectGroup>
            <SelectLabel className="block text-left dark:text-white">
              Jenjang
            </SelectLabel>
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
                {optionEducationLevel.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="focus:bg-ppdb-soft hover:bg-ppdb-soft"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>

          {/* Provinsi */}
          <div className="mt-2">
            <Label className="block text-left dark:text-white mb-2">
              Provinsi
            </Label>
            <SelectModalUrl
              label={
                provinces.find((p) => p.id === filters.province_id)?.name ||
                "Pilih Provinsi"
              }
              value={filters.province_id || null}
              apiUrl="/api/regions/provinces"
              onSelect={(id) =>
                handleFilterChange({
                  target: { name: "province_id", value: id },
                })
              }
            />
          </div>

          {/* Kota */}
          <div className="mt-2">
            <Label className="block text-left dark:text-white mb-2">
              Kota/Kabupaten
            </Label>
            <SelectModalUrl
              label={
                cities.find((c) => c.id === filters.city_id)?.name ||
                "Pilih Kota/Kabupaten"
              }
              value={filters.city_id || null}
              apiUrl={`/api/regions/cities?province_id=${filters.province_id}`}
              onSelect={(id) =>
                handleFilterChange({ target: { name: "city_id", value: id } })
              }
              disabled={!filters.province_id}
            />
          </div>

          {/* Kecamatan */}
          <div className="mt-2">
            <Label className="block text-left dark:text-white mb-2">
              Kecamatan
            </Label>
            <SelectModalUrl
              label={
                districts.find((d) => d.id === filters.district_id)?.name ||
                "Pilih Kecamatan"
              }
              value={filters.district_id || null}
              apiUrl={`/api/regions/districts?city_id=${filters.city_id}`}
              onSelect={(id) =>
                handleFilterChange({
                  target: { name: "district_id", value: id },
                })
              }
              disabled={!filters.city_id}
            />
          </div>
        </div>
      </div>

      {/* Grid daftar sekolah */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : waves?.data?.length === 0 ? (
        <h2 className="text-xl text-center font-semibold text-gray-500">
          Tidak Ada Sekolah Tersedia
        </h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {waves?.data?.map((wave) => (
            <div
              key={wave.id}
              className="border rounded-xl shadow-sm p-4 bg-white flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={wave.school.logo_url || "/src/assets/Group 1078.png"}
                  alt={wave.school.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{wave.school.name}</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-600">
                    {capitalizeWords(wave.school.cities?.name)},{" "}
                    {capitalizeWords(wave.school.provinces?.name)} |{" "}
                    {wave.school.npsn}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-600 mb-2">
                {wave.name}:{" "}
                {new Date(wave.start_date).toLocaleDateString("id")} -{" "}
                {new Date(wave.end_date).toLocaleDateString("id")}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-600 mb-2">
                Kuota: {wave.quota} Murid
              </p>

              <div className="mt-auto flex justify-end">
                <Button
                  onClick={() => {
                    setSelectedSchool(wave.school);
                    setSelectedWave(wave);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <PaginationSlidingWindow
        currentPage={waves?.current_page || 1}
        totalPages={waves?.last_page || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
