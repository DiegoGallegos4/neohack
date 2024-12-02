import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
  Unstaked
} from "../generated/LendingPool/LendingPool"

export function createDepositedEvent(
  depositor: Address,
  amount: BigInt
): Deposited {
  let depositedEvent = changetype<Deposited>(newMockEvent())

  depositedEvent.parameters = new Array()

  depositedEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositedEvent
}

export function createDistributedToInstitutionEvent(
  amount: BigInt
): DistributedToInstitution {
  let distributedToInstitutionEvent = changetype<DistributedToInstitution>(
    newMockEvent()
  )

  distributedToInstitutionEvent.parameters = new Array()

  distributedToInstitutionEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return distributedToInstitutionEvent
}

export function createInstallmentDistributedEvent(
  installmentNumber: BigInt,
  amount: BigInt,
  timestamp: BigInt
): InstallmentDistributed {
  let installmentDistributedEvent = changetype<InstallmentDistributed>(
    newMockEvent()
  )

  installmentDistributedEvent.parameters = new Array()

  installmentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "installmentNumber",
      ethereum.Value.fromUnsignedBigInt(installmentNumber)
    )
  )
  installmentDistributedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  installmentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return installmentDistributedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRepaidEvent(amount: BigInt): Repaid {
  let repaidEvent = changetype<Repaid>(newMockEvent())

  repaidEvent.parameters = new Array()

  repaidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return repaidEvent
}

export function createRepaymentReceivedEvent(
  repaymentNumber: BigInt,
  amount: BigInt,
  timestamp: BigInt
): RepaymentReceived {
  let repaymentReceivedEvent = changetype<RepaymentReceived>(newMockEvent())

  repaymentReceivedEvent.parameters = new Array()

  repaymentReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "repaymentNumber",
      ethereum.Value.fromUnsignedBigInt(repaymentNumber)
    )
  )
  repaymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  repaymentReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return repaymentReceivedEvent
}

export function createRewardsClaimedEvent(
  depositor: Address,
  amount: BigInt
): RewardsClaimed {
  let rewardsClaimedEvent = changetype<RewardsClaimed>(newMockEvent())

  rewardsClaimedEvent.parameters = new Array()

  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return rewardsClaimedEvent
}

export function createStakedEvent(
  amount: BigInt,
  newTotalStaked: BigInt,
  newAvailableAmount: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalStaked",
      ethereum.Value.fromUnsignedBigInt(newTotalStaked)
    )
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam(
      "newAvailableAmount",
      ethereum.Value.fromUnsignedBigInt(newAvailableAmount)
    )
  )

  return stakedEvent
}

export function createStakingCooldownInitiatedEvent(
  timestamp: BigInt
): StakingCooldownInitiated {
  let stakingCooldownInitiatedEvent = changetype<StakingCooldownInitiated>(
    newMockEvent()
  )

  stakingCooldownInitiatedEvent.parameters = new Array()

  stakingCooldownInitiatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return stakingCooldownInitiatedEvent
}

export function createTargetReachedEvent(): TargetReached {
  let targetReachedEvent = changetype<TargetReached>(newMockEvent())

  targetReachedEvent.parameters = new Array()

  return targetReachedEvent
}

export function createUnstakedEvent(
  amount: BigInt,
  newTotalStaked: BigInt,
  newAvailableAmount: BigInt
): Unstaked {
  let unstakedEvent = changetype<Unstaked>(newMockEvent())

  unstakedEvent.parameters = new Array()

  unstakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalStaked",
      ethereum.Value.fromUnsignedBigInt(newTotalStaked)
    )
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam(
      "newAvailableAmount",
      ethereum.Value.fromUnsignedBigInt(newAvailableAmount)
    )
  )

  return unstakedEvent
}
