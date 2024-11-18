// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { StakingVault } from "../StakingVault.sol";

// @dev WARNING: This is for testing purposes only
contract StakingVaultMock is StakingVault {
    constructor(
        address _token,
        address _lzEndpoint,
        address _delegate
    ) StakingVault(_token, _lzEndpoint, _delegate) {}
}
