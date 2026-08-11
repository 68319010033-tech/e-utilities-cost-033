require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ เชื่อมต่อฐานข้อมูลสำเร็จ");

    // sync models (ใช้ migration จริงใน production)
    await sequelize.sync();
    console.log("✅ Sync โมเดลกับฐานข้อมูลเรียบร้อย");

    app.listen(PORT, () => {
      console.log(`🚀 Server กำลังทำงานที่พอร์ต ${PORT}`);
    });
  } catch (err) {
    console.error("❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:", err.message);
    process.exit(1);
  }
}

start();
