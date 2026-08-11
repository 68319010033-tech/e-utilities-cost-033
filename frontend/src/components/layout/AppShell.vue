<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import MobileMenu from "./MobileMenu.vue";
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <Navbar />
      <main class="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <slot />
      </main>
    </div>
    <MobileMenu />
  </div>
</template>
