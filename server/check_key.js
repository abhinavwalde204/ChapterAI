require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say hello in one word' }],
      max_tokens: 10,
      temperature: 0,
    });
    console.log('SUCCESS:', completion.choices[0].message.content);
  } catch (e) {
    console.error('FAILED:', e.status, e.message);
    if (e.error) console.error('Error details:', JSON.stringify(e.error));
  }
}

test();
