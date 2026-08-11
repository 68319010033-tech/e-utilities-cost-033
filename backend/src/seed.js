require("dotenv").config();
const bcrypt = require("bcrypt");
const {
  sequelize,
  User,
  ExpenseCategory,
  BudgetCategory,
} = require("./models");

async function seed() {
  await sequelize.sync();

  // --- Admin user ---
  const existingAdmin = await User.findOne({ where: { username: "admin" } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin1234", 10);
    await User.create({
      username: "admin",
      password: hashed,
      full_name: "ผู้ดูแลระบบ",
      role: "admin",
    });
    console.log("✅ สร้างผู้ใช้ admin (username: admin, password: admin1234)");
  }

  // --- Expense categories ---
  const expenseCategories = [
    { name: "ค่าไฟฟ้า", code: "ELEC" },
    { name: "ค่าพลังงาน", code: "ENERGY" },
    { name: "ค่าน้ำประปา", code: "WATER" },
    { name: "ค่าอินเตอร์เน็ต", code: "INTERNET" },
    { name: "ค่าโทรศัพท์", code: "PHONE" },
    { name: "ค่าไปรษณีย์", code: "POST" },
    { name: "ค่าทิ้งขยะ", code: "WASTE" },
  ];
  for (const c of expenseCategories) {
    await ExpenseCategory.findOrCreate({ where: { code: c.code }, defaults: c });
  }
  console.log("✅ Seed ประเภทค่าใช้จ่ายเรียบร้อย");

  // --- Budget categories ---
  const budgetCategories = [
    { name: "งบประมาณ (ปวช.)", code: "PVC" },
    { name: "งบประมาณ (ปวส.)", code: "PVS" },
    { name: "เงินรายได้สถานศึกษา", code: "INCOME" },
  ];
  for (const b of budgetCategories) {
    await BudgetCategory.findOrCreate({ where: { code: b.code }, defaults: b });
  }
  console.log("✅ Seed หมวดเงินเรียบร้อย");

  await sequelize.close();
  console.log("🎉 Seed ข้อมูลเริ่มต้นเสร็จสมบูรณ์");
}

seed().catch((err) => {
  console.error("❌ Seed ล้มเหลว:", err);
  process.exit(1);
});
