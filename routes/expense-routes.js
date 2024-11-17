const express = require('express');
const expenseControllers = require('../controllers/expense-controllers');

const router = express.Router();

// Create Expense for a User
router.post('/', expenseControllers.createExpense);

// Retrieve All Expenses
router.get('/', expenseControllers.getAllExpenses);

// Retrieve Expenses by User ID
router.get('/user/:userId', expenseControllers.getExpensesByUserId);

// Update Expense for a User
router.patch('/user/:userId', expenseControllers.updateExpense);

// Delete Expense for a User
router.delete('/user/:userId', expenseControllers.deleteExpense);

module.exports = router;
