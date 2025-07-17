import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, Legend } from 'recharts'
import ChartTooltip from './ChartTooltip'

const ChartContainer = ({ title, data, type, height = 300, releaseDate, composition, meaning }) => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#14B8A6', '#F97316', '#84CC16']
  
  // Color-blind friendly palette
  const colorBlindPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f']

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-tooltip">
          <p className="recharts-tooltip-label">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data.visits || data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tickFormatter={formatNumber}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Total', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={customTooltip} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              {releaseDate && (
                <ReferenceLine 
                  x={releaseDate} 
                  stroke="#EF4444" 
                  strokeDasharray="4 4"
                  label={{ value: "v2 launch", position: "top" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={Math.min(height * 0.35, 100)}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorBlindPalette[index % colorBlindPalette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={formatNumber}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Visits', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div>Chart type not supported</div>
    }
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span>{title}</span>
        {composition && meaning && (
          <ChartTooltip 
            title={title}
            composition={composition}
            meaning={meaning}
          />
        )}
      </h3>
      <div className="chart-content">
        {renderChart()}
      </div>
    </div>
  )
}

export default ChartContainer