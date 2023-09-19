import detectEthereumProvider from "@metamask/detect-provider";

// // NOTE: be aware of this: https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import Web3 from "web3";

// // importing a compiled contract artifact which contains function signature etc. to interact
import artifact from "./Lock.json";
import blockchainnet from "./blockchainnet.json";

export let LockContractAddress = "0x0";


export const Testnet = blockchainnet.Testnet; 

export const TestnetRpc = blockchainnet.TestnetRpc;

const web3 = new Web3(
  Web3.currentProvider || new Web3.providers.HttpProvider(TestnetRpc)
  );
export let contract = new web3.eth.Contract(artifact.abi);

export const setLockContractAddress = (address) =>{
  LockContractAddress = address;
  contract = new web3.eth.Contract(artifact.abi, LockContractAddress);
}
// // doc here: https://web3js.readthedocs.io/en/v1.2.11/web3.html#providers
export const deployContract = async (unlockTime, _value) => {
  console.log("_value:", _value);
  // alert("unlockTime:" + unlockTime)
  const provider = await detectEthereumProvider();
  const web3 = new Web3(
    Web3.currentProvider || new Web3.providers.HttpProvider(TestnetRpc)
  );
  if (provider) {
    isLocked()
    if (provider.selectedAddress === undefined){
      await enableEthereumButton()
    }
    const chainId = await provider.request({
      method: 'eth_chainId'
    })
    console.log("chainId:"+chainId)
    console.log("provider.selectedAddress:"+provider.selectedAddress)
    const creationtx = contract.deploy({
      data: artifact.bytecode,
      arguments: [parseInt(unlockTime)]
    });
    const count = await web3.eth.getTransactionCount(provider.selectedAddress);
    console.log(provider.selectedAddress, "getTransactionCount:", count.toString(10))
    const accountNonce =
  '0x' + (parseInt(count.toString(10)) + 1).toString(16)
  //   alert(accountNonce)
    // console.log("sent amt of wei:"+ "0x"+web3.utils.toBigInt(web3.utils.toWei(parseInt(_value), "wei")).toString(16))
    console.log("sent amt of wei:"+web3.utils.toWei(parseInt(_value), "wei"));
    const txhash = await provider.request({
      method: "eth_sendTransaction",
      params: [{
        nonce: accountNonce, // ignored by MetaMask
        gasPrice: '766184446', // customizable by user during MetaMask confirmation.
        gas: '300000', // customizable by user during MetaMask confirmation.
        from: provider.selectedAddress,
        // to: LockContractAddress,
        value: web3.utils.toHex(web3.utils.toBigInt(web3.utils.toWei(parseInt(_value), "wei"))), // have to convert to hexdemical for big number
        data: creationtx.encodeABI(),
        chainId: 31337
      }, ],
    });
    console.log(txhash)
    const receipt = await web3.eth.getTransactionReceipt(txhash)
    console.log(receipt);
    const contractAddress = receipt.contractAddress;
    return contractAddress;

  } else {
    console.log("Please install MetaMask!");
  }
}

export const checkTimestampValidity = async (unlockTimestamp) => {
  // doc here: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
  const latestBlock = await web3.eth.getBlock("latest");
  const blocktimestamp = latestBlock.timestamp;
  if (web3.utils.toBigInt(unlockTimestamp) <=  blocktimestamp){
    // alert("The entered unlock timestamp " +  unlockTimestamp + " is less than the current block timestamp " + blocktimestamp.toString(10) )
    // alert("Please give right unlock timestamp.")
    return {
      "valid" :false,
      "timestamp": blocktimestamp
    }
  }else{
    return {
      "valid" :true,
      "timestamp": unlockTimestamp
    };
  }
};

export const showBlance = async (addr) => {
  // doc here: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
  const balance = await web3.eth.getBalance(addr);
  // alert(balance)
  return {
    address: addr,
    balance: balance.toString(10)
  };
};
export const unlock = async () => {
  // Using MetaMask API to send transaction
  // please read: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-provider-api
  const provider = await detectEthereumProvider();
  if (provider) {
    console.log("found provider", "provider.selectedAddress:"+provider.selectedAddress)
    const count = await web3.eth.getTransactionCount(provider.selectedAddress);
    console.log(provider.selectedAddress, "getTransactionCount:", count.toString(10))
    try{
      await provider.request({
        method: "eth_sendTransaction",
        params: [{
          gasPrice: '766184446', // customizable by user during MetaMask confirmation.
          gas: '300000', // customizable by user during MetaMask confirmation.
          from: provider.selectedAddress,
          to: LockContractAddress,
          value: '0x0', // have to convert to hexdemical for big number
          data: web3.eth.abi.encodeFunctionCall({
              name: "unlock",
              type: "function",
              inputs: [],
            },
            []
          ),
          chainId: 31337,
        }, ],
      });
      return true;
    }catch (err){
      console.log(err.message.split("RPC")[1].slice(2, -1))
      let rpc_message = JSON.parse(err.message.split("RPC")[1].slice(2, -1))
      window.alert(rpc_message.value.data.message)
      return false;
    }
  } else {
    console.log("Please install MetaMask!");
  }
};


export const withdraw = async () => {
  // Using MetaMask API to send transaction
  // please read: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-provider-api
  const provider = await detectEthereumProvider();
  if (provider) {
    console.log("found provider", "provider.selectedAddress:"+provider.selectedAddress)
    const count = await web3.eth.getTransactionCount(provider.selectedAddress);
    console.log(provider.selectedAddress, "getTransactionCount:", count.toString(10))
    try{
      let result = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          gasPrice: '766184446', // customizable by user during MetaMask confirmation.
          gas: '300000', // customizable by user during MetaMask confirmation.
          from: provider.selectedAddress,
          to: LockContractAddress,
          value: '0x0', // have to convert to hexdemical for big number
          data: web3.eth.abi.encodeFunctionCall({
              name: "withdraw",
              type: "function",
              inputs: [],
            },
            []
          ),
          chainId: 31337,
        }, ],
      });
      return true;
    }catch (err){
      // window.alert(JSON.stringify(err))
      console.log(err.message.split("RPC")[1].slice(2, -1))
      let rpc_message = JSON.parse(err.message.split("RPC")[1].slice(2, -1))
      window.alert(rpc_message.value.data.message)
      // window.alert(err.message)
      return false;
    }
  } else {
    console.log("Please install MetaMask!");
  }
};

function isLocked() {
  web3.eth.getAccounts(function (err, accounts) {
    if (err != null) {
      console.log(err)
    } else if (accounts.length === 0) {
      console.log('MetaMask is locked')
    } else {
      console.log('MetaMask is unlocked')
    }
  });
}

export const enableEthereumButton = async () =>{
  console.log("enableEthereumButton")
  const provider = await detectEthereumProvider();
  if (provider) {
      console.log("found provider", "provider.selectedAddress:"+provider.selectedAddress)
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      console.log(accounts);
      return provider.selectedAddress;
  }else{
      console.log("Please install MetaMask!");
  }
}