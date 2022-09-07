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
      ether_amt: 0,
      lockAddress: "0x0"
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleBalance = this.handleBalance.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleUnlock = this.handleUnlock.bind(this);
    this.handleDeploy = this.handleDeploy.bind(this);
  }
  handleQueryChange = (e) => {
    this.setState({ queryInput: e.target.value });
  };
  handleEtherAmtChange = (e) =>{
    // console.log(e)
    this.setState({ether_amt: e.target.value})
  };
  updateUnlockTimestampChange = (e) => {
    // console.log(e)
    this.setState({unlockTimestamp: e.target.value})
  }

  handleQuery = async () => {
    let result = await showBlance(this.state.queryInput);
    console.log(result)
    // alert(result.address)
    // alert(result.balance)
    this.setState({
      address: result.address
    });
    this.setState({
      balance: result.balance
    })
  };
  handleBalance = (e) => {
    this.setState({ balance: e.target.value });
  };

  handleUnlock = async () => {
    let result = await unlock();
    await this.handleQuery();
    if (result){
      this.setState({statusOutput: "Unlock transaction has been processed and succeeded."})
    }else{
      this.setState({statusOutput: "Unlock transaction has been processed but failed."})
    }
  };

  handleWithdraw = async () => {
    let result = await withdraw();
    await this.handleQuery();
    if (result){
      this.setState({statusOutput: "Withdraw transaction has been processed and succeeded."})
    }else{
      this.setState({statusOutput: "Withdraw transaction has been processed but failed."})
    }
  };
  handleDeploy = async () =>{
    let result = await checkTimestampValidity(this.state.unlockTimestamp);
    console.log(result)
    if (result.valid === true){
      let lockAddress = await deployContract(this.state.unlockTimestamp, this.state.ether_amt);
      console.log(lockAddress);
      this.setState({statusOutput: "contract creation transaction has been processed and succeeded and contract address is: "+lockAddress});
      this.setState({lockAddress: lockAddress})
      setLockContractAddress(lockAddress);
    }else{
      alert("current timestamp is too low, try to use "+ result.timestamp.toString(10)+ " +100")
    }
    return;
  }

  render() {
    return (
      <>
        <h1>Welcome to Lock dApp</h1>
        <button class="enableEthereumButton" onClick={enableEthereumButton}>connect to Ethereum Network</button>
        <p>Network: {Testnet}</p>
        <p>Lock Contract Address: {this.state.lockAddress}</p>
        <input
          type="text"
          placeholder="Enter unlocked timestamp"
          onChange={this.updateUnlockTimestampChange}
        />{" "}
        <input
          type="text"
          placeholder="Enter ether amount"
          onChange={this.handleEtherAmtChange}
        />{" "}
        <input type="submit" value="Deploy Lock Contract" onClick={this.handleDeploy} />
        <hr />
        <input
          type="text"
          placeholder="Enter address to query"
          value={this.state.value}
          onChange={this.handleQueryChange}
        />{" "}
        <input type="submit" value="Query Deposit" onClick={this.handleQuery} />
        <p>
          Query Result: {this.state.address} has balance of {this.state.balance} wei
        </p>
        <hr />
        
        <input
          type="submit"
          value="Withdraw()"
          onClick={this.handleWithdraw}
        />{" "}
        <input
          type="submit"
          value="Unlock()"
          onClick={this.handleUnlock}
        />{" "}
        <p>
          Status: {this.state.statusOutput}
        </p>
      </>
    );
  }
}

export default App;