import { create } from 'zustand';

const useErrorStore = create((set) => ({
    errors: null, // Bisa array atau object tergantung API response
    message: null, // Pesan umum untuk error

    setError: (errors, message) => set({ errors, message }),
    clearError: () => set({ errors: null, message: null }), // Fungsi untuk menghapus error
}));

export default useErrorStore;
