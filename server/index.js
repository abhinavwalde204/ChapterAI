const express = require('express');
const cors = require('cors');
const { getTranscript } = require('./transcript');
const { processTranscript } = require('./processor');
const { msToTimestamp } = require('./chunker');
const cache = require('./cache');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.json({ status: 'SERVER RUNNING 🚀' });
});

app.post('/api/transcript', async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId is required' });
  try {
    const transcript = await getTranscript(videoId);
    res.json({ transcript });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyse', async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId is required' });

  const cacheKey = videoId.trim().toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ...cached, fromCache: true });

  try {
    const transcript = await getTranscript(videoId);
    const { chapters } = await processTranscript(transcript);
    const chaptersWithTimestamps = chapters.map(ch => ({
      ...ch,
      timestamp: msToTimestamp(ch.offsetMs),
      startSeconds: Math.floor(ch.offsetMs / 1000)
    }));
    const result = { videoId, chapters: chaptersWithTimestamps };
    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
