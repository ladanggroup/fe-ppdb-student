import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const useDocumentStore = create((set) => ({
  documents: [],
  loading: false,
  error: null,

  fetchDocuments: async (schoolId, isPayment) => { // DocumentController list doesn't take school_id as param, assumes it from auth
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/school/document`, { params: { school_id: schoolId, is_payment: isPayment } });
      set({ documents: response.data.data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Failed to fetch documents' });
      console.error("Error fetching documents:", error);
    }
  },

  addDocument: async (documentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/school/document`, documentData);
      set((state) => ({ documents: [...state.documents, response.data.data], loading: false }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to add document' });
      throw error;
    }
  },

  deleteDocument: async (documentId, schoolId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/school/document/${documentId}`, { data: { school_id: schoolId } }); // Backend expects school_id in body
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== documentId),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Failed to delete document' });
      throw error;
    }
  },
}));

export default useDocumentStore;
