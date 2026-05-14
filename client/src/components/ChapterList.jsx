export default function ChapterList({ chapters, activeChapter, onChapterClick }) {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-xs mb-md">
        <div className="flex items-center gap-sm">
          <h2 className="font-h2 text-h2 text-on-surface">Chapters</h2>
          <span className="px-sm py-xs bg-surface-container-high rounded-full font-timestamp text-timestamp text-on-surface-variant border border-outline-variant/30">
            {chapters.length}
          </span>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto pr-sm space-y-xs">
        {chapters.map((ch, i) => {
          const isActive = activeChapter?.offsetMs === ch.offsetMs;
          return (
            <div
              key={i}
              onClick={() => onChapterClick(ch)}
              className={`chapter-item flex items-start gap-md p-md rounded-lg cursor-pointer ${
                isActive
                  ? 'bg-[rgba(255,0,0,0.1)] border-l-4 border-primary'
                  : 'border border-transparent hover:bg-surface-container-high'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={`font-timestamp text-timestamp text-primary shrink-0 ${
                isActive ? 'font-bold' : 'bg-primary/10 px-sm py-xs rounded'
              }`}>
                {ch.timestamp}
              </span>
              <div className="flex flex-col gap-xs">
                <span className={`font-label text-label transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface'
                }`}>
                  {ch.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
