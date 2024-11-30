"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { AssetIcon } from "@/components/borrow/AssetIcon";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the APY chart
const apyData = [
  { date: "2023-01", apy: 0.02 },
  { date: "2023-02", apy: 0.025 },
  { date: "2023-03", apy: 0.03 },
  { date: "2023-04", apy: 0.035 },
  { date: "2023-05", apy: 0.032 },
  { date: "2023-06", apy: 0.028 },
];

export default function SupplyDetails() {
  const params = useParams();
  const asset = params.asset as string;

  // Mock data
  const supplyData = {
    totalSupplied: 10,
    apy: 0.03,
    ltv: 0.75,
    liquidationThreshold: 0.8,
    liquidationPenalty: 0.05,
    totalBorrowed: 5000,
    totalBorrowable: 8000,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AssetIcon symbol={asset} size={32} />
              <span>Supply {asset} Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Supply Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Supplied
                    </span>
                    <span className="font-semibold">
                      {formatNumber(supplyData.totalSupplied)} {asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current APY</span>
                    <span className="font-semibold">
                      {formatPercent(supplyData.apy)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Risk Parameters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LTV</span>
                    <span className="font-semibold">
                      {formatPercent(supplyData.ltv)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Liquidation Threshold
                    </span>
                    <span className="font-semibold">
                      {formatPercent(supplyData.liquidationThreshold)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Liquidation Penalty
                    </span>
                    <span className="font-semibold">
                      {formatPercent(supplyData.liquidationPenalty)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Borrow Capacity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Borrowed
                    </span>
                    <span className="font-semibold">
                      ${formatNumber(supplyData.totalBorrowed)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Borrowable
                    </span>
                    <span className="font-semibold">
                      ${formatNumber(supplyData.totalBorrowable)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">APY History</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={apyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `${((value as number) * 100).toFixed(2)}%`
                      }
                    />
                    <Line type="monotone" dataKey="apy" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Button className="w-full">Supply {asset}</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
