import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { AssetIcon } from "@/components/borrow/AssetIcon";

interface BorrowCardProps {
  asset: string;
  totalBorrowed: number;
  borrowLimit: number;
  apy: number;
}

export function BorrowCard({
  asset,
  totalBorrowed,
  borrowLimit,
  apy,
}: BorrowCardProps) {
  const borrowPercentage = (totalBorrowed / borrowLimit) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AssetIcon symbol={asset} size={24} />
          <span>Borrow {asset}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Borrowed</span>
            <span className="font-semibold">
              {formatNumber(totalBorrowed)} {asset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Borrow APY</span>
            <span className="font-semibold">{formatPercent(apy)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Borrow Limit</span>
              <span>{borrowPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={borrowPercentage} max={80} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          Borrow {asset}
        </Button>
      </CardFooter>
    </Card>
  );
}
