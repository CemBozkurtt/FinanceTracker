const HttpError = require('../util/http-error');
const User = require('../models/User'); // Mongoose User model
const { v4: uuidv4 } = require('uuid'); 

const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError('Sign up failed, please try again later.', 500);
        return next(error);
    }

    if (existingUser) {
        return next(new HttpError('User already exists, please login instead.', 422));
    }

    const newUser = new User({
        name,
        email,
        password,
    });

    try {
        await newUser.save();
    } catch (err) {
        const error = new HttpError('Sign up failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password'); // Exclude the password field
    } catch (err) {
        const error = new HttpError('Fetching users failed, please try again later.', 500);
        return next(error);
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError('Could not find a user for the provided ID.', 404));
    }

    res.json({ user: user.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
    const userId = req.params.uid;
    const { name, email } = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update the user.', 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError('Could not find a user for the provided ID.', 404));
    }

    user.name = name || user.name;
    user.email = email || user.email;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update the user.', 500);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete the user.', 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError('Could not find a user for the provided ID.', 404));
    }

    try {
        await user.deleteOne();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete the user.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'User deleted.' });
};

exports.signUp = signUp;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
