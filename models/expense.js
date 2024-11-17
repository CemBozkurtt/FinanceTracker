const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  standardExpense: {
    mortgage: { type: Number },
    insurance: { type: Number },
    groceries: { type: Number },
    internet: { type: Number },
  },
  variableExpense: {
    shopping: { type: Number },
    travel: { type: Number },
  },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { strict: true });

module.exports = mongoose.model('Expense', expenseSchema);
