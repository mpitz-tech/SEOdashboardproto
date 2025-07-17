import React from 'react'
import { Users, ShoppingCart, DollarSign, Search, TrendingUp, Eye } from 'lucide-react'
import MetricCard from './MetricCard'
import ChartContainer from './ChartContainer'
import TableCellWithBar from './TableCellWithBar'
import dataService from '../services/dataService'

const OverviewPanel = ({ data }) => {
  const metrics = data.metrics
  const timeSeriesData = dataService.getTimeSeriesData()
  const deviceChannelData = dataService.getDeviceChannelData()
  const topPages = dataService.getTopPages(5)
  const topQueries = dataService.getTopQueries(5)

  // Calculate weekly trends (last 7 days vs previous 7 days)
  const calculateWeeklyTrends = () => {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // Analytics data trends
    const thisWeekAnalytics = dataService.getAnalyticsData().filter(item => 
      new Date(item.date) >= last7Days && new Date(item.date) <= now
    )
    const lastWeekAnalytics = dataService.getAnalyticsData().filter(item => 
      new Date(item.date) >= last14Days && new Date(item.date) < last7Days
    )

    const thisWeekVisits = thisWeekAnalytics.reduce((sum, item) => sum + item.visits, 0)
    const lastWeekVisits = lastWeekAnalytics.reduce((sum, item) => sum + item.visits, 0)
    const thisWeekOrders = thisWeekAnalytics.reduce((sum, item) => sum + item.orders, 0)
    const lastWeekOrders = lastWeekAnalytics.reduce((sum, item) => sum + item.orders, 0)
    const thisWeekRevenue = thisWeekAnalytics.reduce((sum, item) => sum + item.revenue, 0)
    const lastWeekRevenue = lastWeekAnalytics.reduce((sum, item) => sum + item.revenue, 0)

    // Search Console data trends
    const thisWeekSearch = dataService.getSearchConsoleData().filter(item => 
      new Date(item.date) >= last7Days && new Date(item.date) <= now
    )
    const lastWeekSearch = dataService.getSearchConsoleData().filter(item => 
      new Date(item.date) >= last14Days && new Date(item.date) < last7Days
    )

    const thisWeekClicks = thisWeekSearch.reduce((sum, item) => sum + item.clicks, 0)
    const lastWeekClicks = lastWeekSearch.reduce((sum, item) => sum + item.clicks, 0)
    const thisWeekImpressions = thisWeekSearch.reduce((sum, item) => sum + item.impressions, 0)
    const lastWeekImpressions = lastWeekSearch.reduce((sum, item) => sum + item.impressions, 0)
    
    // Calculate average position (lower is better)
    const thisWeekAvgPos = thisWeekSearch.length > 0 ? 
      thisWeekSearch.reduce((sum, item) => sum + item.position, 0) / thisWeekSearch.length : 0
    const lastWeekAvgPos = lastWeekSearch.length > 0 ? 
      lastWeekSearch.reduce((sum, item) => sum + item.position, 0) / lastWeekSearch.length : 0

    return {
      visits: lastWeekVisits > 0 ? ((thisWeekVisits - lastWeekVisits) / lastWeekVisits) * 100 : 0,
      orders: lastWeekOrders > 0 ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100 : 0,
      revenue: lastWeekRevenue > 0 ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 : 0,
      clicks: lastWeekClicks > 0 ? ((thisWeekClicks - lastWeekClicks) / lastWeekClicks) * 100 : 0,
      impressions: lastWeekImpressions > 0 ? ((thisWeekImpressions - lastWeekImpressions) / lastWeekImpressions) * 100 : 0,
      avgPosition: lastWeekAvgPos > 0 ? lastWeekAvgPos - thisWeekAvgPos : 0 // Position improvement (lower is better)
    }
  }

  const weeklyTrends = calculateWeeklyTrends()

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Grouped metrics by category
  const trafficMetrics = [
    {
      title: 'Total Visits',
      value: metrics.totalVisits.toLocaleString(),
      change: `${formatChange(weeklyTrends.visits)} vs last week`,
      trend: weeklyTrends.visits >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Search Clicks',
      value: metrics.totalClicks.toLocaleString(),
      change: `${formatChange(weeklyTrends.clicks)} vs last week`,
      trend: weeklyTrends.clicks >= 0 ? 'up' : 'down',
      icon: Search,
      color: 'blue'
    }
  ]

  const conversionMetrics = [
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      change: `${formatChange(weeklyTrends.orders)} vs last week`,
      trend: weeklyTrends.orders >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: `${formatChange(weeklyTrends.revenue)} vs last week`,
      trend: weeklyTrends.revenue >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'green'
    }
  ]

  const visibilityMetrics = [
    {
      title: 'Impressions',
      value: metrics.totalImpressions.toLocaleString(),
      change: `${formatChange(weeklyTrends.impressions)} vs last week`,
      trend: weeklyTrends.impressions >= 0 ? 'up' : 'down',
      icon: Eye,
      color: 'purple'
    },
    {
      title: 'Avg. Position',
      value: metrics.avgPosition.toFixed(1),
      change: weeklyTrends.avgPosition > 0 
        ? `Improved by ${weeklyTrends.avgPosition.toFixed(1)} positions`
        : weeklyTrends.avgPosition < 0
        ? `Declined by ${Math.abs(weeklyTrends.avgPosition).toFixed(1)} positions`
        : 'No change vs last week',
      trend: weeklyTrends.avgPosition > 0 ? 'up' : 'down', // Positive avgPosition change means improvement (better ranking)
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  return (
    <div className="overview-panel">
      <div className="overview-header">
        <h2>SEO Performance Overview</h2>
        <div className="overview-meta">
          <p className="date-range">
            <strong>Data Period:</strong> {metrics.dateRange?.start?.toLocaleDateString()} to {metrics.dateRange?.end?.toLocaleDateString()} 
            ({metrics.dataFreshness?.dataSpan} days)
          </p>
          <p className="data-freshness">
            <strong>Last Updated:</strong> {metrics.dataFreshness?.lastUpdated?.toLocaleDateString()} 
            ({metrics.dataFreshness?.totalDataPoints?.toLocaleString()} data points)
          </p>
        </div>
      </div>

      <div className="metrics-sections">
        <div className="metrics-section">
          <h3 className="section-title">Traffic Performance</h3>
          <div className="metrics-grid">
            {trafficMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>

        <div className="metrics-section">
          <h3 className="section-title">Conversion Performance</h3>
          <div className="metrics-grid">
            {conversionMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>

        <div className="metrics-section">
          <h3 className="section-title">Search Visibility</h3>
          <div className="metrics-grid">
            {visibilityMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <ChartContainer
          title="Traffic & Revenue Trends"
          data={timeSeriesData}
          type="line"
          height={300}
          releaseDate="2025-06-15"
          composition="Daily website visits aggregated over time from your analytics data. Shows the trend of user sessions and page views."
          meaning="Rising trends indicate growing audience engagement. Look for patterns that correlate with marketing campaigns, content releases, or seasonal factors. The reference line shows when significant changes (like product launches) occurred."
        />
        
        <ChartContainer
          title="Device Breakdown"
          data={deviceChannelData.device}
          type="pie"
          height={300}
          composition="Percentage distribution of website visits by device type: Desktop, Mobile, and Tablet users."
          meaning="Mobile-first trends show user behavior shifts. High mobile traffic suggests need for mobile optimization. Desktop dominance might indicate B2B audience or complex workflows requiring larger screens."
        />
        
        <ChartContainer
          title="Traffic Sources"
          data={deviceChannelData.channel}
          type="bar"
          height={300}
          composition="Website visits grouped by acquisition channel: Organic Search, Paid Search, Direct, Email, Social Media, and Referral traffic."
          meaning="Organic Search dominance indicates strong SEO performance. Balanced channels suggest diversified marketing. High Direct traffic shows brand strength. Monitor for over-dependence on any single channel."
        />
      </div>

      <div className="tables-grid">
        <div className="table-container">
          <h3>Top Performing Pages</h3>
          <div className="table-scroll">
            <table className="data-table table-with-bars">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Visits</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => {
                  const maxVisits = Math.max(...topPages.map(p => p.visits))
                  const maxRevenue = Math.max(...topPages.map(p => p.revenue))
                  const conversionRate = ((page.orders / page.visits) * 100)
                  
                  return (
                    <tr key={index}>
                      <td className="page-cell">{page.page}</td>
                      <TableCellWithBar value={page.visits} maxValue={maxVisits}>
                        {page.visits.toLocaleString()}
                      </TableCellWithBar>
                      <td>{page.orders}</td>
                      <TableCellWithBar value={page.revenue} maxValue={maxRevenue} color="#10B981">
                        ${page.revenue.toFixed(2)}
                      </TableCellWithBar>
                      <td>{conversionRate.toFixed(2)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <h3>Top Search Queries</h3>
          <div className="table-scroll">
            <table className="data-table table-with-bars">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Clicks</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {topQueries.map((query, index) => {
                  const maxClicks = Math.max(...topQueries.map(q => q.clicks))
                  const maxImpressions = Math.max(...topQueries.map(q => q.impressions))
                  
                  return (
                    <tr key={index}>
                      <td className="query-cell">{query.query}</td>
                      <TableCellWithBar value={query.clicks} maxValue={maxClicks} color="#F59E0B">
                        {query.clicks}
                      </TableCellWithBar>
                      <TableCellWithBar value={query.impressions} maxValue={maxImpressions} color="#8B5CF6">
                        {query.impressions}
                      </TableCellWithBar>
                      <td>{(query.ctr * 100).toFixed(2)}%</td>
                      <td>{query.position.toFixed(1)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPanel