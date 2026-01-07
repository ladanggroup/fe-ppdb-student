import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const usePaymentStore = create((set) => ({
  payments: [],
  loading: false,
  error: null,
  // student
  fetchStudentPayments: async (studentId, slug) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/student/payment`, {
        params: { student_id: studentId, slug },
      });
      set({ payments: response.data.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Failed to fetch payments' });
      console.error("Error fetching payments:", error);
    }
  },

  addStudentPayment: async (paymentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/api/student/payment`, paymentData);
      set((state) => ({ payments: [...state.payments, response.data.data], loading: false }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to add payment' });
      throw error;
    }
  },

  updateStudentPayment: async (paymentId, paymentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/api/student/payment/${paymentId}`, paymentData);
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? response.data.data : payment
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update payment' });
      throw error;
    }
  },
}));

export default usePaymentStore;
