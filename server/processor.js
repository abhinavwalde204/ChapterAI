const { chunkTranscript } = require('./chunker');
const { buildChapterPrompt } = require('./promptBuilder');
const { analyseChunk } = require('./groq');

async function processTranscript(transcript) {
  const chunks = chunkTranscript(transcript);
  const allChapters = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const prompt = buildChapterPrompt(chunk, i, chunks.length);

    try {
      const result = await analyseChunk(prompt);
      if (result.chapters) allChapters.push(...result.chapters);
    } catch (err) {
      console.error(`Chunk ${i + 1} failed:`, err.message);
    }

    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  allChapters.sort((a, b) => a.offsetMs - b.offsetMs);

  const deduped = [];
  for (const chapter of allChapters) {
    const last = deduped[deduped.length - 1];
    if (!last || chapter.offsetMs - last.offsetMs > 30000) {
      deduped.push(chapter);
    }
  }

  const titleDeduped = [];
  const seenTitles = new Set();
  for (const chapter of deduped) {
    const normalised = chapter.title.toLowerCase().trim();
    if (!seenTitles.has(normalised)) {
      seenTitles.add(normalised);
      titleDeduped.push(chapter);
    }
  }

  return { chapters: titleDeduped };
}

module.exports = { processTranscript };
