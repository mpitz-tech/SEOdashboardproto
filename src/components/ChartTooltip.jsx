import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

const ChartTooltip = ({ title, composition, meaning }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="chart-tooltip-container">
      <button
        className="chart-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle size={16} />
      </button>
      
      {isVisible && (
        <div className="chart-tooltip">
          <div className="chart-tooltip-header">
            <strong>{title}</strong>
          </div>
          
          <div className="chart-tooltip-section">
            <h4>What this shows:</h4>
            <p>{composition}</p>
          </div>
          
          <div className="chart-tooltip-section">
            <h4>What it means:</h4>
            <p>{meaning}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartTooltip