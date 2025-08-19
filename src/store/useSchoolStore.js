// stores/school.store.js
import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useSchoolStore = create((set, get) => ({
  school: null,
  students: [],
  waves: [],
  subscriptions: [],
  errors: null,
  loading: false,

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
      return false;
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
        school: response.data.data,
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
  // Mendapatkan siswa yang mendaftar ke sekolah
  fetchRegisteredStudents: async () => {
    set({ loading: true });
    try {
      const schoolId = get().school?.id;
      if (!schoolId) throw new Error("School ID not found");

      const response = await apiClient.get(`/api/school/${schoolId}/students`);
      set({
        students: response.data.data,
        loading: false,
        errors: null,
      });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Failed to fetch students",
      });
      return [];
    }
  },

  // Memverifikasi pendaftaran siswa
  verifyStudentRegistration: async (studentId, status) => {
    set({ loading: true });
    try {
      const schoolId = get().school?.id;
      if (!schoolId) throw new Error("School ID not found");

      const response = await apiClient.put(
        `/api/school/${schoolId}/students/${studentId}/verify`,
        {
          status,
        }
      );

      // Update local state
      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId
            ? { ...student, selection_status: status }
            : student
        ),
        loading: false,
        errors: null,
      }));

      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Verification failed",
      });
      return false;
    }
  },
}));

export default useSchoolStore;
