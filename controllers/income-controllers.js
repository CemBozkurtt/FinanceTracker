const HttpError = require('../util/http-error');
const { v4: uuidv4 } = require('uuid');
//const Income = require('../models/income');
// In-memory income records
let DUMMY_INCOME = [];

// Create Income for a User
const createIncome = (req, res, next) => {
  const { userId, monthlyIncome, benefits } = req.body;

  // Validate the userId exists (assuming you have access to user data)
  // Replace this with a user validation logic if needed.
  if (!userId || monthlyIncome === undefined) {
    return next(new HttpError("User ID and monthly income is required to create income.", 400));
  }

  const newIncome = {
    id: uuidv4(),
    userId,
    monthlyIncome,
    benefits: benefits || 0, // Default to 0 if benefits are not provided
  };

  DUMMY_INCOME.push(newIncome);
  res.status(201).json({
    message: "Income created successfully.",
    income: newIncome,
  });
};

// Retrieve All Income Entries
const getAllIncome = (req, res, next) => {
    res.status(200).json({
      message: "All income records retrieved successfully.",
      income: DUMMY_INCOME,
    });
};

// Retrieve Income by User ID
const getIncomeByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const userIncome = DUMMY_INCOME.filter((income) => income.userId === userId);

  if (!userIncome || userIncome.length === 0) {
    return next(new HttpError("No income records found for this user.", 404));
  }

  res.status(200).json({ income: userIncome });
};

// Update Income
const updateIncome = (req, res, next) => {
    const userId = req.params.userId;
     // Log the User ID to verify the route is being called correctly
  console.log('Update Income Called for User ID:', userId);

    const { monthlyIncome, benefits } = req.body;

  const incomeIndex = DUMMY_INCOME.findIndex((income) => income.userId === userId);

  if (incomeIndex === -1) {
    return next(new HttpError("Income entry not found.", 404));
  }

  DUMMY_INCOME[incomeIndex] = {
    ...DUMMY_INCOME[incomeIndex],
    monthlyIncome: monthlyIncome !== undefined ? monthlyIncome : DUMMY_INCOME[incomeIndex].monthlyIncome,
    benefits: benefits !== undefined ? benefits : DUMMY_INCOME[incomeIndex].benefits,
  };

  res.status(200).json({
    message: "Income entry updated successfully.",
    income: DUMMY_INCOME[incomeIndex],
  });
};

// Delete Income
const deleteIncome = (req, res, next) => {
    const userId = req.params.userId;

    const incomeIndex = DUMMY_INCOME.findIndex((income) => income.userId === userId);

  if (incomeIndex === -1) {
    return next(new HttpError("Income entry not found.", 404));
  }

  DUMMY_INCOME.splice(incomeIndex, 1);

  res.status(200).json({ message: "Income entry deleted." });
};

exports.createIncome = createIncome;
exports.getAllIncome = getAllIncome;
exports.getIncomeByUserId = getIncomeByUserId;
exports.updateIncome = updateIncome;
exports.deleteIncome = deleteIncome;
