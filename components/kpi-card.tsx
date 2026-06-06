'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: 'blue' | 'orange' | 'green' | 'purple' | 'teal'
  onClick?: () => void
}

const colorMap = {
  blue: 'border-[var(--status-blue)] bg-blue-50',
  orange: 'border-[var(--status-orange)] bg-orange-50',
  green: 'border-[var(--status-green)] bg-green-50',
  purple: 'border-[var(--status-purple)] bg-purple-50',
  teal: 'border-[var(--status-teal)] bg-teal-50',
}

const textColorMap = {
  blue: 'text-blue-700',
  orange: 'text-orange-700',
  green: 'text-green-700',
  purple: 'text-purple-700',
  teal: 'text-teal-700',
}

export function KPICard({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  color = 'blue',
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${colorMap[color]} ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${textColorMap[color]}`}>{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              {trend === 'up' && (
                <ArrowUp className={`w-4 h-4 ${textColorMap[color]}`} />
              )}
              {trend === 'down' && (
                <ArrowDown className={`w-4 h-4 ${textColorMap[color]}`} />
              )}
              <span className={`text-xs font-semibold ${textColorMap[color]}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className={`text-2xl ${textColorMap[color]}`}>{icon}</div>}
      </div>
    </div>
  )
}
