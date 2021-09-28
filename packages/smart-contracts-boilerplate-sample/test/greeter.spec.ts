import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { Greeter } from '@typechained';
const { solidity } = waffle;
import GreeterABI from '../build/artifacts/contracts/Greeter.sol/Greeter.json';

chai.use(solidity);

describe('Greeter', () => {
  let greeter: Greeter;
  // this is the same list as `ethers.getSigners()`
  let [_, bob] = waffle.provider.getWallets();
  const initGreeting = 'Hello, world!';

  const fixture = async () => {
    return (await waffle.deployContract(bob, GreeterABI, [initGreeting])) as Greeter;
  };

  beforeEach(async () => {
    greeter = await waffle.loadFixture(fixture);
  });

  it('Initalize with correct default greeting', async () => {
    expect(await greeter.greet()).to.equal(initGreeting);
  });

  describe('#setGreeting', () => {
    const newGreeting = 'Bonjour!';

    it('should revert with insufficent donation', async () => {
      // this will send from alice (or first wallet) by default
      await expect(
        greeter.setGreeting(newGreeting, {
          value: ethers.utils.parseEther('0.9'),
        })
      ).to.be.reverted;
    });

    it('should update the greeting with sufficient donation', async () => {
      const donationInWei = ethers.utils.parseEther('2');
      // reconnect contract with a different signer before calling if you want to send from a different wallet.
      await expect(
        greeter.connect(bob).setGreeting(newGreeting, {
          value: donationInWei,
        })
      )
        // the following line is temporarily broken after London hardfork
        // .to.changeEtherBalances(greeter, [bob, greeter], [-donationInWei, donationInWei])
        .to.emit(greeter, 'GreetingUpdated')
        .withArgs(newGreeting, bob.address, donationInWei);

      expect(await greeter.greet()).to.equal(newGreeting);
    });
  });
});

// Wait so the reporter has time to fetch and return prices from APIs.
// https://github.com/cgewecke/eth-gas-reporter/issues/254
// describe('eth-gas-reporter workaround', () => {
//   it('should kill time', (done) => {
//     setTimeout(done, 2000);
//   });
// });
