import 'dotenv/config';
import { HardhatNetworkAccountsUserConfig } from 'hardhat/types';

export type NetworkOptions = 'localhost' | 'mainnet' | 'rinkeby' | 'kovan' | 'ropsten' | 'goerli';

export const nodeUrl = (network: NetworkOptions): string => {
  const alchemyAPI = (network: string): string => {
    const token = process.env.ALCHEMY_TOKEN;
    if (token === '' || typeof token === 'undefined') {
      throw Error('Please declare your ALCHEMY_TOKEN in your .env');
    }
    return `https://eth-${network}.alchemyapi.io/v2/${token}`;
  };

  switch (network) {
    case 'localhost':
      return 'http://localhost:8545';
    default:
      return alchemyAPI(network);
  }
};

// please read https://hardhat.org/config/#hd-wallet-config and
// https://github.com/nomiclabs/hardhat/blob/6d6a4916540eb4d1cee8e6ac9d7f11b6639b85f3/packages/hardhat-core/src/types/config.ts#L148
// for types of return parameter
export const accounts = (network: NetworkOptions): HardhatNetworkAccountsUserConfig => {
  switch (network) {
    case 'localhost':
      throw Error("Use hardhat's accounts from hre.ethers.getSigners() instead!");
    default:
      const walletMnemonic = process.env.CI
        ? 'test test test test test test test test test test test junk'
        : process.env.MNEMONIC;
      if (walletMnemonic === '' || typeof walletMnemonic === 'undefined') {
        throw Error('Please declare your MNEMONIC in your .env');
      }

      return {
        mnemonic: walletMnemonic,
      };
  }
};
