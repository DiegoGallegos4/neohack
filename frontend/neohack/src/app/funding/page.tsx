import React from "react";

import { FilterSort } from "../../components/FilterSort";
import { Hero } from "../../components/Hero";
import { PropertyGrid } from "../../components/PropertyGrid";
import { StatsCard } from "../../components/StatsCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Hero
        title="Invest in Real Estate, Simplified"
        subtitle="Access exclusive property investments and grow your wealth with our crowdfunding platform."
        ctaText="Start Investing Now"
        ctaLink="#properties"
      />
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard title="Total Investments" value="1,234" icon="chart-bar" />
          <StatsCard
            title="Returned to Investors"
            value="$25.6M"
            icon="dollar-sign"
          />
          <StatsCard title="Total Invested" value="$142M" icon="trending-up" />
        </div>
        <FilterSort />
        <PropertyGrid />
      </div>
    </main>
  );
}