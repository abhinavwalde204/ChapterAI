async function getTranscript(videoId) {
  // Use youtube-transcript package (ESM, so dynamic import)
  const { YoutubeTranscript } = await import('youtube-transcript');

  try {
    const entries = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });

    if (!entries || entries.length === 0) {
      throw new Error('No transcript entries returned.');
    }

    // Normalize to the format our chunker expects: { text, offset, duration }
    const transcript = entries
      .filter(e => e.text && e.text.trim())
      .map(e => ({
        text: e.text.replace(/\n/g, ' ').trim(),
        offset: e.offset,
        duration: e.duration
      }));

    if (transcript.length === 0) {
      throw new Error('Transcript fetched but all entries were empty.');
    }

    console.log(`Fetched ${transcript.length} transcript entries for ${videoId}`);
    return transcript;

  } catch (err) {
    // If English fails, try without language preference
    if (err.message.includes('No transcript') || err.message.includes('Could not')) {
      try {
        const entries = await YoutubeTranscript.fetchTranscript(videoId);
        if (!entries || entries.length === 0) {
          throw new Error('No captions found. Make sure the video has CC/subtitles enabled.');
        }

        const transcript = entries
          .filter(e => e.text && e.text.trim())
          .map(e => ({
            text: e.text.replace(/\n/g, ' ').trim(),
            offset: e.offset,
            duration: e.duration
          }));

        if (transcript.length === 0) {
          throw new Error('Transcript fetched but all entries were empty.');
        }

        console.log(`Fetched ${transcript.length} transcript entries for ${videoId} (fallback language)`);
        return transcript;

      } catch (fallbackErr) {
        throw new Error(`No captions found: ${fallbackErr.message}`);
      }
    }

    throw new Error(`Transcript fetch failed: ${err.message}`);
  }
}

module.exports = { getTranscript };
