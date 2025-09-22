// src/store/useAdminStore.js
import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useAdminStore = create((set) => ({
  admins: [],
  loading: false,
  error: null,
  fetchAdmins: async (page, search) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(
        `/api/admin/user?page=${page}&search=${search}`
      );
      set({ admins: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch admins",
        loading: false,
      });
    }
  },
  createAdmin: async (adminData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/api/admin/user", adminData);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create admin",
        loading: false,
      });
      throw error;
    }
  },
  showAdmin: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/user/show/${userId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to show admin",
        loading: false,
      });
    }
  },
  updateAdmin: async (userId, adminData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(
        `/api/admin/user/update/${userId}`,
        adminData
      );
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update admin",
        loading: false,
      });
      throw error;
    }
  },
  deleteAdmin: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/api/admin/user/${userId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete admin",
        loading: false,
      });
    }
  },
  updatePassword: async (userId, passwordData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(
        `/api/admin/setting/update-password/${userId}`,
        passwordData
      );
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update password",
        loading: false,
      });
      throw error;
    }
  },
}));

export default useAdminStore;
