// src/store/authStore.js
import { create } from "zustand";
import apiClient from "@/api/apiClient";

const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  role: null, // 'admin' | 'school' | 'student'
  expiresAt: null,
  errors: null,

  getRolePrefix: () => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/school")) return "school";
    if (path.startsWith("/student")) return "student";

    if (localStorage.getItem("admin_access_token")) return "admin";
    if (localStorage.getItem("school_access_token")) return "school";
    if (localStorage.getItem("student_access_token")) return "student";

    return null;
  },

  // 🔹 Restore token + auto logout jika expired
  restoreAuth: async () => {
    const prefix = useAuthStore.getState().getRolePrefix();
    if (!prefix) return false;

    const token = localStorage.getItem(`${prefix}_access_token`);
    const expiresAt = parseInt(
      localStorage.getItem(`${prefix}_expires_at`),
      10
    );

    if (!token || !expiresAt) return false;

    // 🔸 Cek kadaluarsa token
    const now = Date.now();
    if (now >= expiresAt) {
      useAuthStore.getState()[`logout${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`]();
      return false;
    }

    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      let userResponse;
      if (prefix === "admin")
        userResponse = await useAuthStore.getState().meAdmin();
      else if (prefix === "school")
        userResponse = await useAuthStore.getState().meSchool();
      else if (prefix === "student")
        userResponse = await useAuthStore.getState().meStudent();

      if (!userResponse) throw new Error("Failed to fetch user data");

      set({
        token,
        user: userResponse,
        isAuthenticated: true,
        role: prefix,
        expiresAt,
      });

      return true;
    } catch (error) {
      console.error("Restore auth failed:", error);
      localStorage.removeItem(`${prefix}_access_token`);
      localStorage.removeItem(`${prefix}_expires_at`);
      delete apiClient.defaults.headers.common["Authorization"];
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        role: null,
        expiresAt: null,
        errors: error.message,
      });
      return false;
    }
  },

  /* ==================== SCHOOL ==================== */
  loginSchool: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/api/school/login", {
        email,
        password,
      });
      const { access_token, expires_in } = response.data.data;

      // 🔹 Convert waktu expired ke timestamp
      const expiresAt = new Date(expires_in.replace(" ", "T")).getTime();

      localStorage.setItem("school_access_token", access_token);
      localStorage.setItem("school_expires_at", expiresAt);

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      const user = await useAuthStore.getState().meSchool();
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        role: "school",
        expiresAt,
        errors: null,
      });
      return true;
    } catch (error) {
      set({ errors: error.response?.data?.errors || error.response?.data });
      return false;
    }
  },

  logoutSchool: () => {
    localStorage.removeItem("school_access_token");
    localStorage.removeItem("school_expires_at");
    delete apiClient.defaults.headers.common["Authorization"];
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      expiresAt: null,
      errors: null,
    });
  },

  meSchool: async () => {
    try {
      const response = await apiClient.get("/api/school/me");
      const user = response.data.data;
      set({ user, isAuthenticated: true, role: "school" });
      return user;
    } catch (error) {
      console.error("Failed to fetch school data:", error);
      set({ isAuthenticated: false, user: null, role: null });
      return null;
    }
  },

  /* ==================== STUDENT ==================== */
  loginStudent: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/api/student/login", {
        email,
        password,
      });
      const { access_token, expires_in } = response.data.data;

      const expiresAt = new Date(expires_in.replace(" ", "T")).getTime();

      localStorage.setItem("student_access_token", access_token);
      localStorage.setItem("student_expires_at", expiresAt);

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      const user = await useAuthStore.getState().meStudent();
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        role: "student",
        expiresAt,
        errors: null,
      });
      return true;
    } catch (error) {
      set({ errors: error.response?.data?.errors || error.response?.data });
      return false;
    }
  },

  logoutStudent: () => {
    localStorage.removeItem("student_access_token");
    localStorage.removeItem("student_expires_at");
    delete apiClient.defaults.headers.common["Authorization"];
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      expiresAt: null,
      errors: null,
    });
  },

  meStudent: async () => {
    try {
      const response = await apiClient.get("/api/student/me");
      const user = response.data.data;
      set({ user, isAuthenticated: true, role: "student" });
      return user;
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      set({ isAuthenticated: false, user: null, role: null });
      return null;
    }
  },

  /* ==================== ADMIN ==================== */
  loginAdmin: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/api/admin/login", {
        email,
        password,
      });
      const { access_token, expires_in } = response.data.data;

      const expiresAt = new Date(expires_in.replace(" ", "T")).getTime();

      localStorage.setItem("admin_access_token", access_token);
      localStorage.setItem("admin_expires_at", expiresAt);

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      const user = await useAuthStore.getState().meAdmin();
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        role: "admin",
        expiresAt,
        errors: null,
      });
      return true;
    } catch (error) {
      set({ errors: error.response?.data?.errors || error.response?.data });
      return false;
    }
  },

  logoutAdmin: () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_expires_at");
    delete apiClient.defaults.headers.common["Authorization"];
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      expiresAt: null,
      errors: null,
    });
  },

  meAdmin: async () => {
    try {
      const response = await apiClient.get("/api/admin/me");
      const user = response.data.data;
      set({ user, isAuthenticated: true, role: "admin" });
      return user;
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      set({ isAuthenticated: false, user: null, role: null });
      return null;
    }
  },
}));

export default useAuthStore;
