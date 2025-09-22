import React from "react";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorLabel from "@/components/ErrorLabel";
import BankSelectedCard from "@/components/BankSelectedCard";
import useFile from "@/hooks/useFile";
import { Link } from "react-router";
import formatIdr from "@/utils/formatIdr";

const Payment = ({
  setFormData,
  formData,
  formErrors,
  handleChange,
  getProductPrice,
  banksAdmin,
  bankLoading,
}) => {
  const { uploadedUrl, handleFileChange } = useFile({
    fieldName: "file",
    folder: "payment-proof",
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

  const getFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("?")[0];
  };

  return (
    <div className="mt-8 border rounded-lg p-6 bg-sky-100 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Informasi Pembayaran & Unggah Bukti
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Lakukan pembayaran sesuai instruksi, kemudian unggah bukti transfer.
      </p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        {/* Total bayar */}
        <div className="sm:col-span-full">
          <p className="text-md font-medium text-gray-900 dark:text-white">
            Total yang harus dibayar:
          </p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">
            {formatIdr(getProductPrice()) || "Rp 0"}
          </p>
        </div>

        {/* Tanggal pembayaran */}
        <div className="sm:col-span-3 mt-2.5">
          <Label className="block text-left mb-2">Tanggal Pembayaran</Label>
          <Input
            type="date"
            name="payment_date"
            id="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
            className="focus:ring-sky-500 focus:border-sky-500 bg-sky-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {formErrors?.payment_date && (
            <ErrorLabel message={formErrors.payment_date} />
          )}
        </div>

        {/* Pilih bank */}
        <div className="sm:col-span-3">
          <SelectGroup>
            <SelectLabel className="block text-left">Bank Tujuan</SelectLabel>
          </SelectGroup>
          <Select
            name="selected_bank_id"
            id="selected_bank_id"
            value={
              formData.selected_bank_id
                ? String(formData.selected_bank_id)
                : undefined
            }
            onValueChange={(value) =>
              handleChange({ target: { name: "selected_bank_id", value } })
            }
          >
            <SelectTrigger className="focus:ring-sky-500 focus:border-sky-500 bg-sky-100 dark:bg-gray-800 text-gray-900 dark:text-white">
              <SelectValue placeholder="Pilih Bank" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              {bankLoading ? (
                <SelectItem disabled>Memuat bank...</SelectItem>
              ) : banksAdmin?.length > 0 ? (
                banksAdmin.map((bank) => (
                  <SelectItem className="hover:bg-sky-200" key={bank.id} value={String(bank.id)}>
                    {bank.name} - {bank.account_number} ({bank.account_name})
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

        {/* Bank detail */}
        <div className="col-span-full">
          <BankSelectedCard
            className="focus:ring-white focus:border-white bg-sky-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-800 dark:border-white"
            bank={banksAdmin.find(
              (b) => String(b.id) === String(formData.selected_bank_id)
            )}
          />
        </div>

        {/* Upload bukti */}
        <div className="col-span-full">
          <label
            htmlFor="payment_proof_file"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >
            Unggah Bukti Pembayaran
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 px-6 py-10">
            <div className="text-center">
              {uploadedUrl || formData.payment_proof_file ? (
                <Link
                  to={uploadedUrl || formData.payment_proof_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lihat Dokumen
                </Link>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.69a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300">
                <label
                  htmlFor="payment_proof_file"
                  className="relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                >
                  <span>Unggah file</span>
                  <input
                    id="payment_proof_file"
                    name="payment_proof_file"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                </label>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                JPG, PNG, PDF hingga 10MB
              </p>
              {formData.payment_proof_file && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  File terpilih: {getFileName(formData.payment_proof_file)}
                </p>
              )}
              {formErrors?.payment_proof_file && (
                <ErrorLabel message={formErrors.payment_proof_file} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
