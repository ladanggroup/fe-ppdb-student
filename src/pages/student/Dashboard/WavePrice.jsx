// src/pages/student/SchoolList.jsx
import { useEffect, useState, useMemo } from "react";
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
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SelectModalUrl from "@/components/SelectModalUrl";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import PaginationSlidingWindow from "@/components/PaginationSlidingWindow";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import formatIdr from "@/utils/formatIdr";
import { capitalizeWords } from "@/utils/string";

export default function WavePrice() {
  const { waves, fetchStudentWaves, loading } = useWaveStore();
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
    education_level: searchParams.get("education_level") || "all",
    search: searchParams.get("search") || "",
  });

  const optionEducationLevel = [
    { value: "all", name: "Semua" },
    { value: "paud", name: "PAUD" },
    { value: "tk/ra", name: "TK/RA" },
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
      education_level: "all",
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
        await fetchStudentWaves(
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
  }, [filters, fetchStudentWaves, page]);

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

  // Group waves by school_id
  const groupedBySchool = useMemo(() => {
    if (!waves?.data) return [];
    const map = new Map();
    waves.data.forEach((wave) => {
      if (!map.has(wave.school_id)) {
        map.set(wave.school_id, { ...wave.school, waves: [], totalQuota: 0 });
      }
      const schoolObj = map.get(wave.school_id);
      schoolObj.waves.push(wave);
      schoolObj.totalQuota += wave.quota || 0; // jumlahkan kuota
    });
    return Array.from(map.values());
  }, [waves]);

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6 items-center bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <h1 className="text-2xl font-bold dark:text-white mb-6">
          Daftar Harga Pendaftaran Sekolah
        </h1>

        {/* Search & Filter */}
        <div className="mb-10 w-full">
          <div className="flex items-center relative mb-4">
            <Search className="absolute left-2 top-2 dark:text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari sekolah..."
              value={filters.search}
              onChange={(e) => handleFilterChange(e)}
              name="search"
              className="pl-8"
            />
            <Button
              type="button"
              onClick={reset}
              className="ml-4 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            >
              Reset
            </Button>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Jenjang */}
            <div>
              <Label className="block text-left dark:text-white mb-2">
                Jenjang
              </Label>
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
                <SelectContent className="bg-white dark:bg-gray-700">
                  {optionEducationLevel.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provinsi */}
            <div>
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
            <div>
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
            <div>
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

        {/* Grid Sekolah */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : groupedBySchool.length === 0 ? (
          <h2 className="text-xl text-center font-semibold text-gray-500">
            Tidak Ada Sekolah Tersedia
          </h2>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {groupedBySchool.map((school) => (
              <div
                key={school.id}
                className="border rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800"
              >
                {/* Header Sekolah */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={school.logo_url}
                    alt={school.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {school.name}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {capitalizeWords(school.districts?.name)},{" "}
                      {capitalizeWords(school.cities?.name)},{" "}
                      {capitalizeWords(school.provinces?.name)}
                    </p>
                    <p className="text-sm text-orange-600 font-semibold mt-1">
                      Pagu Sekolah: {school.totalQuota} Murid
                    </p>
                  </div>
                </div>

                {/* Daftar Gelombang */}
                <div className="space-y-3">
                  {school.waves.map((wave) => (
                    <div
                      key={wave.id}
                      className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {wave.name}
                        </h3>
                        <p className="text-orange-600 font-semibold">
                          {formatIdr(wave.price)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(wave.start_date).toLocaleDateString("id-ID")}{" "}
                        – {new Date(wave.end_date).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Kuota Gelombang: {wave.quota} Murid
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <PaginationSlidingWindow
            currentPage={waves?.current_page || 1}
            totalPages={waves?.last_page || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
