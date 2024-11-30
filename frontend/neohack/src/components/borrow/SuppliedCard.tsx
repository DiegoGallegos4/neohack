import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { AssetIcon } from "@/components/borrow/AssetIcon";
import Link from "next/link";

interface SupplyCardProps {
  asset: string;
  totalSupplied: number;
  apy: number;
}

export function SupplyCard({ asset, totalSupplied, apy }: SupplyCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AssetIcon symbol={asset} size={24} />
          <span>Supply {asset}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Supplied</span>
            <span className="font-semibold">
              {formatNumber(totalSupplied)} {asset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supply APY</span>
            <span className="font-semibold">{formatPercent(apy)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/supply/${asset}`} className="w-full">
          <Button variant="secondary" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
