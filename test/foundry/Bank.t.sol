// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/LendingPool.sol";
import "../../contracts/BankFactory.sol";

contract LendingPoolTest is Test {
    LendingPool public lendingPool;
    BankFactory public bank;
    IERC20 public usde;
    address lendingPoolAddress;

    address constant USDE_ADDRESS = 0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696; // Replace with the actual USDE contract address
    address constant INSTITUTION_ADDRESS = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Replace with your institution address
    address constant DEPOSITOR = 0x7D4e2d9D7cf03199D5E41bAB5E9930a8d9A44FD7; // Replace with the depositor's address
    address constant OWNER = 0x7D4e2d9D7cf03199D5E41bAB5E9930a8d9A44FD7; // Replace with the depositor's address
    uint256 private constant INITIAL_DEPOSIT = 5 * 1e18; // 100 USDE

    function setUp() public {
        usde = IERC20(USDE_ADDRESS);
        bank = new BankFactory();

        // Deploy the LendingPool contract
        // lendingPool = new LendingPool(
        //     USDE_ADDRESS,
        //     1000 * 1e18, // Target amount
        //     7 days, // Funding duration
        //     30 days, // Distribution duration
        //     180 days, // Repayment duration
        //     500, // Lending rate (5%)
        //     1000, // Borrowing rate (10%)
        //     INSTITUTION_ADDRESS
        // );

        lendingPoolAddress = bank.createNewPool(
            OWNER,
            "pool",
            USDE_ADDRESS,
            1000 * 1e18, // Target amount
            7 days, // Funding duration
            30 days, // Distribution duration
            180 days, // Repayment duration
            500, // Lending rate (5%)
            1000, // Borrowing rate (10%)
            INSTITUTION_ADDRESS
        );
        lendingPool = LendingPool(lendingPoolAddress);

        vm.startPrank(OWNER);
        usde.approve(address(lendingPool), INITIAL_DEPOSIT);
        bank.changePoolState("pool", true);
        vm.stopPrank();
    }

    function testDeposit() public {
        vm.startPrank(DEPOSITOR);
        lendingPool.deposit(INITIAL_DEPOSIT);
        vm.stopPrank();

        // Check balances
        (uint256 depositAmount, , , , ) = lendingPool.getUserInfo(DEPOSITOR);
        assertEq(depositAmount, INITIAL_DEPOSIT, "Deposit amount mismatch");

        assertEq(usde.balanceOf(address(lendingPool)), INITIAL_DEPOSIT, "USDE balance mismatch in LendingPool");
    }

    function testStake() public {
        uint256 stakeAmount = 1 * 1e18; // Stake 1 USDE

        vm.startPrank(OWNER);
        bank.stakeToken("pool", stakeAmount);
        vm.stopPrank();

        (, , , uint256 totalStaked, , ) = lendingPool.getPoolStatus();
        assertEq(totalStaked, stakeAmount, "Staked amount mismatch");
    }

    function testDistributeToInstitution() public {
        uint256 distributeAmount = 1 * 1e18; // Distribute 1 USDE

        vm.startPrank(OWNER);
        bank.distributeToken("pool", distributeAmount);
        vm.stopPrank();

        (, uint256 availableAmount, , uint256 totalDistributed, , ) = lendingPool.getPoolStatus();
        assertEq(totalDistributed, distributeAmount, "Total distributed mismatch");
        assertEq(availableAmount, INITIAL_DEPOSIT - distributeAmount, "Available amount mismatch");
    }

    function testRepayment() public {
        uint256 repaymentAmount = 1 * 1e18; // Repay 1 USDE

        vm.startPrank(DEPOSITOR);
        lendingPool.repay(repaymentAmount);
        vm.stopPrank();

        (uint256 totalRepaid, , ) = lendingPool.getInstitutionStatus();
        assertEq(totalRepaid, repaymentAmount, "Total repayment mismatch");
    }
}
