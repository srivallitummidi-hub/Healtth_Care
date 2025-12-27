export interface PharmaceuticalData {
  Drug: string;
  Demand_Forecast: number;
  Optimal_Stock_Level: number;
  Restocking_Strategy: string;
}

export interface KPIData {
  totalProducts: number;
  totalRecords: number;
  uniqueSuppliers: number;
  avgDemand: number;
  avgStockLevel: number;
  stockAdequacyRate: number;
  understockedRate: number;
}

export interface DrugStats {
  drug: string;
  totalDemand: number;
  totalStock: number;
  avgDemand: number;
  avgStock: number;
  recordCount: number;
  stockAdequacy: number;
  understocked: number;
}
