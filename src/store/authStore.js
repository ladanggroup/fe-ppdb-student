import { create } from "zustand";
import apiClient from "@/api/apiClient";
// import { useMotionValue } from "framer-motion/client";

const useAuthStore = create((set) => ({
  token: null,
  expires_in: null,
  user: null,
  isAuthenticated: false,
  roles: [],
  abilities: JSON.parse(localStorage.getItem("abilities") || "[]"),
  // abilities: [],
  errors: null,

  // Restore auth state from localStorage
  restoreAuth: async () => {
    const token = localStorage.getItem("access_token");
    const expires_in = localStorage.getItem("expires_in");
    const abilities = JSON.parse(localStorage.getItem("abilities") || "[]");

    if (token) {
      // Set header Authorization jika token ada di localStorage
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = null;
      if (abilities == "kepala_sekolah" || abilities == "admin_sekolah") {
        response = await apiClient.get("/api/school/me");
      } else if (abilities == "siswa") {
        response = await apiClient.get("/api/student/me");
      } else if (abilities == "admin") {
        response = await apiClient.get("/api/admin/me");
      }
      try {
        const user = response.data.data;
        set({
          token,
          expires_in,
          user,
          isAuthenticated: true,
          roles: user.roles,
          abilities,
        });
        return true;
      } catch (error) {
        console.error(
          "Restore auth failed:",
          error
        );

        // Hapus token jika tidak valid
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        delete apiClient.defaults.headers.common["Authorization"];

        // Reset state auth
        set({
          token: null,
          user: null,
          expires_in: null,
          isAuthenticated: false,
        });
      }
    }
  },

  /* school */
  loginSchool: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/api/school/login", {
        email,
        password,
      });
      
      const { access_token, expires_in, ability } = response.data.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("abilities", ability ? JSON.stringify(ability) : JSON.stringify([]));
      set({
        token: access_token,
        expires_in,
        isAuthenticated: true,
        abilities: ability || [],
        errors: null,
      });

      // Set default header Authorization untuk Axios
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      // Fetch user data setelah login berhasil
      await useAuthStore.getState().meSchool();
      return true;
    } catch (error) {
      if (error.response?.status === 422) {
        set({ errors: error.response?.data.errors });
      } else {
        set({ errors: error.response?.data });
      }
      return false;
    }
  },
  logoutSchool: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("abilities");
    set({
      token: null,
      expires_in: null,
      user: null,
      isAuthenticated: false,
      roles: [],
      abilities: [],
      errors: null,
    });
    // Hapus header Authorization dari Axios
    delete apiClient.defaults.headers.common["Authorization"];
  },
  // checkme
  meSchool: async () => {
    try {
      const response = await apiClient.get("/api/school/me");
      const user = response.data.data;
      set({
        user,
        isAuthenticated: true,
        roles: user.roles,
        // abilities: user.abilities || [],
        abilities: JSON.parse(localStorage.getItem("abilities") || "[]"),
        errors: null,
      });
      return user;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isAuthenticated: false, user: null, roles: [], abilities: [], errors: null });
      return null;
    }
  },

  /* student */
  loginStudent: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/api/student/login", {
        email,
        password,
      });
      const { access_token, expires_in, ability } = response.data.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("abilities", ability ? JSON.stringify(ability) : JSON.stringify([]));
      // localStorage.setItem("abilities", JSON.stringify(ability || []));
      set({
        token: access_token,
        expires_in,
        abilities: ability || [],
        isAuthenticated: true,
        errors: null,
      });
      // Set default header Authorization untuk Axios
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      // Fetch user data setelah login berhasil
      await useAuthStore.getState().meStudent();
      return true;
    } catch (error) {
      if (error.response?.status === 422) {
        set({ errors: error.response?.data.errors });
      } else {
        set({ errors: error.response?.data });
      }
      return false;
    }
  },
  logoutStudent: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("abilities");
    set({
      token: null,
      expires_in: null,
      user: null,
      isAuthenticated: false,
      roles: [],
      abilities: [],
      errors: null,
    });
    // Hapus header Authorization dari Axios
    delete apiClient.defaults.headers.common["Authorization"];
  },
  // checkme
  meStudent: async () => {
    try {
      const response = await apiClient.get("/api/student/me");
      const user = response.data.data;
      set({
        user,
        isAuthenticated: true,
        roles: [], // student tidak punya roles
        abilities: user.abilities || [],
        errors: null,
      });
      return user;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isAuthenticated: false, user: null, abilities: [], errors: null });
      return null;
    }
  },

  /* admin */
  loginAdmin: async (email, password) => {
    try {
      const response = await apiClient.post("/api/admin/login", {
        email,
        password,
      });
      const { access_token, expires_in, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("abilities", JSON.stringify(user.abilities || []));
      set({
        token: access_token,
        expires_in,
        user,
        isAuthenticated: true,
      });
      // Set default header Authorization untuk Axios
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      // Fetch user data setelah login berhasil
      await useAuthStore.getState().meAdmin();
      return true;
    } catch (error) {
      if (error.response?.status === 422) {
        set({ errors: error.response?.data.errors });
      } else {
        set({ errors: error.response?.data });
      }
      return false;
    }
  },
  logoutAdmin: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("abilities");
    set({
      token: null,
      expires_in: null,
      user: null,
      isAuthenticated: false,
    });
    // Hapus header Authorization dari Axios
    delete apiClient.defaults.headers.common["Authorization"];
  },
  // checkme
  meAdmin: async () => {
    try {
      const response = await apiClient.get("/api/admin/me");
      const user = response.data.data;
      set({
        user,
        isAuthenticated: true,
        roles: [], // admin tidak punya roles
        abilities: user.abilities || [],
      });
      return user;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isAuthenticated: false, user: null, abilities: [] });
      return null;
    }
  },
}));

export default useAuthStore;