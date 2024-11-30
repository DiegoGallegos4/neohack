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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This would typically come from an API or database
const propertyDetails = {
  id: "1",
  image: "/placeholder.svg?height=400&width=600",
  title: "Downtown Apartment Complex",
  investmentType: "Real Estate",
  annualReturn: 12.5,
  term: 36,
  investors: 120,
  currentInvestment: 3750000,
  target: 5000000,
  riskCategory: "Medium",
  ltv: 65,
  location: "New York, NY",
  minInvestment: 5000,
};

export default function PropertyDetail({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the property details based on the ID
  // const propertyDetails = await getPropertyDetails(params.id)

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all properties
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Image
            src={propertyDetails.image}
            alt={propertyDetails.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {propertyDetails.investmentType}
                </p>
                <h1 className="text-3xl font-bold mb-4">
                  {propertyDetails.title}
                </h1>
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-semibold">
                    {propertyDetails.annualReturn}% Annual Return
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span>{propertyDetails.term} Month Term</span>
                </div>
              </div>
              <div>
                <ProgressBar
                  progress={
                    (propertyDetails.currentInvestment /
                      propertyDetails.target) *
                    100
                  }
                />
                <div className="flex justify-between mt-2 mb-4">
                  <span className="text-sm text-gray-600">
                    {propertyDetails.investors} investors
                  </span>
                  <span className="text-sm font-medium">
                    ${propertyDetails.currentInvestment.toLocaleString()} of $
                    {propertyDetails.target.toLocaleString()}
                  </span>
                </div>
                <InvestmentForm
                  propertyName={propertyDetails.title}
                  minInvestment={propertyDetails.minInvestment}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem
                icon={<DollarSign className="h-5 w-5" />}
                label="Investment Target"
                value={`$${propertyDetails.target.toLocaleString()}`}
                tooltip="The total amount of funding sought for this investment opportunity."
              />
              <DetailItem
                icon={<TrendingUp className="h-5 w-5" />}
                label="Expected Return"
                value={`${propertyDetails.annualReturn}%`}
                tooltip="The projected annual return on investment."
              />
              <DetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="Investment Term"
                value={`${propertyDetails.term} months`}
                tooltip="The duration of the investment period."
              />
              <DetailItem
                icon={<Shield className="h-5 w-5" />}
                label="Risk Category"
                value={propertyDetails.riskCategory}
                tooltip="The assessed level of risk associated with this investment."
              />
              <DetailItem
                icon={<Home className="h-5 w-5" />}
                label="LTV"
                value={`${propertyDetails.ltv}%`}
                tooltip="Loan-to-Value ratio: the ratio of the loan amount to the appraised value of the property."
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