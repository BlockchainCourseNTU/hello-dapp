// credit: https://github.com/defi-wonderland/solidity-boilerplate
// with slight modifications
import { network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export const getBlockNumber = async () => {
  return (await network.provider.request({
    method: 'eth_blockNumber',
  })) as number;
};

export const advanceTimeAndBlock = async (time: number): Promise<void> => {
  await advanceTime(time);
  await advanceBlock();
};

export const advanceToTimeAndBlock = async (time: number): Promise<void> => {
  await advanceToTime(time);
  await advanceBlock();
};

export const advanceTime = async (time: number): Promise<void> => {
  await network.provider.request({
    method: 'evm_increaseTime',
    params: [time],
  });
};

export const advanceToTime = async (time: number): Promise<void> => {
  await network.provider.request({
    method: 'evm_setNextBlockTimestamp',
    params: [time],
  });
};

export const advanceBlock = async () => {
  await network.provider.request({
    method: 'evm_mine',
    params: [],
  });
};

export const reset = async (hre: HardhatRuntimeEnvironment) => {
  const forkingConfig = hre.config.networks.hardhat.forking;
  const params = forkingConfig
    ? [
        {
          forking: {
            jsonRpcUrl: forkingConfig.url,
            blockNumber: forkingConfig.blockNumber,
          },
        },
      ]
    : [];
  await network.provider.request({
    method: 'hardhat_reset',
    params,
  });
};

class SnapshotManager {
  snapshots: { [id: string]: string } = {};

  async take(): Promise<string> {
    const id = await this.takeSnapshot();
    this.snapshots[id] = id;
    return id;
  }

  async revert(id: string): Promise<void> {
    await this.revertSnapshot(this.snapshots[id]);
    this.snapshots[id] = await this.takeSnapshot();
  }

  private async takeSnapshot(): Promise<string> {
    return (await network.provider.request({
      method: 'evm_snapshot',
      params: [],
    })) as string;
  }

  private async revertSnapshot(id: string) {
    await network.provider.request({
      method: 'evm_revert',
      params: [id],
    });
  }
}

export const snapshot = new SnapshotManager();
