// src/pages/admin/Produk/List.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, Outlet } from "react-router";
import useProducts from "@/store/useProductStore";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit, Trash2 } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import { showError } from "@/components/ui/toastSonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const List = () => {
  const { products, loading, error, list, destroy } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const timeout = setTimeout(() => {
      list(page, search);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [list, page, search]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      destroy(productId);
      list(page, search);
    }
  };

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header dan Pencarian */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Daftar Produk
          </h1>

          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchParams({ search: e.target.value, page: 1 });
              }}
              className="w-full md:w-64 bg-white border border-gray-300 dark:border-gray-600"
            />
            <Link
              to="/admin/product/create"
              className="bg-teal-600 text-white hover:bg-teal-500 px-4 py-2 rounded-lg"
            >
              Buat Produk
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : products?.data?.length === 0 ? (
          <p className="text-gray-600 dark:text-white">Belum ada produk.</p>
        ) : (
          <>
            <Table className="bg-teal-100 dark:bg-gray-800 mt-4 rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-white">
                    No
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Nama
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Durasi
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Harga
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data?.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-teal-200 dark:hover:bg-gray-600 transition"
                  >
                    <TableCell className="text-gray-700 dark:text-white px-3 py-4">
                      {products.from + index}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-white px-3 py-4">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-white px-3 py-4">
                      {product.duration}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-white px-3 py-4">
                      {formatIdr(product.price)}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-white px-3 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status === "active"
                          ? "Aktif"
                          : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2 px-3 py-4">
                      <Link
                        to={`/admin/product/${product.id}/edit`}
                        className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-md"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {/* Pagination */}
        <div className="mt-4">
          <Pagination pagination={products} onPageChange={handlePageChange} />
        </div>
      </div>

      <Outlet />
    </DashboardLayout>
  );
};

export default List;
