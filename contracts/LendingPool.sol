// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ISUSDE is IERC20 {
    function deposit(uint256, address) external;

    function unstake(address) external;

    function cooldownAssets(uint256) external;
}

contract LendingPool is ReentrancyGuard, Ownable {
    ERC20 public usde;
    address internal constant SUSDeContract = 0x1B6877c6Dac4b6De4c5817925DC40E2BfdAFc01b;

    struct Pool {
        uint256 targetAmount; // Maximum amount that can be deposited
        uint256 totalDeposits; // Total amount deposited
        uint256 availableAmount; // Amount available for staking/distribution
        uint256 totalStaked; // Amount currently staked
        uint256 totalDistributed; // Amount distributed to institution
        uint256 stakingRewards; // Rewards from USDE staking
        uint256 fundingEndTime;
        uint256 distributionEndTime;
        uint256 repaymentEndTime;
        uint256 lendingRate; // APY for depositors (in basis points)
        uint256 borrowingRate; // APY for institution (in basis points)
        uint256 installments; // Number of distribution installments
        bool isActive;
    }

    struct Institution {
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 installmentsPaid;
        mapping(uint256 => uint256) installments; // Track each installment amount
        mapping(uint256 => uint256) repayments; // Track each repayment
    }

    struct UserInfo {
        uint256 depositAmount;
        uint256 rewardsEarned;
        uint256 rewardsClaimed;
        uint256 lastUpdateTime;
    }

    Pool public pool;
    Institution public institution;

    mapping(address => UserInfo) public userInfo;
    mapping(uint256 => uint256) public installmentTimestamps;

    event Deposited(address indexed depositor, uint256 amount);
    event Staked(uint256 amount, uint256 newTotalStaked, uint256 newAvailableAmount);
    event Unstaked(uint256 amount, uint256 newTotalStaked, uint256 newAvailableAmount);
    event DistributedToInstitution(uint256 amount);
    event Repaid(uint256 amount);
    event RewardsClaimed(address indexed depositor, uint256 amount);
    event TargetReached();
    event InstallmentDistributed(uint256 installmentNumber, uint256 amount, uint256 timestamp);
    event RepaymentReceived(uint256 repaymentNumber, uint256 amount, uint256 timestamp);
    event StakingCooldownInitiated(uint256 timestamp);

    constructor(
        address _usde,
        uint256 _targetAmount,
        uint256 _fundingDuration,
        uint256 _distributionDuration,
        uint256 _repaymentDuration,
        uint256 _lendingRate,
        uint256 _borrowingRate
    ) Ownable(msg.sender) {
        usde = ERC20(_usde);
        pool.targetAmount = _targetAmount;
        pool.fundingEndTime = block.timestamp + _fundingDuration;
        pool.distributionEndTime = pool.fundingEndTime + _distributionDuration;
        pool.repaymentEndTime = pool.distributionEndTime + _repaymentDuration;
        pool.lendingRate = _lendingRate;
        pool.borrowingRate = _borrowingRate;
        pool.isActive = true;
    }

    modifier onlyDuringFunding() {
        require(block.timestamp <= pool.fundingEndTime, "Funding period ended");
        _;
    }

    modifier onlyDuringDistribution() {
        require(block.timestamp <= pool.distributionEndTime, "Distribution period ended");
        require(block.timestamp > pool.fundingEndTime, "Distribution period not started");
        _;
    }

    modifier onlyDuringRepayment() {
        require(block.timestamp <= pool.repaymentEndTime, "Repayment period ended");
        require(block.timestamp > pool.distributionEndTime, "Repayment period not started");
        _;
    }

    function receiveAndApprove(uint256 _amount) internal {
        // transfer token from user to smart contract
        usde.transferFrom(msg.sender, address(this), _amount);
        //approve SUSDe contract to transfer the required amount of tokens
        usde.approve(SUSDeContract, _amount);
    }

    function deposit(uint256 _amount) external nonReentrant onlyDuringFunding {
        require(_amount > 0, "Amount must be greater than 0");
        require(pool.totalDeposits + _amount <= pool.targetAmount, "Target amount exceeded");

        UserInfo storage user = userInfo[msg.sender];
        user.depositAmount += _amount;
        user.lastUpdateTime = block.timestamp;

        pool.totalDeposits += _amount;
        pool.availableAmount += _amount;

        // Transfer USDE from user to contract
        usde.transferFrom(msg.sender, address(this), _amount);

        if (pool.totalDeposits == pool.targetAmount) {
            emit TargetReached();
        }

        emit Deposited(msg.sender, _amount);
    }

    function stake(uint256 _amount) external onlyOwner {
        require(pool.isActive, "Pool not active");
        require(_amount <= pool.availableAmount, "Insufficient available amount");

        //receiveAndApprove
        receiveAndApprove(_amount);

        // Stake in USDE
        ISUSDE(SUSDeContract).deposit(_amount, address(this));

        pool.totalStaked += _amount;

        emit Staked(_amount, pool.totalStaked, pool.availableAmount);
    }

    function unstake(uint256 _amount, address receiver) external onlyOwner {
        require(pool.totalStaked >= _amount, "Insufficient staked amount");

        // Unstake from USDE
        ISUSDE(SUSDeContract).unstake(receiver);

        pool.totalStaked -= _amount;

        // Transfer back to bank
        usde.transfer(owner(), _amount);

        emit Unstaked(_amount, pool.totalStaked, pool.availableAmount);
    }

    function initiateStakingCooldown(uint256 _amount) external onlyOwner {
        ISUSDE(SUSDeContract).cooldownAssets(_amount);
        emit StakingCooldownInitiated(block.timestamp);
    }

    function distributeToInstitution(uint256 _amount) external onlyOwner onlyDuringDistribution {
        require(_amount <= pool.availableAmount, "Insufficient available amount");

        uint256 installmentNumber = institution.installmentsPaid + 1;

        // Update pool tracking
        pool.availableAmount -= _amount;
        pool.totalDistributed += _amount;

        // Update institution tracking
        institution.totalBorrowed += _amount;
        institution.installments[installmentNumber] = _amount;
        institution.installmentsPaid++;
        installmentTimestamps[installmentNumber] = block.timestamp;

        emit InstallmentDistributed(installmentNumber, _amount, block.timestamp);
        emit DistributedToInstitution(_amount);
    }

    function repay(uint256 _amount) external nonReentrant onlyDuringRepayment {
        require(_amount > 0, "Amount must be greater than 0");

        uint256 repaymentNumber = institution.installmentsPaid;

        // Update tracking
        institution.totalRepaid += _amount;
        institution.repayments[repaymentNumber] = _amount;
        pool.availableAmount += _amount;

        emit RepaymentReceived(repaymentNumber, _amount, block.timestamp);
        emit Repaid(_amount);
    }

    function calculateRewards(address _depositor) public view returns (uint256) {
        UserInfo storage user = userInfo[_depositor];
        return (user.depositAmount * pool.lendingRate) / 100;
    }

    function claimRewards() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");
        require(reward <= pool.availableAmount, "Insufficient available amount for rewards");

        // Update tracking
        user.rewardsEarned += reward;
        user.rewardsClaimed += reward;
        pool.availableAmount -= reward;

        emit RewardsClaimed(msg.sender, reward);
    }

    function getPoolStatus()
        external
        view
        returns (
            uint256 targetAmount,
            uint256 totalDeposits,
            uint256 availableAmount,
            uint256 totalStaked,
            uint256 totalDistributed,
            uint256 stakingRewards
        )
    {
        return (
            pool.targetAmount,
            pool.totalDeposits,
            pool.availableAmount,
            pool.totalStaked,
            pool.totalDistributed,
            pool.stakingRewards
        );
    }

    function getInstitutionStatus()
        external
        view
        returns (uint256 totalBorrowed, uint256 totalRepaid, uint256 installmentsPaid)
    {
        return (institution.totalBorrowed, institution.totalRepaid, institution.installmentsPaid);
    }

    function getUserInfo(
        address _user
    )
        external
        view
        returns (uint256 depositAmount, uint256 rewardsEarned, uint256 rewardsClaimed, uint256 lastUpdateTime)
    {
        UserInfo memory user = userInfo[_user];
        return (user.depositAmount, user.rewardsEarned, user.rewardsClaimed, user.lastUpdateTime);
    }

    function setPoolActive(bool _status) external onlyOwner {
        pool.isActive = _status;
    }
}
