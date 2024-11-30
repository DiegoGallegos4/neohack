import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { AssetIcon } from "@/components/borrow/AssetIcon";

interface SuppliedAsset {
  asset: string;
  amount: number;
  value: number;
  apy: number;
}

interface SuppliedAssetsProps {
  assets: SuppliedAsset[];
}

export function SuppliedAssets({ assets }: SuppliedAssetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Supplied Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>APY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.asset}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <AssetIcon symbol={asset.asset} size={24} />
                    <span>{asset.asset}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatNumber(asset.amount)} {asset.asset}
                </TableCell>
                <TableCell>${formatNumber(asset.value)}</TableCell>
                <TableCell>{formatPercent(asset.apy)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
