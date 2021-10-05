import { ethers } from 'hardhat';

let wallet = ethers.Wallet.createRandom();

console.log('You wallet mnemonic phrase: ' + wallet.mnemonic.phrase);
console.log('You wallet address: ' + wallet.address);
