import hre, { ethers, waffle } from 'hardhat';
import { expect } from 'chai';
import { IERC20 } from '@typechained';
import { evm, wallet } from './utils/index';
import { BigNumber, Signer } from 'ethers';

// vitalik.eth: https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045
const vitalik = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
// Dai address on mainnet: https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

describe('DAI Mainnet Forking', () => {
  let dai: IERC20;
  const [alice] = waffle.provider.getWallets();
  let daiVitalik: Signer;
  let snapshotId: string;

  before(async () => {
    await evm.reset(hre);
    dai = (await ethers.getContractAt('IERC20', daiAddress)) as IERC20;
    daiVitalik = (await wallet.impersonate(vitalik)) as Signer;
    snapshotId = await evm.snapshot.take();
  });

  beforeEach(async () => {
    await evm.snapshot.revert(snapshotId);
  });

  describe('#transfer', () => {
    describe('with insufficient balance', () => {
      it('should revert', async () => {
        await expect(
          dai.connect(alice).transfer(wallet.generateRandomAddress(), ethers.utils.parseEther('1'))
        ).to.be.revertedWith('Dai/insufficient-balance');
      });
    });
    describe('with sufficient balance', () => {
      let initSenderBalance: BigNumber;
      let initReceiverBalance: BigNumber;
      const amount = ethers.utils.parseEther('2');

      beforeEach(async () => {
        initSenderBalance = await dai.balanceOf(await daiVitalik.getAddress());
        initReceiverBalance = await dai.balanceOf(alice.address);
        await dai.connect(daiVitalik).transfer(alice.address, amount);
      });
      it('sender balance should be deduced correctly', async () => {
        expect(await dai.balanceOf(await daiVitalik.getAddress())).to.be.equal(
          initSenderBalance.sub(amount)
        );
      });
      it('receiver balance should increase correctly', async () => {
        expect(await dai.balanceOf(alice.address)).to.be.equal(initReceiverBalance.add(amount));
      });
    });
  });
});
