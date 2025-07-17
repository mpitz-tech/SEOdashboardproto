// Data service for loading and processing data via API

import { aggregateByDate, aggregateByDimension, getTopPages, getTopQueries } from '../utils/csvParser.js';
import { createAnalyticsRecord, createSearchConsoleRecord, createMetricSummary, DataTypes } from '../types/index.js';

class DataService {
  constructor() {
    this.analyticsData = [];
    this.searchConsoleData = [];
    this.isLoaded = false;
    this.metadata = {};
  }

  async loadData() {
    try {
      console.log('Loading data from API...');
      
      // Load analytics data from API
      const analyticsResponse = await fetch('/api/ga');
      if (!analyticsResponse.ok) {
        throw new Error(`GA API error: ${analyticsResponse.status}`);
      }
      const analyticsResult = await analyticsResponse.json();
      this.analyticsData = analyticsResult.data.map(createAnalyticsRecord);
      this.metadata.analytics = analyticsResult.metadata;

      // Load search console data from API
      const searchConsoleResponse = await fetch('/api/gsc');
      if (!searchConsoleResponse.ok) {
        throw new Error(`GSC API error: ${searchConsoleResponse.status}`);
      }
      const searchConsoleResult = await searchConsoleResponse.json();
      this.searchConsoleData = searchConsoleResult.data.map(createSearchConsoleRecord);
      this.metadata.searchConsole = searchConsoleResult.metadata;

      this.isLoaded = true;
      console.log(`Loaded ${this.analyticsData.length} analytics records and ${this.searchConsoleData.length} search console records`);
      
      return { 
        success: true, 
        metadata: this.metadata 
      };
    } catch (error) {
      console.error('Error loading data from API:', error);
      
      // Fallback to static files if API fails
      try {
        console.log('Falling back to static CSV files...');
        return await this.loadDataFromStaticFiles();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return { 
          success: false, 
          error: `API failed: ${error.message}. Fallback failed: ${fallbackError.message}` 
        };
      }
    }
  }

  async loadDataFromStaticFiles() {
    // Fallback method using the original static file approach
    const { parseCSV } = await import('../utils/csvParser.js');
    
    try {
      console.log('Loading CSV files directly from public directory...');
      
      // Load analytics data
      const analyticsResponse = await fetch('/analytics_data.csv');
      if (!analyticsResponse.ok) {
        throw new Error(`Analytics CSV not found: ${analyticsResponse.status}`);
      }
      const analyticsCSV = await analyticsResponse.text();
      const analyticsRaw = parseCSV(analyticsCSV);
      this.analyticsData = analyticsRaw.map(createAnalyticsRecord);
      console.log(`Loaded ${this.analyticsData.length} analytics records`);

      // Load search console data
      const searchConsoleResponse = await fetch('/search_console_data.csv');
      if (!searchConsoleResponse.ok) {
        throw new Error(`Search Console CSV not found: ${searchConsoleResponse.status}`);
      }
      const searchConsoleCSV = await searchConsoleResponse.text();
      const searchConsoleRaw = parseCSV(searchConsoleCSV);
      this.searchConsoleData = searchConsoleRaw.map(createSearchConsoleRecord);
      console.log(`Loaded ${this.searchConsoleData.length} search console records`);

      this.isLoaded = true;
      return { success: true, fallback: true };
    } catch (error) {
      console.error('Failed to load static CSV files:', error);
      throw error;
    }
  }

  getAnalyticsData() {
    return this.analyticsData;
  }

  getSearchConsoleData() {
    return this.searchConsoleData;
  }

  // Dashboard Overview Metrics
  getDashboardMetrics() {
    const analyticsMetrics = createMetricSummary(this.analyticsData, DataTypes.ANALYTICS);
    const searchConsoleMetrics = createMetricSummary(this.searchConsoleData, DataTypes.SEARCH_CONSOLE);
    const dateRange = this.getDateRange();
    const trends = this.calculateTrends();
    
    return {
      ...analyticsMetrics,
      ...searchConsoleMetrics,
      totalPages: new Set(this.analyticsData.map(item => item.page)).size,
      totalQueries: new Set(this.searchConsoleData.map(item => item.query)).size,
      dateRange,
      trends,
      dataFreshness: this.getDataFreshness()
    };
  }

  // Time series data for charts
  getTimeSeriesData() {
    const visitsByDate = aggregateByDate(this.analyticsData, 'visits');
    const revenueByDate = aggregateByDate(this.analyticsData, 'revenue');
    const clicksByDate = aggregateByDate(this.searchConsoleData, 'clicks');
    const impressionsByDate = aggregateByDate(this.searchConsoleData, 'impressions');

    return {
      visits: visitsByDate,
      revenue: revenueByDate,
      clicks: clicksByDate,
      impressions: impressionsByDate
    };
  }

  // Device and channel breakdowns
  getDeviceChannelData() {
    const deviceData = aggregateByDimension(this.analyticsData, 'device', 'visits');
    const channelData = aggregateByDimension(this.analyticsData, 'channel', 'visits');
    
    return {
      device: deviceData,
      channel: channelData
    };
  }

  // Top performing pages
  getTopPages(limit = 10) {
    return getTopPages(this.analyticsData, limit);
  }

  // Top performing queries
  getTopQueries(limit = 10) {
    return getTopQueries(this.searchConsoleData, limit);
  }

  // Page-level insights combining both datasets
  getPageInsights() {
    const pageData = {};
    
    // Aggregate analytics data by page
    this.analyticsData.forEach(item => {
      if (!pageData[item.page]) {
        pageData[item.page] = {
          page: item.page,
          visits: 0,
          orders: 0,
          revenue: 0,
          clicks: 0,
          impressions: 0,
          queries: new Set()
        };
      }
      
      pageData[item.page].visits += item.visits;
      pageData[item.page].orders += item.orders;
      pageData[item.page].revenue += item.revenue;
    });

    // Add search console data
    this.searchConsoleData.forEach(item => {
      if (pageData[item.page]) {
        pageData[item.page].clicks += item.clicks;
        pageData[item.page].impressions += item.impressions;
        pageData[item.page].queries.add(item.query);
      }
    });

    // Convert to array and calculate derived metrics
    return Object.values(pageData).map(page => ({
      ...page,
      queries: Array.from(page.queries),
      conversionRate: page.visits > 0 ? (page.orders / page.visits) * 100 : 0,
      revenuePerVisit: page.visits > 0 ? page.revenue / page.visits : 0,
      ctr: page.impressions > 0 ? (page.clicks / page.impressions) * 100 : 0
    }));
  }

  // Search query analysis
  getQueryAnalysis() {
    const queryData = {};
    
    this.searchConsoleData.forEach(item => {
      if (!queryData[item.query]) {
        queryData[item.query] = {
          query: item.query,
          clicks: 0,
          impressions: 0,
          positions: [],
          pages: new Set()
        };
      }
      
      queryData[item.query].clicks += item.clicks;
      queryData[item.query].impressions += item.impressions;
      queryData[item.query].positions.push(item.position);
      queryData[item.query].pages.add(item.page);
    });

    return Object.values(queryData).map(query => ({
      ...query,
      pages: Array.from(query.pages),
      avgPosition: query.positions.reduce((sum, pos) => sum + pos, 0) / query.positions.length,
      ctr: query.impressions > 0 ? (query.clicks / query.impressions) * 100 : 0
    }));
  }

  // Get date range for the dataset
  getDateRange() {
    const allDates = [
      ...this.analyticsData.map(item => new Date(item.date)),
      ...this.searchConsoleData.map(item => new Date(item.date))
    ];
    
    return {
      start: new Date(Math.min(...allDates)),
      end: new Date(Math.max(...allDates))
    };
  }

  // Calculate trends for metrics
  calculateTrends() {
    const dateRange = this.getDateRange();
    const totalDays = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
    const midPoint = new Date(dateRange.start.getTime() + (totalDays / 2) * 24 * 60 * 60 * 1000);

    // Split data into first and second half
    const firstHalf = this.analyticsData.filter(item => new Date(item.date) <= midPoint);
    const secondHalf = this.analyticsData.filter(item => new Date(item.date) > midPoint);

    const firstHalfMetrics = createMetricSummary(firstHalf, DataTypes.ANALYTICS);
    const secondHalfMetrics = createMetricSummary(secondHalf, DataTypes.ANALYTICS);

    const calculateChange = (current, previous) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      visits: {
        change: calculateChange(secondHalfMetrics.totalVisits, firstHalfMetrics.totalVisits),
        timeframe: `${Math.ceil(totalDays / 2)} days`
      },
      orders: {
        change: calculateChange(secondHalfMetrics.totalOrders, firstHalfMetrics.totalOrders),
        timeframe: `${Math.ceil(totalDays / 2)} days`
      },
      revenue: {
        change: calculateChange(secondHalfMetrics.totalRevenue, firstHalfMetrics.totalRevenue),
        timeframe: `${Math.ceil(totalDays / 2)} days`
      },
      conversionRate: {
        change: calculateChange(secondHalfMetrics.avgConversionRate, firstHalfMetrics.avgConversionRate),
        timeframe: `${Math.ceil(totalDays / 2)} days`
      }
    };
  }

  // Get data freshness information
  getDataFreshness() {
    const dateRange = this.getDateRange();
    const now = new Date();
    const daysSinceLastUpdate = Math.ceil((now - dateRange.end) / (1000 * 60 * 60 * 24));
    
    return {
      lastUpdated: dateRange.end,
      daysSinceUpdate: daysSinceLastUpdate,
      totalDataPoints: this.analyticsData.length + this.searchConsoleData.length,
      dataSpan: Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24))
    };
  }

  // AI Query Processing Helper
  processAIQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Handle different types of queries
    if (lowerQuery.includes('revenue') || lowerQuery.includes('money')) {
      return this.getRevenueInsights();
    } else if (lowerQuery.includes('traffic') || lowerQuery.includes('visit')) {
      return this.getTrafficInsights();
    } else if (lowerQuery.includes('conversion') || lowerQuery.includes('order')) {
      return this.getConversionInsights();
    } else if (lowerQuery.includes('search') || lowerQuery.includes('query')) {
      return this.getSearchInsights();
    } else if (lowerQuery.includes('page') || lowerQuery.includes('url')) {
      return this.getPageInsights();
    } else {
      return this.getDashboardMetrics();
    }
  }

  // Specific insight generators for AI responses
  getRevenueInsights() {
    const metrics = this.getDashboardMetrics();
    const topPages = this.getTopPages(5);
    const channelData = this.getDeviceChannelData().channel;
    
    return {
      type: 'revenue',
      totalRevenue: metrics.totalRevenue,
      avgRevenuePerVisit: metrics.avgRevenuePerVisit,
      topRevenuePages: topPages.slice(0, 3),
      topRevenueChannels: channelData.slice(0, 3),
      insights: [
        `Total revenue: $${metrics.totalRevenue.toFixed(2)}`,
        `Average revenue per visit: $${metrics.avgRevenuePerVisit.toFixed(2)}`,
        `Top revenue page: ${topPages[0]?.page} ($${topPages[0]?.revenue.toFixed(2)})`
      ]
    };
  }

  getTrafficInsights() {
    const metrics = this.getDashboardMetrics();
    const timeSeries = this.getTimeSeriesData();
    const deviceData = this.getDeviceChannelData().device;
    
    return {
      type: 'traffic',
      totalVisits: metrics.totalVisits,
      totalClicks: metrics.totalClicks,
      totalImpressions: metrics.totalImpressions,
      avgCTR: metrics.avgCTR,
      timeSeriesData: timeSeries.visits,
      deviceBreakdown: deviceData,
      insights: [
        `Total visits: ${metrics.totalVisits.toLocaleString()}`,
        `Total search clicks: ${metrics.totalClicks.toLocaleString()}`,
        `Average CTR: ${(metrics.avgCTR * 100).toFixed(2)}%`,
        `Top device: ${deviceData[0]?.name} (${deviceData[0]?.value} visits)`
      ]
    };
  }

  getConversionInsights() {
    const metrics = this.getDashboardMetrics();
    const pageInsights = this.getPageInsights();
    const topConverting = pageInsights.sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 5);
    
    return {
      type: 'conversion',
      totalOrders: metrics.totalOrders,
      avgConversionRate: metrics.avgConversionRate,
      topConvertingPages: topConverting,
      insights: [
        `Total orders: ${metrics.totalOrders.toLocaleString()}`,
        `Average conversion rate: ${metrics.avgConversionRate.toFixed(2)}%`,
        `Best converting page: ${topConverting[0]?.page} (${topConverting[0]?.conversionRate.toFixed(2)}%)`
      ]
    };
  }

  getSearchInsights() {
    const metrics = this.getDashboardMetrics();
    const topQueries = this.getTopQueries(5);
    const queryAnalysis = this.getQueryAnalysis();
    
    return {
      type: 'search',
      totalQueries: metrics.totalQueries,
      avgPosition: metrics.avgPosition,
      topQueries: topQueries,
      insights: [
        `Total unique queries: ${metrics.totalQueries.toLocaleString()}`,
        `Average search position: ${metrics.avgPosition.toFixed(1)}`,
        `Top query: "${topQueries[0]?.query}" (${topQueries[0]?.clicks} clicks)`,
        `Best performing query: "${queryAnalysis.sort((a, b) => b.ctr - a.ctr)[0]?.query}" (${queryAnalysis.sort((a, b) => b.ctr - a.ctr)[0]?.ctr.toFixed(2)}% CTR)`
      ]
    };
  }
}

export default new DataService();