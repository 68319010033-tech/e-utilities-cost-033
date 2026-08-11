<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useExpenseStore } from "@/stores/expense";
import { useCategoryStore } from "@/stores/category";

const props = defineProps({ id: { type: String, default: null } });

const router = useRouter();
const route = useRoute();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const isEdit = !!route.params.id;
const loading = ref(false);
const error = ref("");

const form = ref({
  expense_category_id: "",
  budget_category_id: "",
  amount: "",
  billing_month: "",
  paid_date: "",
  invoice_no: "",
  note: "",
});

async function loadExpense() {
  const data = await expenseStore.getExpense(route.params.id);
  form.value = {
    expense_category_id: data.expense_category_id,
    budget_category_id: data.budget_category_id,
    amount: data.amount,
    billing_month: data.billing_month?.slice(0, 10),
    paid_date: data.paid_date?.slice(0, 10) || "",
    invoice_no: data.invoice_no || "",
    note: data.note || "",
  };
}

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    if (isEdit) {
      await expenseStore.updateExpense(route.params.id, form.value);
    } else {
      await expenseStore.createExpense(form.value);
    }
    router.push("/expenses");
  } catch (err) {
    error.value = err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories(),
  ]);
  if (isEdit) await loadExpense();
});
</script>

<template>
  <div class="max-w-xl">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">
      {{ isEdit ? "แก้ไขรายการค่าใช้จ่าย" : "เพิ่มรายการค่าใช้จ่าย" }}
    </h2>

    <form class="bg-white rounded-xl border border-gray-200 p-5 space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm text-gray-600 mb-1">ประเภทค่าใช้จ่าย *</label>
        <select v-model="form.expense_category_id" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
          <option value="" disabled>เลือกประเภท</option>
          <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">หมวดเงินที่เบิก *</label>
        <select v-model="form.budget_category_id" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
          <option value="" disabled>เลือกหมวดเงิน</option>
          <option v-for="b in categoryStore.budgetCategories" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-gray-600 mb-1">จำนวนเงิน (บาท) *</label>
          <input v-model="form.amount" type="number" step="0.01" min="0" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">เดือนของบิล *</label>
          <input v-model="form.billing_month" type="date" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-gray-600 mb-1">วันที่ชำระจริง</label>
          <input v-model="form.paid_date" type="date" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">เลขที่ใบแจ้งหนี้</label>
          <input v-model="form.invoice_no" type="text" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">หมายเหตุ</label>
        <textarea v-model="form.note" rows="3" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"></textarea>
      </div>

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {{ loading ? "กำลังบันทึก..." : "บันทึก" }}
        </button>
        <button
          type="button"
          class="px-5 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="router.push('/expenses')"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  </div>
</template>
