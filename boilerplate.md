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

## Add deployment plugins

## Add commit lint and git hooks

```

```

```

```
