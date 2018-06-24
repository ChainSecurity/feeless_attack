pragma solidity ^0.4.24;

import "../contracts/Token.sol";

contract TokenMock is Token {
    constructor(uint _value) public {
        balances[msg.sender] = _value;
    }
}
