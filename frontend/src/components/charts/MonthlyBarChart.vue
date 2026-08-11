<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  monthly: { type: Array, default: () => [] }, // [{ month: 1, total: 1000 }, ...]
});

const monthLabels = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

const chartData = computed(() => ({
  labels: monthLabels,
  datasets: [
    {
      label: "ยอดรายจ่าย (บาท)",
      backgroundColor: "#3b82f6",
      borderRadius: 4,
      data: props.monthly.map((m) => m.total),
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true },
  },
};
</script>

<template>
  <div class="h-64 md:h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
