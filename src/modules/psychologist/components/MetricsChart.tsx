import React from 'react';
import { Card } from '@/shared/components';
import { MetricData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsChartProps {
  title: string;
  data: MetricData[];
  trend?: 'up' | 'down' | 'stable';
  valueLabel?: string;
}

/**
 * Gráfico de métricas de evolución
 * Visualiza el progreso de pacientes en el tiempo
 */
export const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  data,
  trend = 'stable',
  valueLabel = 'Puntuación'
}) => {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          Sin datos disponibles
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className={`w-5 h-5 ${getTrendColor()}`} />;
      case 'down':
        return <TrendingDown className={`w-5 h-5 ${getTrendColor()}`} />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {getTrendIcon()}
      </div>

      <div className="space-y-4">
        {/* Miniature chart representation */}
        <div className="flex items-end justify-between h-32 gap-1 bg-gray-100 p-4 rounded-lg">
          {data.map((item, index) => {
            const height = ((item.value - minValue) / range) * 100;
            return (
              <div
                key={index}
                className="flex-1 bg-blue-500 rounded-t cursor-pointer hover:bg-blue-600 transition-colors group relative"
                style={{ height: `${height || 5}%` }}
                title={`${item.label}: ${item.value}`}
              >
                <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data table */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium">Fecha</th>
                <th className="text-right py-2 px-2 font-medium">{valueLabel}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-700">{item.label}</td>
                  <td className="py-2 px-2 text-right font-semibold text-gray-800">
                    {item.value.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Mínimo</div>
            <div className="text-lg font-semibold text-gray-800">{minValue.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Promedio</div>
            <div className="text-lg font-semibold text-gray-800">
              {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Máximo</div>
            <div className="text-lg font-semibold text-gray-800">{maxValue.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
