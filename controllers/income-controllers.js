const HttpError = require('../util/http-error');
const Income = require('../models/income'); 

const createIncome = async (req, res, next) => {
    const { userId, monthlyIncome, benefits } = req.body;

    if (!userId || monthlyIncome === undefined) {
        return next(new HttpError("User ID and monthly income are required to create income.", 400));
    }

    const newIncome = new Income({
        userId,
        monthlyIncome,
        benefits: benefits || 0, // Default to 0 if benefits are not provided
    });

    try {
        await newIncome.save();
    } catch (err) {
        const error = new HttpError("Creating income failed, please try again.", 500);
        return next(error);
    }

    res.status(201).json({
        message: "Income created successfully.",
        income: newIncome.toObject({ getters: true }),
    });
};

const getAllIncome = async (req, res, next) => {
    let income;
    try {
        income = await Income.find();
    } catch (err) {
        const error = new HttpError("Fetching income records failed, please try again later.", 500);
        return next(error);
    }

    res.status(200).json({
        message: "All income records retrieved successfully.",
        income: income.map((entry) => entry.toObject({ getters: true })),
    });
};


const getIncomeByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let userIncome;
    try {
        userIncome = await Income.find({ userId });
    } catch (err) {
        const error = new HttpError("Fetching income failed, please try again later.", 500);
        return next(error);
    }

    if (!userIncome || userIncome.length === 0) {
        return next(new HttpError("No income records found for this user.", 404));
    }

    res.status(200).json({ income: userIncome.map((entry) => entry.toObject({ getters: true })) });
};

const updateIncome = async (req, res, next) => {
    const userId = req.params.userId;
    const { monthlyIncome, benefits } = req.body;

    let income;
    try {
        income = await Income.findOne({ userId });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update income.", 500);
        return next(error);
    }

    if (!income) {
        return next(new HttpError("Income entry not found.", 404));
    }

    income.monthlyIncome = monthlyIncome !== undefined ? monthlyIncome : income.monthlyIncome;
    income.benefits = benefits !== undefined ? benefits : income.benefits;

    try {
        await income.save();
    } catch (err) {
        const error = new HttpError("Updating income failed, please try again.", 500);
        return next(error);
    }

    res.status(200).json({
        message: "Income entry updated successfully.",
        income: income.toObject({ getters: true }),
    });
};

const deleteIncome = async (req, res, next) => {
    const userId = req.params.userId;

    let income;
    try {
        income = await Income.findOne({ userId });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete income.", 500);
        return next(error);
    }

    if (!income) {
        return next(new HttpError("Income entry not found.", 404));
    }

    try {
        await income.deleteOne();
    } catch (err) {
        const error = new HttpError("Deleting income failed, please try again.", 500);
        return next(error);
    }

    res.status(200).json({ message: "Income entry deleted." });
};

exports.createIncome = createIncome;
exports.getAllIncome = getAllIncome;
exports.getIncomeByUserId = getIncomeByUserId;
exports.updateIncome = updateIncome;
exports.deleteIncome = deleteIncome;
