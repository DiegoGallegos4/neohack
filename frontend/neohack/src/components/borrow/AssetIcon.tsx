"use client";

import Image from "next/image";

interface AssetIconProps {
  symbol: string;
  size?: number;
}

export function AssetIcon({ symbol, size = 24 }: AssetIconProps) {
  const iconUrl = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${symbol}/logo.png`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={iconUrl}
        alt={`${symbol} icon`}
        width={size}
        height={size}
        className="rounded-full"
        onError={(e) => {
          e.currentTarget.src = `/placeholder.svg?height=${size}&width=${size}`;
        }}
      />
    </div>
  );
}
