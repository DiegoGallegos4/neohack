// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import './LendingPool.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPoolFactory is Ownable {
    uint256 public poolIdx;
    
    mapping(string => uint256) nameToIndex;
    LendingPool[] public pools;

    event NewLendingPool(
        string name,
        address owner,
        address poolAddress
    );

    constructor() Ownable(msg.sender) {}

    function createNewPool(
        address _owner,
        string memory _name,
        address _usde,
        uint256 _targetAmount,
        uint256 _fundingDuration,
        uint256 _distributionDuration,
        uint256 _repaymentDuration,
        uint256 _lendingRate,
        uint256 _borrowingRate
    ) public onlyOwner returns (address) {
        require(nameToIndex[_name] == 0, "Name has already been taken");
        
        LendingPool newPool = new LendingPool(
            _usde,
            _targetAmount,
            _fundingDuration,
            _distributionDuration,
            _repaymentDuration,
            _lendingRate,
            _borrowingRate
        );
        pools.push(newPool);
        
        poolIdx += 1;
        nameToIndex[_name] = poolIdx;

        emit NewLendingPool(_name, _owner, address(newPool));
        return address(newPool);
    }

    function getPool(string memory _name) public view returns(address pool) {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        return address(selectedPool);
    }
}