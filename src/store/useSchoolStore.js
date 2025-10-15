// stores/school.store.js
import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useSchoolStore = create((set) => ({
  userSchool: [],
  schools: [],
  currentUserSchool: null,
  students: [],
  errors: null,
  loading: false,

  // Mendapatkan semua sekolah
  fetchSchools: async (page, search, provinceId, cityId, districtId, educationLevel) => {
    set({ loading: true });
    try {
      const response = await apiClient.get(`/api/schools/list`, {
        params: { page, search, province_id: provinceId, city_id: cityId, district_id: districtId, education_level: educationLevel },
      });
      set({ schools: response.data.data, loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Failed to fetch schools",
      });
      return [];
    }
  },

  // Mendaftarkan sekolah baru
  registerSchool: async (form) => {
    set({ loading: true });
    try {
      const response = await apiClient.post("/api/school/register", form);
      set({ loading: false, errors: null });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.errors || "Registration failed",
      });
      return error.response?.data || { success: false };
    }
  },
  // Memperbarui profil sekolah
  updateSchoolProfile: async (userId, form) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        `/api/school/update/${userId}`,
        form
      );
      // Update state with new school data
      set({
        loading: false,
        errors: null,
      });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.errors || "Update failed",
      });
      return false;
    }
  },

  // user school
  fetchSchoolUser: async (schoolId, page) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/api/school/user", {
        params: { school_id: schoolId, page },
      });
      set({ userSchool: response.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch user school",
        loading: false,
      });
    }
  },

  createUserSchool: async (userSchoolData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post("/api/school/user", userSchoolData);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({
        errors: error.response?.data?.message || "Failed to store user school",
        loading: false,
      });
      throw error;
    }
  },

  updateUserSchool: async (userSchoolId, userSchoolData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.put(`/api/school/user/${userSchoolId}`, userSchoolData);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({
        errors: error.response?.data?.message || "Failed to update user school",
        loading: false,
      });
      throw error;
    }
  },

  showUserSchool: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/school/user/${userId}`);
      set({ userSchool: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to show user school",
        loading: false,
      });
    }
  },

  deleteUserSchool: async (userSchoolId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/school/user/${userSchoolId}`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete user school",
        loading: false,
      });
      return false;
    }
  },

  updatePassword: async (userId, form) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(`/api/school/update-password/${userId}`, form);
      set({ loading: false, errors: null });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.errors || "Update failed",
      });
      return false;
    }
  },
}));

export default useSchoolStore;
