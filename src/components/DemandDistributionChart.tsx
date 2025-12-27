import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DemandDistributionProps {
  data: Array<{ range: string; count: number }>;
}

export const DemandDistributionChart = ({ data }: DemandDistributionProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Demand Forecast Distribution</h2>
      <p className="text-sm text-gray-500 mb-4">Distribution of demand forecasts across different ranges</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Number of Records" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
