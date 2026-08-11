const sequelize = require("../config/db");
const User = require("./user.model");
const ExpenseCategory = require("./expenseCategory.model");
const BudgetCategory = require("./budgetCategory.model");
const Expense = require("./expense.model");

// Associations
User.hasMany(Expense, { foreignKey: "created_by", as: "expenses" });
Expense.belongsTo(User, { foreignKey: "created_by", as: "creator" });

ExpenseCategory.hasMany(Expense, {
  foreignKey: "expense_category_id",
  as: "expenses",
});
Expense.belongsTo(ExpenseCategory, {
  foreignKey: "expense_category_id",
  as: "expenseCategory",
});

BudgetCategory.hasMany(Expense, {
  foreignKey: "budget_category_id",
  as: "expenses",
});
Expense.belongsTo(BudgetCategory, {
  foreignKey: "budget_category_id",
  as: "budgetCategory",
});

module.exports = {
  sequelize,
  User,
  ExpenseCategory,
  BudgetCategory,
  Expense,
};
