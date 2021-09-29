import { ethers, deployments } from 'hardhat';
import { assert } from 'chai';
import { Greeter } from '@typechained';

async function main() {
  const greeterDeployment = await deployments.get('Greeter');

  const greeter = (await ethers.getContractAt(
    greeterDeployment.abi,
    greeterDeployment.address
  )) as Greeter;
  assert((await greeter.greet()) === 'Bonjour localhost!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
