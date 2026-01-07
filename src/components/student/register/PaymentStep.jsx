// // src/components/student/register/PaymentStep.jsx
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Clipboard, Upload, Search, Check, Calendar } from "lucide-react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import ErrorLabel from "@/components/ErrorLabel";
// import { showSuccess, showError } from "@/components/ui/toastSonner";
// import { Link } from "react-router";
// import formatIdr from "@/utils/formatIdr";
// import useFile from "@/hooks/useFile";
// import useBankStore from "@/store/useBankStore";
// import useDocumentStore from "@/store/useDocumentStore";
// import usePaymentStore from "@/store/usePaymentStore";

// export default function PaymentStep({
//   formData,
//   setFormData,
//   setFormErrors,
//   formErrors,
//   waves,
// }) {
//   const { fetchBanks, banks } = useBankStore();
//   const [selectedBank, setSelectedBank] = useState(null);
//   const { deletePathStudentDocument } = useDocumentStore();
//   const { fetchStudentPayments, payments } = usePaymentStore();

//   const { handleFileChange, isUploading, deleteFile } = useFile({
//     fieldName: "file",
//     folder: "student/payment-proof",
//     onSuccess: (res) => handleUploadSuccess(res),
//     onError: () => showError("Gagal upload file"),
//   });

//   useEffect(() => {
//     if (formData.student_id) {
//       fetchStudentPayments(formData.student_id, waves?.[0]?.school?.slug);
//     }
//     fetchBanks(waves?.[0]?.school?.slug);
//   }, [fetchBanks, waves, formData.student_id, fetchStudentPayments]);

//   useEffect(() => {
//     if (banks && banks.length > 0) {
//       setSelectedBank(banks[0]);
//     }

//     if (Array.isArray(payments) && payments.length > 0) {
//       const latestPayment = payments[payments.length - 1];

//       setFormData((prev) => ({
//         ...prev,
//         payments_info: {
//           id: latestPayment?.id || "",
//           payment_date: latestPayment?.payment_date || "",
//           price: latestPayment?.price || waves?.[0]?.price || 0,
//           payment_proof_file: latestPayment?.document?.path || "",
//           file_url: latestPayment?.document?.file || "",
//           bank_id:
//             latestPayment?.bank_id ||
//             banks?.[0]?.id ||
//             "",
//           doc_id: latestPayment?.document_id || "",
//         },
//       }));

//       setSelectedBank(
//         banks.find((b) => String(b.id) === String(latestPayment?.bank_id)) ||
//           banks[0]
//       );
//     } else if (banks?.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         payments_info: {
//           payment_date: "",
//           price: waves?.[0]?.price || 0,
//           payment_proof_file: "",
//           file_url: "",
//           bank_id: banks[0]?.id || "",
//         },
//       }));
//     }
//   }, [banks, payments, setFormData, waves]);

//   const handleUploadSuccess = (res) => {
//     setFormData((prev) => ({
//       ...prev,
//       payments_info: {
//         ...prev.payments_info,
//         payment_proof_file: res.path,
//         file_url: res.url,
//       },
//     }));
//     setFormErrors((prev) => ({ ...prev, payment_proof_file: null }));
//     showSuccess("Bukti pembayaran berhasil diunggah!");
//   };

//   const handleDelete = async () => {
//     const currentFile = formData.payments_info?.payment_proof_file;
//     if (formData.payments_info?.doc_id) {
//       await deletePathStudentDocument(formData.payments_info.doc_id);
//     }
//     await deleteFile(currentFile);
//     setFormData((prev) => ({
//       ...prev,
//       payments_info: {
//         ...prev.payments_info,
//         payment_proof_file: null,
//         file_url: null,
//       },
//     }));
//     showSuccess("Bukti pembayaran dihapus!");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       payments_info: {
//         ...prev.payments_info,
//         [name]: value,
//       },
//     }));
//     setFormErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//     showSuccess("Nomor rekening disalin ke clipboard");
//   };

//   return (
//     <div className="border p-6 rounded-lg shadow-sm border-gray-300 bg-white">
//       <h3 className="text-lg font-semibold text-gray-900">
//         Informasi Pembayaran
//       </h3>
//       <p className="mt-1 text-sm text-gray-600">
//         Biaya yang dibayarkan merupakan biaya administrasi pendaftaran peserta
//         didik baru
//       </p>

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <div className="border rounded-lg p-4">
//             <div className="flex justify-between items-center mb-3">
//               <div>
//                 <p className="font-medium text-gray-800">
//                   {selectedBank?.name || "Memuat bank..."}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {selectedBank?.account_name || "-"}
//                 </p>
//               </div>

//               {banks.length > 1 && (
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       className="cursor-pointer"
//                     >
//                       Ubah
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="bg-white">
//                     <DialogHeader>
//                       <DialogTitle>Pilih Bank</DialogTitle>
//                     </DialogHeader>
//                     <BankSearchList
//                       banks={banks}
//                       selectedBankId={selectedBank?.id}
//                       onSelectBank={setSelectedBank}
//                     />
//                   </DialogContent>
//                 </Dialog>
//               )}
//             </div>

//             {selectedBank && (
//               <div className="flex items-center">
//                 <Input
//                   readOnly
//                   value={selectedBank.account_number}
//                   className="flex-1 text-center font-mono font-medium text-lg text-[#0090D4] bg-blue-50"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="ml-2 cursor-pointer border border-[#0090D4] hover:border-[#0090D4] hover:text-[#0090D4]"
//                   onClick={() => handleCopy(selectedBank.account_number)}
//                 >
//                   <Clipboard size={18} />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="border-l md:pl-6 border-gray-200">
//           <div className="mb-4">
//             <Label>Nominal Transfer</Label>
//             <Input
//               type="text"
//               value={formatIdr(
//                 formData.payments_info?.price || waves?.[0]?.price
//               )}
//               readOnly
//               className="mt-1 font-semibold bg-gray-100"
//             />
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="payment_date">Tanggal Transfer</Label>
//             <div className="relative mt-1">
//               <Input
//                 id="payment_date"
//                 name="payment_date"
//                 type="date"
//                 value={formData.payments_info?.payment_date || ""}
//                 onChange={handleChange}
//               />
//             </div>
//             {formErrors?.payment_date && (
//               <ErrorLabel message={formErrors.payment_date} />
//             )}
//           </div>

//           <PaymentProofUploader
//             currentFile={formData.payments_info?.payment_proof_file}
//             fileUrl={formData.payments_info?.file_url}
//             onUpload={handleFileChange}
//             onDelete={handleDelete}
//             loading={isUploading}
//             formErrors={formErrors}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- BANK SEARCH LIST ---------------- */
// const BankSearchList = ({ banks, selectedBankId, onSelectBank }) => {
//   const [query, setQuery] = useState("");
//   const filteredBanks = banks.filter((b) =>
//     b.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="mt-3">
//       <div className="relative mb-4">
//         <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         <Input
//           placeholder="Cari nama bank..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="pl-10"
//         />
//       </div>

//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {filteredBanks.length > 0 ? (
//           filteredBanks.map((bank) => (
//             <DialogPrimitive.Close asChild key={bank.id}>
//               <div
//                 className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex justify-between items-center"
//                 onClick={() => onSelectBank(bank)}
//               >
//                 <div>
//                   <p className="font-medium">{bank.name}</p>
//                   <p className="text-sm text-gray-500">
//                     {bank.account_number} - {bank.account_name}
//                   </p>
//                 </div>
//                 {String(bank.id) === String(selectedBankId) && (
//                   <Check className="text-green-500" size={18} />
//                 )}
//               </div>
//             </DialogPrimitive.Close>
//           ))
//         ) : (
//           <p className="text-sm text-gray-500">Bank tidak ditemukan</p>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ---------------- PAYMENT PROOF UPLOADER ---------------- */
// const PaymentProofUploader = ({
//   currentFile,
//   fileUrl,
//   onUpload,
//   onDelete,
//   loading,
//   formErrors,
// }) => {
//   const getFileName = (path) =>
//     path ? decodeURIComponent(path.split("/").pop().split("?")[0]) : "";

//   return (
//     <div className="mb-4">
//       <Label>Upload Bukti Bayar</Label>
//       {currentFile ? (
//         <div className="border rounded-lg p-3 bg-gray-50 flex flex-col items-center">
//           <p className="text-sm text-green-600">✓ {getFileName(currentFile)}</p>
//           <div className="flex gap-3 mt-2">
//             {fileUrl && (
//               <Link
//                 to={fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline text-sm cursor-pointer flex items-center gap-1"
//               >
//                 Lihat Dokumen
//               </Link>
//             )}
//             <Button
//               variant="ghost"
//               className="text-red-600 hover:underline text-sm cursor-pointer"
//               onClick={onDelete}
//             >
//               Hapus
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <label className="mt-2 flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-lg px-6 py-8 text-sm text-gray-500">
//           <Upload size={20} className="mb-2 text-gray-400" />
//           {loading ? "Mengunggah..." : "Unggah file atau seret ke sini"}
//           <Input
//             id="payment-proof"
//             type="file"
//             className="sr-only"
//             onChange={onUpload}
//             accept="image/jpeg,image/png,application/pdf"
//           />
//           <p className="text-xs text-gray-400 mt-1">
//             JPG, PNG, PDF hingga 10MB
//           </p>
//         </label>
//       )}
//       {formErrors?.payment_proof_file && (
//         <ErrorLabel message={formErrors.payment_proof_file} />
//       )}
//     </div>
//   );
// };

// src/components/student/register/PaymentStep.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, Upload, Search, Check } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import ErrorLabel from "@/components/ErrorLabel";
import { showSuccess, showError } from "@/components/ui/toastSonner";
import { Link } from "react-router";
import formatIdr from "@/utils/formatIdr";
import useFile from "@/hooks/useFile";
import useBankStore from "@/store/useBankStore";
import useDocumentStore from "@/store/useDocumentStore";
import usePaymentStore from "@/store/usePaymentStore";
import usePaymentMethodStore from "@/store/usePaymentMethodStore"; // <-- store metode pembayaran

export default function PaymentStep({
  formData,
  setFormData,
  setFormErrors,
  formErrors,
  waves,
}) {
  const { fetchBanks, banks } = useBankStore();
  const [selectedBank, setSelectedBank] = useState(null);
  const { deletePathStudentDocument } = useDocumentStore();
  const { fetchStudentPayments, payments } = usePaymentStore();

  const { listPaymentMethodsSchool, paymentMethods = [] } = usePaymentMethodStore();

  const { handleFileChange, isUploading, deleteFile } = useFile({
    fieldName: "file",
    folder: "student/payment-proof",
    onSuccess: (res) => handleUploadSuccess(res),
    onError: () => showError("Gagal upload file"),
  });

  useEffect(() => {
    if (formData.student_id) {
      fetchStudentPayments(formData.student_id, waves?.[0]?.school?.slug);
    }
    fetchBanks(waves?.[0]?.school?.slug);

    // load metode pembayaran untuk sekolah
    if (waves?.[0]?.school?.slug) {
      listPaymentMethodsSchool(waves[0].school.slug).catch(() => {
        // ignore, store handle error
      });
    }
  }, [fetchBanks, waves, formData.student_id, fetchStudentPayments, listPaymentMethodsSchool]);

  useEffect(() => {
    if (banks && banks.length > 0) {
      setSelectedBank(banks[0]);
    }

    // set default payments_info jika belum ada
    if (!formData.payments_info || Object.keys(formData.payments_info).length === 0) {
      setFormData((prev) => ({
        ...prev,
        payments_info: {
          payment_method_id: paymentMethods?.[0]?.id || "",
          payment_method_code: paymentMethods?.[0]?.code || paymentMethods?.[0]?.name || "",
          payment_method_name: paymentMethods?.[0]?.name || "",
          payment_date: "",
          price: waves?.[0]?.price || 0,
          payment_proof_file: "",
          file_url: "",
          bank_id: banks?.[0]?.id || "",
        },
      }));
    }

    if (Array.isArray(payments) && payments.length > 0) {
      const latestPayment = payments[payments.length - 1];

      setFormData((prev) => ({
        ...prev,
        payments_info: {
          id: latestPayment?.id || "",
          payment_method_id: latestPayment?.payment_method_id || prev.payments_info?.payment_method_id || "",
          payment_method_code: latestPayment?.payment_method_code || prev.payments_info?.payment_method_code || "",
          payment_method_name: latestPayment?.payment_method_name || prev.payments_info?.payment_method_name || "",
          payment_date: latestPayment?.payment_date || "",
          price: latestPayment?.price || waves?.[0]?.price || 0,
          payment_proof_file: latestPayment?.document?.path || "",
          file_url: latestPayment?.document?.file || "",
          bank_id: latestPayment?.bank_id || banks?.[0]?.id || "",
          doc_id: latestPayment?.document_id || "",
        },
      }));

      setSelectedBank(
        banks.find((b) => String(b.id) === String(latestPayment?.bank_id)) ||
          banks[0]
      );
    } else if (banks?.length > 0 && formData.payments_info) {
      // ensure default bank_id present
      if (!formData.payments_info.bank_id) {
        setFormData((prev) => ({
          ...prev,
          payments_info: {
            ...prev.payments_info,
            bank_id: banks[0].id,
          },
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banks, payments, paymentMethods, waves]);

  const handleUploadSuccess = (res) => {
    setFormData((prev) => ({
      ...prev,
      payments_info: {
        ...prev.payments_info,
        payment_proof_file: res.path,
        file_url: res.url,
      },
    }));
    setFormErrors((prev) => ({ ...prev, payment_proof_file: null }));
    showSuccess("Bukti pembayaran berhasil diunggah!");
  };

  const handleDelete = async () => {
    const currentFile = formData.payments_info?.payment_proof_file;
    if (formData.payments_info?.doc_id) {
      await deletePathStudentDocument(formData.payments_info.doc_id);
    }
    await deleteFile(currentFile);
    setFormData((prev) => ({
      ...prev,
      payments_info: {
        ...prev.payments_info,
        payment_proof_file: null,
        file_url: null,
      },
    }));
    showSuccess("Bukti pembayaran dihapus!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      payments_info: {
        ...prev.payments_info,
        [name]: value,
      },
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

const handleMethodChange = (e) => {
  const methodId = e.target.value;

  // pastikan array aman
  const methodList = paymentMethods?.data || [];

  const method =
    methodList.find((m) => String(m.id) === String(methodId)) || {};

  setFormData((prev) => ({
    ...prev,
    payments_info: {
      ...prev.payments_info,
      payment_method_id: method.id || methodId,
      payment_method_code:
        method.code ||
        (method.name &&
        method.name.toLowerCase().includes("transfer")
          ? "transfer"
          : method.name),
      payment_method_name: method.name || "",

      // reset field kalau bukan transfer
      ...(method.code && method.code !== "transfer"
        ? {
            payment_proof_file: null,
            file_url: null,
            payment_date: "",
            bank_id: "",
          }
        : {}),
    },
  }));
};


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Nomor rekening disalin ke clipboard");
  };

  // helper cek apakah metode sekarang adalah transfer
  const currentMethodCode = formData.payments_info?.payment_method_code || "";
  const isTransfer = String(currentMethodCode).toLowerCase() === "transfer" ||
    String(formData.payments_info?.payment_method_name || "").toLowerCase().includes("transfer");

  return (
    <div className="border p-6 rounded-lg shadow-sm border-gray-300 bg-white">
      <h3 className="text-lg font-semibold text-gray-900">Informasi Pembayaran</h3>
      <p className="mt-1 text-sm text-gray-600">
        Biaya yang dibayarkan merupakan biaya administrasi pendaftaran peserta didik baru
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Metode Pembayaran */}
        <div>
          <Label>Metode Pembayaran</Label>
          <div className="mt-1">
            <select
              name="payment_method_id"
              value={formData.payments_info?.payment_method_id || ""}
              onChange={handleMethodChange}
              className="w-full border rounded-md px-3 py-2 bg-white"
            >
              {(paymentMethods || []).length === 0 ? (
                <option value="">Memuat metode pembayaran...</option>
              ) : (
                <>
                  {paymentMethods?.data?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Jika metode TRANSFER -> tampilkan detail bank, nominal, tanggal, upload */}
        {isTransfer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedBank?.name || "Memuat bank..."}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedBank?.account_name || "-"}
                    </p>
                  </div>

                  {banks.length > 1 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" className="cursor-pointer">
                          Ubah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Pilih Bank</DialogTitle>
                        </DialogHeader>
                        <BankSearchList
                          banks={banks}
                          selectedBankId={selectedBank?.id}
                          onSelectBank={(b) => {
                            setSelectedBank(b);
                            setFormData((prev) => ({
                              ...prev,
                              payments_info: {
                                ...prev.payments_info,
                                bank_id: b.id,
                              },
                            }));
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {selectedBank && (
                  <div className="flex items-center">
                    <Input
                      readOnly
                      value={selectedBank.account_number}
                      className="flex-1 text-center font-mono font-medium text-lg text-[#0090D4] bg-blue-50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="ml-2 cursor-pointer border border-[#0090D4] hover:border-[#0090D4] hover:text-[#0090D4]"
                      onClick={() => handleCopy(selectedBank.account_number)}
                    >
                      <Clipboard size={18} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-l md:pl-6 border-gray-200">
              <div className="mb-4">
                <Label>Nominal Transfer</Label>
                <Input
                  type="text"
                  value={formatIdr(formData.payments_info?.price || waves?.[0]?.price)}
                  readOnly
                  className="mt-1 font-semibold bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="payment_date">Tanggal Transfer</Label>
                <div className="relative mt-1">
                  <Input
                    id="payment_date"
                    name="payment_date"
                    type="date"
                    value={formData.payments_info?.payment_date || ""}
                    onChange={handleChange}
                  />
                </div>
                {formErrors?.payment_date && <ErrorLabel message={formErrors.payment_date} />}
              </div>

              <PaymentProofUploader
                currentFile={formData.payments_info?.payment_proof_file}
                fileUrl={formData.payments_info?.file_url}
                onUpload={handleFileChange}
                onDelete={handleDelete}
                loading={isUploading}
                formErrors={formErrors}
              />
            </div>
          </div>
        ) : (
          // non-transfer: tampilkan ringkasan instruksi singkat
          <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-700">
            <p className="font-medium">Instruksi Pembayaran</p>
            <p className="mt-2">
              Pilih metode pembayaran ini. Jika perlu bukti pembayaran, ikuti instruksi pada metode yang
              Anda pilih di konfirmasi pendaftaran.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- BANK SEARCH LIST ---------------- */
const BankSearchList = ({ banks, selectedBankId, onSelectBank }) => {
  const [query, setQuery] = useState("");
  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mt-3">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <Input
          placeholder="Cari nama bank..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredBanks.length > 0 ? (
          filteredBanks.map((bank) => (
            <DialogPrimitive.Close asChild key={bank.id}>
              <div
                className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                onClick={() => onSelectBank(bank)}
              >
                <div>
                  <p className="font-medium">{bank.name}</p>
                  <p className="text-sm text-gray-500">
                    {bank.account_number} - {bank.account_name}
                  </p>
                </div>
                {String(bank.id) === String(selectedBankId) && <Check className="text-green-500" size={18} />}
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
const PaymentProofUploader = ({ currentFile, fileUrl, onUpload, onDelete, loading, formErrors }) => {
  const getFileName = (path) => (path ? decodeURIComponent(path.split("/").pop().split("?")[0]) : "");

  return (
    <div className="mb-4">
      <Label>Upload Bukti Bayar</Label>
      {currentFile ? (
        <div className="border rounded-lg p-3 bg-gray-50 flex flex-col items-center">
          <p className="text-sm text-green-600">✓ {getFileName(currentFile)}</p>
          <div className="flex gap-3 mt-2">
            {fileUrl && (
              <Link
                to={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm cursor-pointer flex items-center gap-1"
              >
                Lihat Dokumen
              </Link>
            )}
            <Button variant="ghost" className="text-red-600 hover:underline text-sm cursor-pointer" onClick={onDelete}>
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <label className="mt-2 flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-lg px-6 py-8 text-sm text-gray-500">
          <Upload size={20} className="mb-2 text-gray-400" />
          {loading ? "Mengunggah..." : "Unggah file atau seret ke sini"}
          <Input id="payment-proof" type="file" className="sr-only" onChange={onUpload} accept="image/jpeg,image/png,application/pdf" />
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF hingga 10MB</p>
        </label>
      )}
      {formErrors?.payment_proof_file && <ErrorLabel message={formErrors.payment_proof_file} />}
    </div>
  );
};
