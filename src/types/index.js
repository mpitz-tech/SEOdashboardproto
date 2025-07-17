// Data type definitions for the SEO AI Insight Dashboard

export const DataTypes = {
  ANALYTICS: 'analytics',
  SEARCH_CONSOLE: 'search_console'
};

export const DeviceTypes = {
  DESKTOP: 'Desktop',
  MOBILE: 'Mobile',
  TABLET: 'Tablet'
};

export const ChannelTypes = {
  ORGANIC_SEARCH: 'Organic Search',
  PAID_SEARCH: 'Paid Search',
  DIRECT: 'Direct',
  REFERRAL: 'Referral',
  EMAIL: 'Email',
  SOCIAL: 'Social'
};

// Analytics Data Structure
export const createAnalyticsRecord = (data) => ({
  date: data.date,
  page: data.page,
  visits: parseInt(data.visits) || 0,
  orders: parseInt(data.orders) || 0,
  revenue: parseFloat(data.revenue) || 0,
  device: data.device,
  channel: data.channel,
  conversionRate: data.visits > 0 ? (data.orders / data.visits) * 100 : 0,
  revenuePerVisit: data.visits > 0 ? data.revenue / data.visits : 0
});

// Search Console Data Structure
export const createSearchConsoleRecord = (data) => ({
  date: data.date,
  page: data.page,
  query: data.query,
  clicks: parseInt(data.clicks) || 0,
  impressions: parseInt(data.impressions) || 0,
  ctr: parseFloat(data.ctr) || 0,
  position: parseFloat(data.position) || 0
});

// Aggregated metrics for dashboard
export const createMetricSummary = (data, type) => {
  if (type === DataTypes.ANALYTICS) {
    return {
      totalVisits: data.reduce((sum, item) => sum + item.visits, 0),
      totalOrders: data.reduce((sum, item) => sum + item.orders, 0),
      totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0),
      avgConversionRate: data.reduce((sum, item) => sum + item.conversionRate, 0) / data.length,
      avgRevenuePerVisit: data.reduce((sum, item) => sum + item.revenuePerVisit, 0) / data.length
    };
  } else if (type === DataTypes.SEARCH_CONSOLE) {
    return {
      totalClicks: data.reduce((sum, item) => sum + item.clicks, 0),
      totalImpressions: data.reduce((sum, item) => sum + item.impressions, 0),
      avgCTR: data.reduce((sum, item) => sum + item.ctr, 0) / data.length,
      avgPosition: data.reduce((sum, item) => sum + item.position, 0) / data.length
    };
  }
  return {};
};