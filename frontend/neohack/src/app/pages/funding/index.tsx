import React from "react";

import { PropertyGrid } from "../../../components/PropertyGrid";

export default function Funding() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Real Estate Crowdfunding Opportunities
        </h1>
        <PropertyGrid />
      </div>
    </main>
  );
}
