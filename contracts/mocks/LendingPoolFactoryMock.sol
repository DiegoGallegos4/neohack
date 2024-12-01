// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import "../BankFactory.sol";

contract LendingPoolFactoryMock is BankFactory {
    constructor() BankFactory() {}

    // Mock function to manipulate pool index for testing
    function setPoolIdx(uint256 _idx) external {
        poolIdx = _idx;
    }

    // Mock function to set name to index mapping
    function setNameToIndex(string memory _name, uint256 _idx) external {
        nameToIndex[_name] = _idx;
    }

    // Mock function to directly add a pool to the pools array
    function addPool(LendingPool _pool) external {
        pools.push(_pool);
    }

    // Mock function to set pool state
    function setPoolState(uint256 _poolId, bool _state) external {
        pools[_poolId].setPoolState(_state);
    }

    // Mock function to get pools length
    function getPoolsLength() external view returns (uint256) {
        return pools.length;
    }
}
