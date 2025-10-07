// src/components/student/PaymentInfo.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ErrorLabel from "@/components/ErrorLabel";
import useFile from "@/hooks/useFile";
import useDocumentStore from "@/store/useDocumentStore";
import { Clipboard, Upload, Search, Check } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import { showError, showSuccess } from "../ui/toastSonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "react-router";

const PaymentInfo = ({ formData, formErrors, onPaymentInfoChange }) => {
  const { deleteStudentDocument } = useDocumentStore();
  const { deleteFile } = useFile({});

  const handleDeleteDocument = async (schoolId) => {
    const dataDelete = formData.payments_info[schoolId];
    if (dataDelete?.document_id) {
      await deleteStudentDocument(dataDelete.document_id);
    } else if (dataDelete?.payment_proof_file) {
      await deleteFile(dataDelete.payment_proof_file);
    }
    onPaymentInfoChange(schoolId, "payment_proof_file", null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (text) {
      showSuccess("Berhasil menyalin ke clipboard");
    } else {
      showError("Gagal menyalin ke clipboard");
    }
  };

  return (
    <div className="border p-6 rounded-lg shadow-sm border-gray-600 dark:border-gray-400 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Informasi Pembayaran
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Lakukan pembayaran untuk setiap sekolah yang anda pilih
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.selected_schools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada sekolah yang dipilih untuk pembayaran.
          </p>
        ) : (
          formData.selected_schools.map((school) => {
            const paymentInfo = formData.payments_info[school.school_id] || {};
            const banks = formData.banks_per_school[school.school_id] || [];
            const selectedBank =
              banks.find(
                (b) => String(b.id) === String(paymentInfo.selected_bank_id)
              ) || banks[0];

            return (
              <div
                key={school.school_id}
                className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6 flex flex-col"
              >
                <h4 className="text-md font-semibold text-gray-900 dark:text-white text-center mb-4">
                  Pembayaran <br /> {school.school_name}
                </h4>

                {/* Bank Info Card */}
                {selectedBank ? (
                  <div className="flex items-center justify-between border rounded-lg px-4 py-2 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {selectedBank.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedBank.account_name}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer" size="sm">
                          Ubah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>
                            Pilih Bank {school.school_name}
                          </DialogTitle>
                        </DialogHeader>
                        <BankSearchList
                          banks={banks}
                          schoolId={school.school_id}
                          onPaymentInfoChange={onPaymentInfoChange}
                          selectedBankId={selectedBank?.id}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                    Pilih bank tujuan terlebih dahulu.
                  </p>
                )}

                {/* Nomor Rekening */}
                {selectedBank && (
                  <div className="flex items-center mb-3">
                    <Input
                      readOnly
                      value={selectedBank.account_number}
                      className="flex-1 text-center font-mono font-medium text-lg text-orange-600 bg-orange-50"
                    />
                    <Button
                      onClick={() => handleCopy(selectedBank.account_number)}
                      className="cursor-pointer ml-2"
                    >
                      <Clipboard size={18} />
                    </Button>
                  </div>
                )}

                {/* Nominal Transfer */}
                <div className="mb-3">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominal Transfer
                  </Label>
                  <div className="flex items-center flex-1">
                    <Input
                      readOnly
                      value={formatIdr(school.product_price)}
                      className="bg-gray-100 font-semibold"
                    />
                    <Button
                      onClick={() => handleCopy(school.product_price)}
                      className="cursor-pointer ml-2"
                    >
                      <Clipboard size={18} />
                    </Button>
                  </div>
                </div>

                {/* Tanggal Transfer */}
                <div className="mb-3">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Transfer
                  </Label>
                  <Input
                    type="date"
                    value={paymentInfo.payment_date || ""}
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

                {/* Upload Bukti Bayar */}
                <PaymentProofUploader
                  schoolId={school.school_id}
                  currentFile={paymentInfo.payment_proof_file}
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
            );
          })
        )}
      </div>
    </div>
  );
};

/* ---------------- BANK SEARCH LIST ---------------- */
const BankSearchList = ({
  banks,
  schoolId,
  onPaymentInfoChange,
  selectedBankId,
}) => {
  const [query, setQuery] = useState("");

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mt-3">
      {/* 🔍 Input pencarian */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <Input
          placeholder="Cari nama bank..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List Bank */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {filteredBanks.length > 0 ? (
          filteredBanks.map((bank) => (
            <DialogPrimitive.Close asChild key={bank.id}>
              <div
                className="p-3 border rounded-lg hover:bg-orange-50 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  onPaymentInfoChange(schoolId, "selected_bank_id", bank.id);
                }}
              >
                <div>
                  <p className="font-medium">{bank.name}</p>
                  <p className="text-sm text-gray-500">
                    {bank.account_number} - {bank.account_name}
                  </p>
                </div>
                {String(bank.id) === String(selectedBankId) && (
                  <Check className="text-green-500" size={18} />
                )}
              </div>
            </DialogPrimitive.Close>
          ))
        ) : (
          <p className="text-sm text-gray-500">Bank tidak ditemukan</p>
        )}
      </div>
    </div>
  );
};

/* ---------------- PAYMENT PROOF UPLOADER ---------------- */
const PaymentProofUploader = ({
  schoolId,
  currentFile,
  onFileUpload,
  onDelete,
  formErrors,
}) => {
  const {
    handleFileChange,
    loading: uploadLoading,
    uploadedUrl,
  } = useFile({
    fieldName: "file",
    folder: "student/payment-proof",
    onSuccess: (response) => {
      onFileUpload(response.path);
    },
    onError: () => {
      alert("Gagal upload file");
    },
  });

  // const getFileName = (path) => path?.split("/").pop().split("?")[0];
  const getFileName = (path) => {
    if (!path) return "";
    return decodeURIComponent(path.split("/").pop().split("?")[0]);
  };
  const fileUrl =
    uploadedUrl || (typeof currentFile === "string" ? currentFile : null);

  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Bukti Bayar
      </Label>
      {currentFile ? (
        <div className="border rounded-lg p-3 bg-gray-50 flex flex-col items-center">
          <p className="text-sm text-green-600">✓ {getFileName(currentFile)}</p>
          <div className="flex flex-row items-center mt-2">
            {/* Tombol lihat dokumen */}
            {fileUrl && (
              <Link
                to={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 text-sm"
              >
                Lihat Dokumen
              </Link>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:underline cursor-pointer mt-2"
              onClick={onDelete}
            >
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <label className="mt-2 flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-lg px-6 py-8 text-sm text-gray-500">
          <Upload size={20} className="mb-2 text-gray-400" />
          {uploadLoading ? "Mengunggah..." : "Unggah file atau seret ke sini"}
          <Input
            id={`payment_proof_file_${schoolId}`}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,application/pdf"
          />
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, PDF hingga 10MB
          </p>
        </label>
      )}
      {formErrors[`payment_proof_file_${schoolId}`] && (
        <ErrorLabel message={formErrors[`payment_proof_file_${schoolId}`]} />
      )}
    </div>
  );
};

export default PaymentInfo;
