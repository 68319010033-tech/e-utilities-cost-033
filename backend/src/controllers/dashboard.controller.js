const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");

// GET /api/dashboard/summary?year=
exports.summary = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await sequelize.query(
      `SELECT MONTH(billing_month) AS month, SUM(amount) AS total
       FROM expenses
       WHERE YEAR(billing_month) = :year
       GROUP BY MONTH(billing_month)
       ORDER BY month ASC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );

    // fill missing months with 0
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => Number(r.month) === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });

    const yearTotal = monthly.reduce((sum, m) => sum + m.total, 0);

    // current month vs previous month
    const now = new Date();
    const currentMonth = Number(year) === now.getFullYear() ? now.getMonth() + 1 : 12;
    const currentTotal = monthly.find((m) => m.month === currentMonth)?.total || 0;
    const prevTotal = monthly.find((m) => m.month === currentMonth - 1)?.total || 0;
    const change = prevTotal === 0 ? null : ((currentTotal - prevTotal) / prevTotal) * 100;

    res.json({
      year: Number(year),
      monthly,
      yearTotal,
      currentMonthTotal: currentTotal,
      previousMonthTotal: prevTotal,
      changePercent: change,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/by-category?year=
exports.byCategory = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await sequelize.query(
      `SELECT ec.id, ec.name, ec.code, SUM(e.amount) AS total
       FROM expenses e
       JOIN expense_categories ec ON ec.id = e.expense_category_id
       WHERE YEAR(e.billing_month) = :year
       GROUP BY ec.id, ec.name, ec.code
       ORDER BY total DESC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );

    res.json(rows.map((r) => ({ ...r, total: Number(r.total) })));
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/by-budget?year=
exports.byBudget = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await sequelize.query(
      `SELECT bc.id, bc.name, bc.code, MONTH(e.billing_month) AS month, SUM(e.amount) AS total
       FROM expenses e
       JOIN budget_categories bc ON bc.id = e.budget_category_id
       WHERE YEAR(e.billing_month) = :year
       GROUP BY bc.id, bc.name, bc.code, MONTH(e.billing_month)
       ORDER BY bc.id ASC, month ASC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );

    res.json(rows.map((r) => ({ ...r, total: Number(r.total) })));
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/compare?year1=&year2=
exports.compare = async (req, res, next) => {
  try {
    const { year1, year2 } = req.query;
    if (!year1 || !year2) {
      return res.status(400).json({ message: "กรุณาระบุ year1 และ year2" });
    }

    const rows = await sequelize.query(
      `SELECT YEAR(billing_month) AS year, MONTH(billing_month) AS month, SUM(amount) AS total
       FROM expenses
       WHERE YEAR(billing_month) IN (:year1, :year2)
       GROUP BY YEAR(billing_month), MONTH(billing_month)
       ORDER BY year ASC, month ASC`,
      { replacements: { year1, year2 }, type: QueryTypes.SELECT }
    );

    const buildYear = (y) =>
      Array.from({ length: 12 }, (_, i) => {
        const found = rows.find(
          (r) => Number(r.year) === Number(y) && Number(r.month) === i + 1
        );
        return { month: i + 1, total: found ? Number(found.total) : 0 };
      });

    res.json({
      year1: { year: Number(year1), monthly: buildYear(year1) },
      year2: { year: Number(year2), monthly: buildYear(year2) },
    });
  } catch (err) {
    next(err);
  }
};
