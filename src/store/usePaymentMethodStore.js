import { create } from 'zustand';
import apiClient from "@/api/apiClient";

const usePaymentMethodStore = create((set) => ({
    paymentMethods: [],
    loading: false,
    error: null,

    listPaymentMethodsSchool: async (slug, studentId) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/api/student/payment-method', { params: { slug, student_id: studentId } });
            set({ paymentMethods: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch payment methods', loading: false });
            throw error;
        }
    },
}));

export default usePaymentMethodStore;