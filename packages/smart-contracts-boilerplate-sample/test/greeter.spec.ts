import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();

    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});

// Wait so the reporter has time to fetch and return prices from APIs.
// https://github.com/cgewecke/eth-gas-reporter/issues/254
describe('eth-gas-reporter workaround', () => {
  it('should kill time', (done) => {
    setTimeout(done, 2000);
  });
});
