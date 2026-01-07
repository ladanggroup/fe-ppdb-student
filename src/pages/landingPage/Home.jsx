import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import useSchoolStore from "@/store/useSchoolStore";
import useAuthStore from "@/store/authStore";
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
import { Loader2, Printer } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";
import useSchoolStudent from "@/store/useSchoolStudent";

export default function Home() {
  const { schools, fetchSchoolsStudent, loading } = useSchoolStore();
  const { user } = useAuthStore();
  const {
    fetchProvinces,
    provinces,
    fetchCities,
    cities,
    fetchDistricts,
    districts,
  } = useRegionStore();
  const { printSelectionLetter } = useSchoolStudent();

  localStorage.removeItem("slug");
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

  const fetched = useRef(false);

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

    if (fetched.current) return;
    fetched.current = true;
    fetchData();
    fetched.current = false;
  }, [
    filters.search,
    filters.province_id,
    filters.city_id,
    filters.district_id,
    filters.education_level,
    page,
    fetchSchoolsStudent,
  ]);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    if (schools) {
      fetchProvinces();
    }
  }, [schools, fetchProvinces]);

  // load kota saat pilih provinsi
  useEffect(() => {
    if (filters.province_id) fetchCities(filters.province_id);
  }, [filters.province_id, fetchCities]);

  // load kecamatan saat pilih kota
  useEffect(() => {
    if (filters.city_id) fetchDistricts(filters.city_id);
  }, [filters.city_id, fetchDistricts]);

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

  const handlePrint = async (schoolStudent) => {
    try {
      const response = await printSelectionLetter(
        schoolStudent.registration_number
      );
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Gagal cetak PDF:", error);
    }
  };

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

        {user && loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-800" />
          </div>
        ) : user?.school_students.length === 0 ? (
          <p className="text-gray-700 text-center py-10">
            Belum ada sekolah yang dipilih.
          </p>
        ) : (
          user?.school_students.length > 0 && (
            <div className="px-10 py-12 text-left">
              <h1 className="text-3xl font-bold mb-4">Hasil Seleksi</h1>
              <div className="overflow-x-auto rounded-xl border border-gray-200 mt-10">
                <Table className="text-sm">
                  <TableHeader className="bg-gray-50 [&_th]:text-black">
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nomor Registrasi</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>Nama Peserta</TableHead>
                      <TableHead>NISN</TableHead>
                      <TableHead>Status Seleksi</TableHead>
                      <TableHead className="text-center w-40">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user?.school_students.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="dark:text-gray-800">
                          {user?.school_students.indexOf(item) + 1}
                        </TableCell>
                        <TableCell className="dark:text-gray-800">
                          {item.registration_number}
                        </TableCell>
                        <TableCell className="font-medium dark:text-gray-800">
                          {item.school.name}
                        </TableCell>
                        <TableCell className="dark:text-gray-800">
                          {user.name}
                        </TableCell>
                        <TableCell className="dark:text-gray-800">
                          {user.nisn}
                        </TableCell>
                        <TableCell>
                          <SelectionStatusBadge
                            status={item.selection_status}
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          {item.selection_status === "passed_selection" && (
                            <Button
                              onClick={() => handlePrint(item)}
                              className="bg-orange-500 hover:bg-orange-600 text-white flex gap-2 cursor-pointer mx-auto"
                              size="sm"
                            >
                              <Printer size={14} />
                              Cetak
                            </Button>
                          )}

                          {item.selection_status ===
                            "rejected_data_does_not_match" && (
                            <Link
                              to={
                                "/student/" +
                                item?.school?.slug +
                                "/complete-registration"
                              }
                              className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-md text-xs"
                            >
                              Lengkapi Data
                            </Link>
                          )}

                          {item.selection_status !== "passed_selection" &&
                            item.selection_status !==
                              "rejected_data_does_not_match" && (
                              <span className="text-gray-500 text-xs">
                                Tidak Ada Aksi
                              </span>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        )}

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
