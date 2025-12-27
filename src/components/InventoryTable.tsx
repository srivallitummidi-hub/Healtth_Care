import { DrugStats } from '../types/data';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryTableProps {
  data: DrugStats[];
}

export const InventoryTable = ({ data }: InventoryTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Inventory Analysis by Drug</h2>
        <p className="text-sm text-gray-500 mt-1">Comprehensive view of stock levels and demand patterns</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Drug Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adequacy Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Understocked
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((drug) => {
              const isLowStock = drug.avgStock < drug.avgDemand;
              const difference = drug.avgStock - drug.avgDemand;

              return (
                <tr key={drug.drug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{drug.drug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {drug.avgDemand.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {drug.avgStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {isLowStock ? (
                        <span className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Adequate
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {drug.recordCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">{drug.stockAdequacy}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            drug.stockAdequacy >= 70 ? 'bg-green-500' :
                            drug.stockAdequacy >= 50 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${drug.stockAdequacy}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${drug.understocked > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {drug.understocked.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
