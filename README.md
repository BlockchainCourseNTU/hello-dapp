# "Hello dApp!" Development Workshop

> MVP (Minimal Viable Preparation) for dApp developers.

This is a one-stop hands-on tutorial for first-time Ethereum application developers.

- [Warm up](./warmup.md)
- [Hardhat 101](#hardhat-101)
- [Smart Contracts Boilerplate](#smart-contracts-boilerplate)
- [Resources](#resources)
- [Contributing](#contributing)

## Hardhat 101

In this section, we aim to familiarize you with a powerful and modern development tool [`hardhat`](https://github.com/nomiclabs/hardhat).
Since we only need the basics to kick-start our own project, going through the ["Getting Started" section ](https://hardhat.org/getting-started/) of the official documentation is strongly recommended.

Make a new folder to play with hardhat basics:

```sh
# make sure you are in project root
mkdir -p packages/hardhat-101/ && cd packages/hardhat-101/

# then proceed with hardhat installation: https://hardhat.org/getting-started/#installation
```

## Smart contracts boilerplate

In this section, we aim to build a boilerplate for all your future Solidity projects by gradually introducing essential hardhat plugins and npm packages that are useful and widely used in the development cycle.

- [Building Smart Contract Project Boilerplate](./boilerplate.md#building-smart-contract-project-boilerplate)
  - [Prerequisites](./boilerplate.md#prerequisites)
  - [Hardhat Typescript sample project](./boilerplate.md#hardhat-typescript-sample-project)
    - [Add TypeScript support](./boilerplate.md#add-typescript-support)
  - [Add `OpenZeppelin` dependency](./boilerplate.md#add-openzeppelin-dependency)
  - [Add code formatting and linting](./boilerplate.md#add-code-formatting-and-linting)
  - [Add test coverage](./boilerplate.md#add-test-coverage)
  - [Add gas reporter](./boilerplate.md#add-gas-reporter)
  - [Add commit lint and git hooks](./boilerplate.md#add-commit-lint-and-git-hooks)
  - [Add `TypeChain` support](./boilerplate.md#add-typechain-plugin)
  - [Add deployment plugins](./boilerplate.md#add-deployment-plugins)

## Resources

- a slightly more complex [solidity-boilerplate](https://github.com/defi-wonderland/solidity-boilerplate) by defi-wonderland

## Contributing

Current maintainers are [Alex Xiong](https://github.com/alxiong), [Gwyneth Ang](https://github.com/GwynethAXY), and [Dr. Sourav Gupta](https://github.com/sgsourav).
Feel free to submit issues or PR for bugs or other requests.
