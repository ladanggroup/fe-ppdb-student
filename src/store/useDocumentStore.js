import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useDocumentStore = create((set) => ({
  documents: [],
  loading: false,
  error: null,

  // students
  fetchStudentDocument: async (studentId, isPayment, slug) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/student/document`, {
        params: { student_id: studentId, is_payment: isPayment, slug },
      });
      set({ documents: response.data.data.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch documents",
      });
      console.error("Error fetching documents:", error);
    }
  },

  addStudentDocument: async (documentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(
        `/api/student/document`,
        documentData
      );
      set((state) => ({
        documents: [...(state.documents || []), documentData], // fallback kalau null
      }));
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.errors ||
          error.response?.data?.message ||
          "Failed to add document",
      });
      throw error;
    }
  },

  deleteStudentDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/student/document/${documentId}`);
      set((state) => ({
        documents: (state.documents || []).filter(
          (doc) => doc.id !== documentId
        ),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete document",
      });
      throw error;
    }
  },

  updateStudentDocument: async (documentId, documentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(
        `/api/student/document/${documentId}`,
        documentData
      );
      set((state) => ({
        documents: [...(state.documents || []), documentData], // fallback kalau null
      }));
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.errors ||
          error.response?.data?.message ||
          "Failed to update document",
      });
      throw error;
    }
  },

  deletePathStudentDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/student/document/path/${documentId}`);
      set((state) => ({
        documents: (state.documents || []).filter(
          (doc) => doc.id !== documentId
        ),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete document",
      });
      throw error;
    }
  },
}));

export default useDocumentStore;
