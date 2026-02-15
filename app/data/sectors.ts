export type Sector = {
  id: string;
  name: string;
  change: number;
  marketCap: string;
  stockCount: number;
};

export const sectors: Sector[] = [
  {
    id: "financials",
    name: "Financials",
    change: 0.42,
    marketCap: "3,150T",
    stockCount: 97,
  },
  {
    id: "consumer-cyclical",
    name: "Consumer Cyclical",
    change: -0.35,
    marketCap: "485T",
    stockCount: 68,
  },
  {
    id: "consumer-non-cyclical",
    name: "Consumer Non-Cyclical",
    change: 0.18,
    marketCap: "620T",
    stockCount: 54,
  },
  {
    id: "energy",
    name: "Energy",
    change: 1.25,
    marketCap: "510T",
    stockCount: 42,
  },
  {
    id: "basic-materials",
    name: "Basic Materials",
    change: 0.87,
    marketCap: "380T",
    stockCount: 58,
  },
  {
    id: "industrials",
    name: "Industrials",
    change: -0.62,
    marketCap: "295T",
    stockCount: 45,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    change: -0.21,
    marketCap: "165T",
    stockCount: 23,
  },
  {
    id: "technology",
    name: "Technology",
    change: 1.53,
    marketCap: "210T",
    stockCount: 18,
  },
  {
    id: "property-real-estate",
    name: "Property & Real Estate",
    change: -0.78,
    marketCap: "175T",
    stockCount: 82,
  },
  {
    id: "transportation-logistics",
    name: "Transportation & Logistics",
    change: 0.34,
    marketCap: "120T",
    stockCount: 31,
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    change: -0.15,
    marketCap: "590T",
    stockCount: 36,
  },
];
