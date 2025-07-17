import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricCard = ({ metric }) => {
  const { title, value, change, trend, icon: Icon, color } = metric

  return (
    <div className={`metric-card ${color}`}>
      <div className="metric-header">
        <div className="metric-icon">
          <Icon size={20} />
        </div>
        <div className="metric-change">
          {trend === 'up' ? (
            <TrendingUp size={16} className="trend-up" />
          ) : (
            <TrendingDown size={16} className="trend-down" />
          )}
          <span className={trend === 'up' ? 'change-up' : 'change-down'}>
            {change}
          </span>
        </div>
      </div>
      
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-title">{title}</div>
      </div>
    </div>
  )
}

export default MetricCard