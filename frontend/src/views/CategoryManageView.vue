<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useCategoryStore } from "@/stores/category";

const route = useRoute();
const store = useCategoryStore();

const isBudget = computed(() => route.name === "budget-categories");
const title = computed(() => (isBudget.value ? "จัดการหมวดเงิน" : "จัดการประเภทค่าใช้จ่าย"));
const items = computed(() => (isBudget.value ? store.budgetCategories : store.expenseCategories));

const showForm = ref(false);
const editingId = ref(null);
const form = ref({ name: "", code: "", unit: "บาท" });
const error = ref("");

function resetForm() {
  form.value = { name: "", code: "", unit: "บาท" };
  editingId.value = null;
  showForm.value = false;
  error.value = "";
}

function startEdit(item) {
  form.value = { name: item.name, code: item.code, unit: item.unit || "บาท" };
  editingId.value = item.id;
  showForm.value = true;
}

async function handleSubmit() {
  error.value = "";
  try {
    if (isBudget.value) {
      if (editingId.value) {
        await store.updateBudgetCategory(editingId.value, form.value);
      } else {
        await store.createBudgetCategory(form.value);
      }
    } else {
      if (editingId.value) {
        await store.updateExpenseCategory(editingId.value, form.value);
      } else {
        await store.createExpenseCategory(form.value);
      }
    }
    resetForm();
  } catch (err) {
    error.value = err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ";
  }
}

async function handleDelete(id) {
  if (!confirm("ยืนยันการลบหรือไม่?")) return;
  if (isBudget.value) {
    await store.deleteBudgetCategory(id);
  } else {
    await store.deleteExpenseCategory(id);
  }
}

onMounted(async () => {
  await Promise.all([
    store.fetchExpenseCategories(),
    store.fetchBudgetCategories(),
  ]);
});
</script>

<template>
  <div class="space-y-4 max-w-2xl">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-700">{{ title }}</h2>
      <button
        class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        @click="showForm = !showForm; editingId = null"
      >
        + เพิ่มรายการ
      </button>
    </div>

    <form v-if="showForm" class="bg-white rounded-xl border border-gray-200 p-4 space-y-3" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">ชื่อ</label>
          <input v-model="form.name" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">รหัส</label>
          <input v-model="form.code" required class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-2">
        <button type="submit" class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
          {{ editingId ? "บันทึกการแก้ไข" : "เพิ่ม" }}
        </button>
        <button type="button" class="text-sm text-gray-500 px-4 py-2" @click="resetForm">ยกเลิก</button>
      </div>
    </form>

    <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      <div v-for="item in items" :key="item.id" class="flex items-center justify-between px-4 py-3">
        <div>
          <p class="text-sm font-medium text-gray-700">{{ item.name }}</p>
          <p class="text-xs text-gray-400">{{ item.code }}</p>
        </div>
        <div class="flex gap-3 text-xs">
          <button class="text-primary-600" @click="startEdit(item)">แก้ไข</button>
          <button class="text-red-500" @click="handleDelete(item.id)">ลบ</button>
        </div>
      </div>
      <p v-if="!items.length" class="text-center text-gray-400 py-8">ยังไม่มีข้อมูล</p>
    </div>
  </div>
</template>
