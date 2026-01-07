// src/store/useDocumentRequirementStore.js
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

const useDocumentRequirementStore = create((set) => ({
    documentRequirements: [],
    currentDocumentRequirement: null,
    loading: false,
    error: null,
    //student
    fetchStudentDocumentRequirements: async (slug) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/api/student/document-requirement', { params: { slug } });
            set({ documentRequirements: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch document requirements', loading: false });
        }
    },
}));

export default useDocumentRequirementStore;