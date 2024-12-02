"use client";

import AppLayout from "@/components/AppLayout";
import Banner from "@/components/savings/Banner";
import Staking from "@/components/savings/Staking";

export default function Home() {
  return (
    <AppLayout>
      <div className="h-[94%] flex">
        <div className="w-full  bg-secondary h-full">
          <Banner
            title="High Yield Savings"
            description="Stake your USDE tokens to earn rewards and support the protocol’s stability. By staking, you unlock competitive yields while adding a layer of security to the neobank. In rare shortfall events, a portion of your stake may be used to maintain balance, ensuring long-term sustainability."
          />
          <div className="h-[70%] w-full ">
            <Staking />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
