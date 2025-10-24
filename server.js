const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

const GENIUS_API_KEY = 'ZnCg0UUxaFJErhIyyrhPw11MEU2gppGnFP4sJ6acWicAFzpXCU4ad9iEaUG0dRPV';

// Search for song
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const url = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GENIUS_API_KEY}`
      }
    });

    const data = await response.json();
    
    if (!data.response.hits || data.response.hits.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const song = data.response.hits[0].result;
    const lyricsUrl = song.url;
    
    // Scrape the lyrics from the Genius page
    const lyricsResponse = await axios.get(lyricsUrl);
    const $ = cheerio.load(lyricsResponse.data);
    
    // Extract lyrics - Genius uses specific div classes for lyrics
    let lyrics = '';
    $('[data-lyrics-container="true"]').each((i, elem) => {
      lyrics += $(elem).text() + '\n\n';
    });

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found on page' });
    }

    res.json({
      title: song.title,
      artist: song.primary_artist.name,
      lyrics: lyrics.trim(),
      url: lyricsUrl
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch lyrics', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});