const express = require('express');
const incomeControllers = require('../controllers/income-controllers');

const router = express.Router();

// Create Income for a User
router.post('/', incomeControllers.createIncome);

// Retrieve All Income
router.get('/', incomeControllers.getAllIncome);

// Retrieve Income by User ID
router.get('/user/:userId', incomeControllers.getIncomeByUserId);

// Update Income
router.patch('/user/:userId', incomeControllers.updateIncome);

// Delete Income
router.delete('/user/:userId', incomeControllers.deleteIncome);

module.exports = router;


