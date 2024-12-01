// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import { BankFactory } from "../contracts/BankFactory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployBank is Script {
    function run() public {
        vm.startBroadcast();

        // Deploy BankFactory contract
        BankFactory bankFactory = new BankFactory();
        console.log("BankFactory deployed at:", address(bankFactory));

        vm.stopBroadcast();
    }
}
