"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import AppLayout from "@/components/AppLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Staking from "@/components/home/Staking";

export default function Home() {
  return (
    <AppLayout>
      <div className="h-[6%] flex place-items-center  justify-end px-4 border-b">
        <ConnectButton
          connectButton={{
            label: "Connect",
            className: "bg-red-400",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          }}
          client={client}
          appMetadata={{
            name: "NeoHack",
            url: "https://neohack.vercel.com",
          }}
        />
      </div>
      <div className="h-[94%] flex">
        <div className="w-[70%] px-4  bg-secondary h-full">
          <SidebarTrigger />
        </div>
        <Staking />
      </div>
    </AppLayout>
  );
}
