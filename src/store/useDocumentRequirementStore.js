// src/store/useDocumentRequirementStore.js
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

const useDocumentRequirementStore = create((set) => ({
    documentRequirements: [],
    currentDocumentRequirement: null,
    loading: false,
    error: null,
    fetchDocumentRequirements: async (page, schoolId) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/api/school/document-requirement', { params: { page, school_id: schoolId } });
            set({ documentRequirements: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch document requirements', loading: false });
        }
    },
    showDocumentRequirement: async (documentRequirementId) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get(`/api/school/document-requirement/${documentRequirementId}`);
            set({ currentDocumentRequirement: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to show document requirement', loading: false });
        }
    },
    createDocumentRequirement: async (documentRequirementData) => {
        set({ loading: true, error: null });
        try {
            await apiClient.post('/api/school/document-requirement', documentRequirementData);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create document requirement', loading: false });
            return false;
        }
    },
    updateDocumentRequirement: async (documentRequirementId, documentRequirementData) => {
        set({ loading: true, error: null });
        try {
            await apiClient.put(`/api/school/document-requirement/${documentRequirementId}`, documentRequirementData);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update document requirement', loading: false });
            return false;
        }
    },
    destroyDocumentRequirement: async (documentRequirementId) => {
        set({ loading: true, error: null });
        try {
            await apiClient.delete(`/api/school/document-requirement/${documentRequirementId}`);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete document requirement', loading: false });
            return false;
        }
    },
}));

export default useDocumentRequirementStore;