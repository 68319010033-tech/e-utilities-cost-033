import { defineStore } from "pinia";
import authService from "@/services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null, // เก็บใน memory เท่านั้น ไม่ใช้ localStorage เพื่อลดความเสี่ยง XSS
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    async login(username, password) {
      const { data } = await authService.login(username, password);
      this.accessToken = data.accessToken;
      this.user = data.user;
      return data;
    },
    async logout() {
      try {
        await authService.logout();
      } catch (e) {
        // ignore
      }
      this.accessToken = null;
      this.user = null;
    },
    async refreshAccessToken() {
      const { data } = await authService.refresh();
      this.accessToken = data.accessToken;
      return data.accessToken;
    },
    async fetchMe() {
      const { data } = await authService.me();
      this.user = data;
      return data;
    },
  },
});
