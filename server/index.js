import express from 'express';
import csv from 'csvtojson';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// Enable CORS for development
app.use(cors());

// CSV directory - Downloads folder
const CSV_DIR = path.join(os.homedir(), 'Downloads');

console.log(`Looking for CSV files in: ${CSV_DIR}`);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Google Analytics data endpoint
app.get('/api/ga', async (req, res) => {
  try {
    // Try multiple possible filenames for analytics data
    const possibleFiles = [
      'aa_sample (1) - aa_sample (1).csv',
      'analytics_data.csv',
      'ga_data.csv'
    ];
    
    let data = null;
    let foundFile = null;
    
    for (const filename of possibleFiles) {
      try {
        const filePath = path.join(CSV_DIR, filename);
        data = await csv().fromFile(filePath);
        foundFile = filename;
        console.log(`Successfully loaded GA data from: ${filename}`);
        break;
      } catch (err) {
        console.log(`Could not load ${filename}: ${err.message}`);
        continue;
      }
    }
    
    if (!data) {
      return res.status(404).json({ 
        error: 'Analytics CSV file not found',
        searchedFiles: possibleFiles,
        searchDirectory: CSV_DIR
      });
    }
    
    res.json({
      data,
      metadata: {
        source: foundFile,
        recordCount: data.length,
        lastModified: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading GA data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Google Search Console data endpoint
app.get('/api/gsc', async (req, res) => {
  try {
    // Try multiple possible filenames for search console data
    const possibleFiles = [
      'gsc_sample - gsc_sample.csv',
      'search_console_data.csv',
      'gsc_data.csv'
    ];
    
    let data = null;
    let foundFile = null;
    
    for (const filename of possibleFiles) {
      try {
        const filePath = path.join(CSV_DIR, filename);
        data = await csv().fromFile(filePath);
        foundFile = filename;
        console.log(`Successfully loaded GSC data from: ${filename}`);
        break;
      } catch (err) {
        console.log(`Could not load ${filename}: ${err.message}`);
        continue;
      }
    }
    
    if (!data) {
      return res.status(404).json({ 
        error: 'Search Console CSV file not found',
        searchedFiles: possibleFiles,
        searchDirectory: CSV_DIR
      });
    }
    
    res.json({
      data,
      metadata: {
        source: foundFile,
        recordCount: data.length,
        lastModified: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading GSC data:', error);
    res.status(500).json({ error: error.message });
  }
});

// List available CSV files in Downloads
app.get('/api/files', async (req, res) => {
  try {
    const fs = await import('fs');
    const files = fs.readdirSync(CSV_DIR).filter(file => file.endsWith('.csv'));
    res.json({
      directory: CSV_DIR,
      csvFiles: files
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CSV API server running on http://localhost:${PORT}`);
  console.log(`📁 Serving CSV files from: ${CSV_DIR}`);
  console.log(`🔗 Available endpoints:`);
  console.log(`   GET /api/health - Health check`);
  console.log(`   GET /api/ga - Google Analytics data`);
  console.log(`   GET /api/gsc - Google Search Console data`);
  console.log(`   GET /api/files - List available CSV files`);
});