"use client";
import { ethers } from "ethers";
import { useEffect } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";

import { client } from "../../app/client";

import { StakingForm } from "./StakingForm";
import { UnStakingForm } from "./UnstakeForm";

const contract = getContract({
  address: process.env.NEXT_PUBLIC_SUSDE as string,
  chain: sepolia,
  client,
});

const tokenContract = getContract({
  address: process.env.NEXT_PUBLIC_USDE as string,
  chain: sepolia,
  client,
});

export default function Staking() {
  const activeAccount = useActiveAccount();

  const { data: susdeBalance } = useReadContract({
    contract,
    method: "function balanceOf(address) returns (uint256)",
    params: [activeAccount?.address],
  });

  const { data: usdeBalance } = useReadContract({
    contract: tokenContract,
    method: "function balanceOf(address) returns (uint256)",
    params: [activeAccount?.address],
  });

  return (
    <div className="w-full px-4 h-full flex justify-center items-center  flex-col py-10 ">
      <div className="h-full  w-full max-w-[700px] shadow border rounded-xl px-5 py-5  flex flex-col gap-2">
        <h3 className="h-[10%] flex items-center text-xl font-semibold">
          Stake to earn
        </h3>
        <div className="h-[90%] w-full overflow-y-auto">
          <div className="grid  lg:grid-cols-2 gap-10 lg:h-[50%] ">
            <div className="col-span-1">
              <div className="h-full">
                <StakingForm />
              </div>
            </div>
            <div className="col-span-1 ">
              <div className="h-full ">
                <UnStakingForm />
              </div>
            </div>
          </div>
          <div className="h-[40%] flex flex-col gap-3 i justify-center border-t">
            <h3 className=" font-semibold">Summary</h3>
            <div className="flex gap-2 justify-between w-full">
              <span className="text-gray-500 font-semibold text-sm">
                Cooldown period
              </span>
              <span className="text-primary text-sm font-bold">1 hr</span>
            </div>
            <div className="flex gap-2 justify-between w-full">
              <span className="text-gray-500 font-semibold text-sm">
                USDe balance
              </span>
              <span className="text-primary text-sm font-bold">
                {" "}
                {usdeBalance
                  ? Number(ethers.utils.formatEther(usdeBalance)).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="flex gap-2 justify-between w-full">
              <span className="text-gray-500 font-semibold text-sm">
                S USDe balance
              </span>
              <span className="text-primary text-sm font-bold">
                {susdeBalance
                  ? Number(ethers.utils.formatEther(susdeBalance)).toFixed(2)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
