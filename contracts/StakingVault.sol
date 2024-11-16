// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFTAdapter } from "@layerzerolabs/oft-evm/contracts/OFTAdapter.sol";

/// @notice ERC4626 vault wrapper
contract StakingVault is OFTAdapter {
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
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Approve(address indexed user, uint256 amount);

    constructor(
        address _token,
        address _lzEndpoint,
        address _delegate
    ) OFTAdapter(_token, _lzEndpoint, _delegate) Ownable(_delegate) {}

    /// @notice Approve the sUSDe contract to spend USDe on behalf of the user
    /// @param user Approving user
    /// @param amount Amount to be approved for sUSDe to stake USDe
    function approveStaking(address user, uint256 amount) external{
        emit Approve(user, amount);
    }

    /// @notice Stake USDe by calling deposit from Ethena
    /// @param amount USDe amount to be staked
    function stake(uint256 amount) external {
        require(amount > 0, "Amount should be greater than 0.");

        totalStakedAmount += amount;
        userStake[msg.sender] += amount;
        // calls burn/lock, which burns token fromt the specified user's wallet
        // calls safeTransferFrom for token
        _debit(
            msg.sender,
            amount,
            0,
            CHAIN_EID_SEPOLIA
        );

        emit Staked(msg.sender, amount);
    }

    /// @notice Stake USDe by calling deposit from Ethena
    /// @param amount  USDe amount to be withdrawn
    function unstake(uint256 amount) external {
        totalStakedAmount -= amount;
        userStake[msg.sender] -= amount;
        // calls mint/unlock: credits token to specified user address
        // calls safeTransfer for token
        _credit(
            msg.sender,
            amount,
            CHAIN_EID_SEPOLIA
        );
        emit Unstaked(msg.sender, amount);
    }
}
