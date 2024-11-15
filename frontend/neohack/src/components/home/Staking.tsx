"use client";

import { StakingForm } from "./StakingForm";
import { UnStakeForm } from "./UnstakeForm";

export default function Staking() {
  return (
    <div className="w-[30%] px-4 h-full">
      <div className="h-[10%] flex items-center gap-3">
        <div className="flex gap-2">
          <span className="text-gray-500 font-semibold text-sm">Pool</span>
          <span className="text-primary text-sm font-bold">100.0</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 font-semibold text-sm">TVL</span>
          <span className="text-primary text-sm font-bold">100.0</span>
        </div>
      </div>
      <div className="h-[50%]  shadow border rounded-xl px-3 py-5  flex flex-col gap-2">
        <h3 className="h-[5%] font-semibold">Transact</h3>
        <div className="h-[95%]">
          <div className="h-[50%]">
            <StakingForm />
          </div>
          <div className="h-[50%] flex flex-col gap-3 i justify-center border-t">
            <h3 className=" font-semibold">Summary</h3>
            <div className="flex gap-2 justify-between w-full">
              <span className="text-gray-500 font-semibold text-sm">USDe</span>
              <span className="text-primary text-sm font-bold">100.0</span>
            </div>
            <div className="flex gap-2 justify-between w-full">
              <span className="text-gray-500 font-semibold text-sm">sUSDe</span>
              <span className="text-primary text-sm font-bold">100.0</span>
            </div>

            <UnStakeForm />
          </div>
        </div>
      </div>
    </div>
  );
}
