



// router/walletRoutes.js
const express = require('express');
const { protect } = require('../controllers/authController');
const {  getWalletById, updateWallet, deleteWallet,generateWallets, getWalletsByUserId, enableTradingAndBuyToken, generateMainWallet, autoFundingToSubWallets  } = require('../controllers/walletController');
const { transferToken, sellToken, enableTradingAndSellToken, transferEthToMainWallet, tokensTransferToMainWallet } = require('../controllers/sellAndTransfer');


const router = express.Router();

// const protectTrading = (req, res, next) => {
//     const user = req.user; // Assuming req.user is populated with the authenticated user's data

//     if (!req.user) {
//         return res.status(401).json({ message: 'User not authenticated' });
//     }
//     if (user.role === 'admin'){
//         return next();
//       }
//     if (user.role === 'user' && user.tradding === true) {
//         return next(); // Allow access for regular users if deployfun is false
//     } else {
//         return res.status(403).json({ message: 'Access denied: Tradding already done or not allowed' });
//     }
// };


// Wallet routes
router.post('/generate-wallets', protect, generateWallets);
router.post('/generate-main-wallet', protect, generateMainWallet);
router.post('/enable-trading', protect , enableTradingAndBuyToken);
router.post('/enable-trading-sell', protect , enableTradingAndSellToken);
router.post('/transfer-token', protect, transferToken);
router.post('/transfer-eth-main', protect, transferEthToMainWallet);
router.post('/transfer-token-main', protect, tokensTransferToMainWallet);
router.post('/sell-token', protect, sellToken);
router.post('/autofunding-to-subwallet', protect, autoFundingToSubWallets);
router.get('/',    protect, getWalletsByUserId);
router.get('/:id', protect, getWalletById);
router.put('/:id', protect, updateWallet);
router.delete('/:id', protect, deleteWallet);


module.exports = router;
