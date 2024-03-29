# "Hello dApp!" Development Workshop

[![Test](https://github.com/BlockchainCourseNTU/hello-dapp/actions/workflows/test.yml/badge.svg)](https://github.com/BlockchainCourseNTU/hello-dapp/actions/workflows/test.yml)

> MVP (Minimal Viable Preparation) for dApp developers.

This is a one-stop hands-on tutorial for first-time Ethereum application developers.

- [Warm up](./warmup.md)
- [Hardhat 101](#hardhat-101)
- [Smart Contracts Boilerplate](#smart-contracts-boilerplate)
- [Resources](#resources)
- [Contributing](#contributing)

## [Hello-dApp](./hello-dapp/README.md) 
In this section, we demonstrates a minimal viable preparation for dApp construction using latest Hardhat developement framework.
It comes with a `Lock` contract, a simple web app where user can lock some money when deploying that contract and then `withraw` when time is after the specified locking timestamp or after `unlock` operation.

Detailed instruction can be checked at [README](./hello-dapp/README.md).

## Hardhat 101

In this section, we aim to familiarize you with a powerful and modern development tool [`hardhat`](https://github.com/nomiclabs/hardhat).
Since we only need the basics to kick-start our own project, going through the ["Getting Started" section ](https://hardhat.org/getting-started/) of the official documentation is strongly recommended.

Make a new folder to play with hardhat basics:

```sh
# First clone our repo
git clone git@github.com:BlockchainCourseNTU/hello-dapp.git && cd hello-dapp

# make sure you are in project root, then make a new package
mkdir -p packages/hardhat-101/ && cd packages/hardhat-101/
npm init -y

# then proceed with hardhat installation: https://hardhat.org/getting-started/#installation
```

## Smart contracts boilerplate

In this section, we aim to build a boilerplate for all your future Solidity projects by gradually introducing essential hardhat plugins and npm packages that are useful and widely used in the development cycle.

- [Building Smart Contract Project Boilerplate (Part 1)](./boilerplate.md#building-smart-contract-project-boilerplate-part-1)
  - [Prerequisites](./boilerplate.md#prerequisites)
  - [Hardhat Typescript sample project](./boilerplate.md#hardhat-typescript-sample-project)
    - [Add TypeScript support](./boilerplate.md#add-typescript-support)
  - [Add `OpenZeppelin` dependency](./boilerplate.md#add-openzeppelin-dependency)
  - [Add code formatting and linting](./boilerplate.md#add-code-formatting-and-linting)
  - [Add test coverage](./boilerplate.md#add-test-coverage)
  - [Add gas reporter](./boilerplate.md#add-gas-reporter)
  - [Add contract sizer](./boilerplate.md#add-contract-sizer)
  - [Add commit lint and git hooks](./boilerplate.md#add-commit-lint-and-git-hooks)
  - [Add `TypeChain` support](./boilerplate.md#add-typechain-plugin)
  - [Add deployment plugins](./boilerplate.md#add-deployment-plugins)
- [Building Smart Contract Project Boilerplate (Part 2)](./boilerplate-part2.md#building-smart-contract-project-boilerplate-part-2)
  - [Testing with `waffle`](./boilerplate-part2.md#testing-with-waffle)
  - [Mocking with `smock`](./boilerplate-part2.md#mocking-with-smock)
  - [Special testing: Moving in time](./boilerplate-part2.md#special-testing-moving-in-time)
  - [Special testing: Mainnet Forking](./boilerplate-part2.md#special-testing-mainnet-forking)

## Resources

- a slightly more complex [solidity-boilerplate](https://github.com/defi-wonderland/solidity-boilerplate) by defi-wonderland

## Contributing

Current maintainers are [Liu Ye](https://github.com/Franklinliu) and [Palina Tolmach](https://github.com/polinatolmach).

Thanks for the contribution from [Alex Xiong](https://github.com/alxiong), [Gwyneth Ang](https://github.com/GwynethAXY), and [Dr. Sourav Gupta](https://github.com/sgsourav).

Feel free to submit issues or PR for bugs or other requests.
