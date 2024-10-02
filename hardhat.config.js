require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();


module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
},
    defaultNetwork: "mainnet",
    networks: {
      hardhat: {
        chainId: 137
      },
      mainnet: {
        url: process.env.INFURA_ENDPOINT,
        accounts: [process.env.PRIVATE_KEY],
      },
    },
    etherscan: {
      apiKey: {
        mainnet: process.env.ETHERSCAN_API_KEY,
      },
    },
    sourcify: {
      enabled: true,
    }
  };

  
  


