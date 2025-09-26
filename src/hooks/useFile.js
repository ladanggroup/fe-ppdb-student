// src/hooks/useFile.js
import apiClient from "@/api/apiClient";
import { useState } from "react";

export default function useFile({
  endpoint = "/api/files",
  fieldName = "file",
  folder = "docs",
  onSuccess,
  onError,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState(null);

  const uploadFile = async (selectedFile) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append(fieldName, selectedFile);
    formData.append("folder", folder);

    try {
      setIsUploading(true);
      const response = await apiClient.post(`${endpoint}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = await response.data.data;
      if (response.status === 200) {
        onSuccess && onSuccess(result);
        setUploadedUrl(result.url);
        setErrors(null);
      }
    } catch (err) {
      setErrors(err.response.data);
      onError && onError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (path) => {
    try {
      const response = await apiClient.delete(`${endpoint}/delete`, { data: { path } });
      if (response.status === 200) {
        onSuccess && onSuccess(response.data.data);
        setFile(null);
        setPreview(null);
        setUploadedUrl(null);
      }
    } catch (err) {
      setErrors(err.response?.data || err.message);
      onError && onError(err);
    }
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      uploadFile(selectedFile); // Upload langsung setelah memilih file
    }
  };

  return {
    file,
    preview,
    isUploading,
    errors,
    uploadedUrl,
    handleFileChange,
    deleteFile,
  };
}
