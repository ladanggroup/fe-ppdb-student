import { create } from "zustand";
import apiClient from "@/api/apiClient";

export const useWaveStore = create((set) => ({
  waves: [],
  currentWave: null,
  loading: false,
  error: null,

  // public wave
  fetchPublicWaves: async (
    // province_id,
    // city_id,
    // district_id,
    // education_level,
    // page,
    // search
    slug
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/api/waves', { params: { slug } }); // { params: { province_id, city_id, district_id, education_level, page, search } });
      set({ waves: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false, waves: [] });
    }
  },

  // wave for student
  fetchStudentWaves: async (
    // province_id,
    // city_id,
    // district_id,
    // education_level,
    // page,
    // search,
    slug
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/api/student/wave', { params: { slug} });
      set({ waves: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false, waves: [] });
    }
  },

  showWave: async (waveId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/api/student/wave/${waveId}`);
      set({ currentWave: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  //school wave
  
  // ambil semua wave
  fetchWaves: async (schoolId, page) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/api/school/wave', {
        params: { school_id: schoolId, page },
      });
      set({ waves: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // ambil detail wave
  detailWave: async (waveId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/api/school/wave/${waveId}`);
      set({ currentWave: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // tambah wave
  createWave: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post("/api/school/wave", payload);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // update wave
  updateWave: async (waveId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.put(`/api/school/wave/${waveId}`, payload);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // hapus wave
  deleteWave: async (waveId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/school/wave/${waveId}`);
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },
}));

export default useWaveStore;
