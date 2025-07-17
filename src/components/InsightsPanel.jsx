import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign, Eye, Search, Users, Zap, Brain } from 'lucide-react'
import ChartContainer from './ChartContainer'
import insightsService from '../services/insightsService'

const InsightsPanel = ({ data }) => {
  const [selectedPersona, setSelectedPersona] = useState('seo')
  const [insights, setInsights] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      setLoading(true)
      await insightsService.initialize()
      
      const insightData = {
        rpi: insightsService.getRevenuePerImpressionAnalysis(),
        ctrOpportunities: insightsService.getCTROpportunities(),
        rankRisk: insightsService.getRankLossRisk(),
        funnel: insightsService.getQueryRevenueeFunnel(),
        deviceDisparity: insightsService.getDeviceDisparity(),
        brandAnalysis: insightsService.getBrandVsNonBrandAnalysis(),
        pageClusters: insightsService.getPageClustersAnalysis(),
        revenueShare: insightsService.getRevenueShareAnalysis(),
        intentGap: insightsService.getQueryIntentGap(),
        forecast: insightsService.getRevenueUpliftForecast()
      }
      
      setInsights(insightData)
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const personas = [
    { 
      id: 'seo', 
      label: 'SEO & Content', 
      icon: Search,
      color: 'blue',
      description: 'Keyword optimization, content strategy, technical SEO'
    },
    { 
      id: 'product', 
      label: 'Product & Merchandising', 
      icon: Target,
      color: 'green', 
      description: 'User experience, conversion optimization, product strategy'
    },
    { 
      id: 'executive', 
      label: 'Executive & Marketing', 
      icon: TrendingUp,
      color: 'purple',
      description: 'Revenue impact, forecasting, strategic decisions'
    }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`
  }

  const renderSEOInsights = () => (
    <div className="insights-section">
      <h3 className="section-title">SEO & Content Manager Insights</h3>
      
      {/* Revenue per Impression Analysis */}
      <div className="insight-card">
        <div className="insight-header">
          <DollarSign className="insight-icon" size={20} />
          <h4>Revenue-per-Impression (RPI) by Query</h4>
          <span className="insight-badge">High-Value Keywords</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>RPI</th>
                  <th>Revenue</th>
                  <th>Impressions</th>
                  <th>Rev/Click</th>
                </tr>
              </thead>
              <tbody>
                {insights.rpi?.slice(0, 10).map((query, index) => (
                  <tr key={index}>
                    <td className="query-cell">{query.query}</td>
                    <td className="rpi-cell">{formatCurrency(query.rpi)}</td>
                    <td>{formatCurrency(query.totalRevenue)}</td>
                    <td>{query.totalImpressions.toLocaleString()}</td>
                    <td>{formatCurrency(query.revenuePerClick)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Focus on the top 20% of queries driving 80% of revenue. These high-RPI keywords deserve premium content investment.</p>
          </div>
        </div>
      </div>

      {/* CTR Opportunities */}
      <div className="insight-card">
        <div className="insight-header">
          <Target className="insight-icon" size={20} />
          <h4>CTR Optimization Opportunities</h4>
          <span className="insight-badge warning">Quick Wins</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Query</th>
                  <th>Position</th>
                  <th>Current CTR</th>
                  <th>Site Avg</th>
                  <th>Revenue Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {insights.ctrOpportunities?.slice(0, 8).map((opp, index) => (
                  <tr key={index}>
                    <td className="page-cell">{opp.page}</td>
                    <td className="query-cell">{opp.query}</td>
                    <td className="position-cell">{opp.position.toFixed(1)}</td>
                    <td className="ctr-cell">{formatPercent(opp.currentCTR * 100)}</td>
                    <td className="ctr-cell">{formatPercent(opp.siteAvgCTR * 100)}</td>
                    <td className="revenue-cell">{formatCurrency(opp.revenueOpportunity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Pages ranking in top 10 but underperforming on CTR. Meta title/description optimization can deliver immediate ROI.</p>
          </div>
        </div>
      </div>

      {/* Brand vs Non-Brand Analysis */}
      <div className="insight-card">
        <div className="insight-header">
          <Brain className="insight-icon" size={20} />
          <h4>Brand vs Non-Brand Performance</h4>
          <span className="insight-badge">Content Strategy</span>
        </div>
        <div className="insight-content">
          <div className="brand-comparison">
            <div className="brand-metric">
              <h5>Brand Keywords</h5>
              <div className="metric-value">{formatCurrency(insights.brandAnalysis?.brand?.rpi || 0)}</div>
              <div className="metric-label">RPI</div>
              <div className="metric-details">
                <span>Revenue: {formatCurrency(insights.brandAnalysis?.brand?.revenue || 0)}</span>
                <span>Queries: {insights.brandAnalysis?.brand?.queries || 0}</span>
              </div>
            </div>
            <div className="brand-metric">
              <h5>Non-Brand Keywords</h5>
              <div className="metric-value">{formatCurrency(insights.brandAnalysis?.nonBrand?.rpi || 0)}</div>
              <div className="metric-label">RPI</div>
              <div className="metric-details">
                <span>Revenue: {formatCurrency(insights.brandAnalysis?.nonBrand?.revenue || 0)}</span>
                <span>Queries: {insights.brandAnalysis?.nonBrand?.queries || 0}</span>
              </div>
            </div>
          </div>
          <div className="insight-summary">
            <p>Non-brand content drives incremental revenue growth. Use this data to justify content marketing budget allocation.</p>
          </div>
        </div>
      </div>

      {/* Query Intent Gap */}
      <div className="insight-card">
        <div className="insight-header">
          <AlertTriangle className="insight-icon" size={20} />
          <h4>Query Intent Gaps</h4>
          <span className="insight-badge warning">Content Mismatch</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Landing Page</th>
                  <th>Clicks</th>
                  <th>CVR</th>
                  <th>Revenue/Click</th>
                </tr>
              </thead>
              <tbody>
                {insights.intentGap?.slice(0, 10).map((gap, index) => (
                  <tr key={index}>
                    <td className="query-cell">{gap.query}</td>
                    <td className="page-cell">{gap.page}</td>
                    <td>{gap.clicks}</td>
                    <td className={`cvr-cell ${gap.cvr < 2 ? 'low' : gap.cvr > 5 ? 'high' : ''}`}>
                      {formatPercent(gap.cvr)}
                    </td>
                    <td>{formatCurrency(gap.revenuePerClick)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>High-click queries with low conversion rates indicate content-intent mismatch. Consider creating targeted landing pages.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProductInsights = () => (
    <div className="insights-section">
      <h3 className="section-title">Product & Merchandising Insights</h3>
      
      {/* Rank Loss Revenue Risk */}
      <div className="insight-card">
        <div className="insight-header">
          <AlertTriangle className="insight-icon" size={20} />
          <h4>Rank-Loss Revenue Risk</h4>
          <span className="insight-badge danger">Revenue at Risk</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Query</th>
                  <th>Position Drop</th>
                  <th>Revenue Risk</th>
                  <th>Weekly Impact</th>
                </tr>
              </thead>
              <tbody>
                {insights.rankRisk?.slice(0, 8).map((risk, index) => (
                  <tr key={index}>
                    <td className="page-cell">{risk.page}</td>
                    <td className="query-cell">{risk.query}</td>
                    <td className="position-cell danger">+{risk.positionDelta.toFixed(1)}</td>
                    <td className="revenue-cell">{formatCurrency(risk.revenueRisk)}</td>
                    <td className="revenue-cell">{formatCurrency(risk.weeklyRevenueImpact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Quantifies revenue impact of ranking drops. Use this to prioritize technical SEO fixes and content updates.</p>
          </div>
        </div>
      </div>

      {/* Query to Revenue Funnel */}
      <div className="insight-card">
        <div className="insight-header">
          <TrendingUp className="insight-icon" size={20} />
          <h4>Query-to-Revenue Funnel Analysis</h4>
          <span className="insight-badge">Conversion Optimization</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th>Visit Rate</th>
                  <th>CVR</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {insights.funnel?.slice(0, 10).map((funnel, index) => (
                  <tr key={index}>
                    <td className="query-cell">{funnel.query}</td>
                    <td>{funnel.impressions.toLocaleString()}</td>
                    <td className="ctr-cell">{formatPercent(funnel.ctr)}</td>
                    <td className="visit-cell">{formatPercent(funnel.visitRate)}</td>
                    <td className={`cvr-cell ${funnel.cvr < 2 ? 'low' : funnel.cvr > 5 ? 'high' : ''}`}>
                      {formatPercent(funnel.cvr)}
                    </td>
                    <td className="revenue-cell">{formatCurrency(funnel.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Identify funnel leakage points. Low CTR = SERP optimization needed. Low CVR = landing page optimization needed.</p>
          </div>
        </div>
      </div>

      {/* Device Disparity */}
      <div className="insight-card">
        <div className="insight-header">
          <Users className="insight-icon" size={20} />
          <h4>Device Performance Disparity</h4>
          <span className="insight-badge">Mobile Optimization</span>
        </div>
        <div className="insight-content">
          <div className="device-comparison">
            {insights.deviceDisparity?.deviceData?.map((device, index) => (
              <div key={index} className="device-metric">
                <h5>{device.device}</h5>
                <div className="device-stats">
                  <div className="stat">
                    <span className="stat-label">CVR</span>
                    <span className="stat-value">{formatPercent(device.cvr)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Rev/Visit</span>
                    <span className="stat-value">{formatCurrency(device.revenuePerVisit)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">{formatCurrency(device.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="device-recommendations">
            <h5>Recommendations:</h5>
            <ul>
              {insights.deviceDisparity?.disparity?.recommendations?.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Page Clusters Analysis */}
      <div className="insight-card">
        <div className="insight-header">
          <Eye className="insight-icon" size={20} />
          <h4>Page Clusters: Rising Impressions vs Revenue</h4>
          <span className="insight-badge">Merchandising</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Page Cluster</th>
                  <th>Pages</th>
                  <th>Impressions</th>
                  <th>Revenue</th>
                  <th>CVR</th>
                  <th>Rev/Impression</th>
                </tr>
              </thead>
              <tbody>
                {insights.pageClusters?.slice(0, 8).map((cluster, index) => (
                  <tr key={index}>
                    <td className="cluster-cell">{cluster.cluster}</td>
                    <td>{cluster.pageCount}</td>
                    <td>{cluster.impressions.toLocaleString()}</td>
                    <td className="revenue-cell">{formatCurrency(cluster.revenue)}</td>
                    <td className={`cvr-cell ${cluster.cvr < 2 ? 'low' : cluster.cvr > 5 ? 'high' : ''}`}>
                      {formatPercent(cluster.cvr)}
                    </td>
                    <td>{formatCurrency(cluster.revenuePerImpression)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Identifies page categories where demand is growing but conversion is lacking. Perfect for merchandising improvements.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExecutiveInsights = () => (
    <div className="insights-section">
      <h3 className="section-title">Executive & Marketing Insights</h3>
      
      {/* Revenue Share vs Click Share */}
      <div className="insight-card">
        <div className="insight-header">
          <DollarSign className="insight-icon" size={20} />
          <h4>Revenue Share vs Click Share Analysis</h4>
          <span className="insight-badge">Strategic Planning</span>
        </div>
        <div className="insight-content">
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Revenue Share</th>
                  <th>Click Share</th>
                  <th>Share Gap</th>
                  <th>Revenue/Click</th>
                </tr>
              </thead>
              <tbody>
                {insights.revenueShare?.slice(0, 10).map((share, index) => (
                  <tr key={index}>
                    <td className="page-cell">{share.page}</td>
                    <td className="share-cell">{formatPercent(share.revenueShare)}</td>
                    <td className="share-cell">{formatPercent(share.clickShare)}</td>
                    <td className={`gap-cell ${share.shareGap > 0 ? 'positive' : 'negative'}`}>
                      {share.shareGap > 0 ? '+' : ''}{formatPercent(share.shareGap)}
                    </td>
                    <td>{formatCurrency(share.revenuePerClick)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Reveals page-level cannibalization and identifies high-value vs high-traffic pages for strategic resource allocation.</p>
          </div>
        </div>
      </div>

      {/* Revenue Uplift Forecasting */}
      <div className="insight-card">
        <div className="insight-header">
          <Zap className="insight-icon" size={20} />
          <h4>Revenue Uplift Forecasting</h4>
          <span className="insight-badge success">ROI Projection</span>
        </div>
        <div className="insight-content">
          <div className="forecast-summary">
            <div className="forecast-total">
              <div className="forecast-value">
                {formatCurrency(insights.forecast?.reduce((sum, f) => sum + f.revenueUplift, 0) || 0)}
              </div>
              <div className="forecast-label">Total Potential Revenue Uplift</div>
            </div>
          </div>
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Query</th>
                  <th>Current Pos</th>
                  <th>Current Revenue</th>
                  <th>Projected Revenue</th>
                  <th>Uplift</th>
                </tr>
              </thead>
              <tbody>
                {insights.forecast?.slice(0, 10).map((forecast, index) => (
                  <tr key={index}>
                    <td className="page-cell">{forecast.page}</td>
                    <td className="query-cell">{forecast.query}</td>
                    <td className="position-cell">{forecast.currentPosition.toFixed(1)}</td>
                    <td className="revenue-cell">{formatCurrency(forecast.currentRevenue)}</td>
                    <td className="revenue-cell">{formatCurrency(forecast.projectedRevenue)}</td>
                    <td className="uplift-cell">{formatCurrency(forecast.revenueUplift)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insight-summary">
            <p>Quantifies dollar impact of ranking improvements. Use these projections to justify SEO investments and set KPIs.</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="insights-loading">
        <div className="loading-spinner">
          <Brain className="spinner-icon" size={48} />
          <h3>Analyzing GA + GSC Data...</h3>
          <p>Generating advanced insights from your combined datasets</p>
        </div>
      </div>
    )
  }

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h2>Advanced SEO Insights</h2>
        <p>Data-driven insights combining Google Analytics and Search Console</p>
      </div>

      <div className="persona-selector">
        {personas.map(persona => {
          const Icon = persona.icon
          return (
            <button
              key={persona.id}
              className={`persona-btn ${selectedPersona === persona.id ? 'active' : ''} ${persona.color}`}
              onClick={() => setSelectedPersona(persona.id)}
            >
              <Icon size={20} />
              <div className="persona-info">
                <span className="persona-label">{persona.label}</span>
                <span className="persona-description">{persona.description}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="insights-content">
        {selectedPersona === 'seo' && renderSEOInsights()}
        {selectedPersona === 'product' && renderProductInsights()}
        {selectedPersona === 'executive' && renderExecutiveInsights()}
      </div>
    </div>
  )
}

export default InsightsPanel