pragma solidity 0.6.2;

contract WithOperator {
    event LogNewOperator(address operator);

    address public operator;

    modifier onlyOperator() {
        require(msg.sender == operator, "ERROR::ACCESS_DENIED");
        _;
    }

    constructor() internal {
        _setOperator(msg.sender);
    }

    function changeOperator(address _newOperator) external onlyOperator {
        _setOperator(_newOperator);
    }

    function _setOperator(address _operator) internal {
        operator = _operator;
        emit LogNewOperator(operator);
    }
}
