const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();


const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}



app.use(cors(corsOptions)); 


const TARGET_SERVICES = [
  { id: 1, name: 'Google', url: 'https://www.google.com' },
  { id: 2, name: 'Facebook', url: 'https://www.facebook.com' }
];

app.get('/api/health', async (req, res) => {
  const statusResults = await Promise.all(TARGET_SERVICES.map(async (service) => {
    const startTime = Date.now();
    try {
      const response = await axios.get(service.url, { timeout: 8000,
        headers:{
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        ...service,
        status: response.status === 200 ? 'Online' : 'Warning',
        latency: `${Date.now() - startTime}ms`,
        lastChecked: new Date().toLocaleString()
      };
    } catch (error) {
      return {
        ...service,
        status: 'Offline',
        latency: 'N/A',
        lastChecked: new Date().toLocaleString()
      };
    }
  }));

  res.json(statusResults);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend ลื่นปรื๊ดที่ port ${PORT}`));
