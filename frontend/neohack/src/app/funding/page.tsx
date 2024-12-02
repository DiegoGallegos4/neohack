"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";

import { FilterSort } from "../../components/FilterSort";
import { PropertyGrid } from "../../components/PropertyGrid";
import { StatsCard } from "../../components/StatsCard";
import Banner from "@/components/savings/Banner";

const client = new ApolloClient({
  uri: "https://api.goldsky.com/api/public/project_cm3xynyhkldn001x32ywkffo0/subgraphs/ethbank-subgraph/1.0.0/gn",
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main className="min-h-screen bg-gray-100">
        <Banner
          title="Invest in Real Estate, Simplified"
          description="Access exclusive property investments and grow your wealth by providing liquidity to the protocol. Our escrow contract ensures that your funds are secure and that the property is managed properly. We supervise the progress and fund it based on our compliance system."
        />
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              title="Total Investments"
              value="1,234"
              icon="chart-bar"
            />
            <StatsCard
              title="Returned to Investors"
              value="$25.6M"
              icon="dollar-sign"
            />
            <StatsCard
              title="Total Invested"
              value="$142M"
              icon="trending-up"
            />
          </div>
          <FilterSort />
          <PropertyGrid />
        </div>
      </main>
    </ApolloProvider>
  );
}
