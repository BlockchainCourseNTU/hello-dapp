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
