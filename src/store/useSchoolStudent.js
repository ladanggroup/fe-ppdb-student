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
      const response = await apiClient.post("/api/student/school-student", studentData);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to store student",
        loading: false,
      });
      throw error;
    }
  },
  fetchSchoolStudents: async (studentId, slug) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/student/school-student`, {
        params: { student_id: studentId, slug },
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
      const response = await apiClient.put(
        `/api/student/school-student/${schoolStudentId}/verify`
      );
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update status",
        loading: false,
      });
      throw error;
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
