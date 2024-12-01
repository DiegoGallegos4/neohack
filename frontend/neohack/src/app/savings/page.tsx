"use client";

import AppLayout from "@/components/AppLayout";
import Banner from "@/components/savings/Banner";
import Staking from "@/components/savings/Staking";
// import { Transaction } from "@/components/columns";

// function getData(): Transaction[] {
//   // Fetch data from your API here.
//   //

//   return [
//     {
//       id: "m5gr84i9",
//       time: "2024-11-16T10:00:00Z",
//       address: "0x55a2d1498b62e6316094222b660d5da835a60cf0",
//       apy: "5.25%",
//       value: "0.316",
//       action: "stake",
//     },
//     {
//       id: "6599e228",
//       time: "2024-11-16T10:10:00Z",
//       address: "0xf21615bf8f31c19a0497b7722a83a02ff85d99a2",
//       apy: "6.15%",
//       value: "0.367",
//       action: "unstake",
//     },
//     {
//       id: "58f4da94",
//       time: "2024-11-16T10:20:00Z",
//       address: "0xd791de813ca8116cacc648af19d500fd913051f7",
//       apy: "5.75%",
//       value: "0.250",
//       action: "stake",
//     },
//     {
//       id: "67ea90ce",
//       time: "2024-11-16T10:30:00Z",
//       address: "0xc32f43b425b697a2503280228156bc8d586259e4",
//       apy: "4.85%",
//       value: "0.319",
//       action: "unstake",
//     },
//     {
//       id: "0d84a691",
//       time: "2024-11-16T10:40:00Z",
//       address: "0x84960b4fc650027fc6d75997f10eb01878e89311",
//       apy: "5.00%",
//       value: "0.309",
//       action: "stake",
//     },
//     {
//       id: "8a0cf660",
//       time: "2024-11-16T10:50:00Z",
//       address: "0x043f3ca11080eb3f52f49b3891dab328aa48ca11",
//       apy: "6.50%",
//       value: "0.425",
//       action: "unstake",
//     },
//     {
//       id: "744d4177",
//       time: "2024-11-16T11:00:00Z",
//       address: "0xaf6559bf6ed2d1bfd0fe664a7899efbf14c282fe",
//       apy: "4.95%",
//       value: "0.432",
//       action: "stake",
//     },
//     {
//       id: "637ff917",
//       time: "2024-11-16T11:10:00Z",
//       address: "0xc811a509d3f606adab3b9013073b0940372cfef4",
//       apy: "6.75%",
//       value: "0.201",
//       action: "unstake",
//     },
//     {
//       id: "6489c210",
//       time: "2024-11-16T11:20:00Z",
//       address: "0x1ccbc63dabd6fc81e60de518bfec9f70a716169e",
//       apy: "5.95%",
//       value: "0.423",
//       action: "stake",
//     },
//     {
//       id: "62424646",
//       time: "2024-11-16T11:30:00Z",
//       address: "0x009ef6919d8e803029a8bbf0f6b094b4b8fc1ed3",
//       apy: "5.50%",
//       value: "0.300",
//       action: "unstake",
//     },
//     {
//       id: "31e75b0f",
//       time: "2024-11-16T11:40:00Z",
//       address: "0x724f8154a9276e7134f8b2d9df89c94a5bc23e91",
//       apy: "4.75%",
//       value: "0.314",
//       action: "stake",
//     },
//     {
//       id: "90a2fbe6",
//       time: "2024-11-16T11:50:00Z",
//       address: "0x872f3ca34091eb315b43c4f1bd94d4f91a84c141",
//       apy: "5.90%",
//       value: "0.375",
//       action: "unstake",
//     },
//     {
//       id: "47cb5f31",
//       time: "2024-11-16T12:00:00Z",
//       address: "0x12cd98f674b487f9d8d94b0ed3a2c7c38f9a44d1",
//       apy: "6.25%",
//       value: "0.291",
//       action: "stake",
//     },
//     {
//       id: "7c2c9c51",
//       time: "2024-11-16T12:10:00Z",
//       address: "0xa65f9f8a44ad91a0236d3c2e23fc1e3a89f123bc",
//       apy: "4.65%",
//       value: "0.387",
//       action: "unstake",
//     },
//     {
//       id: "6f4da3cb",
//       time: "2024-11-16T12:20:00Z",
//       address: "0x9d12384e1b0f764e9c4db7d2ad3e9d17a384e91a",
//       apy: "5.35%",
//       value: "0.312",
//       action: "stake",
//     },
//     {
//       id: "8b31d751",
//       time: "2024-11-16T12:30:00Z",
//       address: "0x3e721a98f8f9d12a3e123e89dabc7f91b89a1c23",
//       apy: "6.00%",
//       value: "0.425",
//       action: "unstake",
//     },
//     {
//       id: "5a98f2b7",
//       time: "2024-11-16T12:40:00Z",
//       address: "0xc2d12e98d8c7e3a7b41a84f98b123d93c28f19a1",
//       apy: "4.50%",
//       value: "0.301",
//       action: "stake",
//     },
//     {
//       id: "c3a7d85b",
//       time: "2024-11-16T12:50:00Z",
//       address: "0xf4a93c8d123f7b2a384e912e8b1a34d1f39c85e2",
//       apy: "5.75%",
//       value: "0.329",
//       action: "unstake",
//     },
//     {
//       id: "4b7d3a98",
//       time: "2024-11-16T13:00:00Z",
//       address: "0x93d12e89c7d84f3b1a394e123c8d85a17b43e92f",
//       apy: "6.10%",
//       value: "0.378",
//       action: "stake",
//     },
//     {
//       id: "7b3c2a91",
//       time: "2024-11-16T13:10:00Z",
//       address: "0x29f3b4a12e8d7c1a394c7d85f1a34b89c7e19a38",
//       apy: "4.80%",
//       value: "0.291",
//       action: "unstake",
//     },
//     {
//       id: "9a7d8b13",
//       time: "2024-11-16T13:20:00Z",
//       address: "0x1a3947b43c9d84f123b1a85e92f2c38d7e19a39c",
//       apy: "5.60%",
//       value: "0.423",
//       action: "stake",
//     },
//     {
//       id: "6e4f3a21",
//       time: "2024-11-16T13:30:00Z",
//       address: "0x85b1a34d8c7f2a1239e4b3c7d94f1a38d7e92f39",
//       apy: "6.45%",
//       value: "0.305",
//       action: "unstake",
//     },
//     {
//       id: "b1a92f3c",
//       time: "2024-11-16T13:40:00Z",
//       address: "0x94e38d7c2b4a12f1a85c39d4a3947e1a19c3b8f7",
//       apy: "5.40%",
//       value: "0.387",
//       action: "stake",
//     },
//     {
//       id: "2f3c7d9a",
//       time: "2024-11-16T13:50:00Z",
//       address: "0xc7b3a1e9f2d94f1a85d7b4a12c8f39d4a38e7b9c",
//       apy: "4.70%",
//       value: "0.367",
//       action: "unstake",
//     },
//     {
//       id: "f1a85b4d",
//       time: "2024-11-16T14:00:00Z",
//       address: "0x7c2b39a4d8f19e92f1a85e94a12b4a394d7e38f9",
//       apy: "6.30%",
//       value: "0.289",
//       action: "stake",
//     },
//     {
//       id: "b3a1c8d7",
//       time: "2024-11-16T14:10:00Z",
//       address: "0x8f39a4e92b4d1a85f7c3a394d7b3a9e7b12c8d92",
//       apy: "5.10%",
//       value: "0.323",
//       action: "unstake",
//     },
//     {
//       id: "9a4e7c8b",
//       time: "2024-11-16T14:20:00Z",
//       address: "0x85d4e9a7c1b2a3c9e94f12b4a3947d1a38f2b9e1",
//       apy: "5.90%",
//       value: "0.312",
//       action: "stake",
//     },
//     {
//       id: "a7c8b12e",
//       time: "2024-11-16T14:30:00Z",
//       address: "0xb4a3c92f19a7d8e4b1f12a3d94e92b7c1a38f9e4",
//       apy: "6.40%",
//       value: "0.402",
//       action: "unstake",
//     },
//   ];
// }

export default function Home() {
  // const data = getData();
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
