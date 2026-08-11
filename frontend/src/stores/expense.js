import { defineStore } from "pinia";
import api from "@/services/api";

export const useExpenseStore = defineStore("expense", {
  state: () => ({
    items: [],
    pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    loading: false,
  }),
  actions: {
    async fetchExpenses(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get("/expenses", { params });
        this.items = data.data;
        this.pagination = data.pagination;
        return data;
      } finally {
        this.loading = false;
      }
    },
    async getExpense(id) {
      const { data } = await api.get(`/expenses/${id}`);
      return data;
    },
    async createExpense(payload) {
      const { data } = await api.post("/expenses", payload);
      return data;
    },
    async updateExpense(id, payload) {
      const { data } = await api.put(`/expenses/${id}`, payload);
      return data;
    },
    async deleteExpense(id) {
      await api.delete(`/expenses/${id}`);
      this.items = this.items.filter((e) => e.id !== id);
    },
  },
});
