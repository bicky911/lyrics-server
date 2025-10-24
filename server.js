const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GENIUS_API_KEY = 'ZnCg0UUxaFJErhIyyrhPw11MEU2gppGnFP4sJ6acWicAFzpXCU4ad9iEaUG0dRPV';

app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Searching for:', query);
    
    const url = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GENIUS_API_KEY}`
      }
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Got data:', data);
    
    res.json(data);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Failed to fetch from Genius', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});