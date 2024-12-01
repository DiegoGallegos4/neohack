// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import "./LendingPool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BankFactory
 * @dev This contract is responsible for creating and managing lending pools.
 * It allows the owner to create new pools, stake and unstake tokens, distribute funds,
 * and change the state of lending pools. It also emits events for each action performed.
 */
contract BankFactory is Ownable {
    uint256 public poolIdx;

    mapping(string => uint256) nameToIndex;
    LendingPool[] public pools;

    /**
     * @dev Emitted when a new lending pool is created.
     * @param name The name of the lending pool.
     * @param owner The owner of the lending pool.
     * @param poolAddress The address of the created lending pool.
     */
    event NewLendingPool(string indexed name, address owner, address poolAddress);

    /**
     * @dev Emitted when tokens are staked into a pool.
     * @param name The name of the lending pool.
     * @param amount The amount of tokens staked.
     */
    event TokenStaked(string indexed name, uint256 amount);

    /**
     * @dev Emitted when tokens are unstaked from a pool.
     * @param name The name of the lending pool.
     * @param amount The amount of tokens unstaked.
     */
    event TokenUnstaked(string indexed name, uint256 amount);

    /**
     * @dev Emitted when tokens are placed in cooldown in a pool.
     * @param name The name of the lending pool.
     * @param amount The amount of tokens in cooldown.
     * @param time The timestamp when the cooldown started.
     */
    event TokenCoolDown(string indexed name, uint256 amount, uint256 time);

    /**
     * @dev Emitted when tokens are distributed to an institution.
     * @param name The name of the lending pool.
     * @param amount The amount of tokens distributed.
     */
    event TokenDistribution(string indexed name, uint256 amount);

    /**
     * @dev Emitted when the state of a lending pool changes.
     * @param name The name of the lending pool.
     * @param state The new state of the pool (true for active, false for inactive).
     */
    event PoolStateChange(string indexed name, bool state);

    /**
     * @dev Initializes the contract with the owner address.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new lending pool with specified parameters.
     * @param _owner The owner of the new lending pool.
     * @param _name The name of the new lending pool.
     * @param _usde The address of the USDE token.
     * @param _targetAmount The target amount for the pool.
     * @param _fundingDuration The funding duration for the pool.
     * @param _distributionDuration The distribution duration for the pool.
     * @param _repaymentDuration The repayment duration for the pool.
     * @param _lendingRate The lending rate for the pool.
     * @param _borrowingRate The borrowing rate for the pool.
     * @param _institutionAccount The institution's account address for distribution.
     * @return The address of the newly created lending pool.
     */
    function createNewPool(
        address _owner,
        string memory _name,
        address _usde,
        uint256 _targetAmount,
        uint256 _fundingDuration,
        uint256 _distributionDuration,
        uint256 _repaymentDuration,
        uint256 _lendingRate,
        uint256 _borrowingRate,
        address _institutionAccount
    ) public onlyOwner returns (address) {
        require(nameToIndex[_name] == 0, "Name has already been taken");

        LendingPool newPool = new LendingPool(
            _usde,
            _targetAmount,
            _fundingDuration,
            _distributionDuration,
            _repaymentDuration,
            _lendingRate,
            _borrowingRate,
            _institutionAccount
        );
        pools.push(newPool);

        poolIdx += 1;
        nameToIndex[_name] = poolIdx;

        emit NewLendingPool(_name, _owner, address(newPool));
        return address(newPool);
    }

    /**
     * @dev Retrieves the address of a lending pool by its name.
     * @param _name The name of the lending pool.
     * @return pool The address of the lending pool.
     */
    function getPool(string memory _name) public view returns (address pool) {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        return address(selectedPool);
    }

    /**
     * @dev Stakes tokens into a lending pool.
     * @param _name The name of the lending pool.
     * @param _amount The amount of tokens to stake.
     */
    function stakeToken(string memory _name, uint256 _amount) external onlyOwner {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        selectedPool.stake(_amount);

        emit TokenStaked(_name, _amount);
    }

    /**
     * @dev Places tokens into cooldown in a lending pool.
     * @param _name The name of the lending pool.
     * @param _amount The amount of tokens to place in cooldown.
     */
    function coolDownToken(string memory _name, uint256 _amount) external onlyOwner {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        selectedPool.initiateStakingCooldown(_amount);

        emit TokenCoolDown(_name, _amount, block.timestamp);
    }

    /**
     * @dev Unstakes tokens from a lending pool.
     * @param _name The name of the lending pool.
     * @param _amount The amount of tokens to unstake.
     */
    function unstakeToken(string memory _name, uint256 _amount) external onlyOwner {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        selectedPool.unstake(_amount);

        emit TokenUnstaked(_name, _amount);
    }

    /**
     * @dev Distributes tokens to the institution account of the pool.
     * @param _name The name of the lending pool.
     * @param _amount The amount of tokens to distribute.
     */
    function distributeToken(string memory _name, uint256 _amount) external onlyOwner {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        selectedPool.distributeToInstitution(_amount);

        emit TokenDistribution(_name, _amount);
    }

    /**
     * @dev Changes the state of a lending pool (active or inactive).
     * @param _name The name of the lending pool.
     * @param _state The new state of the pool (true for active, false for inactive).
     */
    function changePoolState(string memory _name, bool _state) external onlyOwner {
        LendingPool selectedPool = pools[nameToIndex[_name] - 1];
        selectedPool.setPoolState(_state);

        emit PoolStateChange(_name, _state);
    }
}
