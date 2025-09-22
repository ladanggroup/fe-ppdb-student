import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // public product
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/products`);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Failed to fetch products' });
      console.error("Error fetching products:", error);
    }
  },
  
  // admin
  store: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/admin/product`, productData);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to store product' });
      throw error;
    }
  },
  update: async (productId, productData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/admin/product/update/${productId}`, productData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update product' });
      throw error;
    }
  },
  list: async (page=1, search) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/product?page=${page}&search=${search}`);
      set({ products: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to list products' });
      throw error;
    }
  },
  destroy: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/api/admin/product/delete/${productId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to delete product' });
      throw error;
    }
  },
  show: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/admin/product/show/${productId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to show product' });
      throw error;
    }
  },
  storeProductFeature: async (productFeatureData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/admin/product/feature`, productFeatureData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to store product feature' });
      throw error;
    }
  },
  updateProductFeature: async (productFeatureData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/admin/product/feature/update/${productFeatureData.id}`, productFeatureData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update product feature' });
      throw error;
    }
  },
  deleteProductFeature: async (productFeatureId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/api/admin/product/feature/delete/${productFeatureId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to delete product feature' });
      throw error;
    }
  },
}));

export default useProductStore;
