// src/store/bankStore.js
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

const useBankStore = create((set) => ({
  banks: [],
  banksAdmin: [],
  currentBank: null,
  loading: false,
  error: null,

  // Get banks list
  fetchBanks: async (schoolId) => { // for school to student
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/banks/school', {
        params: { school_id: schoolId }
      });
      set({ banks: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch banks', loading: false });
    }
  },
  fetchListBanks: async (page, search = '', schoolId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/school/bank', {
        params: { school_id: schoolId, name: search, page: page },
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
  updateBank: async (bankId, bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/api/school/bank/${bankId}`, bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update bank', loading: false });
      return false;
    }
  },

  showBank: async (bankId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/school/bank/${bankId}`);
      set({ currentBank: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to show bank', loading: false });
    }
  },

  destroyBank: async (bankId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/school/bank/${bankId}`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete bank', loading: false });
      return false;
    }
  },

  //admin
  fetchBanksAdmin: async () => { // list bank by admin to school
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/banks/admin'); // list bank by admin to school
      set({ banksAdmin: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch banks', loading: false });
    }
  },

  fetchListBankAdmin: async (page, search) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/admin/bank?page=' + page + '&search=' + search);
      set({ banksAdmin: response.data, loading: false });
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

  updateBankAdmin: async (bankId, bankData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/api/admin/bank/update/${bankId}`, bankData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update bank', loading: false });
      return false;
    }
  },

  destroyBankAdmin: async (bankId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/admin/bank/delete/${bankId}`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete bank', loading: false });
      return false;
    }
  },

  showBankAdmin: async (bankId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/bank/show/${bankId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to show bank', loading: false });
      return false;
    }
  },

  // Set current bank for editing
  setCurrentBank: (bank) => set({ currentBank: bank }),
  
  // Clear current bank
  clearCurrentBank: () => set({ currentBank: null }),
}));

export default useBankStore;