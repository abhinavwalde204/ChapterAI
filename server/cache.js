const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'cache-store.json');
const TTL = 1000 * 60 * 60 * 24 * 90; // 90 days

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      return new Map(Object.entries(JSON.parse(raw)));
    }
  } catch {}
  return new Map();
}

function saveCache(cache) {
  try {
    const obj = {};
    for (const [key, value] of cache.entries()) {
      obj[key] = value;
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('Cache save failed:', err.message);
  }
}

const cache = loadCache();

function get(videoId) {
  const entry = cache.get(videoId);
  if (!entry) return null;
  if (Date.now() - entry.time > TTL) {
    cache.delete(videoId);
    saveCache(cache);
    return null;
  }
  return entry.data;
}

function set(videoId, data) {
  cache.set(videoId, { data, time: Date.now() });
  saveCache(cache);
}

module.exports = { get, set };
