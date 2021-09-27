//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Greeter {
  string public greeting;
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
}
