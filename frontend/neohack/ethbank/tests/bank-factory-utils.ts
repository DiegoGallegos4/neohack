import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NewLendingPool,
  OwnershipTransferred,
  PoolStateChange,
  TokenCoolDown,
  TokenDistribution,
  TokenStaked,
  TokenUnstaked
} from "../generated/BankFactory/BankFactory"

export function createNewLendingPoolEvent(
  name: string,
  owner: Address,
  poolAddress: Address
): NewLendingPool {
  let newLendingPoolEvent = changetype<NewLendingPool>(newMockEvent())

  newLendingPoolEvent.parameters = new Array()

  newLendingPoolEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  newLendingPoolEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  newLendingPoolEvent.parameters.push(
    new ethereum.EventParam(
      "poolAddress",
      ethereum.Value.fromAddress(poolAddress)
    )
  )

  return newLendingPoolEvent
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

export function createPoolStateChangeEvent(
  name: string,
  state: boolean
): PoolStateChange {
  let poolStateChangeEvent = changetype<PoolStateChange>(newMockEvent())

  poolStateChangeEvent.parameters = new Array()

  poolStateChangeEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  poolStateChangeEvent.parameters.push(
    new ethereum.EventParam("state", ethereum.Value.fromBoolean(state))
  )

  return poolStateChangeEvent
}

export function createTokenCoolDownEvent(
  name: string,
  amount: BigInt,
  time: BigInt
): TokenCoolDown {
  let tokenCoolDownEvent = changetype<TokenCoolDown>(newMockEvent())

  tokenCoolDownEvent.parameters = new Array()

  tokenCoolDownEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenCoolDownEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokenCoolDownEvent.parameters.push(
    new ethereum.EventParam("time", ethereum.Value.fromUnsignedBigInt(time))
  )

  return tokenCoolDownEvent
}

export function createTokenDistributionEvent(
  name: string,
  amount: BigInt
): TokenDistribution {
  let tokenDistributionEvent = changetype<TokenDistribution>(newMockEvent())

  tokenDistributionEvent.parameters = new Array()

  tokenDistributionEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenDistributionEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokenDistributionEvent
}

export function createTokenStakedEvent(
  name: string,
  amount: BigInt
): TokenStaked {
  let tokenStakedEvent = changetype<TokenStaked>(newMockEvent())

  tokenStakedEvent.parameters = new Array()

  tokenStakedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenStakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokenStakedEvent
}

export function createTokenUnstakedEvent(
  name: string,
  amount: BigInt
): TokenUnstaked {
  let tokenUnstakedEvent = changetype<TokenUnstaked>(newMockEvent())

  tokenUnstakedEvent.parameters = new Array()

  tokenUnstakedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenUnstakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokenUnstakedEvent
}
