const express = require('express');
const userControllers = require('../controllers/user-controllers');

const router = express.Router();

// Sign up a new user
router.post('/signup', userControllers.signUp);

// Get a user by ID
router.get('/:uid', userControllers.getUserById);

// Get all user
router.get('/', userControllers.getAllUsers);

// Update a user by ID
router.patch('/:uid', userControllers.updateUser);

// Delete a user by ID
router.delete('/:uid', userControllers.deleteUser);

module.exports = router;
