// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error FundingExceeded();
error DistributionExceeded();
error FundAlreadyDistributed();
error RewardsAlreadyDistributed();
error Unauthorized();
// Allows anyone to contribute
// Allows for distrubiton of funds
// Funds are distributed based on advances
// Funds are distributed to a single recipient
// Only owner can distribute
contract FundingPool {
    address public owner;
    string public name;
    address[] public funders;
    uint256 public objectiveAmount;
    uint256 public distributedAmount;
    uint256 public fundedAmount;
    uint256 public internalRateOfReturn;
    address payable public fundRecipient;

    mapping(address => uint256) funds;
    mapping(address => uint256) distributedFunds;
    mapping(address => uint256) rewards;
    bool public distributed;

    event FundingAdded(address indexed funder, uint256 indexed amount);
    event DistributeFunds(address indexed recipient, uint256 indexed amount);

    constructor(string memory _name, address _owner) {
        owner = _owner;
        name = _name;
    }

    modifier onlyOwner {
        require(msg.sender != owner);
        _;
    }

    function distribute(uint256 amount) external onlyOwner {
        if (distributed) {
            revert FundAlreadyDistributed();
        }

        if (distributedAmount + amount > objectiveAmount) {
            revert DistributionExceeded();
        }

        // TODO: unstake
        // TODO: add to rewards

        (bool ok, ) = address(fundRecipient).call{ value: amount }("");
        require(ok, "Transfer failed");
        distributedAmount += amount;

        if (distributedAmount == objectiveAmount) {
            distributed = true;
        }
    }

    function distributeRewards() public {

    }

    function changeFundRecipient(address recipient) external onlyOwner {
        if (msg.sender != owner) {
            revert Unauthorized();
        }

        fundRecipient = payable(recipient);
    }

    function _fund() internal {
        if (objectiveAmount > fundedAmount + msg.value) {
            revert FundingExceeded();
        }

        funds[msg.sender] += msg.value;
        fundedAmount += msg.value;

        // TODO: stake
    }

    receive() payable external {
        _fund();
    }
}