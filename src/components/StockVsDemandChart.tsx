import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StockVsDemandProps {
  data: Array<{ drug: string; avgDemand: number; avgStock: number; difference: number }>;
}

export const StockVsDemandChart = ({ data }: StockVsDemandProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Stock vs Demand Analysis by Drug</h2>
      <p className="text-sm text-gray-500 mb-4">Comparison of average stock levels against demand forecasts</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="drug" />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
          <Bar dataKey="avgDemand" fill="#f59e0b" name="Avg Demand" />
          <Bar dataKey="avgStock" fill="#10b981" name="Avg Stock" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {data.map((item) => (
          <div key={item.drug} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{item.drug}</span>
            <span className={`font-semibold ${item.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.difference >= 0 ? '+' : ''}{item.difference.toLocaleString()} units
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
