import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Greeter, Greeter__factory } from '@typechained';

describe('Greeter', function () {
  let greeter: Greeter;
  let greeterFactory: Greeter__factory;

  beforeEach(async () => {
    greeterFactory = (await ethers.getContractFactory('Greeter')) as Greeter__factory;
    greeter = await greeterFactory.deploy('Hello, world!');
  });

  it("Should return the new greeting once it's changed", async function () {
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
