<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>

<template>
  <header
    class="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between"
  >
    <h2 class="text-base md:text-lg font-semibold text-gray-700">
      ระบบควบคุม-ติดตามค่าสาธารณูปโภค
    </h2>
    <div class="flex items-center gap-3">
      <span class="hidden sm:inline text-sm text-gray-500">
        {{ auth.user?.full_name || auth.user?.username }}
      </span>
      <button
        class="text-sm px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        @click="handleLogout"
      >
        ออกจากระบบ
      </button>
    </div>
  </header>
</template>
