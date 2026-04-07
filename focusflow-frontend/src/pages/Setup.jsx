export default function Setup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Hero Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-400 text-sm font-semibold tracking-widest uppercase">Setup</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Connect Your Music Services</h1>
          <p className="text-white/50 text-lg max-w-xl">
            Link your music and focus tools to unlock personalized sessions tailored to how you work.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-8 pt-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-sm font-medium text-white">Connect Services</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/40">2</div>
            <span className="text-sm font-medium text-white/40">Preferences</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/40">3</div>
            <span className="text-sm font-medium text-white/40">Go Live</span>
          </div>
        </div>

        {/* Service Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Apple Music Card */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-pink-500/40 transition-all duration-300 p-8 cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm5.92 8.598l-4.687 1.46V15.5a2.5 2.5 0 11-1-2V9.44l5.688-1.773v3.93z" />
                </svg>
              </div>
              <span className="text-xs font-semibold tracking-wide text-white/30 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">Not Connected</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Apple Music</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Stream your playlists and let FocusFlow sync your music with your focus sessions automatically.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-pink-600/20 hover:shadow-pink-500/30 active:scale-95">
              Connect Apple Music
            </button>
          </div>

          {/* Muse Card */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-violet-500/40 transition-all duration-300 p-8 cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xs font-semibold tracking-wide text-white/30 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">Not Connected</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Muse</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Connect Muse to bring your creative boards and focus context into every session you start.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 active:scale-95">
              Connect Muse
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-10 flex items-start gap-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">You can always connect services later</p>
            <p className="text-sm text-white/40 leading-relaxed">
              Skipping a service now won't limit your setup. You can return to this page anytime from your account settings to connect additional tools.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pb-16">
          <button className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200 font-medium">
            ← Back
          </button>
          <button className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30 active:scale-95">
            Continue to Preferences →
          </button>
        </div>
      </div>
    </div>
  );
}