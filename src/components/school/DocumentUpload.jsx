import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ErrorLabel from "@/components/ErrorLabel";
import { Upload } from "lucide-react";
import useFile from "@/hooks/useFile";
import useDocumentRequirementStore from "@/store/useDocumentRequirementStore";

const DocumentUpload = ({
  formData,
  setFormData,
  formErrors,
  schoolId,
  onDeleteDocument,
}) => {
  const { documentRequirements, fetchDocumentRequirements, loading } =
    useDocumentRequirementStore();
  const { deleteFile } = useFile({});

  const [page, setPage] = useState(1);
  const [allRequirements, setAllRequirements] = useState([]);

  // Fetch dokumen requirement berdasarkan school_id
  useEffect(() => {
    if (schoolId) {
      fetchDocumentRequirements(page, schoolId);
    }
  }, [schoolId, page, fetchDocumentRequirements]);

  // Gabungkan data lama dan baru saat paginasi
  useEffect(() => {
    if (documentRequirements?.data) {
      setAllRequirements((prev) => {
        const newItems = documentRequirements.data.filter(
          (req) => !prev.some((p) => p.id === req.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [documentRequirements]);

  const uploadedDocs = Array.isArray(formData?.uploaded_documents)
    ? formData.uploaded_documents
    : [];

  const handleFileUpload = (req, file, path) => {
    const updated = uploadedDocs.filter((d) => d.doc_name !== req.name);
    updated.push({
      doc_name: req.name,
      doc_requirement_id: req.id,
      file,
      path,
      is_payment: false,
    });
    setFormData((prev) => ({
      ...prev,
      uploaded_documents: updated,
    }));
  };

  const handleDeleteDocument = async (doc) => {
    try {
      // Hapus file dari storage (jika punya path)
      if (doc?.path) {
        await deleteFile(doc.path);
      }

      // Hapus di backend (jika callback disediakan)
      if (onDeleteDocument) {
        await onDeleteDocument(doc);
      }

      const updated = uploadedDocs.filter((d) => d.doc_name !== doc.doc_name);
      setFormData((prev) => ({
        ...prev,
        uploaded_documents: updated,
      }));
    } catch (error) {
      console.error("Gagal menghapus dokumen:", error);
    }
  };

  const handleLoadMore = () => {
    if (documentRequirements?.next_page_url) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        Unggah Dokumen Persyaratan
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Silakan unggah dokumen sesuai ketentuan sekolah. Pastikan file yang
        diunggah benar dan terbaca.
      </p>

      {loading && page === 1 ? (
        <p className="mt-4 text-center text-gray-600">Memuat dokumen...</p>
      ) : allRequirements.length > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {allRequirements.map((req) => {
              const existing =
                uploadedDocs.find((d) => d.doc_requirement_id === req.id) ||
                uploadedDocs.find((d) => d.doc_name === req.name) ||
                null;

              return (
                <DocumentUploader
                  key={req.id}
                  req={req}
                  existingFile={existing}
                  onUpload={(file, path) => handleFileUpload(req, file, path)}
                  onDelete={() => handleDeleteDocument(existing || req)}
                  formErrors={formErrors}
                />
              );
            })}
          </div>

          {/* Tombol Muat Lebih Banyak */}
          {documentRequirements?.next_page_url && (
            <div className="flex justify-center mt-6">
              <Button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                {loading ? "Memuat..." : "Muat Lebih Banyak"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 text-gray-500 text-center">
          Belum ada dokumen persyaratan dari sekolah.
        </p>
      )}
    </div>
  );
};

const DocumentUploader = ({
  req,
  existingFile,
  onUpload,
  onDelete,
  formErrors,
}) => {
  const [url, setUrl] = useState(null);
  const { handleFileChange, loading: uploadLoading } = useFile({
    fieldName: "file",
    folder: "student/documents",
    onSuccess: (response) => {
      setUrl(response.url);
      onUpload(response.file, response.path);
    },
    onError: (err) => {
      console.error("Upload gagal:", err);
    },
  });

  const getFileName = (path) => path?.split("/").pop() || "";

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label className="text-base font-semibold text-gray-900 dark:text-white">
            {req.name}
          </Label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {req.is_required ? "Wajib diunggah" : "Opsional"}
          </p>
        </div>
        {existingFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            Hapus
          </Button>
        )}
      </div>

      {existingFile ? (
        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border text-sm">
          <div className="flex items-center justify-between">
            <span className="truncate">
              File: {getFileName(existingFile.path)}
            </span>
            <a
              href={url || existingFile.file || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-2"
            >
              Lihat
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`file-${req.id}`}
            className="cursor-pointer rounded-md border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            <span>{uploadLoading ? "Mengunggah..." : "Pilih File"}</span>
            <input
              id={`file-${req.id}`}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              disabled={uploadLoading}
            />
          </label>
          {formErrors?.[req.name] && (
            <ErrorLabel message={formErrors[req.name]} />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
