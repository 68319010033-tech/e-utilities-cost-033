<script setup>
const navItems = [
  { to: "/", label: "แดชบอร์ด", icon: "📊" },
  { to: "/expenses", label: "รายการ", icon: "💰" },
  { to: "/expenses/create", label: "เพิ่ม", icon: "➕" },
  { to: "/reports", label: "รายงาน", icon: "📈" },
];
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-40"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center text-[11px] text-gray-500 px-2"
      active-class="text-primary-600 font-medium"
    >
      <span class="text-lg leading-none">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
