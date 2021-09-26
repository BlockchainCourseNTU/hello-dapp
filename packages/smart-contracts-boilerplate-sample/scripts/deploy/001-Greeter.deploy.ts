import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export const INITIAL_GREET: { [chainId: string]: string } = {
  '1337': 'Bonjour localhost!',
  '4': 'Guten tag, Rinkeby!',
};

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployer } = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();

  await hre.deployments.deploy('Greeter', {
    from: deployer,
    args: [INITIAL_GREET[chainId]],
    log: true,
  });
};

deployFunc.tags = ['Greeter'];

export default deployFunc;
