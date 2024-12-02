export type Property = {
  location: any;
  term: any;
  minInvestment: any;
  investors: any;
  image: any;
  title: any;
  id: string;
  name: string;
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
    image: string;
    investors: number;
    minInvestment: number;
    term: number;
    location: string;
    institution: {
      id: string;
    };
  };
  poolAddress: string;
};

export const mockProperties: Property[] = [
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

export interface ProjectQueryResult {
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

export const formatCurrency = (num: number): string => {
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
