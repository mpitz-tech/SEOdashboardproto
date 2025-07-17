# SEO AI Insight Dashboard

An AI-powered SEO insights dashboard for comprehensive website analysis and optimization recommendations. Built as a product management case study demonstrating unified analytics, data visualization, and conversational AI capabilities.

## 🚀 Live Demo

The dashboard is running at: **http://localhost:3000**

## 📋 Project Overview

This project addresses the challenge of fragmented SEO data by creating a unified dashboard that combines multiple analytics sources into actionable business intelligence through AI-powered insights.

### Key Features

- **📊 Unified Analytics**: Combines Google Search Console and website analytics data
- **🤖 AI Assistant**: Conversational interface for natural language SEO queries
- **📈 Interactive Visualizations**: Real-time charts and performance metrics
- **🔍 Deep Insights**: Page-level and query-level performance analysis
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with modern design patterns
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Data**: CSV-based analytics integration

## 📈 Data Sources

The dashboard integrates two primary data sources:

1. **Analytics Data** (`analytics_data.csv`): Website traffic, conversions, and revenue metrics
2. **Search Console Data** (`search_console_data.csv`): Search rankings, impressions, and click-through rates

## 🎯 Product Vision

**"Democratize SEO insights through unified data and conversational AI"**

- **Problem**: SEO teams struggle with fragmented data across multiple tools
- **Solution**: Single dashboard with AI-powered insights and natural language queries
- **Impact**: 60% reduction in manual reporting time, 3x faster optimization decisions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd seo-ai-insight-dashboard

# Install dependencies
npm install

# Option 1: Start both API server and frontend together
npm start

# Option 2: Start them separately
# Terminal 1 - API server
npm run server

# Terminal 2 - Frontend
npm run dev

# Open browser to http://localhost:3000
```

### API Server

The dashboard now includes a Node.js/Express API server that automatically loads CSV data from your Downloads directory. This eliminates CORS issues and provides a more professional data loading experience.

**Features:**
- Automatic CSV file detection in Downloads folder
- Real-time data streaming from local files
- Fallback to static files if API is unavailable
- Metadata including source file and record count

### Usage

1. **Overview Dashboard**: View key performance metrics and trends
2. **Analytics Panel**: Dive deep into page and query performance
3. **AI Assistant**: Ask questions about your SEO performance in natural language

### Example AI Queries

- "What are my top performing pages?"
- "How is my revenue trending?"
- "Which search queries drive the most traffic?"
- "What optimization opportunities do I have?"

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main dashboard container
│   ├── OverviewPanel.jsx # Key metrics overview
│   ├── AnalyticsPanel.jsx # Detailed analytics
│   ├── AIChat.jsx      # AI assistant interface
│   └── ...
├── data/               # CSV data files
│   ├── analytics_data.csv
│   └── search_console_data.csv
├── services/           # Data processing services
│   └── dataService.js  # Main data service
├── utils/              # Utility functions
│   └── csvParser.js    # CSV parsing utilities
├── types/              # Type definitions
│   └── index.js        # Data type definitions
└── ...
```

## 🎨 Key Components

### Dashboard Tabs

1. **Overview**: Executive summary with key metrics and trends
2. **Analytics**: Detailed performance analysis with filtering
3. **AI Assistant**: Natural language query interface

### AI Assistant Features

- **Context-Aware Responses**: Understands SEO-specific queries
- **Data-Driven Insights**: Provides actionable recommendations
- **Suggested Queries**: Guides users to valuable insights
- **Real-Time Processing**: Instant responses to user questions

### Visualization Components

- **Metric Cards**: Key performance indicators with trend indicators
- **Time Series Charts**: Traffic and revenue trends over time
- **Distribution Charts**: Device and channel breakdowns
- **Data Tables**: Detailed page and query performance

## 📊 Data Model

The dashboard uses a unified data model that combines:

### Analytics Data Schema
```javascript
{
  date: "2025-07-01",
  page: "/product/wireless-headphones",
  visits: 308,
  orders: 14,
  revenue: 1229.47,
  device: "Desktop",
  channel: "Organic Search"
}
```

### Search Console Data Schema
```javascript
{
  date: "7/7/25",
  page: "/product/laptop-charger",
  query: "wireless headphones",
  clicks: 75,
  impressions: 1568,
  ctr: 0.0478,
  position: 8.4
}
```

## 🧠 AI Implementation

The AI assistant uses pattern matching and data analysis to provide insights:

- **Query Processing**: Analyzes user intent and maps to data queries
- **Insight Generation**: Creates human-readable summaries of complex data
- **Recommendation Engine**: Suggests actionable optimization steps
- **Context Awareness**: Understands SEO terminology and business metrics

## 🎯 Key Metrics Dashboard

### Business Metrics
- **Total Visits**: Website traffic volume
- **Total Revenue**: Revenue generated from organic traffic
- **Conversion Rate**: Orders divided by visits
- **Average Order Value**: Revenue per transaction

### SEO Metrics
- **Search Clicks**: Clicks from search results
- **Impressions**: Search result visibility
- **Average Position**: Ranking position in search results
- **Click-Through Rate**: Clicks divided by impressions

## 🔮 Future Enhancements

### Phase 1 Extensions
- Real-time data integration via APIs
- Advanced filtering and segmentation
- Export capabilities for reports
- User authentication and personalization

### Phase 2 Features
- Predictive analytics and forecasting
- Automated alert system
- Competitor benchmarking
- A/B testing integration

### Phase 3 Capabilities
- Machine learning recommendations
- Natural language report generation
- Integration with marketing automation
- Enterprise security features

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm test            # Run tests (when configured)
```

### Development Workflow

1. **Data Processing**: CSV files are parsed and normalized on app startup
2. **Component Rendering**: React components display processed data
3. **AI Processing**: Natural language queries are processed client-side
4. **Real-Time Updates**: Charts and metrics update based on user interactions

## 📝 Documentation

- **[Product Vision](docs/VISION.md)**: Comprehensive product strategy and roadmap
- **[Data Model](docs/DATA_MODEL.md)**: Technical data architecture and schemas
- **[API Documentation](docs/API.md)**: Data service interfaces and methods

## 🤝 Contributing

This project serves as a product management case study. Key areas for contribution:

1. **Data Integration**: Additional analytics sources
2. **AI Enhancement**: Improved natural language processing
3. **Visualization**: New chart types and interactive features
4. **Performance**: Optimization for large datasets

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Recharts for beautiful data visualizations
- Lucide React for consistent iconography
- Inspired by modern SEO analytics platforms

---

**Product Manager**: Demonstrating technical product vision through functional prototypes
**Focus**: Unified analytics, conversational AI, and data-driven insights