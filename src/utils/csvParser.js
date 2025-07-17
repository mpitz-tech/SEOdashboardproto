// CSV parsing utilities for the SEO AI Insight Dashboard

export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    
    data.push(row);
  }
  
  return data;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const aggregateByDate = (data, valueField) => {
  const aggregated = {};
  
  data.forEach(item => {
    const date = item.date;
    if (!aggregated[date]) {
      aggregated[date] = 0;
    }
    aggregated[date] += parseFloat(item[valueField]) || 0;
  });
  
  return Object.entries(aggregated)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const aggregateByDimension = (data, dimension, valueField) => {
  const aggregated = {};
  
  data.forEach(item => {
    const key = item[dimension];
    if (!aggregated[key]) {
      aggregated[key] = 0;
    }
    aggregated[key] += parseFloat(item[valueField]) || 0;
  });
  
  return Object.entries(aggregated)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTopPages = (data, limit = 10) => {
  const pageMetrics = {};
  
  data.forEach(item => {
    const page = item.page;
    if (!pageMetrics[page]) {
      pageMetrics[page] = {
        page,
        visits: 0,
        orders: 0,
        revenue: 0,
        clicks: 0,
        impressions: 0
      };
    }
    
    pageMetrics[page].visits += parseInt(item.visits) || 0;
    pageMetrics[page].orders += parseInt(item.orders) || 0;
    pageMetrics[page].revenue += parseFloat(item.revenue) || 0;
    pageMetrics[page].clicks += parseInt(item.clicks) || 0;
    pageMetrics[page].impressions += parseInt(item.impressions) || 0;
  });
  
  return Object.values(pageMetrics)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, limit);
};

export const getTopQueries = (searchConsoleData, limit = 10) => {
  const queryMetrics = {};
  
  searchConsoleData.forEach(item => {
    const query = item.query;
    if (!queryMetrics[query]) {
      queryMetrics[query] = {
        query,
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        count: 0
      };
    }
    
    queryMetrics[query].clicks += parseInt(item.clicks) || 0;
    queryMetrics[query].impressions += parseInt(item.impressions) || 0;
    queryMetrics[query].ctr += parseFloat(item.ctr) || 0;
    queryMetrics[query].position += parseFloat(item.position) || 0;
    queryMetrics[query].count += 1;
  });
  
  return Object.values(queryMetrics)
    .map(query => ({
      ...query,
      ctr: query.ctr / query.count,
      position: query.position / query.count
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
};