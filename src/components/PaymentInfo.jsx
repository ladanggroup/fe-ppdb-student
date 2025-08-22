import React from "react";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import ErrorLabel from "./ErrorLabel";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import BankSelectedCard from "./BankSelectedCard";
import useFile from "@/hooks/useFile";
import { Link } from "react-router";

const PaymentInfo = ({
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
      setFormData({
        ...formData,
        payment_proof_file: response.path,
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const getFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("?")[0];
  };
  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">
        3. Informasi Pembayaran & Unggah Bukti
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Lakukan pembayaran dan unggah bukti transfer.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-full">
          <p className="text-md font-medium text-gray-900">
            Total yang harus dibayar:
          </p>
          <p className="text-3xl font-bold text-green-700">
            Rp {getProductPrice().toLocaleString("id-ID")}
          </p>
        </div>

        <div className="sm:col-span-3 mt-2.5">
          <Label className="block text-left mb-2">Tanggal Pembayaran</Label>
          <Input
            type="date"
            name="payment_date"
            id="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
          />
          {formErrors.payment_date && (
            <ErrorLabel message={formErrors.payment_date} />
          )}
        </div>

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
            <SelectTrigger className="focus:ring-ppdb-orange focus:border-ppdb-orange">
              <SelectValue placeholder="Pilih Bank" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {bankLoading ? (
                <SelectItem disabled>Memuat bank...</SelectItem>
              ) : banksAdmin.length > 0 ? (
                banksAdmin?.map((bank) => (
                  <SelectItem key={bank.id} value={String(bank.id)}>
                    {bank.name} - {bank.account_number} ({bank.account_name})
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Tidak ada bank tersedia.</SelectItem>
              )}
            </SelectContent>
          </Select>
          {formErrors.selected_bank_id && (
            <ErrorLabel message={formErrors.selected_bank_id} />
          )}
        </div>
        <div className="col-span-full">
          <BankSelectedCard
            bank={banksAdmin.find(
              (b) => String(b.id) === String(formData.selected_bank_id)
            )}
          />
        </div>
        <div className="col-span-full">
          <label
            htmlFor="payment_proof_file"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Unggah Bukti Pembayaran
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="payment_proof_file"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
              <p className="text-xs leading-5 text-gray-600">
                JPG, PNG, PDF hingga 10MB
              </p>
              {formData.payment_proof_file && (
                <p className="mt-2 text-sm text-gray-500">
                  {/* File terpilih: {formData.payment_proof_file} */}
                  File terpilih: {getFileName(formData.payment_proof_file)}
                </p>
              )}
              {formErrors.payment_proof_file && (
                <ErrorLabel message={formErrors.payment_proof_file} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
