import { AlertTriangle, TrendingDown } from 'lucide-react';

interface Alert {
  drug: string;
  demand: number;
  stock: number;
  shortage: number;
  shortagePercentage: number;
  restockingStrategy: string;
}

interface AlertsSectionProps {
  alerts: Alert[];
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Critical Stock Alerts</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Items with stock levels below 80% of forecasted demand (Top 50)
        </p>
      </div>
      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No critical stock alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                    <span className="font-semibold text-gray-900">{alert.drug}</span>
                    <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                      {alert.shortagePercentage}% shortage
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      Demand: <span className="font-medium">{alert.demand.toLocaleString()}</span> |
                      Stock: <span className="font-medium">{alert.stock.toLocaleString()}</span> |
                      Shortage: <span className="font-medium text-red-600">{alert.shortage.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Restocking Strategy: <span className="font-medium">{alert.restockingStrategy}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
