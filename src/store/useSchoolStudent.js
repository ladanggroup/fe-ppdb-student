// src/store/useSchoolStudent.js
import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useSchoolStudent = create((set) => ({
  schoolStudents: [],
  schools: null,
  loading: false,
  error: null,
  //student
  store: async (studentData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post("/api/student/school-student", studentData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to store student",
        loading: false,
      });
      return false;
    }
  },
  fetchSchoolStudents: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/student/school-student`, {
        params: { student_id: studentId },
      });
      set({ schoolStudents: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch students",
        loading: false,
      });
    }
  },
  updateVerify: async (schoolStudentId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(
        `/api/student/school-student/${schoolStudentId}/verify`
      );
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update status",
        loading: false,
      });
      return false;
    }
  },

  //school
  registerStudent: async (schoolId, form) => {
    set({ loading: true });
    try {
      const response = await apiClient.post("/api/school/student", {
        ...form,
        school_id: schoolId,
      });
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

  completeRegistration: async (studentId, form) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        "/api/school/student/" + studentId + "/complete-register",
        form
      );
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

  // Mendapatkan siswa yang mendaftar ke sekolah
  fetchStudents: async (page, search, status, schoolId) => {
    set({ loading: true });
    try {
      const response = await apiClient.get(`/api/school/student`, {
        params: {
          page,
          search,
          status,
          school_id: schoolId,
        },
      });
      set({
        schools: response.data,
        loading: false,
        errors: null,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Failed to fetch students",
      });
      return [];
    }
  },

  detailStudent: async (studentId, schoolId) => {
    set({ loading: true });
    try {
      const response = await apiClient.get(`/api/school/student/${studentId}`, {
        params: {
          school_id: schoolId,
        },
      });
      set({ loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors:
          error.response?.data?.message || "Failed to fetch student details",
      });
      return null;
    }
  },

  // Memverifikasi pendaftaran siswa
  verifyRegistration: async (schoolStudentId) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        `/api/school/student/${schoolStudentId}/verify`
      );

      // Update local state
      set({ loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Verification failed",
      });
      return false;
    }
  },
  rejectRegistration: async (schoolStudentId, note) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        `/api/school/student/${schoolStudentId}/reject`,
        {
          note,
        }
      );

      // Update local state
      set({ loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Rejection failed",
      });
      return false;
    }
  },

  verifySelection: async (schoolStudentId, destinationClass) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        `/api/school/student/${schoolStudentId}/verify-selection`,
        {
          destination_class: destinationClass,
        }
      );

      // Update local state
      set({ loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Verification failed",
      });
      return false;
    }
  },

  rejectSelection: async (schoolStudentId, note) => {
    set({ loading: true });
    try {
      const response = await apiClient.put(
        `/api/school/student/${schoolStudentId}/reject-selection`,
        {
          note,
        }
      );

      // Update local state
      set({ loading: false, errors: null });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Rejection failed",
      });
      return false;
    }
  },

  printSelectionLetter: async (registrationNumber) => {
    set({ loading: true });
    try {
    const response = await apiClient.get(
      `/api/student/school-student/print/${registrationNumber}`,
      { responseType: "blob" }
    );
    set({ loading: false, errors: null });
    return response.data;
    } catch (error) {
      set({
        loading: false,
        errors: error.response?.data?.message || "Failed to print selection letter",
      });
      return false;
    }
  },
}));

export default useSchoolStudent;
