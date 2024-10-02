require('dotenv').config();
const { ethers } = require("hardhat");

async function testNetwork() {
    const rpcUrl = process.env.INFURA_ENDPOINT;
    console.log("RPC URL:", rpcUrl);

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    try {
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);
    } catch (error) {
        console.error("Network connection error:", error);
    }
}

testNetwork();
