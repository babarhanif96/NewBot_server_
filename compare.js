require('dotenv').config(); // Ensure this is at the top of your script

const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Initialize Web3 instance with Infura endpoint
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));

const compileContract = (sourcePath) => {
    const source = fs.readFileSync(sourcePath, 'utf8');
    const input = {
        language: 'Solidity',
        sources: {
            'ERC20.sol': {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    if (output.errors) {
        console.error('Compilation errors:', output.errors);
        return null;
    }
    const contract = output.contracts['ERC20.sol']['MyToken']; // Adjust to match the contract name
    return contract ? contract.evm.bytecode.object : null;
};

const compareBytecodes = async (contractAddress, compiledBytecode) => {
    try {
        const deployedBytecode = await web3.eth.getCode(contractAddress);
        console.log('Deployed Bytecode:', deployedBytecode);
        console.log('Compiled Bytecode:', compiledBytecode);

        if (deployedBytecode === `0x${compiledBytecode}`) {
            console.log('Bytecodes match.');
        } else {
            console.log('Bytecodes do not match.');
        }
    } catch (error) {
        console.error('Error fetching deployed bytecode:', error);
    }
};

const main = async () => {
    const sourcePath = './ERC20.sol'; // Adjust the path to your Solidity file
    const contractAddress = '0x27cd2Dc2952493b37D15Bc50d477B0A33ea0e4Cd'; // Replace with your contract address

    const compiledBytecode = compileContract(sourcePath);
    if (compiledBytecode) {
        await compareBytecodes(contractAddress, compiledBytecode);
    }
};

main().catch(console.error);
