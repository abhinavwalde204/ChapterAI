const { msToTimestamp } = require('./chunker');

function buildChapterPrompt(chunk, chunkIndex, totalChunks) {
  const startTime = msToTimestamp(chunk.startMs);
  const endTime = msToTimestamp(chunk.endMs);
  const durationMinutes = Math.round((chunk.endMs - chunk.startMs) / 60000);

  return `You are an expert video editor and content analyst. Your job is to identify genuine topic shifts in a video transcript and group closely related content into meaningful chapters.

## CORE PRINCIPLE
Chapters must reflect how a human would naturally divide this content. Ask yourself: "If a viewer wanted to find a specific topic in this video, what sections would they look for?" That is your chapter structure.

## TRANSCRIPT FORMAT
Each line starts with a timestamp in brackets like [4:32] followed by the spoken text. Use these timestamps to identify EXACTLY when a topic begins.

## WHAT COUNTS AS A NEW CHAPTER
Only create a new chapter when ALL of these are true:
- The speaker clearly moves to a genuinely different subject
- The new subject would be searched for independently by a viewer
- The topic shift lasts long enough to be worth navigating to (at least 60 seconds)
- A viewer skimming the video would notice this as a distinct section

## WHAT DOES NOT COUNT AS A NEW CHAPTER
- The speaker briefly mentions something before returning to the main topic
- A short anecdote or example that supports the current topic
- A transition phrase like "moving on" without a real topic change
- Sponsor reads, ads, subscribe reminders, channel intros or outros
- A recap of what was just discussed
- Any segment under 60 seconds

## CHAPTER COUNT GUIDANCE
Do NOT target a specific number of chapters. Let the content decide. A 30-minute video might have 4 chapters if it covers one deep topic, or 12 chapters if it covers many distinct topics. Both are correct. Never create chapters just to fill a quota. Never merge genuinely different topics just to reduce count.

## TITLE RULES
- 3 to 8 words, specific and descriptive
- Tells the viewer exactly what they will learn or see
- No generic words: "Introduction", "Discussion", "Overview", "Part 1", "Segment"
- No timestamps in the title
- Capitalise first word and proper nouns only

## TIMESTAMP RULES
- offsetMs must be the millisecond value when the NEW topic genuinely begins
- Pick the timestamp from the transcript line where the topic shift occurs
- Never place a chapter start mid-sentence
- All values must be between ${chunk.startMs} and ${chunk.endMs}

## THIS CHUNK
- Chunk ${chunkIndex + 1} of ${totalChunks}
- Covers: ${startTime} to ${endTime} (${durationMinutes} minutes)
- Valid offsetMs range: ${chunk.startMs} to ${chunk.endMs}

## TRANSCRIPT
${chunk.text}

## BEFORE YOU RESPOND — VERIFY EACH CHAPTER
1. Would a viewer specifically navigate to this section? If no — merge it.
2. Is it genuinely different from the chapter before it? If no — merge it.
3. Is it at least 60 seconds long? If no — merge it with adjacent chapter.
4. Does the title tell exactly what the section covers? If no — rewrite it.
5. Is the offsetMs taken directly from a timestamp in the transcript above? If no — fix it.

## OUTPUT FORMAT
Respond with ONLY valid JSON. No markdown. No code fences. No text before or after.

{
  "chapters": [
    {
      "offsetMs": <exact integer milliseconds from a transcript timestamp>,
      "title": "<specific 3-8 word title>"
    }
  ]
}

If this entire chunk covers one coherent topic with no genuine shifts, return exactly one chapter starting at ${chunk.startMs}.`;
}

module.exports = { buildChapterPrompt };
