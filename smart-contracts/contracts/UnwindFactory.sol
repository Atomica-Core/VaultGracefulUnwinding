pragma solidity 0.6.2;

import "./Unwind.sol";
import "./WithOperator.sol";

contract UnwindFactory is WithOperator {
    event LogNewDistributor(address unwind, address beneficiary, uint256 period, uint256 fee, bool flat);
    event LogNewService(bytes32 name, address addr);
    event LogNewToken(bytes32 ilk, address addr);

    mapping(bytes32 => address) public services;
    mapping(bytes32 => address) public tokens;

    constructor() public WithOperator() {}

    function register(bytes32 name, address addr) external onlyOperator {
        services[name] = addr;
        emit LogNewService(name, addr);
    }

    function registerToken(bytes32 ilk, address addr) external onlyOperator {
        tokens[ilk] = addr;
        emit LogNewToken(ilk, addr);
    }

    function lookup(bytes32 name) external view returns (address addr) {
        addr = services[name];
    }

    function lookupToken(bytes32 ilk) external view returns (address addr) {
        addr = tokens[ilk];
    }

    function join(
        uint256 period,
        uint256 fee,
        bool flat
    ) public {
        Unwind u = new Unwind(address(this), msg.sender, period, fee, flat);
        emit LogNewDistributor(address(u), msg.sender, period, fee, flat);
    }
}
