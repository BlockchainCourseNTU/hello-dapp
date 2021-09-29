import * as dotenv from 'dotenv';
dotenv.config();
import { task, HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import { removeConsoleLog } from 'hardhat-preprocessor';
import { nodeUrl, accounts } from './utils/network';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './build/artifacts',
    cache: './build/cache',
    deploy: './scripts/deploy',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: false, // TODO: process.env.TEST
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 20000,
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: process.env.REPORT_GAS ? true : false,
    showMethodSig: true,
    onlyCalledMethods: false,
  },
  typechain: {
    outDir: 'typechained',
    target: 'ethers-v5',
  },
  networks: {
    hardhat: {
      chainId: 1337, // temporary for MetaMask support: https://github.com/MetaMask/metamask-extension/issues/10290
      forking: {
        url: nodeUrl('mainnet'),
        blockNumber: 13000000, // (Aug-10-2021 09:53:39 PM +UTC) post London fork
      },
    },
    localhost: {
      url: nodeUrl('localhost'),
    },
    rinkeby: {
      url: nodeUrl('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    // can configure other networks, see examples:
    // https://github.com/wighawag/template-ethereum-contracts/blob/main/hardhat.config.ts
  },
  namedAccounts: {
    deployer: {
      default: 0, // by default, take the first account as deployer
      rinkeby: '0x5238A644636946963ffeDAc52Ec53fb489D3a1CD', // on rinkeby, use a specific account
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (hre) => hre.network.name !== 'hardhat' && hre.network.name !== 'localhost'
    ),
  },
};

export default config;
