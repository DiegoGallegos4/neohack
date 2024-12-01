// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { OFTAdapter } from "@layerzerolabs/oft-evm/contracts/OFTAdapter.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// are there any errors in this code?

/// @notice ERC4626 vault wrapper
contract StakingVault is Ownable, OFTAdapter, ReentrancyGuard {
    // -- Constants ---
    // Ethena Sepolia network addresses
    address internal constant USDeContract = 0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696;
    address internal constant SUSDeContract = 0x1B6877c6Dac4b6De4c5817925DC40E2BfdAFc01b;

    uint32 constant CHAIN_EID_BLE = 52085143;
    uint32 constant CHAIN_EID_SEPOLIA = 11155111;

    // --- Instance variable ---
    // Amount staked per user
    mapping(address => uint256) public userStake;
    // Total amount staked in protocol
    uint256 public totalStakedAmount;

    ///// Events

    event Staked(address indexed user, uint256 amount, uint256 newTotalStake);
    event Unstaked(address indexed user, uint256 amount, uint256 newTotalStake);

    event Approve(address indexed user, uint256 amount);

    constructor(
        address _token,
        address _lzEndpoint,
        address _delegate
    ) OFTAdapter(_token, _lzEndpoint, _delegate) Ownable(_delegate) {}

    function receiveAndApprove(uint256 _amount) internal {
        // transfer token from user to smart contract
        ERC20(USDeContract).transferFrom(msg.sender, address(this), _amount);
        //approve SUSDe contract to transfer the required amount of tokens
        ERC20(USDeContract).approve(SUSDeContract, _amount);
    }

    /// @notice Stake USDe by calling deposit from Ethena
    /// @param amount USDe amount to be staked

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount should be greater than 0.");
        require(IERC20(USDeContract).allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        totalStakedAmount += amount;
        userStake[msg.sender] += amount;
        //receive tokens from user and approve SUSDeContract
        receiveAndApprove(amount);

        // calls burn/lock, which burns token fromt the specified user's wallet
        // calls safeTransferFrom for token
        _debit(msg.sender, amount, 0, CHAIN_EID_SEPOLIA);
        emit Staked(msg.sender, amount, totalStakedAmount);
    }

    /// @notice Stake USDe by calling deposit from Ethena
    /// @param amount  USDe amount to be withdrawn
    function unstake(uint256 amount) external {
        require(amount > 0, "Amount should be greater than 0");
        require(userStake[msg.sender] >= amount, "Insufficient stake balance");

        totalStakedAmount -= amount;
        userStake[msg.sender] -= amount;
        // calls mint/unlock: credits token to specified user address
        // calls safeTransfer for token

        _credit(msg.sender, amount, CHAIN_EID_SEPOLIA);
        emit Unstaked(msg.sender, amount, totalStakedAmount);
    }

    // --- View functions ---
    /// @notice Get the staked amount for a specific user
    /// @param user Address of the user
    /// @return Amount of USDe tokens staked by the user
    function getUserStake(address user) external view returns (uint256) {
        return userStake[user];
    }

    /// @notice Check if a user has sufficient stake
    /// @param user Address of the user
    /// @param amount Amount to check against
    /// @return bool True if user has sufficient stake
    function hasSufficientStake(address user, uint256 amount) external view returns (bool) {
        return userStake[user] >= amount;
    }
}
