import React, { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import Pagination from "@/components/Pagination";
import useSchoolStore from "@/store/useSchoolStore";
import { showError } from "@/components/ui/toastSonner";
import { useNavigate, useSearchParams } from "react-router";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const List = () => {
  const navigate = useNavigate();
  const { schools, fetchSchoolsAdmin, loading, error } = useSchoolStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSchoolsAdmin(page, search);
      setSearchParams({ page, search });
    }, 500);
    return () => clearTimeout(delay);
  }, [fetchSchoolsAdmin, page, search, setSearchParams]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Daftar Sekolah
          </h1>

          {/* Search input tanpa tombol */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama sekolah / email / NPSN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white dark:bg-[#1f2d3a] rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Memuat data...</p>
          ) : schools?.data?.length > 0 ? (
            <Table className="min-w-full">
              <TableHeader className="bg-teal-200 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead>Nama Sekolah</TableHead>
                  <TableHead>NPSN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Jenjang</TableHead>
                  <TableHead className="text-center w-[80px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.data.map((school, index) => (
                  <TableRow
                    key={school.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 bg-teal-100 dark:bg-gray-800"
                  >
                    <TableCell className="text-center">
                      {(schools.current_page - 1) * schools.per_page +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.npsn}</TableCell>
                    <TableCell>{school.email}</TableCell>
                    <TableCell>{school.phone || "-"}</TableCell>
                    <TableCell className="uppercase">
                      {school.education_level}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        onClick={() =>
                          navigate(`/admin/school/${school.id}/show`, {
                            state: { school },
                          })
                        }
                        className="bg-sky-500 dark:bg-sky-900 hover:bg-sky-600 dark:hover:bg-sky-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-4 text-center text-gray-500">
              Tidak ada data sekolah ditemukan.
            </p>
          )}
        </div>

        {/* Pagination */}
        {schools?.total > 0 && (
          <Pagination
            className="mt-6 bg-teal-200 dark:bg-teal-900 hover:bg-teal-300 dark:hover:bg-teal-700"
            pagination={schools}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default List;
