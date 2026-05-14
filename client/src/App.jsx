import { useState } from 'react';
import { parseYouTubeId } from './utils/parseYoutubeId';
import Background from './components/Background';
import VideoInput from './components/VideoInput';
import LoadingState from './components/LoadingState';
import YouTubePlayer from './components/YouTubePlayer';
import ChapterList from './components/ChapterList';

export default function App() {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeChapter, setActiveChapter] = useState(null);
  const [playerStart, setPlayerStart] = useState(0);
  const [headerUrl, setHeaderUrl] = useState('');

  async function handleSubmit(id, url) {
    if (url) setHeaderUrl(url);
    setVideoId(id);
    setLoading(true);
    setError('');
    setResult(null);
    setActiveChapter(null);
    setPlayerStart(0);
    setStatus('Fetching transcript from YouTube...');

    const timers = [
      setTimeout(() => setStatus('Analysing content with AI...'), 3000),
      setTimeout(() => setStatus('Identifying topic boundaries...'), 8000),
      setTimeout(() => setStatus('Generating chapter titles...'), 15000),
    ];

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      if (data.chapters?.length > 0) {
        setActiveChapter(data.chapters[0]);
        setPlayerStart(data.chapters[0].startSeconds || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
      setStatus('');
    }
  }

  function handleHeaderSubmit() {
    const id = parseYouTubeId(headerUrl);
    if (id) handleSubmit(id, headerUrl);
  }

  function handleChapterClick(chapter) {
    setActiveChapter(chapter);
    setPlayerStart(chapter.startSeconds);
  }

  function handleReset() {
    setVideoId(null);
    setResult(null);
    setError('');
    setHeaderUrl('');
    setActiveChapter(null);
    setPlayerStart(0);
  }

  const showResults = result && !loading;
  const showHome = !videoId && !loading;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-hidden relative z-10">

      <Background />
      <header className="bg-surface sticky top-0 z-50 border-b border-surface-variant flex items-center justify-center w-full px-margin-mobile md:px-margin-desktop h-16">
        <button onClick={handleReset} className="font-h1 text-h1 font-bold text-on-surface hover:opacity-80 transition-opacity shrink-0 absolute left-margin-mobile md:left-margin-desktop">
          Chapter<span className="text-primary">AI</span>
        </button>

        {showResults && (
          <div className="flex items-center relative w-[400px]">
            <span className="material-symbols-outlined absolute left-3 text-[#aaaaaa] text-[20px]">search</span>
            <input
              className="w-full h-10 bg-surface-container border border-outline-variant rounded-full pl-10 pr-16 text-body text-on-surface focus:outline-none focus:border-primary-container transition-colors placeholder:text-[#666]"
              placeholder="Paste another YouTube URL..."
              type="text"
              value={headerUrl}
              onChange={(e) => setHeaderUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHeaderSubmit()}
            />
            <button
              onClick={handleHeaderSubmit}
              className="absolute right-1.5 bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-meta font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              Go
            </button>
          </div>
        )}
      </header>

      {/* ===== BOTTOM LEFT INFO BOX ===== */}
      <div className="fixed bottom-lg right-lg z-40">
        <div className="p-md bg-surface-container rounded-lg border border-outline-variant/30">
          <p className="text-meta font-meta text-on-surface-variant mb-sm">Powered by Groq &amp; Llama 3.3</p>
          <div className="flex items-center gap-xs text-primary">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-meta font-meta font-bold">AI Chapter Generation</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}

      {/* HOME VIEW */}
      {showHome && (
        <main className="ml-0 flex items-center justify-center min-h-[calc(100vh-64px)] px-margin-mobile">
          <div className="text-center w-full max-w-2xl animate-fade-in">
            {/* Hero */}
            <div className="mb-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-container/20 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h1 className="font-h1 text-4xl font-bold text-on-surface mb-3">
                Chapter<span className="text-primary">AI</span>
              </h1>
              <p className="text-body text-[#aaaaaa] max-w-md mx-auto">
                Paste any YouTube URL and get AI-generated chapters instantly. Our AI analyses the transcript to identify genuine topic shifts.
              </p>
            </div>

            {/* Input */}
            <VideoInput onSubmit={handleSubmit} />

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-sm mt-8">
              {[
                { icon: 'speed', label: 'Fast analysis' },
                { icon: 'target', label: 'Precise timestamps' },
                { icon: 'psychology', label: 'Topic-aware' },
                { icon: 'cached', label: '90-day cache' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-xs px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/20 text-meta font-meta text-[#888]">
                  <span className="material-symbols-outlined text-[14px] text-primary">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-md bg-error-container/20 border border-error/30 rounded-lg animate-fade-in">
                <p className="text-error text-body">{error}</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* LOADING VIEW */}
      {loading && (
        <main className="ml-0">
          <LoadingState status={status} />
        </main>
      )}

      {/* ERROR VIEW (after submit, no results) */}
      {error && !loading && videoId && !result && (
        <main className="ml-0 flex items-center justify-center min-h-[calc(100vh-64px)] px-margin-mobile">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-3xl">error</span>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-2">Something went wrong</h2>
            <p className="text-body text-[#aaaaaa] mb-6">{error}</p>
            <button onClick={handleReset} className="px-6 py-2 bg-surface-container-high text-on-surface rounded-full font-label text-label hover:bg-surface-container-highest transition-colors">
              Try another video
            </button>
          </div>
        </main>
      )}

      {/* RESULTS VIEW */}
      {showResults && (
        <main className="ml-0 pt-gutter px-margin-mobile md:px-margin-desktop pb-xl">
          <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-xl max-w-[1600px] mx-auto">

            {/* Left Column: Video */}
            <section className="flex flex-col gap-lg animate-slide-up">
              <YouTubePlayer videoId={videoId} startSeconds={playerStart} />

              {/* Video Info */}
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm text-meta font-meta text-[#aaaaaa]">
                  <span className="material-symbols-outlined text-[16px]">smart_display</span>
                  <span>Video ID: {videoId}</span>
                  {result.fromCache && (
                    <>
                      <span>•</span>
                      <span className="text-primary flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">cached</span>
                        Cached result
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Key Info Card */}
              <div className="bg-surface-container p-lg rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h2 className="font-h2 text-h2 text-on-surface">AI Analysis Summary</h2>
                </div>
                <div className="grid grid-cols-3 gap-md">
                  <div className="p-md bg-surface-container-high rounded-lg text-center">
                    <p className="font-h1 text-h1 text-primary">{result.chapters.length}</p>
                    <p className="text-meta font-meta text-[#aaaaaa]">Chapters found</p>
                  </div>
                  <div className="p-md bg-surface-container-high rounded-lg text-center">
                    <p className="font-h1 text-h1 text-primary">
                      {result.chapters.length > 0 ? result.chapters[result.chapters.length - 1].timestamp : '0:00'}
                    </p>
                    <p className="text-meta font-meta text-[#aaaaaa]">Last chapter at</p>
                  </div>
                  <div className="p-md bg-surface-container-high rounded-lg text-center">
                    <p className="font-h1 text-h1 text-primary">
                      {result.fromCache ? 'Yes' : 'No'}
                    </p>
                    <p className="text-meta font-meta text-[#aaaaaa]">From cache</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Chapters */}
            <section className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <ChapterList
                chapters={result.chapters}
                activeChapter={activeChapter}
                onChapterClick={handleChapterClick}
              />
            </section>

          </div>
        </main>
      )}
    </div>
  );
}
