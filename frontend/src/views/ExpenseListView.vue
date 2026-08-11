<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExpenseStore } from "@/stores/expense";
import { useCategoryStore } from "@/stores/category";

const router = useRouter();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const filters = ref({
  year: new Date().getFullYear(),
  month: "",
  expense_category_id: "",
  budget_category_id: "",
  page: 1,
  limit: 20,
});

const currencyFmt = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "short" });
}

async function load() {
  const params = { ...filters.value };
  Object.keys(params).forEach((k) => {
    if (params[k] === "") delete params[k];
  });
  await expenseStore.fetchExpenses(params);
}

async function handleDelete(id) {
  if (!confirm("ยืนยันการลบรายการนี้หรือไม่?")) return;
  await expenseStore.deleteExpense(id);
  await load();
}

function changePage(page) {
  filters.value.page = page;
  load();
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories(),
  ]);
  await load();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-700">รายการค่าใช้จ่าย</h2>
      <button
        class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        @click="router.push('/expenses/create')"
      >
        + เพิ่มรายการ
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <select v-model.number="filters.year" class="text-sm border border-gray-300 rounded-lg px-3 py-2" @change="load">
        <option v-for="y in 5" :key="y" :value="new Date().getFullYear() - y + 1">
          ปี {{ new Date().getFullYear() - y + 1 + 543 }}
        </option>
      </select>
      <select v-model="filters.month" class="text-sm border border-gray-300 rounded-lg px-3 py-2" @change="load">
        <option value="">ทุกเดือน</option>
        <option v-for="m in 12" :key="m" :value="m">เดือน {{ m }}</option>
      </select>
      <select v-model="filters.expense_category_id" class="text-sm border border-gray-300 rounded-lg px-3 py-2" @change="load">
        <option value="">ทุกประเภทค่าใช้จ่าย</option>
        <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="filters.budget_category_id" class="text-sm border border-gray-300 rounded-lg px-3 py-2" @change="load">
        <option value="">ทุกหมวดเงิน</option>
        <option v-for="b in categoryStore.budgetCategories" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>
    </div>

    <!-- Desktop table -->
    <div class="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-left">
          <tr>
            <th class="px-4 py-3">เดือนของบิล</th>
            <th class="px-4 py-3">ประเภทค่าใช้จ่าย</th>
            <th class="px-4 py-3">หมวดเงิน</th>
            <th class="px-4 py-3 text-right">จำนวนเงิน</th>
            <th class="px-4 py-3">เลขที่ใบแจ้งหนี้</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="e in expenseStore.items" :key="e.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ formatMonth(e.billing_month) }}</td>
            <td class="px-4 py-3">{{ e.expenseCategory?.name }}</td>
            <td class="px-4 py-3">{{ e.budgetCategory?.name }}</td>
            <td class="px-4 py-3 text-right font-medium">{{ currencyFmt.format(e.amount) }}</td>
            <td class="px-4 py-3 text-gray-400">{{ e.invoice_no || "-" }}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button class="text-primary-600 hover:underline mr-3" @click="router.push(`/expenses/${e.id}/edit`)">แก้ไข</button>
              <button class="text-red-500 hover:underline" @click="handleDelete(e.id)">ลบ</button>
            </td>
          </tr>
          <tr v-if="!expenseStore.items.length">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">ไม่พบรายการ</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile card list -->
    <div class="md:hidden space-y-3">
      <div v-for="e in expenseStore.items" :key="e.id" class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-medium text-gray-700">{{ e.expenseCategory?.name }}</p>
            <p class="text-xs text-gray-400">{{ formatMonth(e.billing_month) }} · {{ e.budgetCategory?.name }}</p>
          </div>
          <p class="font-bold text-primary-700">{{ currencyFmt.format(e.amount) }}</p>
        </div>
        <div class="flex justify-end gap-3 text-xs">
          <button class="text-primary-600" @click="router.push(`/expenses/${e.id}/edit`)">แก้ไข</button>
          <button class="text-red-500" @click="handleDelete(e.id)">ลบ</button>
        </div>
      </div>
      <p v-if="!expenseStore.items.length" class="text-center text-gray-400 py-8">ไม่พบรายการ</p>
    </div>

    <!-- Pagination -->
    <div v-if="expenseStore.pagination.totalPages > 1" class="flex justify-center gap-2">
      <button
        v-for="p in expenseStore.pagination.totalPages"
        :key="p"
        class="w-8 h-8 text-sm rounded-lg"
        :class="p === filters.page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'"
        @click="changePage(p)"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>
