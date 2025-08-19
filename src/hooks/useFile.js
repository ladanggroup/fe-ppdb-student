// import { useState } from 'react';
// import apiClient from '@/api/apiClient';

// export function useFile(apiBaseUrl = '/api') {
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState(null);
//     const [files, setFiles] = useState([]);
//     const [file, setFile] = useState(null);

//     const upload = async (itemFile, folder) => {
//         setLoading(true);
//         setErrors(null);
//         const formData = new FormData();
//         formData.append('file', itemFile);
//         formData.append('folder', folder || 'docs');
//         try {
//             const response = await apiClient.post(`${apiBaseUrl}/files/upload`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//             // const response = await apiClient.post(`${apiBaseUrl}/files/upload`, {'file' : file}, {headers: {'Content-Type': 'multipart/form-data'}});
//             setFile(response.data.data);
//             setFiles([...files, response.data.data]);
//             return {
//                 status: true,
//                 message: 'success',
//                 data: response.data.data
//             }
//         } catch (error) {
//             return {
//                 status: false,
//                 message: error.response?.data?.message,
//                 data: null
//             }
            
//         }
//     };

//     const show = async (path) => {
//         setLoading(true);
//         setErrors(null);
//         try {
//             const response = await apiClient.get(`${apiBaseUrl}/files/view`, {params: {path}});
//             setFile(response.data.data);
//             setFiles([...files, response.data.data]);
//             return {
//                 status: true,
//                 message: response.data.message,
//                 data: response.data.data
//             }
//         } catch (error) {
//             return {
//                 status: false,
//                 message: error.response?.data?.message,
//                 data: null
//             }
            
//         }
//     };

//     const deleteFile = async (path) => {
//         setLoading(true);
//         setErrors(null);
//         try {
//             const response = await apiClient.delete(`${apiBaseUrl}/files/delete`, {data: {path}});
//             setFile(response.data.data);
//             setFiles([...files, response.data.data]);
//             return {
//                 status: true,
//                 message: 'success',
//                 data: response.data
//             }
//         } catch (error) {
//             return {
//                 status: false,
//                 message: error.response?.data?.message,
//                 data: null
//             }
            
//         }
//     };

//     return {
//         upload,
//         show,
//         deleteFile,
//         loading,
//         errors,
//         files,
//         file,
//         setFile,
//         setFiles,
//     };
// }

import apiClient from '@/api/apiClient';
import { useState } from 'react';

export default function useFile({
    endpoint = '/api/files',
    fieldName = 'file',
    folder = 'docs',
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
        formData.append('folder', folder);

        try {
            setIsUploading(true);
            const response = await apiClient.post(`${endpoint}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
    };
}
