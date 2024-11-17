const HttpError = require('../util/http-error');
const { v4: uuidv4 } = require('uuid');  // For generating unique IDs

let DUMMY_USERS = [
    { id: 'u1', name: 'Mathu', email: 'mathu@gmail.com', password: '111' },
    { id: 'u2', name: 'Kishan', email: 'kishan@gmail.com', password: '111' },
    { id: 'u3', name: 'Akira', email: 'mathu@example.com', password: '111' }
];

// Create a new user (sign up)
const signUp = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const hasUser = DUMMY_USERS.find(user => user.email === email);
    if (hasUser) {
        return next(new HttpError('User already exists, please login instead.', 422));
    }

    // Create a new user with a unique ID
    const newUser = {
        id: uuidv4(),  // Using uuidv4 for unique ID generation
        name,
        email,
        password
    };

    DUMMY_USERS.push(newUser);
    res.status(201).json({ user: newUser });
};

// Retrive all users
const getAllUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};


// Retrieve user by ID
const getUserById = (req, res, next) => {
    const userId = req.params.uid;

    const user = DUMMY_USERS.find(u => u.id === userId);
    if (!user) {
        return next(new HttpError('Could not find a user for the provided user id.', 404));
    }

    res.json({ user });
};

// Update a user
const updateUser = (req, res, next) => {
    const userId = req.params.uid;
    const { name, email } = req.body;

    const userIndex = DUMMY_USERS.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return next(new HttpError('User not found.', 404));
    }

    DUMMY_USERS[userIndex] = {
        ...DUMMY_USERS[userIndex],
        name: name || DUMMY_USERS[userIndex].name,
        email: email || DUMMY_USERS[userIndex].email,
    };

    res.status(200).json({ user: DUMMY_USERS[userIndex] });
};

// Delete a user
const deleteUser = (req, res, next) => {
    const userId = req.params.uid;

    const userIndex = DUMMY_USERS.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return next(new HttpError('User not found.', 404));
    }

    DUMMY_USERS.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted.' });
};

exports.signUp = signUp;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getAllUsers = getAllUsers;
