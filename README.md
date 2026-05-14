# ChapterAI — AI-Powered YouTube Chapter Generator

> Paste any YouTube URL and get AI-generated, timestamped chapters instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Powered by Groq](https://img.shields.io/badge/Powered%20by-Groq-orange)](https://groq.com/)

**Live Demo**: [chapterai.vercel.app](https://chapterai.vercel.app) &nbsp;·&nbsp; **Author**: [Abhinav Walde](https://github.com/abhinavwalde)

---

## 💡 Motivation

YouTube videos rarely come with proper chapters, making it frustrating to navigate long-form content. I built ChapterAI to solve this — it analyzes a video's transcript using an LLM to detect genuine topic shifts, then generates accurate timestamped chapters automatically. No manual effort, no guessing.

---

## ✨ Features

- **Automatic Chapter Generation** — Paste any YouTube URL and get AI-generated chapters instantly
- **Smart Transcript Analysis** — Identifies genuine topic shifts, not just keyword matches
- **Precise Timestamps** — Each chapter includes an accurate start time
- **Click-to-Seek Navigation** — Click any chapter to jump directly to that point in the video
- **90-Day Caching** — Previously processed videos load instantly from cache
- **Animated UI** — Motion background with blur effect for a polished experience

---

## 🛠️ Tech Stack

### Frontend
- **React** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Utility-first styling (via CDN)
- **Material Symbols** — Icon library

### Backend
- **Node.js + Express** — Server and REST API
- **Groq SDK** — AI inference integration
- **Llama 3.3 70B Versatile** — LLM used for chapter generation

### External APIs
- **YouTube Transcript API** — Extracts video transcripts by video ID
- **Groq API** — Runs the language model for content analysis

---

## 📁 Project Structure

```
chapterAI/
├── client/                 # React frontend
│   ├── public/
│   │   └── videos/        # Background video assets
│   └── src/
│       ├── components/    # React components
│       ├── utils/         # Utility functions
│       ├── App.jsx        # Main app component
│       ├── index.css      # Global styles
│       └── main.jsx       # Entry point
├── server/                # Node.js backend
│   ├── .env               # Environment variables (not committed)
│   ├── index.js           # Express server entry point
│   ├── groq.js            # Groq AI integration
│   ├── processor.js       # Transcript processing pipeline
│   ├── chunker.js         # Splits transcripts for API limits
│   ├── promptBuilder.js   # Constructs AI prompts
│   ├── transcript.js      # YouTube transcript fetcher
│   └── cache.js           # 90-day result caching
└── README.md
```

---

## ⚙️ Installation & Setup

Note: ChapterAI requires local setup due to Youtube's server side transcript restrictions

### Prerequisites
- Node.js v18+
- npm or yarn
- A free [Groq API key](https://console.groq.com/)

### 1. Clone the repository

```bash
git clone https://github.com/abhinavwalde/chapterAI.git
cd chapterAI
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend:

```bash
node index.js
# Server runs on http://localhost:4000
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/transcript` | POST | Fetch transcript for a YouTube video |
| `/api/analyse` | POST | Generate AI chapters from a video |
| `/ping` | GET | Health check |

---

## 🔧 How It Works

1. Extract the transcript from YouTube using the video ID
2. Split the transcript into chunks to stay within API token limits
3. Build a structured prompt with chunk context and instructions
4. Send to **Groq's Llama 3.3 70B Versatile** model for analysis
5. Parse the JSON response to extract chapter titles and timestamps
6. Deduplicate and sort chapters chronologically
7. Cache the result for 90 days to speed up repeat requests

### AI Model Config

| Parameter | Value |
|---|---|
| Model | Llama 3.3 70B Versatile |
| Temperature | 0 (deterministic) |
| Max Tokens | 1024 |
| Seed | 42 (reproducible output) |

---

## 🎨 Design Decisions

- **Dark theme** with coral/orange-red accent (`#ffb4a8`) for visual contrast
- **Material Design 3** inspired components for a modern feel
- **Animated loading states** to communicate processing time
- **Video background with blur** for depth without distraction
- **Deterministic AI output** (temperature: 0, seed: 42) to ensure consistent chapter quality across runs

---

## 🔮 Roadmap

- [ ] Support for non-English transcripts
- [ ] Export chapters as YouTube description format (copy-paste ready)
- [ ] Browser extension for one-click chapter generation
- [ ] Chapter quality / confidence scoring
- [ ] Support for uploaded video files (not just YouTube URLs)

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

## 👤 Author

**Abhinav Walde**

[GitHub](https://github.com/abhinavwalde204)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for fast and free LLM inference
- [youtube-transcript](https://www.npmjs.com/package/youtube-transcript) for transcript extraction
