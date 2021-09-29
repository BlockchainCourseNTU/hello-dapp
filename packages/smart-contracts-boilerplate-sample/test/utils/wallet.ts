// credit: https://github.com/defi-wonderland/solidity-boilerplate
// with simplifications
import { ethers, network } from 'hardhat';

export const impersonate = async (address: string) => {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  return ethers.provider.getSigner(address);
};

export const generateRandomWallet = async () => {
  const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
  await ethers.provider.send('hardhat_setBalance', [
    wallet.address,
    ethers.utils.parseEther('100'),
  ]);
  return wallet;
};

export const generateRandomAddress = () => {
  return ethers.Wallet.createRandom().address;
};
