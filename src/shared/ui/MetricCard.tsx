import { ReactNode } from "react";

export interface MetricCardProps {
    title: string;
    subtitle?: string;
    value: string | number;
    icon?: ReactNode;
    className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    subtitle,
    value,
    icon,
    className = "",
}) => {
    return (
    <div
      className={`
        rounded-lg border border-gray-200 bg-white p-4 shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className="ml-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
    )
}