// src/components/student/DocumentUpload.jsx
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorLabel from "@/components/ErrorLabel";
import useFile from "@/hooks/useFile";
import { Link } from "react-router";
import { Plus, X, Upload } from "lucide-react";

const DocumentUpload = ({
  formData,
  onDocumentUploadChange,
  onDocumentDelete,
  formErrors,
}) => {
  const [newDocumentName, setNewDocumentName] = useState("");
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [url, setUrl] = useState([]);
  const { deleteFile } = useFile({});
  const handleFileUpload = (docName, file, path) => {
    const newDoc = {
      doc_name: docName,
      path: path,
      file: file,
      is_payment: false,
      type: docName,
    };

    const updatedDocuments = formData.uploaded_documents.filter(
      (doc) => doc.type !== docName
    );
    updatedDocuments.push(newDoc);

    onDocumentUploadChange(updatedDocuments);
    setShowNewDocumentForm(false);
    setNewDocumentName("");
  };

  const handleDeleteDocument = async (doc) => {
    try {
      if (doc.doc_id) {
        // dokumen lama di DB
        await onDocumentDelete(doc.doc_id);
      } else if (doc?.path) {
        // dokumen baru di-upload
        await deleteFile(doc.path);
      }
    } catch (err) {
      console.error("Gagal hapus dokumen:", err);
    }

    const updatedDocuments = formData.uploaded_documents.filter(
      (d) => d.doc_name !== doc.doc_name
    );
    onDocumentUploadChange(updatedDocuments);
  };

  const handleAddNewDocumentType = () => {
    if (newDocumentName.trim()) {
      setShowNewDocumentForm(true);
    }
  };

  const handleCancelNewDocument = () => {
    setShowNewDocumentForm(false);
    setNewDocumentName("");
  };

  const getDocumentTypes = () => {
    return formData.uploaded_documents.map((doc) => doc.type);
  };
  console.log(formData);

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        2. Unggah Dokumen
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Tambahkan dan unggah dokumen-dokumen yang diperlukan untuk pendaftaran.
        Maksimal 1 file per jenis dokumen.
      </p>

      {/* Form Tambah Jenis Dokumen Baru */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <Label
            htmlFor="new-document-name"
            className="text-sm font-medium dark:text-white"
          >
            Nama Dokumen
          </Label>
          <Input
            id="new-document-name"
            type="text"
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
            placeholder="Contoh: Kartu Keluarga, Ijazah, Akta Kelahiran, dll."
            className="mt-1 py-2 px-3"
            disabled={showNewDocumentForm}
          />
        </div>
        {!showNewDocumentForm ? (
          <Button
            type="button"
            onClick={handleAddNewDocumentType}
            disabled={
              !newDocumentName.trim() ||
              getDocumentTypes().includes(newDocumentName.trim())
            }
            className="flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Tambah Dokumen
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={handleCancelNewDocument}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Batal
          </Button>
        )}
      </div>

      {/* Daftar Dokumen yang Sudah Diupload */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.uploaded_documents.map((document) => (
          <DocumentUploader
            key={document.doc_name}
            docType={document.doc_name}
            currentFile={document}
            onFileUpload={(file, path) =>
              handleFileUpload(document.doc_name, file, path)
            }
            setUrl={setUrl}
            url={url}
            onDelete={() => handleDeleteDocument(document)} // 🔥 ganti onRemoveDocument
            formErrors={formErrors}
          />
        ))}

        {/* Form Upload untuk Dokumen Baru */}
        {showNewDocumentForm && (
          <DocumentUploader
            key="new"
            docType={newDocumentName}
            currentFile={null}
            onFileUpload={(file, path) =>
              handleFileUpload(newDocumentName, file, path)
            }
            onDelete={handleCancelNewDocument}
            formErrors={formErrors}
            url={url}
            setUrl={setUrl}
            isNew={true}
          />
        )}

        {formErrors?.uploaded_documents && (
          <ErrorLabel message={formErrors.uploaded_documents} />
        )}
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
  isNew = false,
}) => {
  const { handleFileChange, loading: uploadLoading } = useFile({
    fieldName: "file",
    folder: "student-documents",
    onSuccess: (response) => {
      setUrl((prev) => ({
        ...prev,
        [docType]: response.url,
      }));
      onFileUpload(response.file, response.path);
    },
    onError: (err) => {
      console.error("Upload failed", err);
    },
  });

  const getFileNameFromPath = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("?")[0];
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label className="text-lg font-semibold text-left text-gray-900 dark:text-white">
            {docType}
          </Label>
          {currentFile ? (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ✓ File sudah diunggah
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Silakan unggah file
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete} // 🔥 pakai onDelete
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          {isNew ? "Batal" : "Hapus"}
        </Button>
      </div>

      {/* File saat ini */}
      {currentFile ? (
        <div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-md border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium mb-1">
                  File Terunggah: {getFileNameFromPath(currentFile.path)}
                </Label>
                <Link
                  to={
                    url[docType] ||
                    (typeof currentFile.file === "string"
                      ? currentFile.file
                      : "#")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-[18px] px-2 py-1"
                >
                  Lihat Dokumen
                </Link>
                <span className="text-xs text-green-600">✓</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Upload File */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 bg-white dark:bg-gray-700 rounded-md border">
          <div>
            <Label className="text-sm font-medium mb-1 dark:text-white">
              Nama Dokumen
            </Label>
            <Input
              type="text"
              value={docType}
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-600 dark:text-gray-400 py-2 px-3 rounded-md"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Dokumen yang diunggah
            </span>
            {formErrors[docType] && (
              <ErrorLabel message={formErrors[docType]} />
            )}
          </div>
          <div>
            <Label className="text-sm font-medium mb-1 dark:text-white">
              Unggah File
            </Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor={`file-input-${docType}`}
                className="flex-1 cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 justify-center"
              >
                <Upload size={16} />
                <span>{uploadLoading ? "Mengunggah..." : "Pilih File"}</span>
                <input
                  id={`file-input-${docType}`}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,application/pdf"
                  disabled={uploadLoading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              JPG, PNG, PDF hingga 10MB
            </p>
          </div>
        </div>
      )}

      {formErrors[`uploaded_documents_${docType}`] && (
        <ErrorLabel message={formErrors[`uploaded_documents_${docType}`]} />
      )}
    </div>
  );
};

export default DocumentUpload;
