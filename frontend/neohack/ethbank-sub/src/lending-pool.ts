import {
  Deposited as DepositedEvent,
  DistributedToInstitution as DistributedToInstitutionEvent,
  InstallmentDistributed as InstallmentDistributedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Repaid as RepaidEvent,
  RepaymentReceived as RepaymentReceivedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  StakingCooldownInitiated as StakingCooldownInitiatedEvent,
  TargetReached as TargetReachedEvent,
  Unstaked as UnstakedEvent,
} from "../generated/LendingPool/LendingPool"
import {
  Deposited,
  DistributedToInstitution,
  InstallmentDistributed,
  OwnershipTransferred,
  Repaid,
  RepaymentReceived,
  RewardsClaimed,
  Staked,
  StakingCooldownInitiated,
  TargetReached,
  Unstaked,
} from "../generated/schema"

export function handleDeposited(event: DepositedEvent): void {
  let entity = new Deposited(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.depositor = event.params.depositor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDistributedToInstitution(
  event: DistributedToInstitutionEvent,
): void {
  let entity = new DistributedToInstitution(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInstallmentDistributed(
  event: InstallmentDistributedEvent,
): void {
  let entity = new InstallmentDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.installmentNumber = event.params.installmentNumber
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRepaid(event: RepaidEvent): void {
  let entity = new Repaid(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRepaymentReceived(event: RepaymentReceivedEvent): void {
  let entity = new RepaymentReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.repaymentNumber = event.params.repaymentNumber
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let entity = new RewardsClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.depositor = event.params.depositor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.amount = event.params.amount
  entity.newTotalStaked = event.params.newTotalStaked
  entity.newAvailableAmount = event.params.newAvailableAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakingCooldownInitiated(
  event: StakingCooldownInitiatedEvent,
): void {
  let entity = new StakingCooldownInitiated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTargetReached(event: TargetReachedEvent): void {
  let entity = new TargetReached(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnstaked(event: UnstakedEvent): void {
  let entity = new Unstaked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.amount = event.params.amount
  entity.newTotalStaked = event.params.newTotalStaked
  entity.newAvailableAmount = event.params.newAvailableAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
