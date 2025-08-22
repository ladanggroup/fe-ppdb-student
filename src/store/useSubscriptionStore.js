import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const useSubscriptionStore = create((set) => ({
  subscriptions: [], // Untuk menyimpan daftar langganan sekolah
  subscriptionsAdmin: null,
  loading: false,
  error: null,

  /**
   * Mengambil daftar langganan untuk sekolah tertentu.
   * @param {string} schoolId ID sekolah
   */
  fetchSubscriptions: async (schoolId) => {
    set({ loading: true, error: null });
    try {
      // Backend SubscriptionController@list expects school_id in request input
      const response = await apiClient.get('/api/school/subscription', {
        params: { school_id: schoolId }
      });
      // Assuming your backend's list method returns paginated data
      // like simplePaginate(10) which has a 'data' property for the items
      set({ subscriptions: response.data.data, loading: false });
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
      // Setelah berhasil membuat, mungkin Anda ingin menambahkan langganan baru ke state
      // atau me-refresh daftar langganan.
      // Karena backend hanya mengembalikan pesan sukses, kita bisa me-refresh daftar.
      // Jika backend mengembalikan objek langganan yang baru dibuat, Anda bisa menambahkannya langsung.
      set({ loading: false }); // Set loading to false first
      // Optionally, you can refetch all subscriptions to get the latest list
      // This depends on whether the backend returns the full new subscription object or just a success message.
      // If it returns the new subscription, you can do:
      // set((state) => ({ subscriptions: [...state.subscriptions, response.data.data] }));
      // For now, assuming it just returns success, so we'll rely on a refetch in the component.
      return response.data; // Mengembalikan respons untuk penanganan sukses di komponen
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Gagal membuat langganan' });
      throw error; // Melemparkan error agar bisa ditangkap oleh komponen
    }
  },

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
