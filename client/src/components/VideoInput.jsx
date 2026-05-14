import { useState } from 'react';
import { parseYouTubeId } from '../utils/parseYoutubeId';

export default function VideoInput({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    const id = parseYouTubeId(url);
    if (!id) {
      setError('Please paste a valid YouTube URL');
      return;
    }
    setError('');
    onSubmit(id, url);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-sm">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#aaaaaa]">link</span>
          <input
            id="url-input"
            type="text"
            placeholder="Paste any YouTube URL..."
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full h-12 bg-surface-container border border-outline-variant rounded-xl pl-12 pr-4 text-body text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/50 transition-all placeholder:text-[#666]"
          />
        </div>
        <button
          id="generate-btn"
          onClick={handleSubmit}
          className="h-12 px-6 bg-primary-container text-on-primary-fixed font-bold rounded-xl text-label hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Generate
        </button>
      </div>
      {error && (
        <p className="text-error text-meta font-meta mt-sm ml-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
