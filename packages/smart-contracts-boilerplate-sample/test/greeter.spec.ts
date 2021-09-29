import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { Greeter, DaiMock__factory, DaiMock } from '@typechained';
import GreeterABI from '../build/artifacts/contracts/Greeter.sol/Greeter.json';
import { smock, MockContract } from '@defi-wonderland/smock';

const { solidity } = waffle;
chai.use(solidity);
chai.use(smock.matchers);
chai.config.includeStack = true;

describe('flatten', () => {
  it('testing', async () => {
    let [alice, bob] = waffle.provider.getWallets();
    const initGreeting = 'Hello, world!';
    const whoGreeting = 'Heal the world, WHO!';
    const WHOAddress = ethers.utils.getAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');

    let greeter = (await waffle.deployContract(alice, GreeterABI, [initGreeting])) as Greeter;
    const factory = await smock.mock<DaiMock__factory>('DaiMock');
    let daiMock = (await factory.deploy()) as MockContract<DaiMock>;

    await greeter.setDaiAddress(daiMock.address);

    await daiMock.setVariable('_balances', {
      [alice.address]: 12,
    });
    expect(await daiMock.balanceOf(alice.address)).to.equals(12);
    await daiMock.setVariable('_allowances', {
      [alice.address]: {
        [greeter.address]: 11,
      },
    });
    expect(await daiMock.allowance(alice.address, greeter.address)).to.equals(11);

    expect(daiMock.transferFrom).to.have.callCount(0);
    await greeter.setGreetingWithDai(whoGreeting);
    expect(daiMock.transferFrom).to.have.callCount(13); // FIXME: why 13 times?!
    for (let i = 0; i < 13; i++) {
      console.log(`the ${i}-th call: `, daiMock.transferFrom.getCall(i).args);
    }

    // expect(await daiMock.balanceOf(alice.address)).is.equals(2);
    // expect(await daiMock.balanceOf(WHOAddress)).is.equals(10);
    // expect(await daiMock.allowance(alice.address, greeter.address)).is.equals(1);

    // // if DAI reverts, so should greeter.setGreetingWithDai
    // daiMock.allowance.reverts();
    // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.reverted;
    // daiMock.allowance.reset(); // reset its behavior

    // // when only fake require allowances check in Greeter.sol, still would fail when calling dai.transferFrom.
    // // it should fail from `dai.transferFrom()` -> `_transfer()`, on this line:
    // // `require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");`
    // daiMock.allowance.whenCalledWith(alice.address, greeter.address).returns(11);
    // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    // expect(daiMock.transferFrom).to.have.callCount(14);

    // console.log('here');
    // // however, when we even fake dai.transferFrom, everything should work
    // daiMock.transferFrom.whenCalledWith(alice.address, WHOAddress, 10).returns(true);
    // expect(await daiMock.transferFrom(alice.address, WHOAddress, 10)).to.equals(true);

    // await greeter.setGreetingWithDai(whoGreeting);
    // // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.not.reverted;
  });
});

// describe('Greeter', () => {
//   let greeter: Greeter;
//   let daiMock: MockContract<DaiMock>;
//   const WHOAddress = ethers.utils.getAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');

//   // this is the same list as `ethers.getSigners()`
//   let [alice, bob] = waffle.provider.getWallets();
//   const initGreeting = 'Hello, world!';

//   const greeterFixture = async () => {
//     // deploy greeter once
//     return (await waffle.deployContract(alice, GreeterABI, [initGreeting])) as Greeter;
//   };
//   const daiMockFixture = async () => {
//     // deploy mock dai once
//     const factory = await smock.mock<DaiMock__factory>('DaiMock');
//     return await factory.deploy();
//   };

//   beforeEach(async () => {
//     greeter = await waffle.loadFixture(greeterFixture);
//     daiMock = await waffle.loadFixture(daiMockFixture);

//     // setting the DAI address to our mock to faciliate contract call.
//     await greeter.setDaiAddress(daiMock.address);
//   });

//   // it('Initalize with correct default greeting', async () => {
//   //   expect(await greeter.greet()).to.equal(initGreeting);
//   // });

//   // describe('#setGreeting', () => {
//   //   const newGreeting = 'Bonjour!';

//   //   it('should revert with insufficent donation', async () => {
//   //     // this will send from alice (or first wallet) by default
//   //     await expect(
//   //       greeter.setGreeting(newGreeting, {
//   //         value: ethers.utils.parseEther('0.9'),
//   //       })
//   //     ).to.be.reverted;
//   //   });

//   //   it('should update the greeting with sufficient donation', async () => {
//   //     const donationInWei = ethers.utils.parseEther('2');
//   //     // reconnect contract with a different signer before calling if you want to send from a different wallet.
//   //     await expect(
//   //       greeter.connect(bob).setGreeting(newGreeting, {
//   //         value: donationInWei,
//   //       })
//   //     )
//   //       // the following line is temporarily broken after London hardfork
//   //       // .to.changeEtherBalances(greeter, [bob, greeter], [-donationInWei, donationInWei])
//   //       .to.emit(greeter, 'GreetingUpdated')
//   //       .withArgs(newGreeting, bob.address, donationInWei);

//   //     expect(await greeter.greet()).to.equal(newGreeting);
//   //   });
//   // });

//   describe('#setGreetingWithDai', () => {
//     const whoGreeting = 'Heal the world, WHO!';
//     // Mock also supports all fakes features
//     it('fakes functionalities', async () => {
//       // // if DAI reverts, so should greeter.setGreetingWithDai
//       // daiMock.allowance.reverts();
//       // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.reverted;
//       // daiMock.allowance.reset(); // reset its behavior

//       // // when only fake require allowances check in Greeter.sol, still would fail when calling dai.transferFrom.
//       // // it should fail from `dai.transferFrom()` -> `_transfer()`, on this line:
//       // // `require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");`
//       // daiMock.allowance.whenCalledWith(alice.address, greeter.address).returns(11);
//       // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.revertedWith('ERC20: transfer amount exceeds balance');

//       // console.log('here');
//       // // however, when we even fake dai.transferFrom, everything should work
//       // daiMock.transferFrom.whenCalledWith(alice.address, WHOAddress, 10).returns(true);
//       // expect(await daiMock.transferFrom(alice.address, WHOAddress, 10)).to.equals(true);
//       // expect(await (daiMock as FakeContract<DaiMock>).transferFrom(alice.address, WHOAddress, 10)).to.equals(true);
//       // console.log('from test: sender, recipient: ', alice.address, WHOAddress);
//       // await greeter.setGreetingWithDai(whoGreeting);
//       // // await expect(greeter.setGreetingWithDai(whoGreeting)).to.be.not.reverted;
//     });

//     it('mock functionalities', async () => {
//       // in case we do want dai to run properly, we just manipulate their private variables
//       await daiMock.setVariable('_balances', {
//         [alice.address]: 12,
//       });
//       // console.log(await daiMock.balanceOf(alice.address));
//       expect(await daiMock.balanceOf(alice.address)).to.equals(12);
//       await daiMock.setVariable('_allowances', {
//         [alice.address]: {
//           [greeter.address]: 11,
//         },
//       });
//       expect(daiMock.allowance(alice.address, greeter.address)).to.equals(11);
//       console.log('yo');
//       await greeter.setGreetingWithDai(whoGreeting);
//       // expect(daiMock.allowance).to.have.been.calledOnce;
//       // expect(daiMock.transferFrom).to.have.callCount(1);
//       // expect(daiMock.balanceOf(alice.address)).is.equals(2);
//       // expect(daiMock.balanceOf(WHOAddress)).is.equals(10);
//       // expect(daiMock.allowance(alice.address, greeter.address)).is.equals(1);
//     });
//   });
// });

// // Wait so the reporter has time to fetch and return prices from APIs.
// // https://github.com/cgewecke/eth-gas-reporter/issues/254
// // describe('eth-gas-reporter workaround', () => {
// //   it('should kill time', (done) => {
// //     setTimeout(done, 2000);
// //   });
// // });
