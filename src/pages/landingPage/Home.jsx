import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import useSchoolStore from "@/store/useSchoolStore";
import useRegionStore from "@/store/regionStore";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectModalUrl from "@/components/SelectModalUrl";
import LoadingOverlay from "@/components/LoadingOverlay";
import PaginationSlidingWindow from "@/components/PaginationSlidingWindow";
import { capitalizeWords } from "@/utils/string";

export default function Home() {
  const { schools, fetchSchoolsStudent, loading } = useSchoolStore();
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
        await fetchSchoolsStudent(
          page,
          filters.search,
          filters.province_id,
          filters.city_id,
          filters.district_id,
          filters.education_level === "all" ? null : filters.education_level
        );
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [
    filters.search,
    filters.province_id,
    filters.city_id,
    filters.district_id,
    filters.education_level,
    page,
    fetchSchoolsStudent,
  ]);

  // update params url setiap kali filter berubah
  useEffect(() => {
    // Cek apakah ada filter yang aktif
    const hasActiveFilter =
      (filters.education_level && filters.education_level !== "all") ||
      filters.province_id ||
      filters.city_id ||
      filters.district_id ||
      filters.search ||
      page !== 1; // default page 1 juga tidak perlu tampil

    // Jika tidak ada filter aktif → hapus semua query param
    if (!hasActiveFilter) {
      setSearchParams({});
      return;
    }

    // Jika ada filter aktif → buat query params-nya
    const params = {};

    if (filters.education_level && filters.education_level !== "all")
      params.education_level = filters.education_level;

    if (filters.province_id) params.province_id = filters.province_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.district_id) params.district_id = filters.district_id;
    if (filters.search) params.search = filters.search;
    if (page && page !== 1) params.page = page;

    setSearchParams(params);
  }, [filters, page, setSearchParams]);

  if (loading) return <LoadingOverlay />;

  return (
    <LandingPageLayout>
      <div className="overflow-y-auto">
        <section className="text-center py-16 bg-orange-50">
          <h1 className="text-4xl font-bold">
            Situs <span className="text-orange-500">PPDB Online</span>
          </h1>
          <p className="mt-2">
            Pendaftaran Sekolah Dalam Genggaman, Langkah Cepat Menuju
          </p>
          <p className="mt-1">Sekolah Impian</p>
        </section>

        <div className="px-10 py-12 text-left">
          <h1 className="text-3xl font-bold mb-4">Daftar Sekolah</h1>
          <div className="mb-10 py-4 px-4 w-full border border-gray-200 dark:border-gray-700 rounded-xl">
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
                <Label className="block text-left mb-2">Jenjang</Label>
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
                        className="hover:bg-orange-soft-200"
                        key={item.value}
                        value={item.value}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provinsi */}
              <div>
                <Label className="block text-left mb-2">Provinsi</Label>
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
                <Label className="block text-left mb-2">Kota/Kabupaten</Label>
                <SelectModalUrl
                  label={
                    cities.find((c) => c.id === filters.city_id)?.name ||
                    "Pilih Kota/Kabupaten"
                  }
                  value={filters.city_id || null}
                  apiUrl={`/api/regions/cities?province_id=${filters.province_id}`}
                  onSelect={(id) =>
                    handleFilterChange({
                      target: { name: "city_id", value: id },
                    })
                  }
                  disabled={!filters.province_id}
                />
              </div>

              {/* Kecamatan */}
              <div>
                <Label className="block text-left mb-2">Kecamatan</Label>
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
            {loading ? (
              <LoadingOverlay />
            ) : schools?.data?.length === 0 ? (
              <div className="mt-8">
                <p className="text-center font-semibold">
                  Tidak ada sekolah yang cocok
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {schools?.data?.map((school) => (
                    <div
                      key={school.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={school?.logo_url || "/src/assets/Group 1078.png"}
                          alt="Logo Sekolah"
                          className="w-26 h-24 border border-gray-600 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {school.name}
                          </h3>
                          <p className="text-sm">
                            {capitalizeWords(school.provinces?.name)},{" "}
                            {capitalizeWords(school.cities?.name)},{" "}
                            {capitalizeWords(school.districts?.name)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/${school.slug}`}
                          className="bg-ppdb-orange hover:bg-orange-soft-200 text-white font-semibold py-2 px-4 rounded-md"
                        >
                          Lihat Sekolah
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <PaginationSlidingWindow
                    currentPage={schools?.current_page || 1}
                    totalPages={schools?.last_page || 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
}
