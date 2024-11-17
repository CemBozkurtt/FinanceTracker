const HttpError = require('../util/http-error');
const { v4: uuidv4 } = require('uuid');
const Expense = require('../models/expense');  // Import the Expense model
//const mongoose = require('mongoose');  // Import mongoose for validation

// In-memory expense records (for demonstration purposes)
let DUMMY_EXPENSES = [];

// Create Expense for a User
const createExpense = (req, res, next) => {
  const { userId, standardExpense, variableExpense } = req.body;

  // Validate required fields
  if (!userId || !standardExpense || !variableExpense) {
    return next(new HttpError("User ID, standard expenses, and variable expenses are required.", 400));
  }


  // Create new expense object
  const newExpense = {
    id: uuidv4(),
    userId,
    standardExpense,
    variableExpense,
  };

  // Add to in-memory records (replace with DB save in a real scenario)
  DUMMY_EXPENSES.push(newExpense);

  res.status(201).json({
    message: "Expense created successfully.",
    expense: newExpense,
  });
};

// Retrieve All Expenses Entries
const getAllExpenses = (req, res, next) => {
  res.status(200).json({
    message: "All expense records retrieved successfully.",
    expenses: DUMMY_EXPENSES,
  });
};

// Retrieve Expenses by User ID
const getExpensesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const userExpenses = DUMMY_EXPENSES.filter((expense) => expense.userId === userId);

  if (!userExpenses || userExpenses.length === 0) {
    return next(new HttpError("No expense records found for this user.", 404));
  }

  res.status(200).json({ expenses: userExpenses });
};

// Update Expense for a User
const updateExpense = (req, res, next) => {
  const userId = req.params.userId;
  
  const { standardExpense, variableExpense } = req.body;

  // Find the index of the expense to update
  const expenseIndex = DUMMY_EXPENSES.findIndex((expense) => expense.userId === userId);

  if (expenseIndex === -1) {
    return next(new HttpError("Expense entry not found for this user.", 404));
  }

  // Update the expense record
  DUMMY_EXPENSES[expenseIndex] = {
    ...DUMMY_EXPENSES[expenseIndex],
    standardExpense: standardExpense || DUMMY_EXPENSES[expenseIndex].standardExpense,
    variableExpense: variableExpense || DUMMY_EXPENSES[expenseIndex].variableExpense,
  };

  res.status(200).json({
    message: "Expense entry updated successfully.",
    expense: DUMMY_EXPENSES[expenseIndex],
  });
};

// Delete Expense for a User
const deleteExpense = (req, res, next) => {
  const userId = req.params.userId;

  const expenseIndex = DUMMY_EXPENSES.findIndex((expense) => expense.userId === userId);

  if (expenseIndex === -1) {
    return next(new HttpError("Expense entry not found for this user.", 404));
  }

  // Remove the expense entry from in-memory records
  DUMMY_EXPENSES.splice(expenseIndex, 1);

  res.status(200).json({ message: "Expense entry deleted successfully." });
};

// Export the methods for use in routes
exports.createExpense = createExpense;
exports.getAllExpenses = getAllExpenses;
exports.getExpensesByUserId = getExpensesByUserId;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
