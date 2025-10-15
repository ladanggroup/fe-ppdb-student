// src/pages/admin/Product/Edit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useProducts from "@/store/useProductStore";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import formatIdr from "@/utils/formatIdr";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    show,
    update,
    storeProductFeature,
    updateProductFeature,
    // deleteProductFeature,
    error,
    success,
    loading,
  } = useProducts();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [features, setFeatures] = useState([{ featureName: "" }]);

  // Ambil data produk saat halaman dibuka
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await show(id);
        if (product) {
          setName(product.name || "");
          setDuration(product.duration || "");
          setPrice(product.price || "");
          setStatus(product.status || "active");
          setFeatures(
            product.features && product.features.length > 0
              ? product.features.map((f) => ({
                  featureName: f.name,
                  id: f.id, // simpan id untuk update
                }))
              : [{ featureName: "" }]
          );
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    };

    fetchProduct();
  }, [id, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, duration, price, status };
      await update(id, productData);

      // Update fitur produk
      for (const feature of features) {
        if (feature.featureName) {
          if (feature.id) {
            // update fitur lama
            await updateProductFeature({
              id: feature.id,
              product_id: id,
              featureName: feature.featureName,
            });
          } else {
            // fitur baru → create
            await storeProductFeature({
              product_id: id,
              featureName: feature.featureName,
            });
          }
        }
      }

      navigate("/admin/product");
    } catch (err) {
      console.error(err);
    }
  };

  // const handleAddFeature = (index) => {
  //   const newFeatures = [...features];
  //   newFeatures.splice(index + 1, 0, { featureName: "" });
  //   setFeatures(newFeatures);
  // };

  // const handleFeatureChange = (index, value) => {
  //   const newFeatures = [...features];
  //   newFeatures[index].featureName = value;
  //   setFeatures(newFeatures);
  // };

  // const handleRemoveFeature = (index) => {
  //   const featureId = features[index].id;
  //   deleteProductFeature(featureId);

  //   const newFeatures = features.filter((_, i) => i !== index);
  //   setFeatures(newFeatures);
  // };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <div className="md:col-span-2">
          <Label className="block text-left mb-2">Nama:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Produk A"
            className="border border-teal-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label className="block text-left mb-2">Durasi (Bulan):</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Contoh: 6"
            className="border border-teal-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="md:col-span-2 mt-2.5">
          <Label className="block text-left mb-2">Harga:</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Contoh: 500000"
            className="border border-teal-300 p-2 rounded w-full"
            required
          />
          {price && (
            <p className="text-gray-600 text-left">Harga: {formatIdr(price)}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <SelectGroup>
            <SelectLabel className="block text-left">Status:</SelectLabel>
          </SelectGroup>
          <Select value={status} onValueChange={(e) => setStatus(e)} required>
            <SelectTrigger className="border border-teal-300 bg-white p-2 rounded w-full">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-[#1f2d3a] dark:text-white">
              <SelectItem className="hover:bg-teal-500" value="active">
                Aktif
              </SelectItem>
              <SelectItem className="hover:bg-teal-500" value="inactive">
                Tidak Aktif
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input Fitur Produk */}
        {/* <div className="md:col-span-4">
          <Label className="block text-left mb-2">Fitur Produk:</Label>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  type="text"
                  value={feature.featureName}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Nama Fitur"
                  required
                  className="mr-2"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded"
                  >
                    -
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAddFeature(index)}
                    className="bg-teal-500 text-white hover:bg-teal-600 px-2 py-1 rounded"
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <Button
          type="submit"
          disabled={loading}
          className="md:col-span-4 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded mt-4"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </DashboardLayout>
  );
};

export default Edit;
