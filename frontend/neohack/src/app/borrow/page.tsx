import { SupplyCard } from "@/components/borrow/SuppliedCard";
import { BorrowCard } from "@/components/borrow/BorrowCard";
import { SuppliedAssets } from "@/components/borrow/SuppliedAssets";
import { BorrowedAssets } from "@/components/borrow/BorrowedAssets";

export default function Home() {
  // Mock data
  const supplyData = { asset: "ETH", totalSupplied: 10, apy: 0.03 };
  const borrowData = {
    asset: "USDe",
    totalBorrowed: 5000,
    borrowLimit: 8000,
    apy: 0.05,
  };
  const suppliedAssets = [
    { asset: "ETH", amount: 10, value: 20000, apy: 0.03 },
    { asset: "WBTC", amount: 0.5, value: 15000, apy: 0.02 },
  ];
  const borrowedAssets = [
    { asset: "USDe", amount: 5000, value: 5000, apy: 0.05 },
    { asset: "DAI", amount: 2000, value: 2000, apy: 0.04 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SupplyCard {...supplyData} />
          <BorrowCard {...borrowData} />
        </div>
        <SuppliedAssets assets={suppliedAssets} />
        <BorrowedAssets assets={borrowedAssets} />
      </main>
    </div>
  );
}
