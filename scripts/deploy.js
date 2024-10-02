require('dotenv').config();
const hre = require("hardhat");
const { ethers } = hre;

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');





// const deployContract = async (name, symbol, supply, taxwallet, buytax, selltax) => {
//     try {
//         console.log(name, symbol, supply, taxwallet, buytax, selltax);
    
//         await hre.run('compile');

//         // Get the contract factory
//         const Contract = await ethers.getContractFactory("MyToken");

//         const contract = await Contract.deploy(name, symbol, supply, taxwallet, buytax, selltax);
//         await contract.deployed();

//         return {
//             contractAddress: contract.address
//         };
//     } catch (error) {
//         console.error('Deployment error:', error);
//         throw error;
//     }
// };


const deployContract = async (privateKey ,taxwallet, teamWallet , bFee , liqFee , mFee, uFee, tFee ) => {
    try {
        console.log(taxwallet, teamWallet);

        // Use the private key passed from the frontend
        const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);

        // Compile the contract
        await hre.run('compile');

        // Get the contract factory
        const Contract = await hre.ethers.getContractFactory("MyToken", wallet);

        // Estimate gas price
        const gasPrice = await hre.ethers.provider.getGasPrice();
        const gasLimit = 5000000; 


        console.log(`Current gas price: ${hre.ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`);

        // Deploy the contract with the estimated gas price
        // const contract = await Contract.deploy( taxwallet, teamWallet, liqFee * 10 , mFee * 10 , uFee * 10 , tFee * 10 , bFee * 10 ,  {
        //     // gasPrice: gasPrice
        //     gasPrice: gasPrice * 2 ,
        //     gasLimit: gasLimit * 2

        // });
        const maxPriorityFeePerGas = hre.ethers.utils.parseUnits('30', 'gwei'); // 30 Gwei tip
        const maxFeePerGas = hre.ethers.utils.parseUnits('60', 'gwei'); // 60 Gwei total fee (base + tip)
        const contract = await Contract.deploy(
            taxwallet, 
            teamWallet, 
            liqFee * 10, 
            mFee * 10, 
            uFee * 10, 
            tFee * 10, 
            bFee * 10, 
            {
                maxPriorityFeePerGas: maxPriorityFeePerGas,
                maxFeePerGas: maxFeePerGas
            }
        );



        // Wait for the deployment to complete
        await contract.deployed();

        console.log(`Contract deployed at address: ${contract.address}`);

        return {
            contractAddress: contract.address
        };
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
};





module.exports = deployContract;



