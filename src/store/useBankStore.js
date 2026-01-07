// src/store/useBankStore.js
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

const useBankStore = create((set) => ({
  banks: [],
  banksAdmin: [],
  currentBank: null,
  loading: false,
  error: null,

  // Get banks list
  fetchBanks: async (slug) => { // for school to student
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/banks/school', {
        params: { slug: slug },
      });
      set({ banks: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch banks', loading: false });
    }
  },

  // Set current bank for editing
  setCurrentBank: (bank) => set({ currentBank: bank }),
  
  // Clear current bank
  clearCurrentBank: () => set({ currentBank: null }),
}));

export default useBankStore;