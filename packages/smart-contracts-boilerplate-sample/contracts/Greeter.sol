// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Greeter {
  string public greeting;
  address public whoAddress = address(0x008ba1f109551bd432803012645ac136ddd64dba72);
  IERC20 private _dai;

  event GreetingUpdated(string _new, address setter, uint256 amount);

  constructor(string memory _greeting) {
    console.log('Deploying a Greeter with greeting:', _greeting);
    greeting = _greeting;
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public payable {
    console.log('Changing greeting from', greeting, 'to', _greeting);
    require(msg.value >= 1 ether, 'minimal donation is 1 ether');
    greeting = _greeting;
    emit GreetingUpdated(_greeting, msg.sender, msg.value);
  }

  // extremely dangerous setter, anyone can call. demo purposes only.
  function setDaiAddress(address daiAddr) external {
    _dai = IERC20(daiAddr);
  }

  // donate 10 DAI to WHO to change the greeting
  function setGreetingWithDai(string memory _greeting) external {
    require(_dai.allowance(msg.sender, address(this)) >= 10, 'approve at least 10 DAI first');
    greeting = _greeting;
    _dai.transferFrom(msg.sender, whoAddress, 10);
  }
}
