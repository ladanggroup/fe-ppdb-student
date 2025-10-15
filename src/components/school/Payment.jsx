// src/components/school/Payment.jsx
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorLabel from "@/components/ErrorLabel";
import BankSelectedCard from "@/components/BankSelectedCard";
import useFile from "@/hooks/useFile";
import { Link } from "react-router";
import {
  UploadCloud,
  Banknote,
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import { Button } from "@/components/ui/button";
import { confirmToast } from "../ui/confirmToast";

const Payment = ({
  setFormData,
  formData,
  formErrors,
  handleChange,
  getProductPrice,
  banksAdmin,
  bankLoading,
}) => {
  const { uploadedUrl, handleFileChange, isUploading, deleteFile } = useFile({
    fieldName: "file",
    folder: "school/payment-proof",
    onSuccess: (response) => {
      setFormData((prev) => ({
        ...prev,
        payment_proof_file: response.path,
      }));
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleDelete = async () => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await deleteFile(formData.payment_proof_file);
        setFormData((prev) => ({
          ...prev,
          payment_proof_file: null,
        }));
      },
      onCancel: () => {
        console.log("cancel");
      },
    });
  };

  const getFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("?")[0];
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-gray-800 dark:to-gray-900 border border-sky-200 dark:border-gray-700 rounded-xl shadow-md p-6 transition">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Banknote className="w-5 h-5 text-sky-500" />
        Informasi Pembayaran
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Silakan isi detail pembayaran dan unggah bukti transfer Anda.
      </p>

      {/* Total bayar */}
      <div className="bg-white dark:bg-gray-800 border border-sky-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="text-sky-600 dark:text-sky-400 w-6 h-6" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Total Pembayaran
          </p>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2 sm:mt-0">
          {formatIdr(getProductPrice()) || "Rp 0"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tanggal Pembayaran */}
        <div>
          <Label className="text-left mb-2 flex items-center dark:text-white gap-1">
            <Calendar className="w-4 h-4 text-sky-600" /> Tanggal Pembayaran
          </Label>
          <Input
            type="date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
            className="focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {formErrors?.payment_date && (
            <ErrorLabel message={formErrors.payment_date} />
          )}
        </div>

        {/* Pilih Bank */}
        <div>
          <Label className="block text-left dark:text-white mb-2">
            Bank Tujuan
          </Label>
          <Select
            name="selected_bank_id"
            value={
              formData.selected_bank_id
                ? String(formData.selected_bank_id)
                : undefined
            }
            onValueChange={(value) =>
              handleChange({ target: { name: "selected_bank_id", value } })
            }
          >
            <SelectTrigger className="focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <SelectValue placeholder="Pilih Bank" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              {bankLoading ? (
                <SelectItem disabled>Memuat bank...</SelectItem>
              ) : banksAdmin?.length > 0 ? (
                banksAdmin.map((bank) => (
                  <SelectItem
                    key={bank.id}
                    value={String(bank.id)}
                    className="hover:bg-sky-100 dark:hover:bg-gray-700"
                  >
                    {bank.name} — {bank.account_number} ({bank.account_name})
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Tidak ada bank tersedia.</SelectItem>
              )}
            </SelectContent>
          </Select>
          {formErrors?.selected_bank_id && (
            <ErrorLabel message={formErrors.selected_bank_id} />
          )}
        </div>
      </div>

      {/* Card detail bank */}
      <div className="mt-6">
        <BankSelectedCard
          className="focus:ring-white focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-800 dark:border-white"
          bank={banksAdmin.find(
            (b) => String(b.id) === String(formData.selected_bank_id)
          )}
        />
      </div>

      {/* Upload bukti pembayaran */}
      <div className="mt-8 border border-dashed border-sky-300 dark:border-gray-600 rounded-lg p-6 text-center bg-white dark:bg-gray-800">
        <UploadCloud className="mx-auto w-10 h-10 text-sky-500 mb-2" />
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Unggah Bukti Pembayaran (JPG, PNG, PDF, max 10MB)
        </p>

        {uploadedUrl || formData.payment_proof_file ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Link
              to={uploadedUrl || formData.payment_proof_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              <FileText className="w-4 h-4" /> Lihat Dokumen
            </Link>

            <Button
              onClick={handleDelete}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 border-red-300 dark:border-red-500"
            >
              <Trash2 className="w-4 h-4" /> Hapus Bukti
            </Button>
          </div>
        ) : (
          <label className="inline-flex items-center justify-center mt-3 cursor-pointer rounded-md bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 transition">
            {isUploading ? "Mengunggah..." : "Pilih File"}
            <input
              type="file"
              name="payment_proof_file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,application/pdf"
              disabled={isUploading}
            />
          </label>
        )}

        {formData.payment_proof_file && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            File:{" "}
            <span className="font-medium">
              {getFileName(formData.payment_proof_file)}
            </span>
          </p>
        )}

        {formErrors?.payment_proof_file && (
          <ErrorLabel message={formErrors.payment_proof_file} />
        )}
      </div>
    </div>
  );
};

export default Payment;
