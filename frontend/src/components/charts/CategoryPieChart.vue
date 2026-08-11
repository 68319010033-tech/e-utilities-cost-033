<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{ name, total }, ...]
});

const palette = [
  "#3b82f6", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

const chartData = computed(() => ({
  labels: props.items.map((i) => i.name),
  datasets: [
    {
      data: props.items.map((i) => i.total),
      backgroundColor: props.items.map((_, i) => palette[i % palette.length]),
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};
</script>

<template>
  <div class="h-64 md:h-80">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
