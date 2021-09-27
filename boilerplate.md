# Building Smart Contract Project Boilerplate

⚠ make sure you already read through [Hardhat 101](README.md#hardhat-101) before moving on.️

> 💡 note on folder structure: we use [monorepo](https://en.wikipedia.org/wiki/Monorepo) to manages our smart contract and front-end code. Concretely, we use [`lerna`](https://lerna.js.org/) which by default
> keeps all codebases under `./packages/` folder.

- [Prerequisites](#prerequisites)
- [Hardhat Typescript sample project](#hardhat-typescript-sample-project)
  - [Add TypeScript support](#add-typescript-support)
- [Add `OpenZeppelin` dependency](#add-openzeppelin-dependency)
- [Add code formatting and linting](#add-code-formatting-and-linting)
- [Add test coverage](#add-test-coverage)
- [Add gas reporter](#add-gas-reporter)
- [Add commit lint and git hooks](#add-commit-lint-and-git-hooks)
  - [Contract boilerplate as its separate repo](#contract-boilerplate-as-its-separate-repo)
  - [Contract boilerplate as one of the packages in a monorepo](#contract-boilerplate-as-one-of-the-packages-in-a-monorepo)
- [Add `TypeChain` plugin](#add-typechain-plugin)
- [Add deployment plugins](#add-deployment-plugins)
  - [deploying to localhost and test against deployed contracts](#deploying-to-localhost-and-test-against-deployed-contracts)
  - [deploying to live testnet or mainnet](#deploying-to-live-testnet-or-mainnet)
- [Troubleshooting](#troubleshooting)
  - [`yarn add` failed inside a workspace/package](#yarn-add-failed-inside-a-workspacepackage)

## Prerequisites

Check the following installation:

- [`node.js` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm): preferably the latest LTS version of `node`: `node@14.17.6`.
- [`yarn`](https://classic.yarnpkg.com/en/docs/install/)

Learn the following languages:

- `Solidity`
  - The most recommended tutorial is [CryptoZombies](https://cryptozombies.io/), at least Curriculum 1~4.
  - Or read the official [Solidity doc](https://docs.soliditylang.org/en/latest/index.html) for more details.
- `TypeScript`
  - If you've never wrote any TypeScript before, we strongly recommend [the "TypeScript Handbook"](https://www.typescriptlang.org/docs/handbook/intro.html).
  - Regardless of whether you come from an OOP language like Java or C#, or a functional language like Haskell or ML, or a hybrid language like Go, Rust or Scala, you should take a look at their ["Getting started section"](https://www.typescriptlang.org/docs/handbook/intro.html#get-started).
  - Main reasons for our nudging to `TypeScript` over `JavaScript` is its dominant popularity and superior protection against many common JS caveats via its type systems. (see [StackOverflow's 2021 survey](https://insights.stackoverflow.com/survey/2021#technology-most-loved-dreaded-and-wanted), or [state of JS](https://2020.stateofjs.com/en-US/technologies/javascript-flavors/#javascript_flavors_experience_ranking) for yourself)

## Hardhat Typescript sample project

Create a new package and initialize with a basic sample Hardhat project (in JS).

```sh
mkdir -p packages/smart-contracts-boilerplate && cd packages/smart-contracts-boilerplate
npx hardhat # then choose the basic sample project
```

### Add TypeScript support

The following steps are almost verbatim from the [official doc](https://hardhat.org/guides/typescript.html) except we use `yarn` as our package manager.

1. Remove `package-lock.json` and use `yarn` instead. You should be able to see a `yarn.lock` file being generated.

   ⚠ you are only removing `package-lock.json`, NOT `package.json`. Your `yarn` still replies on `package.json` to install all dependencies and other tasks.

   ```sh
   rm package-lock.json
   yarn

   ```

2. Install the following `npm` packages:

   ```sh
   yarn add --dev ts-node typescript chai @types/node @types/mocha @types/chai
   ```

3. Rename `hardhat.config.js` to `hardhat.config.ts`

   ```sh
   mv hardhat.config.js hardhat.config.ts
   ```

   and update the file, please refer to the [doc here](https://hardhat.org/config/#available-config-options),
   if you don't understand some of the configurations specified below.

   ```typescript
   import { task, HardhatUserConfig } from "hardhat/config";
   import "@nomiclabs/hardhat-waffle";

   task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
     const accounts = await hre.ethers.getSigners();
     for (const account of accounts) {
       console.log(account.address);
     }
   });

   const config: HardhatUserConfig = {
     defaultNetwork: "hardhat",
     paths: {
       sources: "./contracts",
       tests: "./test",
       artifacts: "./build/artifacts",
       cache: "./build/cache",
     },
     solidity: {
       compilers: [
         {
           version: "0.8.0",
           settings: {
             optimizer: {
               enabled: true,
               runs: 200,
             },
           },
         },
       ],
     },
     mocha: {
       timeout: 20000,
     },
   };

   export default config;
   ```

4. Add a [`tsconfig.json`](./packages/smart-contracts-boilerplate-sample/tsconfig.json) file, (learn more about what it does [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html))

   ```json
   {
     "compilerOptions": {
       "target": "es2019",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "resolveJsonModule": true,
       "outDir": "dist",
       "baseUrl": "."
     },
     "include": ["./scripts", "./test"],
     "files": ["./hardhat.config.ts"]
   }
   ```

5. For convenience, introduce the following scripts in `package.json`:

   ```json
   {
     "scripts": {
       "compile": "yarn hardhat compile",
       "test": "yarn compile && yarn hardhat test"
     }
   }
   ```

   Now, run `yarn compile`, you should be able to successfully compile your contracts. Woohoo! 🎉

   Notice there's `artifiacts/` and `cache/` folders being created, both of which are git ignored, and if you dig into `artifiacts/contracts/Greeter.sol/Greeter.json`, you will see an ABI spec of the compiled contract.

6. Finally, let's rename our test file:

   ```sh
   mv test/sample-test.js test/greeter.spec.ts
   rm scripts/sample-script.js # we don't use this
   ```

   Now run `yarn test`, you should see your test passing!

   ```sh
     Greeter
   Deploying a Greeter with greeting: Hello, world!
   Changing greeting from 'Hello, world!' to 'Hola, mundo!'
    ✓ Should return the new greeting once it's changed (415ms)

    1 passing (416ms)

    ✨ Done in 1.84s.
   ```

   Notice "Deploying a Greeter with greeting: Hello, world!" is actually being `console.log` from the contract constructor! This is super nice for debugging purposes, and thanks to `hardhat/console.sol` for enabling this feature.

## Add `OpenZeppelin` dependency

As demonstrated in CryptoZombies' tutorial or most other Solidity tutorials, [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) are a set of community vetted, widely used library.

1. Install these contracts in your dependencies
   ```sh
   yarn add @openzeppelin/contracts
   ```
2. To verify that we can import the OpenZeppelin library, add the following line to your `contract/Greeter.sol`

   ```sol
   import "@openzeppelin/contracts/utils/math/SafeMath.sol";

   ```

   Then run `yarn compile`. If it compiled successfully, as it should, then it means you now have `OpenZeppelin` dependency installed.

## Add code formatting and linting

We use [`solhint`](https://github.com/protofire/solhint) for linting Solidity contract code, [`prettier`](https://prettier.io/docs/en/index.html) for formatting TypeScript/Javascript/Solidity code,
and [`sort-package-json`](https://github.com/keithamus/sort-package-json) for sorting dependencies declaration in alphabetical order.

> If you wondering "linter v.s. Formatter", please [read here](https://prettier.io/docs/en/comparison.html).

1. Add those tools to `devDependencies`

   ```sh
   yarn add --dev solhint prettier sort-package-json solhint-plugin-prettier prettier-plugin-solidity
   ```

2. Add Solidity linting rules in a new file `.solhint.json`, see explanations for these configs and a complete list [here](https://github.com/protofire/solhint#rules).

   ```json
   {
     "extends": "solhint:recommended",
     "plugins": ["prettier"],
     "rules": {
       "prettier/prettier": "error",
       "compiler-version": ["off"],
       "constructor-syntax": "warn",
       "quotes": ["error", "single"],
       "func-visibility": ["warn", { "ignoreConstructors": true }],
       "not-rely-on-time": "off",
       "private-vars-leading-underscore": ["warn", { "strict": false }]
     }
   }
   ```

3. Add format rules in a new file `.prettierrc`, see explanations for these configs and a complete list [here](https://prettier.io/docs/en/options.html). The *.sol rules adhere to the [solididty style guide](https://docs.soliditylang.org/en/latest/style-guide.html).

   ```json
   {
     "overrides": [
       {
         "files": "**.sol",
         "options": {
           "printWidth": 99,
           "tabWidth": 2,
           "useTabs": false,
           "singleQuote": true,
           "bracketSpacing": false
         }
       },
       {
         "files": ["**.ts", "**.js"],
         "options": {
           "printWidth": 145,
           "tabWidth": 2,
           "semi": true,
           "singleQuote": true,
           "useTabs": false,
           "endOfLine": "auto"
         }
       },
       {
         "files": "**.json",
         "options": {
           "tabWidth": 2,
           "printWidth": 200
         }
       }
     ]
   }
   ```

   We further specify a list of files that we don't want format in a new file `.prettierignore`

   ```text
   # General
   .prettierignore
   .solhintignore
   .husky
   .gitignore
   .gitattributes
   .env.example
   .env
   workspace.code-workspace
   .DS_STORE
   codechecks.yml

   # Hardhat
   coverage
   coverage.json
   build
   deployments
   dist

   # JS
   node_modules
   package-lock.json
   yarn.lock

   # Solidity
   contracts/mock
   ```

4. Add the following scripts to `package.json`

   ```json
   {
     "scripts": {
       "lint": "yarn solhint 'contracts/**/*.sol' && yarn prettier --check './**'",
       "lint:fix": "yarn sort-package-json && yarn prettier --write './**' && yarn solhint --fix 'contracts/**/*.sol'"
     }
   }
   ```

   Now run `yarn lint`, you should see a bunch of error reported and justifications or hints to fix them:

   ```
   contracts/Greeter.sol
   4:8   error    Replace "hardhat/console.sol" with 'hardhat/console.sol'                                                            prettier/prettier
   4:8   error    Use single quotes for string literals                                                                               quotes
   5:8   error    Replace "@openzeppelin/contracts/utils/math/SafeMath.sol" with '@openzeppelin/contracts/utils/math/SafeMath.sol'    prettier/prettier
   5:8   error    Use single quotes for string literals                                                                               quotes
   8:1   error    Delete ··                                                                                                           prettier/prettier
   8:5   warning  'greeting' should start with _                                                                                      private-vars-leading-underscore
   10:1   error    Delete ··                                                                                                           prettier/prettier
   11:5   error    Replace ····console.log("Deploying·a·Greeter·with·greeting:" with console.log('Deploying·a·Greeter·with·greeting:'  prettier/prettier
   11:21  error    Use single quotes for string literals                                                                               quotes
   12:1   error    Replace ········ with ····                                                                                          prettier/prettier
   13:3   error    Delete ··                                                                                                           prettier/prettier
   15:1   error    Delete ··                                                                                                           prettier/prettier
   16:5   error    Delete ····                                                                                                         prettier/prettier
   17:3   error    Delete ··                                                                                                           prettier/prettier
   19:1   error    Replace ···· with ··                                                                                                prettier/prettier
   20:1   error    Delete ····                                                                                                         prettier/prettier
   20:21  error    Use single quotes for string literals                                                                               quotes
   21:1   error    Replace ········ with ····                                                                                          prettier/prettier
   22:1   error    Delete ··                                                                                                           prettier/prettier

    ✖ 19 problems (18 errors, 1 warning)
   ```

   A quick way to fix is running `yarn lint:fix`.

   After which you might still see some warning and errors that our linters can't make decisions on how to fix them.
   Go to `contract/Greeter.sol`, change line 8 to `string public greeting;`, change line 20 to `console.log('Changing greeting from', greeting, 'to', _greeting);`.

   Now run `yarn lint` again, there should be no errors left.

## Add test coverage

We use [`solidity-coverage` plugin](https://hardhat.org/plugins/solidity-coverage.html) for test coverage report.

1. Install dependency
   ```sh
   yarn add --dev solidity-coverage
   ```
2. Update `hardhat.config.ts`:
   ```typescript
   import "solidity-coverage";
   ```
3. Add a new script command in `package.json`:

   ```json
   {
     "scripts": {
       "coverage": "hardhat coverage"
     }
   }
   ```

   Then run `yarn coverage`, you should get:

   ```
   --------------|----------|----------|----------|----------|----------------|
   File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
   --------------|----------|----------|----------|----------|----------------|
   contracts/    |      100 |      100 |      100 |      100 |                |
   Greeter.sol   |      100 |      100 |      100 |      100 |                |
   --------------|----------|----------|----------|----------|----------------|
   All files     |      100 |      100 |      100 |      100 |                |
   --------------|----------|----------|----------|----------|----------------|
   > Istanbul reports written to ./coverage/ and ./coverage.json
   > ✨ Done in 5.15s.

   ```

4. Finally add coverage related artifacts to your `.gitignore` file
   ```
   # Coverage
   coverage
   coverage.json
   ```

## Add gas reporter

We use [`hardhat-gas-reporter` plugin](https://hardhat.org/plugins/hardhat-gas-reporter.html) for gas consumption report.

Normally we don't want to see gas reports on every test run, therefore we only enable it with an environment variable `REPORT_GAS`.
To set temporary env variable only in the context of a command, we use [`cross-env`](https://www.npmjs.com/package/cross-env).

In step 5 below, we further use [`dotenv`](https://www.npmjs.com/package/dotenv) to get secret/local variables from `.env` file.

1. Install dependencies
   ```sh
   yarn add --dev hardhat-gas-reporter cross-env dotenv
   ```
2. Add configuration to your `hardhat.config.ts`, see the list of [configuration options](https://hardhat.org/plugins/hardhat-gas-reporter.html#options).

   ```typescript
   import "hardhat-gas-reporter";
   const config: HardhatUserConfig = {
     // ...
     gasReporter: {
       currency: "USD",
       enabled: process.env.REPORT_GAS ? true : false,
       showMethodSig: true,
       onlyCalledMethods: false,
     },
   };
   ```

3. Add a new script command to `package.json`

   ```json
   {
     "scripts": {
       "gas": "cross-env REPORT_GAS=1 yarn hardhat test"
     }
   }
   ```

4. Run `yarn gas` to get a gas report from our tests run.

5. Optionally, if you want to get an actual market price, we integrate with [CoinMarketCap's API](https://coinmarketcap.com/api/pricing/) (Free tier is more than enough for personal use).

   Copy the [`.env.example`] file and paste it into your own `.env` file, fill in your CoinMarketCap API key:

   ```
   COINMARKETCAP_API_KEY=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx
   ```

   Jump back to `hardhat.config.ts`, add the following extra configuration:

   ```typescript
   import * as dotenv from "dotenv";
   dotenv.config();

   const config: HardhatUserConfig = {
     // ...
     gasReporter: {
       // ...
       coinmarketcap: process.env.COINMARKETCAP_API_KEY,
     },
   };
   ```

   Run `yarn gas` again, and you shall see the USD cost.

   ```
   ·------------------------------------|---------------------------|-------------|-----------------------------·
   |        Solc version: 0.8.0         ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
   ·····································|···························|·············|······························
   |  Methods                           ·               74 gwei/gas               ·       2868.09 usd/eth       │
   ·············|·······················|·············|·············|·············|···············|··············
   |  Contract  ·  Method               ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
   ·············|·······················|·············|·············|·············|···············|··············
   |  Greeter   ·  greet()              ·          -  ·          -  ·          -  ·            0  ·          -  │
   ·············|·······················|·············|·············|·············|···············|··············
   |  Greeter   ·  greeting()           ·          -  ·          -  ·          -  ·            0  ·          -  │
   ·············|·······················|·············|·············|·············|···············|··············
   |  Greeter   ·  setGreeting(string)  ·          -  ·          -  ·      34658  ·            2  ·       7.36  │
   ·············|·······················|·············|·············|·············|···············|··············
   |  Deployments                       ·                                         ·  % of limit   ·             │
   ·····································|·············|·············|·············|···············|··············
   |  Greeter                           ·          -  ·          -  ·     422738  ·        1.4 %  ·      89.72  │
   ·------------------------------------|-------------|-------------|-------------|---------------|-------------·

   ```

   > Be aware of [a bug](https://github.com/cgewecke/eth-gas-reporter/issues/254) from upstream in `hardhat-gas-report`, if you don't see the price reporting, it's most likely due to this bug.

## Add contract sizer

1. Install dependencies
   ```sh
   yarn add --dev hardhat-contract-sizer
   ```
2. Add configuration to your `hardhat.config.ts`, see the list of [configuration options](https://hardhat.org/plugins/hardhat-gas-reporter.html#options).

   ```typescript
   import "hardhat-contract-sizer";
   const config: HardhatUserConfig = {
     // ...
     contractSizer: {
      alphaSort: true,
      disambiguatePaths: false,
      runOnCompile: true,
      strict: true,
    }
   };
   ```

3. Add a new script command to `package.json`

   ```json
   {
     "scripts": {
       "size": "yarn hardhat size-contracts"
     }
   }
   ```

4. Run `yarn size` to get the contract size report for our compiled contract. Alternatively, you should also see thereport when you do `yarn compile`.

## Add commit lint and git hooks

To enforce standardized, conventional commit messages, we use [`commitlint`](https://github.com/conventional-changelog/commitlint).
We recommend skimming through ["benefits of commitlint"](https://github.com/conventional-changelog/commitlint#benefits-using-commitlint) first if you haven't used it before.
Apparently, you should read the [conventional rules](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) that your future commit messages should adhere to.

To lint our commit message upon each `git commit`, we need to create [git hooks](https://git-scm.com/docs/githooks), for that we use [`husky`](https://github.com/typicode/husky).
For avid explorers, you can read this [blog post](https://blog.typicode.com/husky-git-hooks-javascript-config/) to understand some design decisions of `husky`.

⚠ If you're running from the cloned `hello-dapp` repo, then you can skip this section as `commitlint` and `husky` hooks had been configured already.
Else if you are building a contract package in your own monorepo, then you should add `husky` in root `package.json` instead.

Choose one of the two depending on your project setup:

- [Contract boilerplate as its separate repo](#contract-boilerplate-as-its-separate-repo)
- [Contract boilerplate as one of the packages in a monorepo](#contract-boilerplate-as-one-of-the-packages-in-a-monorepo)

### Contract boilerplate as its separate repo

1. Install dependencies
   ```sh
   # Install commitlint cli and conventional config
   yarn add --dev @commitlint/config-conventional @commitlint/cli husky
   ```
2. Configure `commitlint` to use conventional config
   ```sh
   echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
   ```
   Activate/initialize `husky` (one-time):
   ```sh
   npx husky-init && yarn
   ```
   And you should be able to see a `.husky/pre-commit` file created for you.
3. First modify `.husky/pre-commit` file to run linting instead:

   ```
    #!/bin/sh
    . "$(dirname "$0")/_/husky.sh"

    yarn lint:fix
   ```

   Then add a new hook to ensure proper commit message:

   ```sh
   # ensure proper commit messages
   npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
   ```

### Contract boilerplate as one of the packages in a monorepo

⚠ Again, if you're running from the cloned `hello-dapp` repo, then you can skip this section as `commitlint` and `husky` hooks had been configured already.

1. Go back to Monorepo project root, then run

   ```sh
   yarn add --dev @commitlint/config-conventional @commitlint/cli husky
   echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

   # enable Git hooks
   yarn husky install

   # ensure correct format and linting before commit
   yarn husky add .husky/pre-commit 'yarn lint:fix'
   git add .husky/pre-commit

   # ensure proper commit messages
   yarn husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
   git add .husky/commit-msg
   ```

   Add the following lines to `package.json` in monorepo's root:

   ```json
   {
     "scripts": {
       "lint": "yarn lerna run lint",
       "lint:fix": "yarn lerna run lint:fix"
     }
   }
   ```

   Done. Go ahead and try commit with some bad error message such as `foo blah did something`, the hooks should prevent you from committing. 🛡️

## Add `TypeChain` plugin

Next stop, we add a super helpful tool called [`TypeChain`](https://github.com/dethcrypto/TypeChain) to our project template.
The one-liner pitch is "automatically generate TypeScript bindings for smart contracts".

What that means is, when writing tests or later on writing deployment scripts, we are likely to invoke functions or query getters defined in our contracts.
Right now it doesn't seem a hustle to remember each function signature (i.e. the function name and input/output parameters and their types) since our toy `Greeter.sol` is simple;
but what if our contracts get complicated with dozens of functions?
Wouldn't it be handy the auto-completion engine in your editor/IDE knows these function signatures and offer you rich type information as you code? -- that's what `TypeChain` provides!

While `TypeChain` works with many other frameworks, we will be using its `Hardhat` plugin 👷.

1. Install dependencies, (we use `waffle+ethers.js` stack)

   ```sh
   yarn add --dev typechain @typechain/hardhat @typechain/ethers-v5
   ```

2. Ensure you have the following imports in `hardhat.config.ts`:

   ```typescript
   import "@typechain/hardhat";
   import "@nomiclabs/hardhat-ethers";
   import "@nomiclabs/hardhat-waffle";
   ```

   Add `TypeChain` plugin related configuration, more [docs here](https://github.com/dethcrypto/TypeChain/tree/master/packages/hardhat#configuration):

   ```typescript
   const config: HardhatUserConfig = {
     // ...
     typechain: {
       outDir: "typechained",
       target: "ethers-v5",
     },
   };
   ```

   Run `yarn compile`, upon completion, you should be able to see a newly generated `typechained/` folder which contains TypeScript types info of your smart contracts.

   💡 a bit explanation here: by default, all the types artifacts generated would be outputted to `typechain/`.
   The primarily reason we customize it to `outDir: typechained` is to avoid confusion between importing from `@typechaind` v.s. importing from an npm package named `@typechain`.

3. To enable internal types import similarly to a published package, we update our `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@typechained": ["typechained/index"]
       }
     }
   }
   ```

4. Finally, jump to your `test/greeter.spec.ts` and change to the following (pay attention to `NOTICE HERE` comments):

   ```typescript
   import { expect } from "chai";
   import { ethers } from "hardhat";
   // NOTICE HERE: import autogenerated types
   import { Greeter, Greeter__factory } from "@typechained";

   describe("Greeter", function () {
     // NOTICE HERE: we can give our contract a `Greeter` type!! instead of an `any` type.
     let greeter: Greeter;
     let greeterFactory: Greeter__factory;

     beforeEach(async () => {
       greeterFactory = (await ethers.getContractFactory(
         "Greeter"
       )) as Greeter__factory;
       greeter = await greeterFactory.deploy("Hello, world!");
     });

     it("Should return the new greeting once it's changed", async function () {
       // NOTICE HERE: try type this yourself, your IDE's auto-completion should suggest available
       // functions of `greeter` as you type.
       await greeter.deployed();

       expect(await greeter.greet()).to.equal("Hello, world!");

       const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

       // wait until the transaction is mined
       await setGreetingTx.wait();

       expect(await greeter.greet()).to.equal("Hola, mundo!");
     });
   });
   ```

   Note: without the customized path declaration in the last step, you can still import types via relative path `import { Greeter } from '../typechaind/index';` -- but it is (arguably) not as nice as our import style which treats `@typechaind` as just another package.

## Add deployment plugins

Now with smart contracts written and locally tested, it's time for live testnet/mainnet deployments, for which we use [`hardhat-deploy` plugin](https://github.com/wighawag/hardhat-deploy/tree/master).

💡 tips: most steps below offer only minimum clarifications, you are strongly recommended to read the `README` of the `hardhat-deploy` repo for more under-the-hood explanations and other available setup options for more complicated deployment flows.
Also when lost, try to find [template/example deployment setups here](https://github.com/wighawag/template-ethereum-contracts).

### deploying to localhost and test against deployed contracts

1. Install dependencies

   ```sh
   yarn add --dev hardhat-deploy
   ```

2. Update `hardhat.config.ts`

   ```typescript
   import "hardhat-deploy";
   const config: HardhatUserConfig = {
     // ...
     networks: {
       hardhat: {
         chainId: 1337, // temporary for MetaMask support: https://github.com/MetaMask/metamask-extension/issues/10290
       },
     },
     paths: {
       // ...
       deploy: "./scripts/deploy",
     },
     namedAccounts: {
       deployer: {
         default: 0, // by default, take the first account as deployer
         rinkeby: "0x5238A644636946963ffeDAc52Ec53fb489D3a1CD", // on rinkeby, use a specific account
       },
     },
   };
   ```

   - To use `scripts/deploy/` as the folder for all deployment scripts (personal preference, you can also go with default path which is `deploy/`, [see doc here](https://github.com/wighawag/hardhat-deploy/tree/master#3-extra-hardhatconfig-paths-options)),
   - The default `chainId` of `hardhat` network and `localhost` network are `31337`, but we can change it to something else (as long as not colliding with others). Specifically, due to [a MetaMask compatibility issue](https://github.com/MetaMask/metamask-extension/issues/10290), we change it `1337`.
   - The differences between `hardhat` and `localhost` is roughly: the latter is a separate, long-running process where changes made to it can be persistent locally across scripts and invocations; whereas the former is usually an ephemeral session (e.g. when you run fresh tests) that would shut down once scripts are done running (changes to the network are not persistent).
   - We "named" the first account as the `deployer`, (to get the full list of accounts hardhat generated for you, run `yarn hardhat accounts` task). When pushing to testnet or main net, we usually use one of our accounts in our MetaMask wallet with safer, protected private key.

3. Create a new deployment script `./scripts/deploy/001-Greeter.deploy.ts`:

   ```typescript
   import { HardhatRuntimeEnvironment } from "hardhat/types";
   import { DeployFunction } from "hardhat-deploy/types";

   export const INITIAL_GREET: { [chainId: string]: string } = {
     "1337": "Bonjour localhost!",
     "4": "Guten tag, Rinkeby!",
   };

   const deployFunc: DeployFunction = async (
     hre: HardhatRuntimeEnvironment
   ) => {
     const { deployer } = await hre.getNamedAccounts();
     const chainId = await hre.getChainId();

     await hre.deployments.deploy("Greeter", {
       from: deployer,
       args: [INITIAL_GREET[chainId]],
       log: true,
     });
   };
   deployFunc.tags = ["Greeter"];

   export default deployFunc;
   ```

   Note on the filename: as [documented here](https://github.com/wighawag/hardhat-deploy/tree/master#the-deploy-task), when you later run `yarn deploy --network <NETWORK>`, hardhat will "scan for files in alphabetical order and execute them in turn".
   If your deployment workflow is straightforwardly in a sequential order, then naming your deployment scripts using `xxx-<contract/purpose>.deploy.ts` where `xxx` dictates the order, would be sufficient.
   However, if your deployment workflow is more complicated with library linking or inter-dependencies or even conditional deployments, then you should check out [`DeployFunction`'s `skip`, `dependencies`, and `runAtTheEnd` fields here](https://github.com/wighawag/hardhat-deploy/tree/master#deploy-scripts) as well as
   [library linking](https://github.com/wighawag/hardhat-deploy/tree/master#handling-contract-using-libraries) config.

   Then add this to your `package.json` for slightly shorthanded commands:

   ```json
   {
     "scripts": {
       "deploy": "yarn hardhat deploy"
     }
   }
   ```

4. Now, first start a local node in a new terminal window: `yarn hardhat node`, you should see `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`.

   Jump to another terminal session, run `yarn deploy --network localhost`, you should see our `Greeter.sol` successfully deployed.

   ```
   web3_clientVersion
   Contract deployment: Greeter
   Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
   Transaction:         0xf87999b7500e0ded42ddd10982e458c7fbcc054fd82fcaad893f45c2ecc037b8
   From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
   Value:               0 ETH
   Gas used:            542532 of 542532
   Block #1:            0x13b50db64e9e7120d870078b9b41f802c908161145cf1cf92e9ce32e35d80fd2

   eth_chainId
   eth_accounts (2)
   eth_chainId (2)
   eth_getTransactionByHash
   eth_blockNumber
   eth_chainId
   ```

   - Just for experimentation, you can try to run the same deployment script again, you will see `hardhat` by default won't create a duplicated contract `reusing "Greeter" at 0x5FbDB2315678afecb367f032d93F642f64180aa3` -- this is a clear indication that our changes made to our local blockchain are persistent.
   - You should a new folder `deployemnts/` generated, go ahead and explore what's inside.

5. Finally, let's try to test against our deployed contract.
   Copy [`test-local-deployed-greeter.ts`](./packages/smart-contracts-boilerplate-sample/scripts/test-local-deployed-greeter.ts) to your `scripts/test-local-deployed-greeter.ts`.

   Run

   ```sh
   yarn hardhat run ./scripts/test-local-deployed-greeter.ts --network localhost
   ```

   You should see our `assert((await greeter.greet()) === 'Bonjour localhost!')` passed! If you want, you can also try `console.log(greeterDeployment.address)` which would print the same address shown in the last step.

### deploying to live testnet or mainnet

Now you are ready for deploying to live [test|main] networks under your MetaMask accounts.

1. We will need to use our Alchemy hosted endpoints for live testnet access, and use wallet mnemonic (the master secret seed) to derive and sign our deployment transactions.
   If you haven't set up Alchemy, please refer to [warm up](./warmup.md#setup-alchemy).

   First, create a new file at your `utils/network.ts` and copy [this file](./packages/smart-contracts-boilerplate-sample/utils/network.ts) over.

   Update your `hardhat.config.ts` to use alchemy endpoints for `rinkeby` testnet, and use your own mnemonic (i.e. your MetaMask wallet) to send transactions:

   ```typescript
   import { nodeUrl, accounts } from "./utils/network";
   const config: HardhatUserConfig = {
     networks: {
       hardhat: {
         chainId: 1337, // temporary for MetaMask support: https://github.com/MetaMask/metamask-extension/issues/10290
       },
       localhost: {
         url: nodeUrl("localhost"),
       },
       rinkeby: {
         url: nodeUrl("rinkeby"),
         accounts: accounts("rinkeby"),
       },
       // can configure other networks, see examples:
       // https://github.com/wighawag/template-ethereum-contracts/blob/main/hardhat.config.ts
     },
   };
   ```

2. Run
   ```sh
   cp .env.example .env
   ```
   Edit your `.env` file by filling your API tokens and wallet mnemonic.
3. Run

   ```sh
   yarn deploy --network rinkeby
   ```

   You should see (be patient, this might take some time):

   ```
   deploying "Greeter" (tx: 0x41ef031e20b772de6b43a820e1ffdfc80b3d7fbdb978a75d13dee7a1b554f237)...: deployed at 0xD4deB045fb89E750864a7349087A6674C1E79F78 with 542664 gas
   ✨  Done in 71.73s.
   ```

   You should be able to see your transactions and deployed contracts on Etherscan. For example I have switched my MetaMask to my second account, then ran the deploy command to `rinkeby`, you can find my transaction [here](https://rinkeby.etherscan.io/tx/0x41ef031e20b772de6b43a820e1ffdfc80b3d7fbdb978a75d13dee7a1b554f237).

💡 The best practice is you version control (git commit) your `deployments/` artifacts for discovery, reference and consistency during migrations.

## Troubleshooting

### `yarn add` failed inside a workspace/package

If you are using monorepo like `lerna` and `yarn workspaces`, then make sure:

1. specified in `lerna.json` in your monorepo root, something like:

   ```json
   {
     "npmClient": "yarn",
     "useWorkspaces": true,
     "packages": ["packages/*"],
     "version": "independent"
   }
   ```

2. in all of your `packages/*/package.json`, you have specified a `version` field
