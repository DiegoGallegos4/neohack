"use client";

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Home,
  Info,
  MapPin,
  Shield,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { InvestmentForm } from "@/components/InvestmentForm";
import { ProgressBar } from "@/components/ProgressBar";
import { formatCurrency, mockProperties } from "@/components/funding/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/router";

const propertyDetails = mockProperties[0];

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const property = router.query.propertyData
    ? JSON.parse(router.query.propertyData as string)
    : null;
  const propertyData = {
    ...property,
    investmentType: "Lending",
  };
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/funding"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all properties
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Image
            src={propertyData.pool.image}
            alt={propertyData.name}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {propertyData.investmentType}
                </p>
                <h1 className="text-3xl font-bold mb-4">
                  {propertyDetails.title}
                </h1>
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-semibold">
                    {propertyData.pool.lendingRate / 100}% IRR
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span>{propertyData.pool.term} Month Term</span>
                </div>
              </div>
              <div>
                <ProgressBar
                  progress={
                    (propertyData.pool.availableAmount /
                      propertyData.pool.targetAmount) *
                    100
                  }
                />
                <div className="flex justify-between mt-2 mb-4">
                  <span className="text-sm text-gray-600">
                    {propertyDetails.investors} investors
                  </span>
                  <span className="text-sm font-medium">
                    {propertyData.pool.availableAmount} $
                    {formatCurrency(
                      Number(propertyData.pool.targetAmount) /
                        10000000000000000,
                    )}{" "}
                  </span>
                </div>
                <InvestmentForm
                  propertyName={propertyDetails.title}
                  poolContract={params.id}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem
                icon={<DollarSign className="h-5 w-5" />}
                label="Investment Target"
                value={`$${formatCurrency(
                  Number(propertyData.pool.targetAmount) / 10000000000000000,
                )}`}
                tooltip="The total amount of funding sought for this investment opportunity."
              />
              <DetailItem
                icon={<TrendingUp className="h-5 w-5" />}
                label="Expected Return"
                value={`${propertyData.pool.lendingRate / 100}%`}
                tooltip="The projected annual return on investment."
              />
              <DetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="Investment Term"
                value={`${propertyDetails.term} months`}
                tooltip="The duration of the investment period."
              />
              <DetailItem
                icon={<DollarSign className="h-5 w-5" />}
                label="Minimum Investment"
                value={`$${propertyDetails.minInvestment.toLocaleString()}`}
                tooltip="The smallest amount that can be invested in this property."
              />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Location</h2>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{propertyDetails.location}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip: string;
}) {
  return (
    <div className="flex items-center">
      {icon}
      <div className="ml-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400 ml-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
