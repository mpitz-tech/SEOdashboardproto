import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <Loader2 className="spinner-icon" />
        <h2>Loading SEO Data...</h2>
        <p>Processing analytics and search console data</p>
      </div>
    </div>
  )
}

export default LoadingSpinner