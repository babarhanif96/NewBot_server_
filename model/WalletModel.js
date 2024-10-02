// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
