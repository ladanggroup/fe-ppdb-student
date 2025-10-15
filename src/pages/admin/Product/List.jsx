// src/pages/admin/Produk/List.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, Outlet } from "react-router";
import useProducts from "@/store/useProductStore";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import formatIdr from "@/utils/formatIdr";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/LoadingOverlay";

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
    if (window.confirm("Anda yakin ingin menghapus produk ini?")) {
      destroy(productId);
      list(page, search);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      {/* overlay loading */}
      {loading && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Daftar Produk</h1>
        {/* Search tanpa tombol */}
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchParams({ search: e.target.value, page: 1 });
          }}
          placeholder="Cari produk..."
          className="w-2/3 py-2 px-4 border border-gray-300 rounded-lg"
        />
        <Link
          to="/admin/product/create"
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
        >
          Buat Produk
        </Link>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-2">No</th>
            <th className="p-2">Nama</th>
            <th className="p-2">Durasi</th>
            <th className="p-2">Harga</th>
            <th className="p-2">Status</th>
            {/* <th className="p-2">Fitur</th> */}
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.data?.map((product, index) => (
            <tr key={product.id}>
              <td className="text-center border-b border-gray-200 p-2">
                {products.from + index}
              </td>
              <td className="text-center border-b border-gray-200 p-2">{product.name}</td>
              <td className="text-center border-b border-gray-200 p-2">{product.duration}</td>
              <td className="text-center border-b border-gray-200 p-2">
                {formatIdr(product.price)}
              </td>
              <td className="text-center border-b border-gray-200 p-2">{product.status}</td>
              {/* <td className="p-2">
                {product.features && product.features.length > 0 ? (
                  <div>
                    {product.features.map((f, i) => (
                      <React.Fragment key={i}>
                        {f.name}
                        {i < product.features.length - 1 && ", "}
                        {(i + 1) % 2 === 0 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td> */}
              <td className="text-center border-b border-gray-200  p-2">
                <Link
                  to={`/admin/product/${product.id}/edit`}
                  className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-lg mr-2"
                >
                  Edit
                </Link>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination pagination={products} onPageChange={handlePageChange} />
      <Outlet />
    </DashboardLayout>
  );
};

export default List;
