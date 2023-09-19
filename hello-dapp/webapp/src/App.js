import React from "react";
import {
  showBlance,
  withdraw,
  unlock,
  Testnet,
  deployContract,
  enableEthereumButton,
  checkTimestampValidity,
  setLockContractAddress
} from "./lock.js";
import "./App.css";
import { ReactComponent as MetaMaskIcon } from "./MetaMask.svg";

let injectedProvider = false

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true
  console.log(window.ethereum)
  console.log(window.ethereum.isMetaMask)
}
const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false
if (isMetaMask) {
  console.log("MetaMask is installed!")
}else{
  console.log("MetaMask is not installed!")
  window.alert("MetaMask is not installed!")
}
// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryInput: "",
      address: "0x0",
      balance: 0,
      statusOutput: "",
      status: "",
      unlockTimestamp: 0,
      ether_amt: 1000000000,
      lockAddress: "0x0",
      lockBalance: 0,
      wallet: undefined,
      active: false,
      date: new Date()
    };

    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleUnlock = this.handleUnlock.bind(this);
    this.handleDeploy = this.handleDeploy.bind(this);

    this.setWallet = this.setWallet.bind(this);
    this.handleConnect = this.handleConnect.bind(this);

    // update every second
    setInterval(() => {
      this.setState({
        date: new Date()
      })
    })
  }
  setWallet = (wallet) => {
    this.setState({wallet: wallet})
  }

  handleEtherAmtChange = (e) =>{
    this.setState({ether_amt: e.target.value})
  };

  updateUnlockTimestampChange = (e) => {
    this.setState({unlockTimestamp: e.target.value})
  }

  handleUnlock = async () => {
    let result = await unlock();
    // await this.handleQuery();
    if (result){
      this.setState({statusOutput: "Unlock transaction has been processed and succeeded."})
      await this.handleConnect();
    }else{
      this.setState({statusOutput: "Unlock transaction has been processed but failed."})
    }
  };

  handleWithdraw = async () => {
    let result = await withdraw();
    // await this.handleQuery();
    if (result){
      this.setState({statusOutput: "Withdraw transaction has been processed and succeeded."})
      await this.handleConnect();
    }else{
      this.setState({statusOutput: "Withdraw transaction has been processed but failed."})
    }
  };
  handleDeploy = async () =>{
    let timestamp = this.fromDateLocalString(this.state.unlockTimestamp);
    console.log(timestamp)
    let result = await checkTimestampValidity(timestamp);
    console.log(result)
    if (result.valid === true){
      let lockAddress = await deployContract(timestamp, this.state.ether_amt);
      console.log(lockAddress);
      this.setState({statusOutput: "contract creation transaction has been processed and succeeded and contract address is: "+lockAddress});
      this.setState({lockAddress: lockAddress})
      setLockContractAddress(lockAddress);
      let result = await showBlance(lockAddress);
      this.setState({
        lockBalance: result.balance
      })
      await this.handleConnect();

    }else{
      alert("current timestamp is too low, try to use "+ result.timestamp.toString(10)+ " +100")
    }
    return;
  }

  handleConnect = async () => {
    // console.log("handleConnect")
    let result = await enableEthereumButton();
    // console.log(result)
    if (result){ 
      this.setState({active: true})
      let selectedAddress = result;
      let balance = await showBlance(selectedAddress);
      this.setState({wallet: {address: selectedAddress, balance: balance.balance}})
    }
  }
  getTime = () => {
    return Math.floor(Date.now() / 1000);
  };

  getDate = () => {
    return new Date().toUTCString();
  };

  fromDateLocalString = (dateString) => {
    console.log(dateString)
    return new Date(dateString).getTime();
  }

  render() {
    return (
      <>
        <div className = "App">
      
        {/* <div className="App">
          <h2>Injected Provider { injectedProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
          { isMetaMask && 
            <button>Connect MetaMask</button>
          }
        </div> */}
        <p class = "mb-0">
        <div>
        <button type="button" id="connectStatus" style={{ backgroundColor: this.state.active ? "" : "gray" }} onClick={this.handleConnect}> <MetaMaskIcon width="50" height="50" /></button>
        </div>  
        <div><a>{this.state.active ? "connected": "not connected"}</a></div>
        </p>
        {this.state.wallet? <div><p>Address: {this.state.wallet.address}</p> <p>Balance: {this.state.wallet.balance}</p></div>: <p></p>}
        <h1>Welcome to Lock dApp</h1>
        <p>People can lock some amount of money into a Lock smart contract until a given expiration timestamp.</p>
        <p>{"Current time: " + new Date().toUTCString()}</p>
        <div>
        <p> {"How much ether (wei) do you want to lock?"}</p>
        <input
          style={{ width: "500px" }}
          type="text"
          defaultValue={this.state.ether_amt}
          placeholder={"e.g. 1000000000"}
          onChange={this.handleEtherAmtChange}
        />{" "}
        </div>
        
        <br/>
        <div>
          <p> When do you want to unlock the money? </p>
          <input
          style={{ width: "500px" }}
          type="text"
          defaultValue={this.state.date.toUTCString()}
          placeholder={this.state.date.toUTCString()}
          onChange={this.updateUnlockTimestampChange}
          />{" "}
        </div>
        
        <br/>
        <button type="submit" onClick={this.handleDeploy}> Lock </button>
        <p>Lock Contract Address: {this.state.lockAddress}</p>
        {
          this.state.lockAddress !== "UNDEFINED"?
        <p>
          {this.state.lockAddress} has {this.state.lockBalance} wei
        </p>
        : <br/>
        }
        <input
          type="submit"
          value="Withdraw your money (only after the unlock timestamp)"
          onClick={this.handleWithdraw}
          disabled = {this.state.lockAddress === "UNDEFINED"}
        />{" "}
        <br/>
        <input
          type="submit"
          value="Unlock your money (only the contract owner can do this)"
          onClick={this.handleUnlock}
          disabled = {this.state.lockAddress === "UNDEFINED"}
        />{" "}
         
        <p>
          {this.state.statusOutput}
        </p>
        


        {/* <hr />
        <input
          type="text"
          placeholder="Enter address to query"
          value={this.state.value}
          onChange={this.handleQueryChange}
        />{" "}
        <br />
        <input type="submit" value="Query Deposit" onClick={this.handleQuery} />
        <br />
        <p>
          {this.state.address} has {this.state.balance} wei
        </p>
        <hr /> */}
        </div>
      </>
    );
  }
}

export default App;