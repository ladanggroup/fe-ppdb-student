import { create } from "zustand";
import apiClient from "@/api/apiClient";

export const useWaveDocumentRequirementStore = create((set) => ({
    waveDocumentRequirements: [],
    currentWaveDocumentRequirement: null,
    loading: false,
    error: null,

    fetchWaveDocumentRequirements: async (waveId) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get(`/api/school/wave-document-requirement/${waveId}`);
            set({ waveDocumentRequirements: res.data.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data || err.message, loading: false });
        }
    },

    showWaveDocumentRequirement: async (waveDocumentRequirementId) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get(`/api/school/wave-document-requirement/${waveDocumentRequirementId}`);
            set({ currentWaveDocumentRequirement: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to show wave document requirement', loading: false });
        }
    },

    createWaveDocumentRequirement: async (waveDocumentRequirementData) => {
        set({ loading: true, error: null });
        try {
            await apiClient.post('/api/school/wave-document-requirement', waveDocumentRequirementData);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create wave document requirement', loading: false });
            return false;
        }
    },

    updateWaveDocumentRequirement: async (waveDocumentRequirementId, waveDocumentRequirementData) => {
        set({ loading: true, error: null });
        try {
            await apiClient.put(`/api/school/wave-document-requirement/${waveDocumentRequirementId}`, waveDocumentRequirementData);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update wave document requirement', loading: false });
            return false;
        }
    },
}));