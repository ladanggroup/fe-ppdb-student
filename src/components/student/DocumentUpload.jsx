// src/components/student/DocumentUpload.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorLabel from "@/components/ErrorLabel";
import LoadingOverlay from "../LoadingOverlay";
import useFile from "@/hooks/useFile";
import { Upload } from "lucide-react";
import useDocumentRequirementStore from "@/store/useDocumentRequirementStore";

const DocumentUpload = ({
  formData,
  onDocumentUploadChange,
  onDocumentDelete,
  formErrors,
}) => {
  const { fetchStudentDocumentRequirements, loading } =
    useDocumentRequirementStore();
  const [docRequirementCache, setDocRequirementCache] = useState({});
  const [url, setUrl] = useState({});
  const { deleteFile } = useFile({});

  const documentRequirementFetch = useCallback(async () => {
    if (formData.selected_schools.length > 0) {
      try {
        let cache = {}; // kumpulkan semua dulu
        for (const school of formData.selected_schools) {
          if (!school.school_id) continue;
          const res = await fetchStudentDocumentRequirements(school.school_id);
          if (res) {
            res.forEach((req) => {
              if (!cache[req.name]) cache[req.name] = [];
              cache[req.name].push({
                school_id: req.school_id,
                requirement_id: req.id,
              });
            });
          }
        }
        setDocRequirementCache(cache);
      } catch (error) {
        console.error("Gagal fetch dokumen requirement:", error);
      }
    }
  }, [formData.selected_schools, fetchStudentDocumentRequirements]);

  useEffect(() => {
    documentRequirementFetch();
  }, [documentRequirementFetch]);

  useEffect(() => {
    let updatedDocs = [...formData.uploaded_documents];
    let changed = false;

    Object.keys(docRequirementCache).forEach((docName) => {
      const alreadyExist = updatedDocs.some((doc) => doc.doc_name === docName);
      if (!alreadyExist) {
        updatedDocs.push({
          doc_name: docName,
          path: "",
          file: "",
          is_payment: false,
        });
        changed = true;
      }
    });

    if (changed) {
      onDocumentUploadChange(updatedDocs);
    }
  }, [docRequirementCache, formData.uploaded_documents, onDocumentUploadChange]);

  const handleFileUpload = (docName, file, path) => {
    const updatedDocs = formData.uploaded_documents.filter(
      (doc) => doc.doc_name !== docName
    );

    docRequirementCache[docName]?.forEach((req) => {
      updatedDocs.push({
        doc_name: docName,
        path,
        file,
        is_payment: false,
        doc_requirement_id: req.requirement_id,
        school_id: req.school_id,
      });
    });

    onDocumentUploadChange(updatedDocs);
  };

  const handleDeleteDocument = async (doc) => {
    try {
      if (doc.doc_id) {
        await onDocumentDelete(doc.doc_id);
      } else if (doc?.path) {
        await deleteFile(doc.path);
      }
    } catch (err) {
      console.error("Gagal hapus dokumen:", err);
    }

    const updatedDocs = formData.uploaded_documents.filter(
      (d) => d.doc_name !== doc.doc_name
    );
    onDocumentUploadChange(updatedDocs);
  };

  return (
    <div className="relative border border-gray-800 dark:border-gray-500 rounded-lg p-8 bg-gray-50 dark:bg-gray-800">
      <LoadingOverlay isLoading={loading} />

      <div className="space-y-6">
        {formData.selected_schools.map((school) => (
          <div
            key={school.school_id}
            className="border border-gray-800 dark:border-gray-500 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
          >
            {/* Header Sekolah */}
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={school.logo_url || "/src/assets/Group 1078.png"}
                  alt={school.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {school.school_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {school.school_npsn}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  Alamat Sekolah
                </h4>
                <h4 className="font-medium text-center text-gray-800 dark:text-gray-200">
                  {school.wave_name}
                </h4>
                <h4 className="font-medium text-center text-gray-800 dark:text-gray-200">
                  Kuota
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {school.address}, {school.district}, {school.city},{" "}
                  {school.province}
                </p>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                  {new Date(school.start_date).toLocaleDateString("id")} -{" "}
                  {new Date(school.end_date).toLocaleDateString("id")}
                </p>
                <span className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                  {school?.quota} Murid
                </span>
              </div>
            </div>

            {/* Upload Dokumen */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">
                Upload Dokumen
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Silakan unggah dokumen yang dibutuhkan untuk melengkapi
                pendaftaran
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(docRequirementCache)
                  .filter((docName) =>
                    docRequirementCache[docName].some(
                      (req) => req.school_id === school.school_id
                    )
                  )
                  .map((docName) => {
                    const currentFile = formData.uploaded_documents.find(
                      (doc) =>
                        doc.doc_name === docName &&
                        doc.school_id === school.school_id
                    );
                    return (
                      <DocumentUploader
                        key={`${school.school_id}-${docName}`}
                        docType={docName}
                        currentFile={currentFile}
                        onFileUpload={(file, path) =>
                          handleFileUpload(docName, file, path)
                        }
                        onDelete={() => handleDeleteDocument(currentFile)}
                        formErrors={formErrors}
                        url={url}
                        setUrl={setUrl}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocumentUploader = ({
  docType,
  currentFile,
  onFileUpload,
  onDelete,
  formErrors,
  url,
  setUrl,
}) => {
  const { handleFileChange, loading: uploadLoading } = useFile({
    fieldName: "file",
    folder: "student/documents",
    onSuccess: (response) => {
      setUrl((prev) => ({
        ...prev,
        [docType]: response.url,
      }));
      onFileUpload(response.file, response.path);
    },
    onError: (err) => console.error("Upload gagal", err),
  });

  const getFileName = (path) =>
    path ? path.split("/").pop().split("?")[0] : "";

  return (
    <div className="border border-dashed border-gray-800 dark:border-gray-400 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
      <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {docType}
      </Label>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Silakan unggah file
      </p>

      {currentFile?.path ? (
        <div className="mt-2 p-2 border border-dashed border-gray-800 dark:border-gray-400 rounded bg-white dark:bg-gray-600">
          <p className="text-sm text-green-600">
            ✓ {getFileName(currentFile.path)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Link
              to={url[docType] || currentFile.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ppdb-orange text-sm hover:underline cursor-pointer"
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
          htmlFor={`file-input-${docType}`}
          className="mt-2 flex items-center gap-2 cursor-pointer border px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
        >
          <Upload size={16} />
          {uploadLoading ? "Mengunggah..." : "Pilih File"}
          <Input
            id={`file-input-${docType}`}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,application/pdf"
            disabled={uploadLoading}
          />
        </label>
      )}

      {formErrors?.[`uploaded_documents_${docType}`] && (
        <ErrorLabel message={formErrors[`uploaded_documents_${docType}`]} />
      )}
    </div>
  );
};

export default DocumentUpload;

