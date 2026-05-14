function chunkTranscript(transcript) {
  const sentences = [];
  let current = { text: '', startMs: transcript[0].offset, endMs: 0 };

  for (const entry of transcript) {
    current.text += ' ' + entry.text;
    current.endMs = entry.offset + entry.duration;

    if (current.text.split(' ').length >= 30) {
      sentences.push({ ...current, text: current.text.trim() });
      current = { text: '', startMs: entry.offset, endMs: 0 };
    }
  }

  if (current.text.trim()) {
    sentences.push({ ...current, text: current.text.trim() });
  }

  const CHUNK_SIZE = 40;
  const OVERLAP = 5;
  const chunks = [];

  for (let i = 0; i < sentences.length; i += CHUNK_SIZE - OVERLAP) {
    const slice = sentences.slice(i, i + CHUNK_SIZE);
    if (slice.length === 0) break;

    chunks.push({
      startMs: slice[0].startMs,
      endMs: slice[slice.length - 1].endMs,
      text: slice.map(s => `[${msToTimestamp(s.startMs)}] ${s.text}`).join('\n'),
      sentenceCount: slice.length
    });

    if (i + CHUNK_SIZE >= sentences.length) break;
  }

  return chunks;
}

function msToTimestamp(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

module.exports = { chunkTranscript, msToTimestamp };
