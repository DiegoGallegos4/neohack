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
    }
  }
`;

export function PropertyGrid() {
  const { loading, error, data } = useQuery(projectQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {mockProperties.map((property) => (
        <Link
          href={`/funding/${property.id}`}
          key={property.id}
          className="block"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <Image
              src={property.image}
              alt={property.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {property.investors} investors
                </span>
                <span className="text-sm font-medium">
                  ${property.target.toLocaleString()} target
                </span>
              </div>
              <ProgressBar
                progress={(property.currentInvestment / property.target) * 100}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Expected Return</span>
                <span className="text-lg font-bold text-green-600">
                  {property.expectedReturn}%
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">Min Investment</span>
                <span className="text-sm font-medium">
                  ${property.minInvestment.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">Term</span>
                <span className="text-sm font-medium">
                  {property.term} months
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {property.location}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
