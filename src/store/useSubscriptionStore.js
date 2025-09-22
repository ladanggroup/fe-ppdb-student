import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const useSubscriptionStore = create((set) => ({
  subscriptions: [], // Untuk menyimpan daftar langganan sekolah
  subscriptionsAdmin: [],
  loading: false,
  error: null,

  // school
  /**
   * Mengambil daftar langganan untuk sekolah tertentu.
   * @param {string} schoolId ID sekolah
   */
  fetchSubscriptions: async (schoolId, page) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/school/subscription', {
        params: { school_id: schoolId, page },
      });
      set({ subscriptions: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Gagal mengambil langganan' });
      console.error("Error fetching subscriptions:", error);
    }
  },

  /**
   * Membuat langganan baru untuk sekolah.
   * @param {object} subscriptionData Data langganan (product_id, school_id)
   */
  createSubscription: async (subscriptionData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/api/school/subscription', subscriptionData);
      set({ loading: false }); // Set loading to false first
      return response.data; // Mengembalikan respons untuk penanganan sukses di komponen
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal membuat langganan' });
      throw error; // Melemparkan error agar bisa ditangkap oleh komponen
    }
  },

  /**
   * Menghapus langganan untuk sekolah.
   * @param {string} subscriptionId ID langganan
   */
  deleteSubscription: async (subscriptionId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/api/school/subscription/${subscriptionId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal menghapus langganan' });
      throw error;
    }
  },

  showSubscription: async (subscriptionId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/school/subscription/${subscriptionId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal menampilkan langganan' });
      throw error;
    }
  },

  updateVerifySubscription: async (subscriptionId, subscriptionData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/school/subscription/${subscriptionId}/verify`, subscriptionData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal memperbarui langganan' });
      throw error;
    }
  },

  // admin
  listAdmin: async (page=1, status) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/subscription?page=${page}&search=${status}`);
      set({ subscriptionsAdmin: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal mengambil langganan' });
      throw error;
    }
  },

  showAdmin: async (subscriptionId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/subscription/show/${subscriptionId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal menampilkan langganan' });
      throw error;
    }
  },

  verifyAdmin: async (subscriptionId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/admin/subscription/verify/${subscriptionId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal memverifikasi langganan' });
      throw error;
    }
  },
  rejectAdmin: async (subscriptionId, note) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/admin/subscription/reject/${subscriptionId}`, { note });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal menolak langganan' });
      throw error;
    }
  }
}));

export default useSubscriptionStore;
