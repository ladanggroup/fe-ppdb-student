import { create } from 'zustand';
import apiClient from '../api/apiClient';

const useRegionStore = create((set) => ({
    provinces: [],
    cities: [],
    districts: [],
    village: [],
    fetchProvinces: async () => {
        try {
            const response = await apiClient.get('/api/regions/provinces');
            set({ provinces: response.data });
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    },
    fetchCities: async (province) => {
        try {
            const response = await apiClient.get(`/api/regions/cities`, { params: { province_id: province } });
            set({ cities: response.data });
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    },
    fetchDistricts: async (city) => {
        try {
            const response = await apiClient.get(`/api/regions/districts`, { params: { city_id: city } });
            set({ districts: response.data });
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    },
}));

export default useRegionStore;
