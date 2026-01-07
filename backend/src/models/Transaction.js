const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell', 'transfer_in', 'transfer_out'],
        required: true
    },
    coinId: {
        type: String,
        required: true
    },
    coinName: String,
    coinSymbol: String,
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalValue: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    exchange: String,
    notes: String,
    taxYear: {
        type: Number,
        required: true
    },
    isTaxable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
