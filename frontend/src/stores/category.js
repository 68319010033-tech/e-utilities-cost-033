import { defineStore } from "pinia";
import api from "@/services/api";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    expenseCategories: [],
    budgetCategories: [],
  }),
  actions: {
    async fetchExpenseCategories() {
      const { data } = await api.get("/expense-categories");
      this.expenseCategories = data;
      return data;
    },
    async fetchBudgetCategories() {
      const { data } = await api.get("/budget-categories");
      this.budgetCategories = data;
      return data;
    },
    async createExpenseCategory(payload) {
      const { data } = await api.post("/expense-categories", payload);
      this.expenseCategories.push(data);
      return data;
    },
    async updateExpenseCategory(id, payload) {
      const { data } = await api.put(`/expense-categories/${id}`, payload);
      const idx = this.expenseCategories.findIndex((c) => c.id === id);
      if (idx !== -1) this.expenseCategories[idx] = data;
      return data;
    },
    async deleteExpenseCategory(id) {
      await api.delete(`/expense-categories/${id}`);
      this.expenseCategories = this.expenseCategories.filter((c) => c.id !== id);
    },
    async createBudgetCategory(payload) {
      const { data } = await api.post("/budget-categories", payload);
      this.budgetCategories.push(data);
      return data;
    },
    async updateBudgetCategory(id, payload) {
      const { data } = await api.put(`/budget-categories/${id}`, payload);
      const idx = this.budgetCategories.findIndex((c) => c.id === id);
      if (idx !== -1) this.budgetCategories[idx] = data;
      return data;
    },
    async deleteBudgetCategory(id) {
      await api.delete(`/budget-categories/${id}`);
      this.budgetCategories = this.budgetCategories.filter((c) => c.id !== id);
    },
  },
});
