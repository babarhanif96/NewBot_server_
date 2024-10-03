// controllers/authController.js
require('dotenv').config();
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.ENCRYPTION_KEY
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';


// Function to decrypt data
function decrypt(text) {
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid encrypted text format');
        }

        const iv = Buffer.from(textParts[0], 'hex'); // Extract IV
        const encryptedText = Buffer.from(textParts[1], 'hex'); // Extract the encrypted text

        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        throw new Error('Failed to decrypt the text');
    }
}

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.checkDeviceLock = async (req, res, next) => {
    const { user } = req;  // Assuming the user is authenticated
    const currentDeviceInfo = req.headers['user-agent'];
    const currentIp = req.ip;
//    console.log("currentDeviceInfo===",currentDeviceInfo);
//    console.log("currentIp===",currentIp);
    // Check if user account is locked to a specific device
    if (user.registeredDevice.isLocked) {
        // Compare stored device info with current device info
        if (user.registeredDevice.userAgent !== currentDeviceInfo || user.registeredDevice.ipAddress !== currentIp) {
            return res.status(403).json({ message: 'Account is locked to another device' });
        }
    } else {
        // First login, lock the account to the current device
        user.registeredDevice = {
            userAgent: currentDeviceInfo,
            ipAddress: currentIp,
            isLocked: true,
        };
        await user.save();
    }

    next();
};

// Signup Controller


exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, mainWallet, role } = req.body;
    
    // Get device info from request headers
    // const userAgent = req.headers['user-agent'];  // User-Agent from the device/browser
    // const ipAddress = req.ip;  // IP address of the request
    
    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Initialize the new user object
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            mainWallet,
            role: role || 'user',
        });

        // Only apply device locking if the user is not an admin
        // if (role !== 'admin') {
        //     newUser.registeredDevice = {
        //         userAgent,
        //         ipAddress,
        //         isLocked: true  // Lock account to this device
        //     };
        // }

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Prepare user object without the password field
        const { password: pwd, ...userWithoutPassword } = newUser.toObject();

        // Send the response back to the client
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Get device info from request headers
    const currentDeviceInfo = req.headers['user-agent'];  // User-Agent from the device/browser
    const currentIp = req.ip;  // IP address of the request

    try {
        // Find the user by email
        const user = await User.findOne({ email }).populate('mainWallet');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Device lock applies only to non-admin users
        if (user.role !== 'admin') {
            // Check if the user account is locked to a specific device
            if (user.registeredDevice.isLocked) {
                // If current device info or IP does not match the registered one, reject login
                if (user.registeredDevice.userAgent !== currentDeviceInfo || user.registeredDevice.ipAddress !== currentIp) {
                    return res.status(403).json({ message: 'This account is locked to another device' });
                }
            } else {
                // If first login, lock the account to the current device
                user.registeredDevice = {
                    userAgent: currentDeviceInfo,
                    ipAddress: currentIp,
                    isLocked: true,  // Lock account to this device
                };
                await user.save();
            }
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Prepare user object without password
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        // Send response
        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.getMe = async (req, res) => {
    // Assuming the user ID is passed from req.user._id (after authentication)
    const id = req.user._id;

    try {
        // Step 1: Find the user by ID and populate the 'mainWallet'
        const user = await User.findById(id).populate('mainWallet');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Check if the user has a mainWallet and decrypt the privateKey
        if (user.mainWallet && user.mainWallet.privateKey) {
            try {
                const decryptedPrivateKey = decrypt(user.mainWallet.privateKey);
                // Step 3: Attach decryptedPrivateKey to the response object
                user.mainWallet.privateKey = decryptedPrivateKey;
            } catch (error) {
                return res.status(500).json({ message: 'Error decrypting private key', error: error.message });
            }
        }

        // Step 4: Exclude the password and any other sensitive fields from the user data
        const { password, ...userData } = user.toObject();

        // Step 5: Send the user data with the decrypted main wallet's private key
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};



