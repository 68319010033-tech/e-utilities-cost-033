<script setup>
import { useRoute } from "vue-router";
import AppShell from "@/components/layout/AppShell.vue";

const route = useRoute();
</script>

<template>
  <!-- หน้า login ไม่ต้องมี sidebar/navbar -->
  <RouterView v-if="route.meta.public" />
  <AppShell v-else>
    <RouterView />
  </AppShell>
</template>
