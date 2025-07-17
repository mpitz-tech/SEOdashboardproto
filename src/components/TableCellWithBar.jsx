import React from 'react'

const TableCellWithBar = ({ value, maxValue, children, color = '#3B82F6' }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  
  return (
    <td className="table-cell-with-bar">
      <div 
        className="table-cell-bar" 
        style={{ 
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}20 0%, ${color}08 100%)`
        }}
      />
      <div className="table-cell-content">
        {children || (typeof value === 'number' ? value.toLocaleString() : value)}
      </div>
    </td>
  )
}

export default TableCellWithBar