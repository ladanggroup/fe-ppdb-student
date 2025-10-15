import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const useStudentStore = create((set) => ({
  students: [],
  currentStudent: null,
  loading: false,
  error: null,

  register: async (form) => {
    set({ loading: true });
    try {
      const response = await apiClient.post("/api/student/register", form);
      set({ loading: false, errors: null });
      return response.data;
    } catch (error) {
      set({ loading: false, errors: error.response?.data?.errors || "Registration failed" });
      return false;
    }
  },

  completeRegistration: async (form) => {
    set({ loading: true });
    try {
      const response = await apiClient.post("/api/student/complete-register", form);
      set({ loading: false, errors: null });
      return response.data;
    } catch (error) {
      set({ loading: false, errors: error.response?.data?.errors || "Registration failed" });
      return false;
    }
  },

  update: async (studentId, studentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/student/setting/update/${studentId}`, studentData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update student' });
      throw error;
    }
  },

  updatePassword: async (studentId, passwordData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/student/setting/change-password/${studentId}`, passwordData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update password' });
      throw error;
    }
  },

  //admin
  fetchStudentsAdmin: async (page, search) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/api/admin/student", { params: { page, search } });
      set({ students: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch students", loading: false });
    }
  },

  showStudentAdmin: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/student/show/${studentId}`);
      set({ currentStudent: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to show student", loading: false });
    }
  },
}));

export default useStudentStore;