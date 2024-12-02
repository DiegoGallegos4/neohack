import {
  NewLendingPool as NewLendingPoolEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolStateChange as PoolStateChangeEvent,
  TokenCoolDown as TokenCoolDownEvent,
  TokenDistribution as TokenDistributionEvent,
  TokenStaked as TokenStakedEvent,
  TokenUnstaked as TokenUnstakedEvent
} from "../generated/BankFactory/BankFactory"
import {
  NewLendingPool,
  OwnershipTransferred,
  PoolStateChange,
  TokenCoolDown,
  TokenDistribution,
  TokenStaked,
  TokenUnstaked,
  Pool,
  Institution
} from "../generated/schema"
import { LendingPool as LendingPoolContract } from "../generated/templates/LendingPool/LendingPool"
import { LendingPool } from "../generated/templates"

export function handleNewLendingPool(event: NewLendingPoolEvent): void {
  let entity = new NewLendingPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.owner = event.params.owner
  entity.poolAddress = event.params.poolAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let poolContract = LendingPoolContract.bind(event.params.poolAddress)
  let pool = new Pool(event.params.poolAddress.toHexString())
  
  let poolData = poolContract.pool()
  pool.targetAmount = poolData.value0
  pool.totalDeposits = poolData.value1
  pool.availableAmount = poolData.value2
  pool.totalStaked = poolData.value3
  pool.totalDistributed = poolData.value4
  pool.stakingRewards = poolData.value5
  pool.fundingEndTime = poolData.value6
  pool.distributionEndTime = poolData.value7
  pool.institutionAccount = poolData.value8
  pool.repaymentEndTime = poolData.value9
  pool.lendingRate = poolData.value10
  pool.borrowingRate = poolData.value11
  pool.installments = poolData.value12
  pool.isActive = poolData.value13

  let institution = new Institution(poolData.value8.toHexString())
  let institutionData = poolContract.institution()
  
  institution.pool = pool.id
  institution.totalBorrowed = institutionData.value0
  institution.totalRepaid = institutionData.value1
  institution.installmentsPaid = institutionData.value2
  institution.installments = []
  institution.repayments = []
  
  pool.institution = institution.id
  // Set up the relationship
  
  institution.save()
  pool.save()
  
  entity.pool = pool.id.toString()
  entity.save()
  
  LendingPool.create(event.params.poolAddress)
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolStateChange(event: PoolStateChangeEvent): void {
  let entity = new PoolStateChange(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.state = event.params.state

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenCoolDown(event: TokenCoolDownEvent): void {
  let entity = new TokenCoolDown(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.amount = event.params.amount
  entity.time = event.params.time

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenDistribution(event: TokenDistributionEvent): void {
  let entity = new TokenDistribution(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenStaked(event: TokenStakedEvent): void {
  let entity = new TokenStaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenUnstaked(event: TokenUnstakedEvent): void {
  let entity = new TokenUnstaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name.toString()
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
