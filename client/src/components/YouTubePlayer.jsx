export default function YouTubePlayer({ videoId, startSeconds }) {
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden border border-outline-variant/20 shadow-xl bg-surface-container-lowest">
      <iframe
        key={`${videoId}-${startSeconds}`}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}
