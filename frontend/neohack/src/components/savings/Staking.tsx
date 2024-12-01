"use client";
import { ethers, formatEther } from "ethers";
import { useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";

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
  const [amt, setAmt] = useState(0);

  const { data: susdeBalance, refetch: refetchSusde } = useReadContract({
    contract,
    method: "function balanceOf(address) returns (uint256)",
    params: [activeAccount?.address ?? ethers.ZeroAddress],
  });

  const { data: usdeBalance, refetch: refetchUsde } = useReadContract({
    contract: tokenContract,
    method: "function balanceOf(address) returns (uint256)",
    params: [activeAccount?.address ?? ethers.ZeroAddress],
  });

  const { data: usdeRatio } = useReadContract({
    contract,
    method: "function convertToAssets(uint256) returns(uint256)",
    params: [BigInt(amt || 0)],
  });

  useEffect(() => {
    susdeBalance && setAmt(Number(susdeBalance));
  }, [susdeBalance]);

  return (
    <div className="w-full px-4 h-full flex justify-center items-center  flex-col py-10 ">
      <div className="h-full  w-full  shadow border rounded-xl px-5 py-5  flex flex-col gap-2 ">
        <div className="h-auto grid grid-cols-1 lg:grid-cols-5 px-3    border py-2">
          <div className="  h-14  flex flex-row justify-between items-center   lg:flex-col lg:items-start">
            <span className="font-semibold text-sm flex items-center h-[50%] ">
              Cooldown period
            </span>
            <span className="text-gray-500  text-sm font-bold flex items-center  h-[50%]  ">
              1 hr
            </span>
          </div>
          <div className="  h-14  flex flex-row justify-between items-center  lg:flex-col lg:items-start">
            <span className="font-semibold text-sm flex items-center h-[50%] ">
              USDe balance
            </span>
            <span className="text-gray-500  text-sm font-bold flex items-center  h-[50%]  ">
              {usdeBalance ? Number(formatEther(usdeBalance)).toFixed(2) : 0}
            </span>
          </div>
          <div className="  h-14  flex flex-row justify-between items-center  lg:flex-col lg:items-start">
            <span className="font-semibold text-sm flex items-center h-[50%] ">
              SUSDe balance
            </span>
            <span className="text-gray-500  text-sm font-bold flex items-center  h-[50%]  ">
              {susdeBalance ? Number(formatEther(susdeBalance)).toFixed(2) : 0}
            </span>
          </div>
          <div className="  h-14  flex flex-row justify-between items-center  lg:flex-col lg:items-start">
            <span className="font-semibold text-sm flex items-center h-[50%] ">
              APY
            </span>
            <span className="text-gray-500  text-sm font-bold flex items-center  h-[50%]  ">
              29 %
            </span>
          </div>
          <div className="  h-14  flex flex-row justify-between items-center  lg:flex-col lg:items-start">
            <span className="font-semibold text-sm flex items-center h-[50%] ">
              Reward
            </span>
            <span className="text-gray-500  text-sm font-bold flex items-center  h-[50%]  ">
              {" "}
              {usdeRatio
                ? Number(formatEther(usdeRatio.toString())).toFixed(2)
                : 0}
            </span>
          </div>
        </div>
        <div className="flex flex-grow flex-col lg:flex-row gap-10  overflow-y-auto">
          <div className="w-full lg:w-[50%] h-full ">
            <div className="h-[20%] flex flex-col justify-center ">
              <h3 className="flex items-center font-semibold text-xl">
                Stake USDe
              </h3>
              <p className=" flex items-center  text-sm text-gray-500 ">
                Receive matching SUSDe when you stake USDe.
              </p>
            </div>
            <div className="h-[80%]">
              <StakingForm
                refetchSusde={refetchSusde}
                refetchUsde={refetchUsde}
              />
            </div>
          </div>
          <div className="w-full lg:w-[50%] h-full">
            <div className="h-[20%] flex flex-col justify-center">
              <h3 className="flex items-center font-semibold text-xl">
                Claim USDe
              </h3>
              <p className=" flex items-center  text-sm text-gray-500">
                Claim USDe when you stake back SUSDe.
              </p>
            </div>
            <div className="h-[80%]">
              <UnStakingForm
                refetchSusde={refetchSusde}
                refetchUsde={refetchUsde}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
