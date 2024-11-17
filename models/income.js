const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  monthlyIncome: { type: Number, required: true },
  benefits: { type: Number },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Income', incomeSchema);
