# DevWorkshop
This workshop aims to equip students with the knowledge relevent for building a decentralized application using the waffle-hardhat-ethers.js dev-stack.

## Step 0: Prerequisite
1. Check if you have node:
    ```
    node -v
    ```
    I am using 12.18.3. If you do not have node, download [here](https://nodejs.org/en/download/).

2. Check if you have npm:
    ```
    npm -v
    ```
    I am using 6.14.6. You should have npm if you have node installed.

3. Check if you have npx:
    ```
    npx -v
    ```
    I am using 6.14.6.
    If your npm version is < 5.2.0, npx would not have been automatically installed. Run `npm install -g npx`

## Step 1: Installing Hardhat
1. Create a working directory for this workshop.


2. Hardhat uses local installation in the project. To install it, we first have to create an npm project in the empty folder.
    ```
    npm init
    ```
    Best practice: Run this command in the root directory of your project
    This command creates [package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) file – contains metadata and information about project's packages and dependencies. You will be asked for the following, use the defaults for now (you can change it in future): name, version, description, entry point, test command, git repository, keywords, author, license.

3. Install Hardhat
    ```
    npm install --save-dev hardhat
    ```
4. Bootstrap Hardhat project:
    ```
    npx hardhat
    ```
    Select 'Create an empty hardhat.config.js'. You should see a file "hardhat.config.js" created.
5. Create directories for contracts, tests and scripts
    ```
    mkdir contracts test scripts
    ```  

## Step 2: Set Up Testing Environment

1. Install Waffle, Chai and Ethers.

    Tests in Waffle are written using Mocha alongside with Chai. Waffle matchers only work with Chai.
    Ethers is a ...
    ```
    npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
    ```

## Step 3: Our First Smart Contract

Create a few directories to hold your project files:
```
mkdir contracts test scripts
```
