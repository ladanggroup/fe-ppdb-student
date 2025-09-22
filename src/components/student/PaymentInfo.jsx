// src/components/student/PaymentInfo.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import BankSelectedCard from "@/components/BankSelectedCard";
import ErrorLabel from "@/components/ErrorLabel";
import useFile from "@/hooks/useFile";
import useDocumentStore from "@/store/useDocumentStore";
import { Link } from "react-router"; // Use react-router-dom Link if available
import formatIdr from "@/utils/formatIdr";
import { showError } from "../ui/toastSonner";

const PaymentInfo = ({ formData, formErrors, onPaymentInfoChange }) => {
  const { deleteStudentDocument } = useDocumentStore();
  const handleDeleteDocument = async (schoolId) => {
    const dataDelete = formData.payments_info[schoolId];
    if (dataDelete) {
      await deleteStudentDocument(dataDelete.document_id);
    }
  };
  
  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        4. Informasi Pembayaran
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Lakukan pembayaran untuk setiap sekolah yang Anda pilih.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.selected_schools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada sekolah yang dipilih untuk pembayaran.
          </p>
        ) : (
          formData.selected_schools.map((school) => (
            <div
              key={school.school_id}
              className="border p-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Pembayaran untuk {school.school_name} <br />
                (Gelombang: {school.wave_name})
              </h4>

              <div className="sm:col-span-full mb-4">
                <p className="text-md font-medium text-gray-900 dark:text-white">
                  Total yang harus dibayar:
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-500">
                  {formatIdr(school.product_price)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="mt-2.5">
                  <Label
                    htmlFor={`payment_date_${school.school_id}`}
                    className="block text-left dark:text-white mb-2"
                  >
                    Tanggal Pembayaran
                  </Label>
                  <Input
                    type="date"
                    name={`payment_date_${school.school_id}`}
                    id={`payment_date_${school.school_id}`}
                    value={
                      formData.payments_info[school.school_id]?.payment_date ||
                      ""
                    }
                    onChange={(e) =>
                      onPaymentInfoChange(
                        school.school_id,
                        "payment_date",
                        e.target.value
                      )
                    }
                  />
                  {formErrors[`payment_date_${school.school_id}`] && (
                    <ErrorLabel
                      message={formErrors[`payment_date_${school.school_id}`]}
                    />
                  )}
                </div>

                <div>
                  <SelectGroup>
                    <SelectLabel
                      htmlFor={`selected_bank_id_${school.school_id}`}
                      className="block text-left dark:text-white"
                    >
                      Bank Tujuan
                    </SelectLabel>
                  </SelectGroup>
                  <Select
                    name={`selected_bank_id_${school.school_id}`}
                    id={`selected_bank_id_${school.school_id}`}
                    value={
                      formData.payments_info[school.school_id]?.selected_bank_id
                        ? String(
                            formData.payments_info[school.school_id]
                              ?.selected_bank_id
                          )
                        : undefined
                    }
                    onValueChange={(value) =>
                      onPaymentInfoChange(
                        school.school_id,
                        "selected_bank_id",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="focus:ring-ppdb-orange focus:border-ppdb-orange bg-white">
                      <SelectValue placeholder="Pilih Bank" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {formData.banks_per_school[school.school_id]?.length >
                      0 ? (
                        formData.banks_per_school[school.school_id].map(
                          (bank) => (
                            <SelectItem
                              className="hover:bg-ppdb-soft"
                              key={bank.id}
                              value={String(bank.id)} // ini string
                            >
                              {bank.name} - <br />
                              {bank.account_number} ({bank.account_name})
                            </SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem disabled>
                          Tidak ada bank tersedia.
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {formErrors[`selected_bank_id_${school.school_id}`] && (
                    <ErrorLabel
                      message={
                        formErrors[`selected_bank_id_${school.school_id}`]
                      }
                    />
                  )}
                </div>

                <div className="col-span-full">
                  <BankSelectedCard
                    bank={formData.banks_per_school[school.school_id]?.find(
                      (b) =>
                        String(b.id) ===
                        String(
                          formData.payments_info[school.school_id]
                            ?.selected_bank_id
                        )
                    )}
                  />
                </div>

                <PaymentProofUploader
                  schoolId={school.school_id}
                  currentFile={
                    formData.payments_info[school.school_id]?.payment_proof_file
                  }
                  onFileUpload={(path) =>
                    onPaymentInfoChange(
                      school.school_id,
                      "payment_proof_file",
                      path
                    )
                  }
                  onDelete={() => handleDeleteDocument(school.school_id)}
                  formErrors={formErrors}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper Component for payment proof upload
const PaymentProofUploader = ({
  schoolId,
  currentFile,
  onFileUpload,
  onDelete,
  formErrors,
}) => {
  const {
    uploadedUrl,
    handleFileChange: baseHandleFileChange,
    loading: uploadLoading,
  } = useFile({
    fieldName: "file",
    folder: "payment-proof",
    onSuccess: (response) => {
      onFileUpload(response.path); // update formData setelah upload sukses
    },
    onError: (err) => {
      console.error("Upload failed", err);
      showError("Gagal mengunggah bukti pembayaran.");
    },
  });

  const handleFileChange = async (e) => {
    if (currentFile) {
      try {
        onDelete();
      } catch (err) {
        console.error("Gagal menghapus file lama", err);
      }
    }
    // lanjut upload file baru
    baseHandleFileChange(e);
  };

  // 👉 handler drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = {
        preventDefault: () => {}, // dummy supaya gak error
        target: { files: [file] },
      };
      handleFileChange(fakeEvent);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // biar bisa drop
  };

  const getFileName = (path) => {
    if (!path) return "";
    const fileName = path.split("/").pop().split("?")[0];
    return decodeURIComponent(fileName);
  };

  let objectUrl = uploadedUrl;

  return (
    <div className="col-span-full">
      <label
        htmlFor={`payment_proof_file_${schoolId}`}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        Unggah Bukti Pembayaran
      </label>
      <div
        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          {currentFile ? (
            <Link
              to={
                objectUrl ||
                (typeof currentFile === "string" ? currentFile : "#")
              }
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
              htmlFor={`payment_proof_file_input_${schoolId}`}
              className="relative cursor-pointer rounded-md font-semibold text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{uploadLoading ? "Mengunggah..." : "Unggah file"}</span>
              <input
                id={`payment_proof_file_input_${schoolId}`}
                name={`payment_proof_file_${schoolId}`}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,application/pdf"
                disabled={uploadLoading}
              />
            </label>
            <p className="dark:text-white pl-1">atau seret dan lepas</p>
          </div>
          <p className="text-xs leading-5 text-gray-600 dark:text-white">
            JPG, PNG, PDF hingga 10MB
          </p>
          {currentFile && (
            <p className="mt-2 text-sm text-gray-500">
              File terpilih: {getFileName(currentFile)}
            </p>
          )}
          {formErrors[`payment_proof_file_${schoolId}`] && (
            <ErrorLabel
              message={formErrors[`payment_proof_file_${schoolId}`]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
