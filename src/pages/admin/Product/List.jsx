// src/pages/admin/Produk/List.jsx
import React, { useEffect } from "react";
import { Link, useSearchParams, Outlet } from "react-router"; // Import Link dari react-router-dom
import useProducts from "@/store/useProductStore";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import Pagination from "@/components/Pagination";
import Button from "@/components/ui/button";

const List = () => {
  const { products, loading, error, list, destroy } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // ambil page dari URL, default 1
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    list(page);
  }, [list, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Anda yakin ingin menghapus produk ini?")) {
      destroy(productId);
      list(page);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
        <Link
          to="/admin/product/create"
          className="bg-teal-500 text-white px-4 py-2 rounded-lg mb-4 inline-block"
        >
          Buat Produk
        </Link>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Nama</th>
            <th className="border border-gray-300 p-2">Durasi</th>
            <th className="border border-gray-300 p-2">Harga</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Fitur</th>
            <th className="border border-gray-300 p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.data?.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">{product.duration}</td>
              <td className="border border-gray-300 p-2">{product.price}</td>
              <td className="border border-gray-300 p-2">{product.status}</td>
              <td className="border border-gray-300 p-2">
                {product.features && product.features.length > 0 ? (
                  <div>
                    {product.features.map((f, i) => (
                      <React.Fragment key={i}>
                        {f.name}
                        {i < product.features.length - 1 && ", "}
                        {/* Break setiap 2 fitur */}
                        {(i + 1) % 2 === 0 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <Link
                  to={`/admin/product/${product.id}/edit`}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Edit
                </Link>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
