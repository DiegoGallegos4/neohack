// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import './FundingPool.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FundingFactory is Ownable {
    uint256 public poolIdx;

    mapping(string => uint256) nameToIndex;
    FundingPool[] public pools;

    event NewFundingProject(
        string name,
        address owner
    );

    constructor() Ownable(msg.sender) {}

    function createNewPool(address _owner, string memory _name) public onlyOwner returns (address)  {
        require(nameToIndex[_name] == 0, "Name has already been taken");
        FundingPool newPool = new FundingPool(_name, _owner);
        pools.push(newPool);
        
        poolIdx += 1;
        nameToIndex[_name] = poolIdx; 

        emit NewFundingProject(_name, _owner);
        return address(newPool);
    }

    function getPool(string memory _name) public view returns(address pool, string memory name) {
        FundingPool selectedPool = pools[nameToIndex[_name] - 1];
        return (address(selectedPool), selectedPool.name());
    }
}