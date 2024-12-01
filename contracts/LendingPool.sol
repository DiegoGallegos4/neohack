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

/**
 * @title LendingPool
 * @dev This contract manages a lending pool where users can deposit assets, they get staked and rewards are earned.
 * The contract allows the owner to control the pool state, while users can deposit, claim rewards, and participate .
 * It also supports borrowing and repayment functionality for institutions.
 */
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
        address institutionAccount; // Address to receive funds
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
        bool rewardInActive;
    }

    Pool public pool;
    Institution public institution;

    mapping(address => UserInfo) public userInfo;
    mapping(uint256 => uint256) public installmentTimestamps;

    /// @notice Emitted when a user deposits an amount into the pool.
    /// @param depositor The address of the user depositing funds.
    /// @param amount The amount of tokens deposited.
    event Deposited(address indexed depositor, uint256 amount);

    /// @notice Emitted when an amount is staked in the USDE contract.
    /// @param amount The amount of tokens staked.
    /// @param newTotalStaked The updated total amount staked in the pool.
    /// @param newAvailableAmount The updated available amount of tokens in the pool.
    event Staked(uint256 amount, uint256 newTotalStaked, uint256 newAvailableAmount);

    /// @notice Emitted when an amount is unstaked from the USDE contract.
    /// @param amount The amount of tokens unstaked.
    /// @param newTotalStaked The updated total amount staked in the pool after the unstaking.
    /// @param newAvailableAmount The updated available amount of tokens in the pool after the unstaking.
    event Unstaked(uint256 amount, uint256 newTotalStaked, uint256 newAvailableAmount);

    /// @notice Emitted when tokens are distributed to the institution.
    /// @param amount The amount of tokens distributed.
    event DistributedToInstitution(uint256 amount);

    /// @notice Emitted when a repayment is received from the institution.
    /// @param amount The amount of tokens repaid.
    event Repaid(uint256 amount);

    /// @notice Emitted when a user claims their rewards.
    /// @param depositor The address of the user claiming the rewards.
    /// @param amount The amount of rewards claimed.
    event RewardsClaimed(address indexed depositor, uint256 amount);

    /// @notice Emitted when the target deposit amount is reached.
    event TargetReached();

    /// @notice Emitted when an installment is distributed to the institution.
    /// @param installmentNumber The installment number being distributed.
    /// @param amount The amount of tokens distributed in the installment.
    /// @param timestamp The timestamp when the installment is distributed.
    event InstallmentDistributed(uint256 installmentNumber, uint256 amount, uint256 timestamp);

    /// @notice Emitted when a repayment is received for a specific installment.
    /// @param repaymentNumber The repayment number being received.
    /// @param amount The amount of tokens repaid for the installment.
    /// @param timestamp The timestamp when the repayment is received.
    event RepaymentReceived(uint256 repaymentNumber, uint256 amount, uint256 timestamp);

    /// @notice Emitted when staking cooldown is initiated.
    /// @param timestamp The timestamp when the staking cooldown is initiated.
    event StakingCooldownInitiated(uint256 timestamp);

    /**
     * @dev Initializes the LendingPool contract with the necessary parameters.
     * The constructor sets up the USDE token address, the target amount for deposits,
     * funding duration, distribution duration, repayment duration, lending and borrowing rates,
     * and the institution's account address. It also calculates the end times for the funding,
     * distribution, and repayment periods.
     *
     * @param _usde The address of the USDE token contract.
     * @param _targetAmount The maximum target amount that can be deposited into the pool.
     * @param _fundingDuration The duration of the funding period in seconds.
     * @param _distributionDuration The duration of the distribution period in seconds.
     * @param _repaymentDuration The duration of the repayment period in seconds.
     * @param _lendingRate The annual percentage yield (APY) for depositors, in basis points (100 = 1%).
     * @param _borrowingRate The annual percentage yield (APY) for the institution, in basis points (100 = 1%).
     * @param _institutionAccount The address of the institution receiving the distributed funds.
     */
    constructor(
        address _usde,
        uint256 _targetAmount,
        uint256 _fundingDuration,
        uint256 _distributionDuration,
        uint256 _repaymentDuration,
        uint256 _lendingRate,
        uint256 _borrowingRate,
        address _institutionAccount
    ) Ownable(msg.sender) {
        usde = ERC20(_usde);
        pool.targetAmount = _targetAmount;
        pool.fundingEndTime = block.timestamp + _fundingDuration;
        pool.distributionEndTime = pool.fundingEndTime + _distributionDuration;
        pool.repaymentEndTime = pool.distributionEndTime + _repaymentDuration;
        pool.lendingRate = _lendingRate;
        pool.borrowingRate = _borrowingRate;
        pool.isActive = true;
        pool.institutionAccount = _institutionAccount;
    }

    /**
     * @dev Modifier that restricts access to functions during the funding period.
     * Reverts if the current time is after the funding end time.
     */
    modifier onlyDuringFunding() {
        require(block.timestamp <= pool.fundingEndTime, "Funding period ended");
        _;
    }

    /**
     * @dev Modifier that restricts access to functions during the distribution period.
     * Reverts if the current time is after the distribution end time or before the funding period ends.
     */
    modifier onlyDuringDistribution() {
        require(block.timestamp <= pool.distributionEndTime, "Distribution period ended");
        require(block.timestamp > pool.fundingEndTime, "Distribution period not started");
        _;
    }

    /**
     * @dev Modifier that restricts access to functions during the repayment period.
     * Reverts if the current time is after the repayment end time or before the distribution period ends.
     */
    modifier onlyDuringRepayment() {
        require(block.timestamp <= pool.repaymentEndTime, "Repayment period ended");
        require(block.timestamp > pool.distributionEndTime, "Repayment period not started");
        _;
    }

    /**
     * @dev Internal function that allows the contract to receive tokens from the user and approve
     * the SUSDe contract to transfer the specified amount of tokens.
     * @param _amount The amount of tokens to transfer and approve.
     */
    function receiveAndApprove(uint256 _amount) internal {
        // transfer token from user to smart contract
        usde.transferFrom(msg.sender, address(this), _amount);
        //approve SUSDe contract to transfer the required amount of tokens
        usde.approve(SUSDeContract, _amount);
    }

    /**
     * @dev Allows users to deposit tokens into the pool during the funding period.
     * Emits the `Deposited` event after a successful deposit, and the `TargetReached` event
     * if the target deposit amount is met.
     * @param _amount The amount of tokens to deposit.
     */
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

    /**
     * @dev Allows the owner to stake a specified amount of tokens into the pool by transferring
     * tokens to the contract, approving the SUSDe contract, and then depositing them.
     * Emits the `Staked` event after a successful stake.
     * @param _amount The amount of tokens to stake.
     */
    function stake(uint256 _amount) external onlyOwner {
        require(pool.isActive, "Pool not active");
        require(_amount <= pool.availableAmount, "Insufficient available amount");

        //receiveAndApprove
        receiveAndApprove(_amount);

        // Stake in USDE
        ISUSDE(SUSDeContract).deposit(_amount, address(this));

        pool.totalStaked += _amount;
        pool.availableAmount -= _amount;

        emit Staked(_amount, pool.totalStaked, pool.availableAmount);
    }

    /**
     * @dev Allows the owner to unstake a specified amount of tokens from the pool. The contract
     * unstakes from the SUSDe contract, and the tokens are transferred back to the owner.
     * Emits the `Unstaked` event after a successful unstake.
     * @param _amount The amount of tokens to unstake.
     */
    function unstake(uint256 _amount) external onlyOwner {
        require(pool.totalStaked >= _amount, "Insufficient staked amount");

        // Unstake from USDE
        ISUSDE(SUSDeContract).unstake(address(this));

        pool.totalStaked -= _amount;
        pool.availableAmount += _amount;

        // Transfer back to bank
        usde.transfer(owner(), _amount);

        emit Unstaked(_amount, pool.totalStaked, pool.availableAmount);
    }

    /**
     * @dev Initiates the staking cooldown for the specified amount of tokens in the SUSDe contract.
     * This function is only callable by the owner.
     * Emits the `StakingCooldownInitiated` event upon successful initiation.
     * @param _amount The amount of tokens to initiate the cooldown for.
     */
    function initiateStakingCooldown(uint256 _amount) external onlyOwner {
        ISUSDE(SUSDeContract).cooldownAssets(_amount);
        emit StakingCooldownInitiated(block.timestamp);
    }

    /**
     * @dev Distributes a specified amount of tokens to the institution during the distribution period.
     * This function is only callable by the owner and during the distribution phase.
     * The amount must not exceed the available pool amount.
     * Emits the `InstallmentDistributed` and `DistributedToInstitution` events upon successful distribution.
     * @param _amount The amount of tokens to distribute.
     */

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

        //transfer token
        usde.transfer(pool.institutionAccount, _amount);
        emit InstallmentDistributed(installmentNumber, _amount, block.timestamp);
        emit DistributedToInstitution(_amount);
    }

    /**
     * @dev Allows the owner to receive repayments from the institution during the repayment period.
     * This function is only callable by the owner and during the repayment phase.
     * It requires that the amount to be repaid is greater than zero.
     * Emits the `RepaymentReceived` and `Repaid` events upon successful repayment.
     * @param _amount The amount of tokens to repay.
     */
    function repay(uint256 _amount) external nonReentrant onlyDuringRepayment {
        require(_amount > 0, "Amount must be greater than 0");

        uint256 repaymentNumber = institution.installmentsPaid;

        // Update tracking
        institution.totalRepaid += _amount;
        institution.repayments[repaymentNumber] = _amount;

        //transfer from user to bank
        usde.transferFrom(msg.sender, owner(), _amount);

        emit RepaymentReceived(repaymentNumber, _amount, block.timestamp);
        emit Repaid(_amount);
    }

    /**
     * @dev Calculates the rewards for a specified depositor based on their deposit amount and the pool's lending rate.
     * The reward is calculated as the deposit amount multiplied by the lending rate, divided by 100.
     * @param _depositor The address of the depositor for whom to calculate the rewards.
     * @return The calculated reward for the depositor.
     */

    function calculateRewards(address _depositor) public view returns (uint256) {
        return (userInfo[_depositor].depositAmount * pool.lendingRate) / 100;
    }

    /**
     * @dev Allows a depositor to claim their accumulated rewards.
     * The function checks that the depositor has rewards to claim, that there are enough funds available in the pool,
     * and that the reward has not already been claimed. Upon success, the rewards are transferred to the depositor's address,
     * and the necessary state variables are updated.
     * Emits the `RewardsClaimed` event upon successful reward transfer.
     */

    function claimRewards() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");
        require(reward <= pool.availableAmount, "Insufficient available amount for rewards");
        require(!user.rewardInActive, "Reward already claimed");

        // Update tracking
        user.rewardsEarned += reward;
        user.rewardsClaimed += reward;
        pool.availableAmount -= reward;

        usde.transfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    /**
     * @dev Retrieves the current status of the pool, including target amount, total deposits,
     * available amount, total staked, total distributed, and staking rewards.
     * @return targetAmount The target deposit amount for the pool.
     * @return totalDeposits The total amount deposited into the pool.
     * @return availableAmount The amount currently available in the pool.
     * @return totalStaked The total amount staked in the pool.
     * @return totalDistributed The total amount distributed to the institution.
     * @return stakingRewards The total amount of staking rewards.
     */

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

    /**
     * @dev Retrieves the current status of the institution, including the total amount borrowed,
     * total amount repaid, and the number of installments paid.
     * @return totalBorrowed The total amount borrowed by the institution.
     * @return totalRepaid The total amount repaid by the institution.
     * @return installmentsPaid The number of installments that have been paid by the institution.
     */

    function getInstitutionStatus()
        external
        view
        returns (uint256 totalBorrowed, uint256 totalRepaid, uint256 installmentsPaid)
    {
        return (institution.totalBorrowed, institution.totalRepaid, institution.installmentsPaid);
    }

    /**
     * @dev Retrieves the information of a specific user, including their deposit amount, rewards earned,
     * rewards claimed, last update time, and whether their reward is active.
     * @param _user The address of the user whose information is to be retrieved.
     * @return depositAmount The amount deposited by the user.
     * @return rewardsEarned The total rewards earned by the user.
     * @return rewardsClaimed The total rewards claimed by the user.
     * @return lastUpdateTime The last time the user's information was updated.
     * @return rewardInActive A boolean indicating whether the user's reward is currently active (claimed or not).
     */

    function getUserInfo(
        address _user
    )
        external
        view
        returns (
            uint256 depositAmount,
            uint256 rewardsEarned,
            uint256 rewardsClaimed,
            uint256 lastUpdateTime,
            bool rewardInActive
        )
    {
        UserInfo memory user = userInfo[_user];
        return (user.depositAmount, user.rewardsEarned, user.rewardsClaimed, user.lastUpdateTime, user.rewardInActive);
    }

    /**
     * @dev Allows the owner to set the active state of the pool. If set to false, the pool becomes inactive,
     * and no further deposits, staking, or distributions can occur.
     * @param _state The new state of the pool, where `true` activates the pool and `false` deactivates it.
     */

    function setPoolState(bool _state) external onlyOwner {
        pool.isActive = _state;
    }
}
