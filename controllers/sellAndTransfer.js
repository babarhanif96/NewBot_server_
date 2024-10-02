require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(process.env.RPC_URL);
const User = require('../model/UserModel');
const Wallet = require('../model/WalletModel');
const BN = require('bn.js'); // Import BN for handling big numbers

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;
const ivLength = 16;



const routerAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const erc20Abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"BuyTaxesUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"ExcludedFromFeesUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"Launched","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SellTaxesUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"StuckEthersCleared","type":"event"},{"anonymous":false,"inputs":[],"name":"SwapEnabled","type":"event"},{"anonymous":false,"inputs":[],"name":"SwapThresholdUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TransferForeignToken","type":"event"},{"anonymous":false,"inputs":[],"name":"taxWalletUpdated","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyTaxes","outputs":[{"internalType":"uint256","name":"tax","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountPercentage","type":"uint256"}],"name":"clearStuckEthers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"excludedFromFees","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"launched","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sellTaxes","outputs":[{"internalType":"uint256","name":"tax","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tax","type":"uint256"}],"name":"setBuyTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"state","type":"bool"}],"name":"setExcludedFromFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tax","type":"uint256"}],"name":"setSellTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"state","type":"bool"}],"name":"setSwapEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"new_amount","type":"uint256"}],"name":"setSwapThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newWallet","type":"address"}],"name":"settaxWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taxWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unclog","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"}],"name":"withdrawStuckTokens","outputs":[{"internalType":"bool","name":"_sent","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const BNB_ADDRESS =  process.env.ETH_ADDRESS; // Native BNB
const routerAddress = process.env.PANCAKESWAP_ROUTER_ADDRESS;
const RPC_URL = process.env.RPC_URL;
// const routerAbi = require('./PancakeRouterABI.json'); // Import PancakeSwap Router ABI
// const erc20Abi = require('./ERC20ABI.json'); // Minimal ERC-20 ABI for allowance and transferFrom

async function getGasPrice(web3) {
    return await web3.eth.getGasPrice();
}


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

  
async function transferToken(web3, account, tokenAddress, toAddress, amountInTokens) {
    try {
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const amount = web3.utils.toWei(amountInTokens.toString(), 'ether'); // Convert amount to Wei

        // Prepare and send the transfer transaction
        const tx = tokenContract.methods.transfer(toAddress, amount);
        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await getGasPrice(web3);
        const data = tx.encodeABI();

        const txData = {
            from: account.address,
            to: tokenAddress,
            data,
            gas,
            gasPrice
        };

        const receipt = await web3.eth.sendTransaction(txData);
        console.log('Transfer successful! Hash:', receipt.transactionHash);
        return receipt.transactionHash;

    } catch (error) {
        console.error('Error during token transfer:', error);
        throw error;
    }
}

exports.transferToken = async (req, res) => {
    
    const { privateKey, tokenAddress, toAddress, amountInTokens } = req.body;
    // console.log(privateKey, tokenAddress, toAddress, amountInTokens)

    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const txHash = await transferToken(web3, account, tokenAddress, toAddress, amountInTokens);
        res.status(200).json({ transactionHash: txHash });
    } catch (error) {
        console.error('Failed to complete the token transfer:', error);
        res.status(500).json({ error: 'Failed to complete the token transfer' });
    }
};







  // SellToken
async function approveToken(web3, account, tokenContract, spender, amount) {
    const allowance = await tokenContract.methods.allowance(account.address, spender).call();

    if (parseInt(allowance) >= parseInt(amount)) {
        console.log('Token is already approved for spending');
        return;
    }

    const tx = tokenContract.methods.approve(spender, amount);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await getGasPrice(web3);

    const txData = {
        from: account.address,
        to: tokenContract.options.address,
        data: tx.encodeABI(),
        gas,
        gasPrice
    };

    const receipt = await web3.eth.sendTransaction(txData);
    console.log('Approval successful! Hash:', receipt.transactionHash);
}

exports.sellToken = async (req, res) => {
    
    const { privateKey, tokenAddress, amountInTokens } = req.body;
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        // const routerAddress = process.env.PANCAKESWAP_ROUTER_ADDRESS;
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const router = new web3.eth.Contract(routerAbi, routerAddress);

        const amountIn = web3.utils.toWei(amountInTokens.toString(), 'ether');
        const path = [tokenAddress, BNB_ADDRESS];
        const to = account.address; // Receiver address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
        const gasPrice = await getGasPrice(web3);

        // Approve the router to spend the tokens
        await approveToken(web3, account, tokenContract, routerAddress, amountIn);

        // Prepare and send the sell transaction
        const tx = router.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            0, // amountOutMin, set to 0 for simplicity (adjust for slippage tolerance)
            path,
            to,
            deadline
        );

        const gas = await tx.estimateGas({ from: account.address });
        const data = tx.encodeABI();

        const txData = {
            from: account.address,
            to: router.options.address,
            data,
            gas,
            gasPrice
        };

        const receipt = await web3.eth.sendTransaction(txData);
        res.status(200).json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error during token sale:', error);
        res.status(500).json({ error: 'Token sale failed' });
    }
};




// Controller for enabling trading and selling tokens
exports.enableTradingAndSellToken = async (req, res) => {
    const { tokenAddress, correspondingData } = req.body;
     console.log(tokenAddress, correspondingData)
    if (!tokenAddress || !correspondingData || correspondingData.length === 0) {
        return res.status(400).json({ message: 'Token address and corresponding data are required.' });
    }

    try {
       
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
        console.log("try2");
        // Array to store transaction results for each wallet
        const transactionResults = [];

        // Loop through each wallet's data in correspondingData
        for (const data of correspondingData) {
            const { privateKey, tokenAmount } = data;
            console.log(data);
            // Skip if amountInTokens is empty or undefined
            if (!tokenAmount || tokenAmount === "") {
                transactionResults.push({
                    walletAddress: data.walletAddress || 'Unknown address', // Optionally store the wallet address
                    status: 'skipped',
                    message: 'No token amount specified for this wallet.',
                });
                continue; // Skip to the next wallet
            }
            console.log("try21");
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);

            // Get the token contract and router contract
            const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
            const router = new web3.eth.Contract(routerAbi, routerAddress);
console.log("contract")
            // Convert token amount to wei
            const amountIn = web3.utils.toWei(tokenAmount.toString(), 'ether');
            const path = [tokenAddress, BNB_ADDRESS];
            const to = account.address; // The wallet selling the tokens
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
            const gasPrice = await getGasPrice(web3);

            // Approve the router to spend the tokens


            console.log("approve")

            await approveToken(web3, account, tokenContract, routerAddress, amountIn);



            // Prepare and send the sell transaction
            const tx = router.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountIn,
                0, // amountOutMin, set to 0 for simplicity (adjust for slippage tolerance)
                path,
                to,
                deadline
            );
            console.log(tx)

            const gas = await tx.estimateGas({ from: account.address });
            const dataTx = tx.encodeABI();

            const txData = {
                from: account.address,
                to: router.options.address,
                data: dataTx,
                gas,
                gasPrice
            };

            // Send the signed transaction
            const receipt = await web3.eth.sendTransaction(txData);

            // Push transaction result to the results array
            transactionResults.push({
                walletAddress: account.address,
                status: 'success',
                transactionHash: receipt.transactionHash,
            });
        }

        // Return all transaction results
        return res.status(200).json({
            message: 'Token sell transactions completed for all wallets.',
            transactionResults
        });

    } catch (error) {
        console.error('Error during token sale:', error);
        return res.status(500).json({ message: 'Token sale failed', error: error.message });
    }
};




exports.tokensTransferToMainWallet = async (req, res) => {
    const { tokenAddress } = req.body; // Token address from request body
           console.log("tokensTransferToMainWallet" ,tokenAddress )
    if (!tokenAddress) {
        return res.status(400).json({ message: 'tokenAddress is required.' });
    }

    try {
        const userId = req.user._id; // Assuming the user ID comes from req.user
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));

        // Step 1: Retrieve the user's main wallet
        const user = await User.findById(userId).populate('mainWallet');
        if (!user || !user.mainWallet) {
            return res.status(404).json({ message: 'User or main wallet not found.' });
        }

        const mainWalletAddress = user.mainWallet.walletAddress;

        // Step 2: Fetch all sub-wallets for the user (excluding the main wallet)
        const subWallets = await Wallet.find({
            userId: userId,
            _id: { $ne: user.mainWallet._id }, // Exclude the main wallet
        });

        if (!subWallets || subWallets.length === 0) {
            return res.status(404).json({ message: 'No sub-wallets found for this user.' });
        }

        // Array to store transfer results
        const transferResults = [];

        // Step 3: Loop through each sub-wallet and get token balance
        for (const subWallet of subWallets) {
            const { privateKey, walletAddress } = subWallet;
 console.log("pk" , privateKey , "aa" ,walletAddress)
            const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

            // Step 4: Fetch the token balance for this wallet
            const balance = await tokenContract.methods.balanceOf(walletAddress).call();
console.log("balance " , balance);
            // Skip if balance is 0
            if (balance == 0) {
                continue; // Skip to the next sub-wallet
            }

            let PK = decrypt(privateKey);

            const account = web3.eth.accounts.privateKeyToAccount(PK);
            web3.eth.accounts.wallet.add(account);

            // Step 5: Approve the token transfer from the sub-wallet to the main wallet
            const approveTx = tokenContract.methods.approve(mainWalletAddress, balance);
            const approveGas = await approveTx.estimateGas({ from: walletAddress });
            await approveTx.send({
                from: walletAddress,
                gas: approveGas,
                gasPrice: await web3.eth.getGasPrice(),
            });

            // Step 6: Transfer the token balance to the main wallet
            const transferTx = tokenContract.methods.transfer(mainWalletAddress, balance);
            const gas = await transferTx.estimateGas({ from: walletAddress });
            const gasPrice = await web3.eth.getGasPrice();
            const txData = {
                from: walletAddress,
                to: tokenAddress,
                data: transferTx.encodeABI(),
                gas,
                gasPrice,
            };

            const receipt = await web3.eth.sendTransaction(txData);

            // Step 7: Store the transfer result
            transferResults.push({
                walletAddress,
                tokenAddress,
                status: 'success',
                transactionHash: receipt.transactionHash,
                transferredAmount: web3.utils.fromWei(balance, 'ether'),
            });
        }

        // Step 8: Return the transfer results
        return res.status(200).json({
            message: 'Tokens transferred from all sub-wallets to main wallet.',
            transferResults,
        });

    } catch (error) {
        console.error('Error during token transfer:', error);
        return res.status(500).json({ message: 'Token transfer failed', error: error.message });
    }
};

exports.transferEthToMainWallet = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user ID comes from req.user
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
        
        // Step 1: Retrieve the user's main wallet
        const user = await User.findById(userId).populate('mainWallet');
        if (!user || !user.mainWallet) {
            return res.status(404).json({ message: 'User or main wallet not found.' });
        }
        
        const mainWalletAddress = user.mainWallet.walletAddress;

        // Step 2: Fetch all sub-wallets for the user (excluding the main wallet)
        const subWallets = await Wallet.find({
            userId: userId,
            _id: { $ne: user.mainWallet._id } // Exclude the main wallet
        });

        if (!subWallets || subWallets.length === 0) {
            return res.status(404).json({ message: 'No sub-wallets found for this user.' });
        }

        // Array to store transfer results
        const transferResults = [];

        // Step 3: Loop through each sub-wallet
        for (const subWallet of subWallets) {
            const { privateKey, walletAddress } = subWallet;

            // Fetch the ETH balance of the sub-wallet
            const balanceInWei = await web3.eth.getBalance(walletAddress);

            // Skip if balance is 0
            if (balanceInWei === '0') {
                continue; // Skip to the next wallet
            }

            let PK = decrypt(privateKey);

            // Prepare to send the ETH to the main wallet
            const account = web3.eth.accounts.privateKeyToAccount(PK);
            web3.eth.accounts.wallet.add(account);

            // Calculate gas fee
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = new BN(21000); // Standard gas limit for ETH transfer
            const gasFeeInWei = new BN(gasPrice).mul(gasLimit);

            // Determine the amount to send after deducting gas fees
            const amountToSend = new BN(balanceInWei).sub(gasFeeInWei);

            // Ensure there's enough balance after deducting gas fees
            if (amountToSend.lte(new BN(0))) {
                continue; // Skip if there's not enough to cover gas fees
            }

            // Step 4: Prepare and send the transfer transaction
            const txData = {
                from: walletAddress,
                to: mainWalletAddress,
                value: amountToSend.toString(), // Convert BigNumber to string
                gas: gasLimit.toString(), // Convert gas limit to string
                gasPrice: gasPrice.toString(), // Convert gas price to string
            };

            // Send the transaction
            const receipt = await web3.eth.sendTransaction(txData);

            // Push the result of the transfer into the results array
            transferResults.push({
                walletAddress,
                status: 'success',
                transactionHash: receipt.transactionHash,
                transferredAmount: web3.utils.fromWei(amountToSend, 'ether'),
            });
        }

        // Step 5: Return the transfer results
        return res.status(200).json({
            message: 'ETH transferred from all sub-wallets to main wallet.',
            transferResults,
        });

    } catch (error) {
        console.error('Error during ETH transfer:', error);
        return res.status(500).json({ message: 'ETH transfer failed', error: error.message });
    }
};
