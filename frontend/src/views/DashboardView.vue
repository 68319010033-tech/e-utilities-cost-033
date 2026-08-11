<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart.vue";
import CategoryPieChart from "@/components/charts/CategoryPieChart.vue";

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const summary = ref(null);
const byCategory = ref([]);
const loading = ref(false);

const currencyFmt = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

async function loadData() {
  loading.value = true;
  try {
    const [summaryRes, categoryRes] = await Promise.all([
      api.get("/dashboard/summary", { params: { year: selectedYear.value } }),
      api.get("/dashboard/by-category", { params: { year: selectedYear.value } }),
    ]);
    summary.value = summaryRes.data;
    byCategory.value = categoryRes.data;
  } finally {
    loading.value = false;
  }
}

const changeLabel = computed(() => {
  if (!summary.value || summary.value.changePercent === null) return "—";
  const val = summary.value.changePercent;
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
});

onMounted(loadData);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-700">แดชบอร์ดสรุปยอดรายจ่าย</h2>
      <select
        v-model.number="selectedYear"
        class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        @change="loadData"
      >
        <option v-for="y in years" :key="y" :value="y">ปี {{ y + 543 }}</option>
      </select>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">ยอดรวมเดือนนี้</p>
        <p class="text-lg md:text-xl font-bold text-primary-700">
          {{ currencyFmt.format(summary?.currentMonthTotal || 0) }}
        </p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">ยอดรวมเดือนก่อน</p>
        <p class="text-lg md:text-xl font-bold text-gray-700">
          {{ currencyFmt.format(summary?.previousMonthTotal || 0) }}
        </p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">เปลี่ยนแปลง</p>
        <p
          class="text-lg md:text-xl font-bold"
          :class="summary?.changePercent >= 0 ? 'text-red-500' : 'text-green-500'"
        >
          {{ changeLabel }}
        </p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">ยอดรวมทั้งปี</p>
        <p class="text-lg md:text-xl font-bold text-gray-700">
          {{ currencyFmt.format(summary?.yearTotal || 0) }}
        </p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-600 mb-3">ยอดรายจ่ายรายเดือน</h3>
        <MonthlyBarChart :monthly="summary?.monthly || []" />
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-600 mb-3">สัดส่วนตามประเภท</h3>
        <CategoryPieChart :items="byCategory" />
      </div>
    </div>

    <p v-if="loading" class="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
  </div>
</template>
