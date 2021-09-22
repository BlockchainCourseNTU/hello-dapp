# Building Smart Contract Project Boilerplate

⚠ *make sure you already read through [Hardhat 101](#hardhat-101) before moving on.*️

> 💡 note on folder structure: we use [monorepo](https://en.wikipedia.org/wiki/Monorepo) to manages our smart contract and front end code. Concretely, we use [`lerna`](https://lerna.js.org/) which by default
> keeps all codebases under `./packages/` folder.

## Prerequisites

Check the following installation:

- [`node.js` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm): preferably the latest LTS version of `node`: `node@14.17.6`.
- [`yarn`](https://classic.yarnpkg.com/en/docs/install/)

Learn the following languages:

- `Solidity`
  - The most recommended tutorial is [CryptoZombie](https://cryptozombies.io/) at least Curriculum 1~4.
  - Or read official [Solidity doc](https://docs.soliditylang.org/en/latest/index.html) for more details.
- `TypeScript`
  - If you never wrote any TypeScript before, we strongly recommend [the "TypeScript Handbook"](https://www.typescriptlang.org/docs/handbook/intro.html).
  - Regardless of whether you come from an OOP language like Java or C#, or a functional language like Haskell or ML, or a hybrid language like Go, Rust or Scala, you should take a look at their ["Getting started"](https://www.typescriptlang.org/docs/handbook/intro.html#get-started)
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

   ```sh
   rm package-lock.json
   yarn

   ```

2. Install the following `npm` packages:

   ```sh
   yarn add -D ts-node typescript chai @types/node @types/mocha @types/chai
   ```

3. Rename `hardhat.config.js` to `hardhat.config.ts`

   ```sh
   mv hardhat.config.js hardhat.config.ts
   ```

   and update the file

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
       "test": "yarn hardhat test"
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

As demonstrated in CryptoZombie's tutorial or most other Solidity tutorials, [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) are a set of community vetted, widely used library.

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
   yarn add -D solhint prettier sort-package-json solhint-plugin-prettier prettier-plugin-solidity
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

3. Add format rules in a new file `.prettierrc`, see explanations for these configs and a complete list [here](https://prettier.io/docs/en/options.html).

   ```json
   {
     "overrides": [
       {
         "files": "**.sol",
         "options": {
           "printWidth": 145,
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
   artifacts
   cache
   typechained
   deployments

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
   yarn add -D solidity-coverage
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
   yarn add -D hardhat-gas-reporter cross-env dotenv
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

## Add deployment plugins

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
   yarn add -D @commitlint/config-conventional @commitlint/cli husky
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
   yarn add -D @commitlint/config-conventional @commitlint/cli husky
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
