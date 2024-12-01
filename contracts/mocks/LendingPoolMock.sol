// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "../LendingPool.sol";

contract LendingPoolMock is LendingPool {
    constructor(
        address _owner,
        address _token,
        uint256 _targetAmount,
        uint256 _fundingDuration,
        uint256 _distributionDuration,
        uint256 _repaymentDuration,
        uint256 _lendingRate,
        uint256 _borrowingRate,
        address _institutionAccount
    )
        LendingPool(
            _token,
            _targetAmount,
            _fundingDuration,
            _distributionDuration,
            _repaymentDuration,
            _lendingRate,
            _borrowingRate,
            _institutionAccount
        )
    {}

    // Add mock functions here to manipulate time or state for testing
    function changePoolState(bool _state) external {
        pool.isActive = _state;
    }
}
