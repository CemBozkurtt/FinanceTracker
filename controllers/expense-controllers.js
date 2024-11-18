const HttpError = require('../util/http-error');
const Expense = require('../models/expense'); 

const createExpense = async (req, res, next) => {
    const { userId, category, amount, description } = req.body;

    if (!userId || amount === undefined || !category) {
        return next(new HttpError("User ID, category, and amount are required to create an expense.", 400));
    }

    const newExpense = new Expense({
        userId,
        category,
        amount,
        description: description || '', // Default to empty string if description is not provided
    });

    try {
        await newExpense.save();
    } catch (err) {
        const error = new HttpError("Creating expense failed, please try again.", 500);
        return next(error);
    }

    res.status(201).json({
        message: "Expense created successfully.",
        expense: newExpense.toObject({ getters: true }),
    });
};

const getAllExpenses = async (req, res, next) => {
    let expenses;
    try {
        expenses = await Expense.find();
    } catch (err) {
        const error = new HttpError("Fetching expense records failed, please try again later.", 500);
        return next(error);
    }

    res.status(200).json({
        message: "All expense records retrieved successfully.",
        expenses: expenses.map((entry) => entry.toObject({ getters: true })),
    });
};

const getExpensesByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let userExpenses;
    try {
        userExpenses = await Expense.find({ userId });
    } catch (err) {
        const error = new HttpError("Fetching expenses failed, please try again later.", 500);
        return next(error);
    }

    if (!userExpenses || userExpenses.length === 0) {
        return next(new HttpError("No expense records found for this user.", 404));
    }

    res.status(200).json({ expenses: userExpenses.map((entry) => entry.toObject({ getters: true })) });
};

const updateExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    const { category, amount, description } = req.body;

    let expense;
    try {
        expense = await Expense.findById(expenseId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update expense.", 500);
        return next(error);
    }

    if (!expense) {
        return next(new HttpError("Expense entry not found.", 404));
    }

    expense.category = category || expense.category;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.description = description || expense.description;

    try {
        await expense.save();
    } catch (err) {
        const error = new HttpError("Updating expense failed, please try again.", 500);
        return next(error);
    }

    res.status(200).json({
        message: "Expense entry updated successfully.",
        expense: expense.toObject({ getters: true }),
    });
};

const deleteExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;

    let expense;
    try {
        expense = await Expense.findById(expenseId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete expense.", 500);
        return next(error);
    }

    if (!expense) {
        return next(new HttpError("Expense entry not found.", 404));
    }

    try {
        await expense.deleteOne();
    } catch (err) {
        const error = new HttpError("Deleting expense failed, please try again.", 500);
        return next(error);
    }

    res.status(200).json({ message: "Expense entry deleted." });
};

exports.createExpense = createExpense;
exports.getAllExpenses = getAllExpenses;
exports.getExpensesByUserId = getExpensesByUserId;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
