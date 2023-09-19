# MVP Project for Blockchain Course of NTU in AY2022-2023
---
This project demonstrates a minimal viable preparation for dApp construction using Hardhat developement framework.
It comes with a `Lock` contract, a simple web app that can deploy contract to the blockchain and user can interact with the running contract.

### Prerequisite
* npx. https://www.npmjs.com/package/npx
* nodejs. https://nodejs.org/en/download/package-manager/
* npm.  https://nodejs.org/en/download/package-manager/
* Chrome browser.
* MetaMask wallet. https://chrome.google.com/webstore/category/extensions -> search "metamask", then add the extension to your chrome browser.
The tested setup on Ubuntu 20.04 LTS is:
```
apt install -y nodejs npm 
npm install -g npx
```

### Quick start

Step 1. clone the git repo and then install all the dependent packages.
```
git clone https://github.com/BlockchainCourseNTU/hello-dapp.git
cd  hello-dapp/hello-dapp
npm install
```

Step 2. compile `Lock` contract
```
npx hardhat compile
```

Step 3. copy the compiled artifact from `artifacts/contracts/Lock.sol/Lock.json` to `webapp/src`
```
cp artifacts/contracts/Lock.sol/Lock.json webapp/src
```

Step 4. setup a blockchain test network run by hardhat node (in another terminal)
```
npx hardhat node
```

Step 5. setup our website
```
cd webapp 
npm install
npm run start
```
The website would hosted on your http://localhost:3000


More complicated examples like election dApp can refer to https://github.com/schadokar/election-ethereum-react-dapp.git.


<!-- 
Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
``` -->
