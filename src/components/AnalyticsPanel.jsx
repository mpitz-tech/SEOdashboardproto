import React, { useState } from 'react'
import { Filter, Download, Calendar } from 'lucide-react'
import ChartContainer from './ChartContainer'
import dataService from '../services/dataService'

const AnalyticsPanel = ({ data }) => {
  const [selectedView, setSelectedView] = useState('pages')
  const [dateRange, setDateRange] = useState('all')

  const pageInsights = dataService.getPageInsights()
  const queryAnalysis = dataService.getQueryAnalysis()
  const timeSeriesData = dataService.getTimeSeriesData()

  const views = [
    { id: 'pages', label: 'Page Performance' },
    { id: 'queries', label: 'Search Queries' },
    { id: 'trends', label: 'Trends Analysis' }
  ]

  const renderPagePerformance = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h3>Page Performance Analysis</h3>
        <div className="section-controls">
          <button className="filter-btn">
            <Filter size={16} />
            Filter
          </button>
          <button className="export-btn">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Page URL</th>
                <th>Visits</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Conv. Rate</th>
                <th>Search Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Queries</th>
              </tr>
            </thead>
            <tbody>
              {pageInsights.slice(0, 20).map((page, index) => (
                <tr key={index}>
                  <td className="page-cell">
                    <a href={page.page} target="_blank" rel="noopener noreferrer">
                      {page.page}
                    </a>
                  </td>
                  <td>{page.visits.toLocaleString()}</td>
                  <td>{page.orders}</td>
                  <td>${page.revenue.toFixed(2)}</td>
                  <td>{page.conversionRate.toFixed(2)}%</td>
                  <td>{page.clicks}</td>
                  <td>{page.impressions}</td>
                  <td>{page.ctr.toFixed(2)}%</td>
                  <td>{page.queries.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderQueryAnalysis = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h3>Search Query Analysis</h3>
        <div className="section-controls">
          <button className="filter-btn">
            <Filter size={16} />
            Filter
          </button>
          <button className="export-btn">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Avg. Position</th>
                <th>Pages</th>
                <th>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {queryAnalysis.slice(0, 20).map((query, index) => (
                <tr key={index}>
                  <td className="query-cell">{query.query}</td>
                  <td>{query.clicks}</td>
                  <td>{query.impressions}</td>
                  <td>{query.ctr.toFixed(2)}%</td>
                  <td>{query.avgPosition.toFixed(1)}</td>
                  <td>{query.pages.length}</td>
                  <td>
                    <span className={`opportunity ${query.avgPosition > 10 ? 'high' : query.avgPosition > 5 ? 'medium' : 'low'}`}>
                      {query.avgPosition > 10 ? 'High' : query.avgPosition > 5 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderTrendsAnalysis = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h3>Trends Analysis</h3>
        <div className="section-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-selector"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>
      
      <div className="charts-grid">
        <ChartContainer
          title="Visits Over Time"
          data={timeSeriesData.visits}
          type="line"
          height={250}
          composition="Daily website visits from analytics data showing user traffic patterns."
          meaning="Increasing visits indicate growing audience reach. Monitor for traffic spikes correlating with marketing campaigns or content releases."
        />
        
        <ChartContainer
          title="Revenue Over Time"
          data={timeSeriesData.revenue}
          type="line"
          height={250}
          composition="Daily revenue generated from website visits, tracking monetary performance."
          meaning="Revenue trends show business impact of traffic. Look for conversion rate changes and seasonal patterns affecting sales."
        />
        
        <ChartContainer
          title="Search Clicks Over Time"
          data={timeSeriesData.clicks}
          type="line"
          height={250}
          composition="Daily clicks from search engine results, measuring search visibility effectiveness."
          meaning="Click trends indicate search performance and ranking changes. Declining clicks may suggest ranking drops or algorithm updates."
        />
        
        <ChartContainer
          title="Impressions Over Time"
          data={timeSeriesData.impressions}
          type="line"
          height={250}
          composition="Daily search result impressions showing how often your content appears in search results."
          meaning="High impressions with low clicks suggest opportunities to improve titles and meta descriptions for better click-through rates."
        />
      </div>
    </div>
  )

  const renderView = () => {
    switch (selectedView) {
      case 'pages':
        return renderPagePerformance()
      case 'queries':
        return renderQueryAnalysis()
      case 'trends':
        return renderTrendsAnalysis()
      default:
        return renderPagePerformance()
    }
  }

  return (
    <div className="analytics-panel">
      <div className="analytics-header">
        <h2>Detailed Analytics</h2>
        <div className="view-selector">
          {views.map(view => (
            <button
              key={view.id}
              className={`view-btn ${selectedView === view.id ? 'active' : ''}`}
              onClick={() => setSelectedView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {renderView()}
    </div>
  )
}

export default AnalyticsPanel