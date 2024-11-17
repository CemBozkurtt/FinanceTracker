const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const usersRoutes = require('./routes/users-routes');
const incomeRoutes = require('./routes/income-routes');
const expenseRoutes = require('./routes/expense-routes');
const HttpError = require('./util/http-error');

const app = express();

app.use(bodyParser.json());

// Add the routes
app.use('/api/users', usersRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);


// Handle 404 errors if no routes are matched
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error middleware triggered:', error);
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// MongoDB connection and app start
mongoose
  .connect('mongodb+srv://username:BdZnfmQCSxCqGLkx@cluster0.stiyv.mongodb.net/budget?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(5050, () => {
      console.log('Server is running on port 5050');
    });
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err);
  });
