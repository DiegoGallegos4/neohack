// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface ILendingPool {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount, address to) external;
}

contract LendingProtocol is Ownable {
    using Math for uint256;

    struct Position {
        uint256 collateral;
        uint256 debt;
        uint256 interest;
    }

    mapping(address => Position) private positions;
    mapping(address => uint256) private liquidationFees;

    uint256 public totalBorrowed;
    uint256 public totalReserve;
    uint256 public totalDeposit;

    // ----------
    // Events
    // ----------

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Borrow(
        address indexed account,
        uint256 amountBorrowed,
        uint256 totalDebt,
        uint256 collateralAmount
    );
    event Repay(
        address indexed account,
        uint256 debtRepaid,
        uint256 debtRemaining,
        uint256 collateralAmount
    );
    event Liquidation(
        address indexed account,
        address indexed liquidator,
        uint256 collateralLiquidated,
        uint256 lastCollateralRatio,
        uint256 lastDebtOutstanding,
        uint256 protocolDebtCreated 
    );
    // protocolDebtCreated: if liquidating at < 100% col rat -> protocol takes on debt

    constructor(address _owner) Ownable(_owner) {}

    /// @notice lender approve same amount of stablecoin for contract to spend it
    /// increases the total deposit and send it to lending pool (Ethena)
    /// exchange rate (optional)
    /// mints staked stablecoing (sUSDe)
    // function bondAsset external {}

    /// @notice borrower adds collateral to the 
    function deposit(uint256 _amount) external payable {
        require(msg.value != 0, "Must be greater than 0");
        positions[msg.sender].collateral += _amount;

        emit Deposit(msg.sender, _amount);
    }
    function withdraw(uint256 _amount) public {
    }

    function borrow(uint256 _amount) public {

    }

    function repay(uint256 _amount) public {

    }

    function liquidate(address _account) public {
        
    }


}