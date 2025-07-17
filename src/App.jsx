import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import GlobalAIAssistant from './components/GlobalAIAssistant'
import dataService from './services/dataService'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [currentContext, setCurrentContext] = useState('overview')

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const result = await dataService.loadData()
        
        if (result.success) {
          setData({
            analytics: dataService.getAnalyticsData(),
            searchConsole: dataService.getSearchConsoleData(),
            metrics: dataService.getDashboardMetrics()
          })
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="app">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-container">
          <div className="error-message">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <Dashboard data={data} onContextChange={setCurrentContext} />
      <GlobalAIAssistant data={data} currentContext={currentContext} />
      <Footer />
    </div>
  )
}

export default App