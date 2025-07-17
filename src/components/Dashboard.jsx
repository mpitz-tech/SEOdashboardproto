import React, { useState, useEffect } from 'react'
import OverviewPanel from './OverviewPanel'
import AnalyticsPanel from './AnalyticsPanel'
import AIChat from './AIChat'

const Dashboard = ({ data, onContextChange }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', component: OverviewPanel },
    { id: 'analytics', component: AnalyticsPanel },
    { id: 'ai-chat', component: AIChat }
  ]

  useEffect(() => {
    onContextChange(activeTab)
  }, [activeTab, onContextChange])

  // Listen for hash changes to handle navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash && tabs.find(tab => tab.id === hash)) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <ActiveComponent data={data} currentContext={activeTab} />
      </div>
    </div>
  )
}

export default Dashboard