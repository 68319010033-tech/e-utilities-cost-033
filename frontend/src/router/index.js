import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
  },
  {
    path: "/expenses",
    name: "expense-list",
    component: () => import("@/views/ExpenseListView.vue"),
  },
  {
    path: "/expenses/create",
    name: "expense-create",
    component: () => import("@/views/ExpenseFormView.vue"),
  },
  {
    path: "/expenses/:id/edit",
    name: "expense-edit",
    component: () => import("@/views/ExpenseFormView.vue"),
    props: true,
  },
  {
    path: "/settings/expense-categories",
    name: "expense-categories",
    component: () => import("@/views/CategoryManageView.vue"),
  },
  {
    path: "/settings/budget-categories",
    name: "budget-categories",
    component: () => import("@/views/CategoryManageView.vue"),
  },
  {
    path: "/reports",
    name: "reports",
    component: () => import("@/views/ReportHistoryView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (to.name === "login" && auth.isAuthenticated) {
    return { name: "dashboard" };
  }
  return true;
});

export default router;
