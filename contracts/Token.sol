pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC827/ERC827Token.sol";
import "./Feeless.sol";

contract Token is ERC827Token, Feeless {
  string public constant symbol = "XXX";
  string public constant name = "AToken";
  uint8 public constant decimals = 18;


  function approveAndCall(
    address _spender,
    uint256 _value,
    bytes _data
  )
    public
    payable
    feeless
    returns (bool)
  {
    require(_spender != address(this));

    allowed[msgSender][_spender] = _value;
    emit Approval(msgSender, _spender, _value);

    // solium-disable-next-line security/no-call-value
    require(_spender.call.value(msg.value)(_data));

    return true;
  }

}
