// Advanced insights service for GA + GSC data analysis
import dataService from './dataService.js';

class InsightsService {
  constructor() {
    this.gaData = [];
    this.gscData = [];
    this.joinedData = [];
    this.brandKeywords = ['your-brand', 'yourbrand', 'brand-name']; // Update with actual brand terms
  }

  async initialize() {
    this.gaData = dataService.getAnalyticsData();
    this.gscData = dataService.getSearchConsoleData();
    this.joinedData = this.joinDatasets();
    return this.joinedData;
  }

  // Join GA and GSC data on page + date
  joinDatasets() {
    const joined = [];
    
    // Create lookup maps for efficient joining
    const gaLookup = new Map();
    this.gaData.forEach(row => {
      const key = `${row.page}|${row.date}`;
      if (!gaLookup.has(key)) {
        gaLookup.set(key, []);
      }
      gaLookup.get(key).push(row);
    });

    // Join GSC data with GA data
    this.gscData.forEach(gscRow => {
      const key = `${gscRow.page}|${gscRow.date}`;
      const gaMatches = gaLookup.get(key) || [];
      
      if (gaMatches.length > 0) {
        gaMatches.forEach(gaRow => {
          joined.push({
            ...gscRow,
            visits: gaRow.visits || 0,
            orders: gaRow.orders || 0,
            revenue: gaRow.revenue || 0,
            device: gaRow.device || 'Unknown',
            channel: gaRow.channel || 'Unknown'
          });
        });
      } else {
        // Include GSC data even without GA match
        joined.push({
          ...gscRow,
          visits: 0,
          orders: 0,
          revenue: 0,
          device: 'Unknown',
          channel: 'Unknown'
        });
      }
    });

    return joined;
  }

  // 1. Revenue-per-Impression (RPI) by query
  getRevenuePerImpressionAnalysis() {
    const queryMetrics = new Map();
    
    this.joinedData.forEach(row => {
      if (!queryMetrics.has(row.query)) {
        queryMetrics.set(row.query, {
          query: row.query,
          totalRevenue: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalVisits: 0,
          pages: new Set()
        });
      }
      
      const metrics = queryMetrics.get(row.query);
      metrics.totalRevenue += row.revenue;
      metrics.totalImpressions += row.impressions;
      metrics.totalClicks += row.clicks;
      metrics.totalVisits += row.visits;
      metrics.pages.add(row.page);
    });

    return Array.from(queryMetrics.values())
      .map(metric => ({
        ...metric,
        rpi: metric.totalImpressions > 0 ? metric.totalRevenue / metric.totalImpressions : 0,
        revenuePerClick: metric.totalClicks > 0 ? metric.totalRevenue / metric.totalClicks : 0,
        cvr: metric.totalVisits > 0 ? (metric.totalRevenue / metric.totalVisits) * 100 : 0,
        pages: Array.from(metric.pages)
      }))
      .sort((a, b) => b.rpi - a.rpi)
      .slice(0, 50); // Top 50 queries by RPI
  }

  // 2. CTR Opportunity Detection
  getCTROpportunities() {
    const siteAvgCTR = this.calculateSiteAverageCTR();
    
    return this.joinedData
      .filter(row => row.position <= 10 && row.ctr < siteAvgCTR)
      .map(row => ({
        page: row.page,
        query: row.query,
        currentCTR: row.ctr,
        siteAvgCTR: siteAvgCTR,
        position: row.position,
        impressions: row.impressions,
        clicks: row.clicks,
        revenue: row.revenue,
        potentialClicks: row.impressions * siteAvgCTR,
        potentialRevenue: (row.impressions * siteAvgCTR) * (row.revenue / Math.max(row.clicks, 1)),
        opportunity: ((row.impressions * siteAvgCTR) - row.clicks),
        revenueOpportunity: ((row.impressions * siteAvgCTR) - row.clicks) * (row.revenue / Math.max(row.clicks, 1))
      }))
      .sort((a, b) => b.revenueOpportunity - a.revenueOpportunity)
      .slice(0, 20);
  }

  // 3. Rank-Loss Revenue Risk
  getRankLossRisk() {
    const positionChanges = this.calculatePositionChanges();
    
    return positionChanges
      .filter(change => change.positionDelta > 0) // Position got worse
      .map(change => ({
        ...change,
        revenueRisk: change.positionDelta * change.revenuePerClick,
        weeklyRevenueImpact: change.positionDelta * change.revenuePerClick * 7
      }))
      .sort((a, b) => b.revenueRisk - a.revenueRisk)
      .slice(0, 15);
  }

  // 4. Query-to-Revenue Funnel
  getQueryRevenueeFunnel() {
    const queryFunnels = new Map();
    
    this.joinedData.forEach(row => {
      if (!queryFunnels.has(row.query)) {
        queryFunnels.set(row.query, {
          query: row.query,
          impressions: 0,
          clicks: 0,
          visits: 0,
          orders: 0,
          revenue: 0
        });
      }
      
      const funnel = queryFunnels.get(row.query);
      funnel.impressions += row.impressions;
      funnel.clicks += row.clicks;
      funnel.visits += row.visits;
      funnel.orders += row.orders;
      funnel.revenue += row.revenue;
    });

    return Array.from(queryFunnels.values())
      .map(funnel => ({
        ...funnel,
        ctr: funnel.impressions > 0 ? (funnel.clicks / funnel.impressions) * 100 : 0,
        visitRate: funnel.clicks > 0 ? (funnel.visits / funnel.clicks) * 100 : 0,
        cvr: funnel.visits > 0 ? (funnel.orders / funnel.visits) * 100 : 0,
        revenuePerVisit: funnel.visits > 0 ? funnel.revenue / funnel.visits : 0,
        revenuePerClick: funnel.clicks > 0 ? funnel.revenue / funnel.clicks : 0
      }))
      .filter(funnel => funnel.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 25);
  }

  // 5. Device Disparity Analysis
  getDeviceDisparity() {
    const deviceMetrics = new Map();
    
    this.joinedData.forEach(row => {
      if (!deviceMetrics.has(row.device)) {
        deviceMetrics.set(row.device, {
          device: row.device,
          visits: 0,
          orders: 0,
          revenue: 0,
          clicks: 0,
          impressions: 0
        });
      }
      
      const metrics = deviceMetrics.get(row.device);
      metrics.visits += row.visits;
      metrics.orders += row.orders;
      metrics.revenue += row.revenue;
      metrics.clicks += row.clicks;
      metrics.impressions += row.impressions;
    });

    const deviceData = Array.from(deviceMetrics.values())
      .map(metrics => ({
        ...metrics,
        cvr: metrics.visits > 0 ? (metrics.orders / metrics.visits) * 100 : 0,
        revenuePerVisit: metrics.visits > 0 ? metrics.revenue / metrics.visits : 0,
        ctr: metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0
      }));

    // Calculate disparity vs desktop
    const desktopCVR = deviceData.find(d => d.device === 'Desktop')?.cvr || 0;
    const mobileCVR = deviceData.find(d => d.device === 'Mobile')?.cvr || 0;
    
    return {
      deviceData,
      disparity: {
        mobileVsDesktop: mobileCVR - desktopCVR,
        mobileRevenueGap: (desktopCVR - mobileCVR) * (deviceData.find(d => d.device === 'Mobile')?.visits || 0) / 100,
        recommendations: this.getDeviceRecommendations(deviceData)
      }
    };
  }

  // 6. Brand vs Non-Brand Analysis
  getBrandVsNonBrandAnalysis() {
    const brandMetrics = { brand: {}, nonBrand: {} };
    
    ['brand', 'nonBrand'].forEach(type => {
      brandMetrics[type] = {
        queries: 0,
        impressions: 0,
        clicks: 0,
        visits: 0,
        orders: 0,
        revenue: 0,
        avgPosition: 0,
        topQueries: []
      };
    });

    const brandQueries = [];
    const nonBrandQueries = [];

    this.joinedData.forEach(row => {
      const isBrand = this.isBrandQuery(row.query);
      const metrics = isBrand ? brandMetrics.brand : brandMetrics.nonBrand;
      const queryArray = isBrand ? brandQueries : nonBrandQueries;
      
      metrics.impressions += row.impressions;
      metrics.clicks += row.clicks;
      metrics.visits += row.visits;
      metrics.orders += row.orders;
      metrics.revenue += row.revenue;
      
      queryArray.push({
        query: row.query,
        revenue: row.revenue,
        clicks: row.clicks,
        impressions: row.impressions,
        rpi: row.impressions > 0 ? row.revenue / row.impressions : 0
      });
    });

    // Calculate averages and top queries
    ['brand', 'nonBrand'].forEach(type => {
      const metrics = brandMetrics[type];
      const queries = type === 'brand' ? brandQueries : nonBrandQueries;
      
      metrics.queries = queries.length;
      metrics.rpi = metrics.impressions > 0 ? metrics.revenue / metrics.impressions : 0;
      metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
      metrics.cvr = metrics.visits > 0 ? (metrics.orders / metrics.visits) * 100 : 0;
      metrics.topQueries = queries
        .sort((a, b) => b.rpi - a.rpi)
        .slice(0, 10);
    });

    return brandMetrics;
  }

  // 7. Page Clusters with Rising Impressions but Flat Revenue
  getPageClustersAnalysis() {
    const clusters = new Map();
    
    this.joinedData.forEach(row => {
      const cluster = this.getPageCluster(row.page);
      if (!clusters.has(cluster)) {
        clusters.set(cluster, {
          cluster,
          pages: new Set(),
          impressions: 0,
          clicks: 0,
          revenue: 0,
          visits: 0,
          orders: 0
        });
      }
      
      const clusterData = clusters.get(cluster);
      clusterData.pages.add(row.page);
      clusterData.impressions += row.impressions;
      clusterData.clicks += row.clicks;
      clusterData.revenue += row.revenue;
      clusterData.visits += row.visits;
      clusterData.orders += row.orders;
    });

    // Calculate trends (simplified - would need time series analysis)
    return Array.from(clusters.values())
      .map(cluster => ({
        ...cluster,
        pages: Array.from(cluster.pages),
        pageCount: cluster.pages.size,
        avgRevenuePerPage: cluster.pages.size > 0 ? cluster.revenue / cluster.pages.size : 0,
        cvr: cluster.visits > 0 ? (cluster.orders / cluster.visits) * 100 : 0,
        ctr: cluster.impressions > 0 ? (cluster.clicks / cluster.impressions) * 100 : 0,
        revenuePerImpression: cluster.impressions > 0 ? cluster.revenue / cluster.impressions : 0
      }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 15);
  }

  // 8. Revenue Share vs Click Share
  getRevenueShareAnalysis() {
    const totalRevenue = this.joinedData.reduce((sum, row) => sum + row.revenue, 0);
    const totalClicks = this.joinedData.reduce((sum, row) => sum + row.clicks, 0);
    
    const pageMetrics = new Map();
    
    this.joinedData.forEach(row => {
      if (!pageMetrics.has(row.page)) {
        pageMetrics.set(row.page, {
          page: row.page,
          revenue: 0,
          clicks: 0,
          visits: 0,
          orders: 0,
          impressions: 0
        });
      }
      
      const metrics = pageMetrics.get(row.page);
      metrics.revenue += row.revenue;
      metrics.clicks += row.clicks;
      metrics.visits += row.visits;
      metrics.orders += row.orders;
      metrics.impressions += row.impressions;
    });

    return Array.from(pageMetrics.values())
      .map(metrics => ({
        ...metrics,
        revenueShare: (metrics.revenue / totalRevenue) * 100,
        clickShare: (metrics.clicks / totalClicks) * 100,
        shareGap: ((metrics.revenue / totalRevenue) - (metrics.clicks / totalClicks)) * 100,
        revenuePerClick: metrics.clicks > 0 ? metrics.revenue / metrics.clicks : 0,
        cvr: metrics.visits > 0 ? (metrics.orders / metrics.visits) * 100 : 0
      }))
      .sort((a, b) => Math.abs(b.shareGap) - Math.abs(a.shareGap))
      .slice(0, 20);
  }

  // 9. Query Intent Gap
  getQueryIntentGap() {
    const queryPageMetrics = new Map();
    
    this.joinedData.forEach(row => {
      const key = `${row.query}|${row.page}`;
      if (!queryPageMetrics.has(key)) {
        queryPageMetrics.set(key, {
          query: row.query,
          page: row.page,
          clicks: 0,
          visits: 0,
          orders: 0,
          revenue: 0
        });
      }
      
      const metrics = queryPageMetrics.get(key);
      metrics.clicks += row.clicks;
      metrics.visits += row.visits;
      metrics.orders += row.orders;
      metrics.revenue += row.revenue;
    });

    return Array.from(queryPageMetrics.values())
      .map(metrics => ({
        ...metrics,
        cvr: metrics.visits > 0 ? (metrics.orders / metrics.visits) * 100 : 0,
        revenuePerClick: metrics.clicks > 0 ? metrics.revenue / metrics.clicks : 0
      }))
      .filter(metrics => metrics.clicks > 10) // Only queries with meaningful traffic
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 30);
  }

  // 10. Revenue Uplift Forecasting
  getRevenueUpliftForecast() {
    const siteCTR = this.calculateSiteAverageCTR();
    const siteRevenuePerClick = this.calculateSiteRevenuePerClick();
    
    return this.joinedData
      .filter(row => row.position > 3) // Only pages not in top 3
      .map(row => {
        const projectedPosition = 3;
        const projectedCTR = siteCTR * 2; // Assume 2x CTR for position 3
        const projectedClicks = row.impressions * projectedCTR;
        const currentRevenuePerClick = row.clicks > 0 ? row.revenue / row.clicks : siteRevenuePerClick;
        
        return {
          page: row.page,
          query: row.query,
          currentPosition: row.position,
          currentClicks: row.clicks,
          currentRevenue: row.revenue,
          projectedPosition,
          projectedClicks,
          projectedRevenue: projectedClicks * currentRevenuePerClick,
          revenueUplift: (projectedClicks * currentRevenuePerClick) - row.revenue,
          percentageIncrease: row.revenue > 0 ? (((projectedClicks * currentRevenuePerClick) - row.revenue) / row.revenue) * 100 : 0
        };
      })
      .filter(forecast => forecast.revenueUplift > 0)
      .sort((a, b) => b.revenueUplift - a.revenueUplift)
      .slice(0, 20);
  }

  // Helper methods
  calculateSiteAverageCTR() {
    const totalClicks = this.joinedData.reduce((sum, row) => sum + row.clicks, 0);
    const totalImpressions = this.joinedData.reduce((sum, row) => sum + row.impressions, 0);
    return totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  }

  calculateSiteRevenuePerClick() {
    const totalRevenue = this.joinedData.reduce((sum, row) => sum + row.revenue, 0);
    const totalClicks = this.joinedData.reduce((sum, row) => sum + row.clicks, 0);
    return totalClicks > 0 ? totalRevenue / totalClicks : 0;
  }

  calculatePositionChanges() {
    // Simplified - would need time series analysis for real week-over-week changes
    const positionData = new Map();
    
    this.joinedData.forEach(row => {
      const key = `${row.page}|${row.query}`;
      if (!positionData.has(key)) {
        positionData.set(key, []);
      }
      positionData.get(key).push({
        date: row.date,
        position: row.position,
        revenue: row.revenue,
        clicks: row.clicks
      });
    });

    const changes = [];
    positionData.forEach((positions, key) => {
      if (positions.length >= 2) {
        const [page, query] = key.split('|');
        const recent = positions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const previous = positions[positions.length - 1];
        
        changes.push({
          page,
          query,
          previousPosition: previous.position,
          currentPosition: recent.position,
          positionDelta: recent.position - previous.position,
          revenuePerClick: recent.clicks > 0 ? recent.revenue / recent.clicks : 0,
          currentRevenue: recent.revenue
        });
      }
    });

    return changes;
  }

  isBrandQuery(query) {
    return this.brandKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getPageCluster(page) {
    const segments = page.split('/').filter(s => s);
    return segments.length > 1 ? `/${segments[0]}/` : '/';
  }

  getDeviceRecommendations(deviceData) {
    const recommendations = [];
    const desktop = deviceData.find(d => d.device === 'Desktop');
    const mobile = deviceData.find(d => d.device === 'Mobile');
    
    if (desktop && mobile) {
      if (mobile.cvr < desktop.cvr * 0.8) {
        recommendations.push('Mobile conversion rate is significantly lower - consider mobile UX improvements');
      }
      if (mobile.revenuePerVisit < desktop.revenuePerVisit * 0.7) {
        recommendations.push('Mobile revenue per visit is low - optimize mobile checkout flow');
      }
    }
    
    return recommendations;
  }
}

export default new InsightsService();