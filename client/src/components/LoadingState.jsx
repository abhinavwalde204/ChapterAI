export default function LoadingState({ status }) {
  const steps = [
    { icon: 'subtitles', label: 'Fetching transcript', done: status?.includes('Analysing') || status?.includes('Identifying') || status?.includes('Generating') },
    { icon: 'psychology', label: 'Analysing content with AI', done: status?.includes('Identifying') || status?.includes('Generating') },
    { icon: 'auto_awesome', label: 'Identifying topic boundaries', done: status?.includes('Generating') },
    { icon: 'list_alt', label: 'Generating chapter titles', done: false },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-margin-mobile">
      <div className="text-center max-w-md w-full animate-fade-in">
        {/* Animated orb */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary-container/30" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
          <div className="absolute inset-2 rounded-full bg-primary-container/50" style={{ animation: 'pulse-glow 2s ease-in-out infinite 0.3s' }} />
          <div className="absolute inset-4 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1", animation: 'spin 3s linear infinite' }}>
              progress_activity
            </span>
          </div>
        </div>

        <h2 className="font-h2 text-h2 text-on-surface mb-2">Analysing video</h2>
        <p className="text-body text-[#aaaaaa] mb-8">This usually takes 20–60 seconds</p>

        {/* Step indicators */}
        <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-[18px] ${step.done ? 'text-green-400' : 'text-[#555]'}`}
                style={step.done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {step.done ? 'check_circle' : step.icon}
              </span>
              <span className={`text-label font-label ${step.done ? 'text-[#aaaaaa]' : 'text-[#555]'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
