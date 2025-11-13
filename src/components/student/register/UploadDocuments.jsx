// src/components/student/register/UploadDocuments.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Upload } from "lucide-react";
import useFile from "@/hooks/useFile";
import useDocumentRequirementStore from "@/store/useDocumentRequirementStore";
import useDocumentStore from "@/store/useDocumentStore";
import ErrorLabel from "@/components/ErrorLabel";

export default function UploadDocuments({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  school,
  waves,
}) {
  const { slug } = useParams();
  const { fetchStudentDocumentRequirements, documentRequirements, loading } =
    useDocumentRequirementStore();
  const { deleteStudentDocument } = useDocumentStore();
  const { deleteFile } = useFile({});

  useEffect(() => {
    fetchStudentDocumentRequirements(slug);
  }, [fetchStudentDocumentRequirements, slug]);

  useEffect(() => {
    if (documentRequirements && documentRequirements.length > 0) {
      setFormData((prev) => ({
        ...prev,
        document_requirements: documentRequirements,
      }));
    }
  }, [documentRequirements, setFormData]);

  const handleUploadSuccess = (docReq, result) => {
    const newDoc = {
      doc_name: docReq?.name || "",
      path: result.path,
      document_requirement_id: docReq?.id,
      school_id: school?.id || null,
      student_id: formData?.student_id,
      is_payment: false,
      file_url: result.url,
    };

    try {
      setFormData((prev) => ({
        ...prev,
        uploaded_documents: [
          ...(prev.uploaded_documents || []).filter(
            (d) => d.document_requirement_id !== docReq.id
          ),
          newDoc,
        ],
      }));
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        [`uploaded_documents_${docReq.name}`]:
          "Gagal memperbarui data dokumen. Silakan coba lagi.",
      }));
      console.error("Gagal menghapus error form:", error);
    }
  };

  const handleDelete = async (doc) => {
    try {
      if (doc.doc_id) {
        await deleteStudentDocument(doc.doc_id);
      } else if (doc?.path) {
        await deleteFile(doc.path);
      }
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        [`uploaded_documents_${doc.doc_name}`]:
          "Gagal menghapus dokumen. Silakan coba lagi.",
      }));
      console.error("Gagal menghapus dokumen:", error);
    }
    setFormData((prev) => ({
      ...prev,
      uploaded_documents: prev.uploaded_documents.filter(
        (d) => d.document_requirement_id !== doc.document_requirement_id
      ),
    }));
  };

  return (
    <div className="relative border border-gray-800 dark:border-gray-500 rounded-lg p-8 bg-gray-50 dark:bg-gray-800">
      <LoadingOverlay isLoading={loading} />

      {/* Header Sekolah */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={school?.logo_url || "/src/assets/Group 1078.png"}
          alt="Logo Sekolah"
          className="w-16 h-16 rounded-md object-contain border"
        />
        <div>
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">
            {school?.name || "Nama Sekolah"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {school?.npsn || "-"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {school?.address || "-"}
          </p>
        </div>
      </div>

      {/* Info Wave */}
      {formData.wave_id && (
        <div className="grid grid-cols-1 md:grid-cols-3 text-sm mb-6 border-b border-dashed border-gray-300 dark:border-gray-600 pt-4 pb-6 gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Gelombang:</strong>{" "}
            {waves.find((w) => w.id === formData.wave_id)?.name || "-"}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Periode:</strong>{" "}
            {waves.find((w) => w.id === formData.wave_id)?.start_date
              ? `${new Date(
                  waves.find((w) => w.id === formData.wave_id)?.start_date
                ).toLocaleDateString("id-ID")} - ${new Date(
                  waves.find((w) => w.id === formData.wave_id)?.end_date
                ).toLocaleDateString("id-ID")}`
              : "-"}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Kuota:</strong>{" "}
            {waves.find((w) => w.id === formData.wave_id)?.quota || 0} Siswa
          </p>
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-white">
          Upload Dokumen
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Silakan unggah dokumen yang dibutuhkan untuk melengkapi pendaftaran.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentRequirements && documentRequirements.length > 0 ? (
            documentRequirements.map((doc) => {
              const currentFile = formData.uploaded_documents?.find(
                (d) => d.document_requirement_id === doc.id
              );
              return (
                <DocumentUploader
                  key={doc.id}
                  doc={doc}
                  currentFile={currentFile}
                  onUploadSuccess={(result) => handleUploadSuccess(doc, result)}
                  onDelete={() => handleDelete(currentFile)}
                  formErrors={formErrors}
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-sm col-span-2">
              Tidak ada dokumen yang perlu diunggah.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================
   Sub-komponen: DocumentUploader
   ========================== */
const DocumentUploader = ({
  doc,
  currentFile,
  onUploadSuccess,
  onDelete,
  formErrors,
}) => {
  const { handleFileChange, loading } = useFile({
    fieldName: "file",
    folder: "student/documents",
    onSuccess: (response) => onUploadSuccess(response),
    onError: (err) => console.error("Upload gagal:", err),
  });

  const getFileName = (path) =>
    path ? path.split("/").pop().split("?")[0] : "";

  return (
    // <div className="border border-dashed border-gray-800 dark:border-gray-400 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
    <div
      className={`border border-dashed rounded-md p-4 bg-gray-50 dark:bg-gray-700 ${
        formErrors?.[`uploaded_documents_${doc.name}`]
          ? "border-red-500"
          : "border-gray-800 dark:border-gray-400"
      }`}
    >
      <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {doc.name}
      </Label>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Silakan unggah file (jpg, png, pdf)
      </p>

      {currentFile?.path ? (
        <div className="mt-2 p-2 border border-dashed border-gray-800 dark:border-gray-400 rounded bg-white dark:bg-gray-600">
          <p className="text-sm text-green-600">
            ✓ {getFileName(currentFile.path)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Link
              to={currentFile.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline cursor-pointer"
            >
              Lihat Dokumen
            </Link>
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="text-red-600 hover:underline cursor-pointer text-sm"
            >
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`file-input-${doc.id}`}
          className="mt-2 flex items-center gap-2 cursor-pointer border px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
        >
          <Upload size={16} />
          {loading ? "Mengunggah..." : "Pilih File"}
          <Input
            id={`file-input-${doc.id}`}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,application/pdf"
            disabled={loading}
          />
        </label>
      )}

      {formErrors?.[`uploaded_documents_${doc.name}`] && (
        <ErrorLabel message={formErrors[`uploaded_documents_${doc.name}`]} />
      )}
    </div>
  );
};
