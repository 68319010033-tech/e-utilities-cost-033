<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart.vue";

const currentYear = new Date().getFullYear();
const year1 = ref(currentYear - 1);
const year2 = ref(currentYear);
const compareData = ref(null);
const loading = ref(false);

const currencyFmt = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const monthNames = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

async function loadComparison() {
  loading.value = true;
  try {
    const { data } = await api.get("/dashboard/compare", {
      params: { year1: year1.value, year2: year2.value },
    });
    compareData.value = data;
  } finally {
    loading.value = false;
  }
}

onMounted(loadComparison);
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-700">รายงานย้อนหลัง / เปรียบเทียบปี</h2>

    <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-end gap-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">ปีที่ 1</label>
        <select v-model.number="year1" class="text-sm border border-gray-300 rounded-lg px-3 py-2">
          <option v-for="y in 6" :key="y" :value="currentYear - y + 1">{{ currentYear - y + 1 + 543 }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">ปีที่ 2</label>
        <select v-model.number="year2" class="text-sm border border-gray-300 rounded-lg px-3 py-2">
          <option v-for="y in 6" :key="y" :value="currentYear - y + 1">{{ currentYear - y + 1 + 543 }}</option>
        </select>
      </div>
      <button class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" @click="loadComparison">
        เปรียบเทียบ
      </button>
    </div>

    <div v-if="compareData" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-600 mb-3">ปี {{ compareData.year1.year + 543 }}</h3>
        <MonthlyBarChart :monthly="compareData.year1.monthly" />
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-600 mb-3">ปี {{ compareData.year2.year + 543 }}</h3>
        <MonthlyBarChart :monthly="compareData.year2.monthly" />
      </div>
    </div>

    <div v-if="compareData" class="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table class="w-full text-sm min-w-[500px]">
        <thead class="bg-gray-50 text-gray-500">
          <tr>
            <th class="px-4 py-3 text-left">เดือน</th>
            <th class="px-4 py-3 text-right">ปี {{ compareData.year1.year + 543 }}</th>
            <th class="px-4 py-3 text-right">ปี {{ compareData.year2.year + 543 }}</th>
            <th class="px-4 py-3 text-right">ผลต่าง</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(m, idx) in monthNames" :key="idx">
            <td class="px-4 py-2">{{ m }}</td>
            <td class="px-4 py-2 text-right">{{ currencyFmt.format(compareData.year1.monthly[idx].total) }}</td>
            <td class="px-4 py-2 text-right">{{ currencyFmt.format(compareData.year2.monthly[idx].total) }}</td>
            <td
              class="px-4 py-2 text-right"
              :class="compareData.year2.monthly[idx].total - compareData.year1.monthly[idx].total >= 0 ? 'text-red-500' : 'text-green-500'"
            >
              {{ currencyFmt.format(compareData.year2.monthly[idx].total - compareData.year1.monthly[idx].total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="loading" class="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
  </div>
</template>
