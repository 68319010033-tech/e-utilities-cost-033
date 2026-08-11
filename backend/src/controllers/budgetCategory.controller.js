const { BudgetCategory } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const items = await BudgetCategory.findAll({ order: [["id", "ASC"]] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: "กรุณากรอกชื่อและรหัสหมวดเงิน" });
    }
    const item = await BudgetCategory.create({ name, code });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await BudgetCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const { name, code, is_active } = req.body;
    await item.update({ name, code, is_active });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await BudgetCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    await item.destroy();
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    next(err);
  }
};
