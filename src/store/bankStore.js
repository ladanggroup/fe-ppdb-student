// src/stores/bankStore.js
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

const useBankStore = create((set) => ({
  banks: [],
  banksAdmin: [],
  currentBank: null,
  loading: false,
  error: null,

  // Get banks list
  fetchBanks: async (schoolId, name = '') => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/school/bank', {
        params: { school_id: schoolId, name }
      });
      set({ banks: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch banks', loading: false });
    }
  },

  // Create new bank
  createBank: async (bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/api/school/bank', bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create bank', loading: false });
      return false;
    }
  },

  // Update bank
  updateBank: async (bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put('/api/school/bank', bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update bank', loading: false });
      return false;
    }
  },

  //admin
  fetchBanksAdmin: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/bank');
      set({ banksAdmin: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch banks', loading: false });
    }
  },

  createBankAdmin: async (bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/api/admin/bank', bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create bank', loading: false });
      return false;
    }
  },

  updateBankAdmin: async (bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put('/api/admin/bank', bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update bank', loading: false });
      return false;
    }
  },

  // Set current bank for editing
  setCurrentBank: (bank) => set({ currentBank: bank }),
  
  // Clear current bank
  clearCurrentBank: () => set({ currentBank: null }),
}));

export default useBankStore;