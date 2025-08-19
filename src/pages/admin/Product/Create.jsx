// src/pages/admin/Product/Create.jsx
import React, { useState } from "react";
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
import formatIdr from '@/utils/formatIdr';
import { useNavigate } from "react-router";

const Create = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [features, setFeatures] = useState([{ featureName: "" }]); // State untuk menyimpan fitur produk
  const { store, storeProductFeature, error, success, loading } = useProducts(); // Mengakses fungsi store
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, duration, price, status };
      const productId = await store(productData); // Mengirim data Product ke store

      // Mengirim fitur produk jika ada
      for (const feature of features) {
        if (feature.featureName) {
          await storeProductFeature({
            product_id: productId,
            featureName: feature.featureName,
          });
        }
      }

      // Reset form setelah pengiriman
      setName("");
      setDuration("");
      setPrice("");
      setStatus("");
      setFeatures([{ featureName: "" }]); // Reset fitur
      navigate("/product");
    } catch (err) {
      console.error(err); // Menangani error jika ada
    }
  };

  const handleAddFeature = (index) => {
    // setFeatures([...features, { featureName: "" }]); // Menambahkan fitur baru
    const newFeatures = [...features];
    newFeatures.splice(index + 1, 0, { featureName: "" }); // Menambahkan fitur baru di indeks index + 1
    setFeatures(newFeatures);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index].featureName = value; // Mengupdate nama fitur
    setFeatures(newFeatures);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index); // Menghapus fitur berdasarkan indeks
    setFeatures(newFeatures);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Buat Produk Baru</h1>
      {error && <div className="text-red-500">{error}</div>}{" "}
      {/* Menampilkan error jika ada */}
      {success && <div className="text-green-500">{success}</div>}{" "}
      {/* Menampilkan success message */}
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
            required
            className="border border-teal-300 p-2 rounded w-full"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="block text-left mb-2">Durasi(Bulan):</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Contoh: 1 "
            required
            className="border border-teal-300 p-2 rounded w-full"
          />
        </div>
        <div className="md:col-span-2 mt-2.5">
          <Label className="block text-left mb-2">Harga:</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Contoh: 100000"
            required
            className="border border-teal-300 p-2 rounded w-full"
          />
          {price && 
            <p className="text-gray-600 text-left">Harga: {formatIdr(price)}</p>
          }
        </div>
        <div className="md:col-span-2">
          <SelectGroup>
            <SelectLabel className="block text-left">Status:</SelectLabel>
          </SelectGroup>
          <Select
            value={status}
            onValueChange={(e) => setStatus(e)}
            required
            className="border border-teal-300 p-2 rounded w-full"
          >
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

        {/* Input untuk fitur produk */}
        <div className="md:col-span-4">
          <Label className="block text-left mb-2">Fitur Produk:</Label>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  type="text"
                  value={feature.featureName}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Nama Fitur"
                  className="border border-teal-300 p-2 rounded w-full mr-2"
                  required
                />
                <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => handleRemoveFeature(index)} // Fungsi untuk menghapus fitur
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
            {features.length === 0 && (
              <div className="text-gray-500">Tidak ada fitur produk</div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="md:col-span-4 bg-teal-500 text-white dark:bg-[#1f2d3a] dark:text-white hover:bg-teal-600 dark:hover:bg-teal-600 px-4 py-2 rounded mt-4"
        >
          {loading ? "Membuat..." : "Buat Produk"}
        </Button>
      </form>
    </DashboardLayout>
  );
};

export default Create;
