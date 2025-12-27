import { PharmaceuticalData, KPIData, DrugStats } from '../types/data';

export const calculateKPIs = (data: PharmaceuticalData[]): KPIData => {
  const uniqueDrugs = new Set(data.map(d => d.Drug)).size;
  const totalRecords = data.length;

  const totalDemand = data.reduce((sum, d) => sum + d.Demand_Forecast, 0);
  const totalStock = data.reduce((sum, d) => sum + d.Optimal_Stock_Level, 0);

  const avgDemand = totalDemand / totalRecords;
  const avgStockLevel = totalStock / totalRecords;

  const adequateStock = data.filter(d => d.Optimal_Stock_Level >= d.Demand_Forecast).length;
  const stockAdequacyRate = (adequateStock / totalRecords) * 100;

  const understocked = data.filter(d => d.Optimal_Stock_Level < d.Demand_Forecast).length;
  const understockedRate = (understocked / totalRecords) * 100;

  const uniqueStrategies = new Set(data.map(d => d.Restocking_Strategy)).size;

  return {
    totalProducts: uniqueDrugs,
    totalRecords,
    uniqueSuppliers: uniqueStrategies,
    avgDemand: Math.round(avgDemand),
    avgStockLevel: Math.round(avgStockLevel),
    stockAdequacyRate: Math.round(stockAdequacyRate * 10) / 10,
    understockedRate: Math.round(understockedRate * 10) / 10
  };
};

export const getDrugStatistics = (data: PharmaceuticalData[]): DrugStats[] => {
  const drugMap = new Map<string, PharmaceuticalData[]>();

  data.forEach(record => {
    if (!drugMap.has(record.Drug)) {
      drugMap.set(record.Drug, []);
    }
    drugMap.get(record.Drug)!.push(record);
  });

  const stats: DrugStats[] = [];

  drugMap.forEach((records, drug) => {
    const totalDemand = records.reduce((sum, r) => sum + r.Demand_Forecast, 0);
    const totalStock = records.reduce((sum, r) => sum + r.Optimal_Stock_Level, 0);
    const recordCount = records.length;
    const avgDemand = totalDemand / recordCount;
    const avgStock = totalStock / recordCount;
    const adequateRecords = records.filter(r => r.Optimal_Stock_Level >= r.Demand_Forecast).length;
    const stockAdequacy = (adequateRecords / recordCount) * 100;
    const understocked = recordCount - adequateRecords;

    stats.push({
      drug,
      totalDemand,
      totalStock,
      avgDemand: Math.round(avgDemand),
      avgStock: Math.round(avgStock),
      recordCount,
      stockAdequacy: Math.round(stockAdequacy),
      understocked
    });
  });

  return stats.sort((a, b) => b.totalDemand - a.totalDemand);
};

export const getRestockingDistribution = (data: PharmaceuticalData[]) => {
  const distribution = new Map<string, number>();

  data.forEach(record => {
    const strategy = record.Restocking_Strategy;
    distribution.set(strategy, (distribution.get(strategy) || 0) + 1);
  });

  return Array.from(distribution.entries()).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / data.length) * 100 * 10) / 10
  })).sort((a, b) => b.value - a.value);
};

export const getDemandDistribution = (data: PharmaceuticalData[]) => {
  const ranges = [
    { label: '0-2000', min: 0, max: 2000 },
    { label: '2001-4000', min: 2001, max: 4000 },
    { label: '4001-6000', min: 4001, max: 6000 },
    { label: '6001-8000', min: 6001, max: 8000 },
    { label: '8001+', min: 8001, max: Infinity }
  ];

  return ranges.map(range => ({
    range: range.label,
    count: data.filter(d =>
      d.Demand_Forecast >= range.min && d.Demand_Forecast <= range.max
    ).length
  }));
};

export const getStockVsDemandAnalysis = (data: PharmaceuticalData[]) => {
  const drugStats = getDrugStatistics(data);

  return drugStats.map(stat => ({
    drug: stat.drug,
    avgDemand: stat.avgDemand,
    avgStock: stat.avgStock,
    difference: stat.avgStock - stat.avgDemand
  }));
};

export const getLowStockAlerts = (data: PharmaceuticalData[], threshold: number = 0.8) => {
  return data
    .filter(d => d.Optimal_Stock_Level < d.Demand_Forecast * threshold)
    .map(d => ({
      drug: d.Drug,
      demand: d.Demand_Forecast,
      stock: d.Optimal_Stock_Level,
      shortage: d.Demand_Forecast - d.Optimal_Stock_Level,
      shortagePercentage: Math.round(((d.Demand_Forecast - d.Optimal_Stock_Level) / d.Demand_Forecast) * 100),
      restockingStrategy: d.Restocking_Strategy
    }))
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 50);
};

export const getRestockingStrategyPerformance = (data: PharmaceuticalData[]) => {
  const strategyMap = new Map<string, PharmaceuticalData[]>();

  data.forEach(record => {
    if (!strategyMap.has(record.Restocking_Strategy)) {
      strategyMap.set(record.Restocking_Strategy, []);
    }
    strategyMap.get(record.Restocking_Strategy)!.push(record);
  });

  return Array.from(strategyMap.entries()).map(([strategy, records]) => {
    const avgDemand = records.reduce((sum, r) => sum + r.Demand_Forecast, 0) / records.length;
    const avgStock = records.reduce((sum, r) => sum + r.Optimal_Stock_Level, 0) / records.length;
    const adequateStock = records.filter(r => r.Optimal_Stock_Level >= r.Demand_Forecast).length;
    const adequacyRate = (adequateStock / records.length) * 100;

    return {
      strategy,
      avgDemand: Math.round(avgDemand),
      avgStock: Math.round(avgStock),
      adequacyRate: Math.round(adequacyRate),
      recordCount: records.length
    };
  });
};
