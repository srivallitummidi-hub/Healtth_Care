import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RestockingPerformanceProps {
  data: Array<{
    strategy: string;
    avgDemand: number;
    avgStock: number;
    adequacyRate: number;
    recordCount: number;
  }>;
}

export const RestockingPerformanceChart = ({ data }: RestockingPerformanceProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Restocking Strategy Performance</h2>
      <p className="text-sm text-gray-500 mb-4">Comparison of stock adequacy rates across different strategies</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="strategy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="adequacyRate" fill="#8b5cf6" name="Stock Adequacy Rate (%)" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.strategy} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{item.strategy}</h3>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                item.adequacyRate >= 70 ? 'bg-green-100 text-green-700' :
                item.adequacyRate >= 50 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.adequacyRate}% Adequacy
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Avg Demand</p>
                <p className="font-semibold text-gray-900">{item.avgDemand.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Stock</p>
                <p className="font-semibold text-gray-900">{item.avgStock.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Records</p>
                <p className="font-semibold text-gray-900">{item.recordCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
