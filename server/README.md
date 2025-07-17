# SEO Dashboard API Server

A Node.js/Express API server that serves CSV data from your Downloads directory to the SEO dashboard.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/ga` - Google Analytics data (looks for analytics CSV files)
- `GET /api/gsc` - Google Search Console data (looks for search console CSV files)
- `GET /api/files` - List all available CSV files

## CSV File Detection

The API automatically looks for CSV files in your Downloads folder with these names:

**Analytics Data:**
- `aa_sample (1) - aa_sample (1).csv`
- `analytics_data.csv`
- `ga_data.csv`

**Search Console Data:**
- `gsc_sample - gsc_sample.csv`
- `search_console_data.csv`
- `gsc_data.csv`

## Response Format

```json
{
  "data": [...],
  "metadata": {
    "source": "filename.csv",
    "recordCount": 5000,
    "lastModified": "2025-07-17T03:08:32.315Z"
  }
}
```

## Development

The server runs on port 4000 and includes CORS headers for development with the React frontend on port 3000.