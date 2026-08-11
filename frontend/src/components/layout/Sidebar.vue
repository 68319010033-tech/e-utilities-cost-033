<script setup>
const navItems = [
  { to: "/", label: "แดชบอร์ด", icon: "📊" },
  { to: "/expenses", label: "รายการค่าใช้จ่าย", icon: "💰" },
  { to: "/settings/expense-categories", label: "ประเภทค่าใช้จ่าย", icon: "🗂️" },
  { to: "/settings/budget-categories", label: "หมวดเงิน", icon: "🏷️" },
  { to: "/reports", label: "รายงานย้อนหลัง", icon: "📈" },
];
</script>

<template>
  <aside
    class="hidden md:flex md:flex-col md:w-60 lg:w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0"
  >
    <div class="px-4 py-5 border-b border-gray-100">
      <h1 class="text-lg font-bold text-primary-700">ค่าสาธารณูปโภค</h1>
      <p class="text-xs text-gray-400">Utility Cost Tracker</p>
    </div>
    <nav class="flex-1 overflow-y-auto py-3">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
        active-class="bg-primary-50 text-primary-700 font-medium"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
