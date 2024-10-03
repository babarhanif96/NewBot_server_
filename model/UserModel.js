const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mainWallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"  // Referencing the Wallet model
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    image: {
        url: { type: String },
        public_id: { type: String }
    },
    registeredDevice: {
        userAgent: String,
        ipAddress: String,
        isLocked: { type: Boolean, default: false }, // Lock once logged in on one device
    },
    deployfun: { type: Boolean, default: true },
    tradding: { type: Boolean, default: true }
});

// Middleware to remove `deployfun` and `tradding` for admin users before saving
userSchema.pre('save', function (next) {
    // If the user's role is admin, remove or ignore `deployfun` and `tradding`
    if (this.role === 'admin') {
        this.deployfun = true;  // You can also use `delete this.deployfun;`
        this.tradding = true;   // You can also use `delete this.tradding;`
    }

    next();
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password for login
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
