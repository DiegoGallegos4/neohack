import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

import { ProgressBar } from "./ProgressBar";
interface Property {
  id: string;
  image: string;
  title: string;
  investors: number;
  target: number;
  currentInvestment: number;
  expectedReturn: number;
  minInvestment: number;
  term: number;
  location: string;
}

const mockProperties: Property[] = [
  {
    id: "1",
    image: "/re-1.jpeg",
    title: "Downtown Apartment Complex",
    investors: 120,
    target: 5000000,
    currentInvestment: 3750000,
    expectedReturn: 12.5,
    minInvestment: 5000,
    term: 36,
    location: "New York, NY",
  },
  {
    id: "2",
    image: "/re-2.jpeg",
    title: "Suburban Office Park",
    investors: 85,
    target: 8000000,
    currentInvestment: 6000000,
    expectedReturn: 10.8,
    minInvestment: 10000,
    term: 48,
    location: "Chicago, IL",
  },
];

const projectQuery = gql`
  query GetProjects {
    newLendingPools {
      id
      pool {
        borrowingRate
        targetAmount
        distributionEndTime
        isActive
        lendingRate
        totalDeposits
        totalDistributed
        totalStaked
        availableAmount
        institution {
          id
        }
      }
      name
      poolAddress
    }
  }
`;

interface ProjectQueryResult {
  newLendingPools: {
    id: string;
    pool: {
      borrowingRate: number;
      targetAmount: string;
      distributionEndTime: string;
      isActive: boolean;
      lendingRate: number;
      totalDeposits: string;
      totalDistributed: string;
      totalStaked: string;
      availableAmount: string;
      institution: {
        id: string;
      };
    };
    name: string;
    poolAddress: string;
  }[];
}

const formatCurrency = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export function PropertyGrid() {
  const { loading, error, data } = useQuery<ProjectQueryResult>(projectQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data?.newLendingPools);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data?.newLendingPools.map((property, idx) => {
        const mockProperty = mockProperties[idx % mockProperties.length];
        const propertyData = {
          ...property,
          name: mockProperty.title,
          pool: {
            ...property.pool,
            image: mockProperty.image,
            investors: mockProperty.investors,
            minInvestment: mockProperty.minInvestment,
            term: mockProperty.term,
            location: mockProperty.location,
          },
        };
        return (
          <Link
            href={`/funding/${property.poolAddress}`}
            key={property.id}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <Image
                src={propertyData.pool.image}
                alt={propertyData.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {propertyData.name}
                </h3>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {propertyData.pool.investors} investors
                  </span>
                  <span className="text-sm font-medium">
                    $
                    {formatCurrency(
                      Number(property.pool.targetAmount) / 10000000000000000,
                    )}{" "}
                    target
                  </span>
                </div>
                <ProgressBar
                  progress={
                    (Number(propertyData.pool.availableAmount) /
                      Number(propertyData.pool.targetAmount)) *
                    100
                  }
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected Return</span>
                  <span className="text-lg font-bold text-green-600">
                    {propertyData.pool.lendingRate / 100}%
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min Investment</span>
                  <span className="text-sm font-medium">
                    ${propertyData.pool.minInvestment.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Term</span>
                  <span className="text-sm font-medium">
                    {propertyData.pool.term} months
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {propertyData.pool.location}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
