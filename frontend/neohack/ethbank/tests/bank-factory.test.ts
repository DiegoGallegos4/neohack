import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { NewLendingPool } from "../generated/schema"
import { NewLendingPool as NewLendingPoolEvent } from "../generated/BankFactory/BankFactory"
import { handleNewLendingPool } from "../src/bank-factory"
import { createNewLendingPoolEvent } from "./bank-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let name = "Example string value"
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let poolAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newNewLendingPoolEvent = createNewLendingPoolEvent(
      name,
      owner,
      poolAddress
    )
    handleNewLendingPool(newNewLendingPoolEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewLendingPool created and stored", () => {
    assert.entityCount("NewLendingPool", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewLendingPool",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "NewLendingPool",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewLendingPool",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
