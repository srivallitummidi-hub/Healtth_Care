import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { PharmaceuticalData } from '../types/data';
import {
  calculateKPIs,
  getDrugStatistics,
  getRestockingDistribution,
  getDemandDistribution,
  getStockVsDemandAnalysis,
  getLowStockAlerts,
  getRestockingStrategyPerformance
} from '../utils/dataAnalysis';
import { KPICard } from './KPICard';
import { InventoryTable } from './InventoryTable';
import { AlertsSection } from './AlertsSection';
import { RestockingDistributionChart } from './RestockingDistributionChart';
import { DemandDistributionChart } from './DemandDistributionChart';
import { StockVsDemandChart } from './StockVsDemandChart';
import { RestockingPerformanceChart } from './RestockingPerformanceChart';

export const Dashboard = () => {
  const [data, setData] = useState<PharmaceuticalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data as PharmaceuticalData[];
            setData(parsedData);
            setLoading(false);
          },
          error: (error: Error) => {
            setError(error.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading pharmaceutical supply chain data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const kpis = calculateKPIs(data);
  const drugStats = getDrugStatistics(data);
  const restockingDist = getRestockingDistribution(data);
  const demandDist = getDemandDistribution(data);
  const stockVsDemand = getStockVsDemandAnalysis(data);
  const alerts = getLowStockAlerts(data);
  const restockingPerf = getRestockingStrategyPerformance(data);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pharmaceutical Supply Chain Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time inventory optimization and demand forecasting analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Drug Types"
              value={kpis.totalProducts}
              icon={Package}
              color="blue"
            />
            <KPICard
              title="Total Records"
              value={kpis.totalRecords.toLocaleString()}
              icon={ShoppingCart}
              color="green"
            />
            <KPICard
              title="Restocking Strategies"
              value={kpis.uniqueSuppliers}
              icon={TrendingUp}
              color="teal"
            />
            <KPICard
              title="Avg Demand Forecast"
              value={kpis.avgDemand.toLocaleString()}
              icon={BarChart3}
              trend="units per record"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <KPICard
              title="Avg Optimal Stock"
              value={kpis.avgStockLevel.toLocaleString()}
              icon={Package}
              trend="units per record"
              color="slate"
            />
            <KPICard
              title="Stock Adequacy Rate"
              value={`${kpis.stockAdequacyRate}%`}
              icon={CheckCircle2}
              trend="stock meets demand"
              color="green"
            />
            <KPICard
              title="Understocked Rate"
              value={`${kpis.understockedRate}%`}
              icon={AlertCircle}
              trend="stock below demand"
              color="red"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            Critical Alerts
          </h2>
          <AlertsSection alerts={alerts} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Inventory Analysis
          </h2>
          <InventoryTable data={drugStats} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Supply Chain Performance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RestockingDistributionChart data={restockingDist} />
            <RestockingPerformanceChart data={restockingPerf} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Demand & Consumption Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemandDistributionChart data={demandDist} />
            <StockVsDemandChart data={stockVsDemand} />
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Dataset Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p><strong>Dataset:</strong> Pharmaceutical Supply Chain Optimization</p>
                <p><strong>Total Records:</strong> {data.length.toLocaleString()}</p>
                <p><strong>Unique Drugs:</strong> {kpis.totalProducts}</p>
              </div>
              <div>
                <p><strong>Columns:</strong> Drug, Demand_Forecast, Optimal_Stock_Level, Restocking_Strategy</p>
                <p><strong>Analysis:</strong> Real-time calculations from actual dataset</p>
                <p><strong>No mock data used</strong> - All metrics derived from CSV</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Pharmaceutical Supply Chain Dashboard | Data-Driven Analytics | Built with React + Recharts + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};
