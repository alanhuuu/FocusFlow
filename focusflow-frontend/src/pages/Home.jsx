import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Top nav bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.332 2.798H4.13c-1.36 0-2.333-1.797-1.332-2.798L4.2 15.3" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight text-lg">FocusFlow</span>
          <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">Beta</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to="/player"
            className="px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors duration-200 font-medium"
          >
            Player
          </Link>
          <Link
            to="/setup"
            className="px-4 py-2 text-sm rounded-lg bg-white/8 border border-white/10 text-white/80 hover:bg-white/12 hover:text-white transition-all duration-200 font-medium"
          >
            Setup
          </Link>
        </nav>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-10">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          Neural Adaptive Engine — Active
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-3xl">
          <span className="text-white">Music that thinks</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            like your brain.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-white/50 text-xl max-w-xl leading-relaxed mb-12">
          FocusFlow reads your EEG signals in real time and adapts music to sustain deep focus — automatically, continuously, effortlessly.
        </p>

        {/* Primary + secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link
            to="/setup"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-violet-600/40 hover:shadow-violet-600/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
            </svg>
            Get Started Free
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <Link
            to="/player"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white hover:border-white/20 font-semibold text-base transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Preview Player
          </Link>
        </div>

        {/* Feature pills row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20">
          {[
            { icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.332 2.798H4.13c-1.36 0-2.333-1.797-1.332-2.798L4.2 15.3", label: "EEG Brain Reading" },
            { icon: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z", label: "Adaptive Music" },
            { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", label: "Real-Time Sync" },
            { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Science-Backed" },
          ].map(({ icon, label }) => (
            <div key={label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/8 text-white/55 text-sm">
              <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </div>
          ))}
        </div>

        {/* Feature cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {[
            {
              title: "Reads your brain",
              body: "Connects to consumer EEG headsets and streams live brainwave data to detect attention, stress, and flow states.",
              color: "from-violet-500/20 to-transparent",
              border: "border-violet-500/20",
              dot: "bg-violet-400",
            },
            {
              title: "Adapts in real time",
              body: "The music BPM, key, and layering shift every few seconds based on your neural state — not a timer.",
              color: "from-indigo-500/20 to-transparent",
              border: "border-indigo-500/20",
              dot: "bg-indigo-400",
            },
            {
              title: "Tracks your flow",
              body: "Session analytics show your focus score over time so you can understand your peak performance windows.",
              color: "from-purple-500/20 to-transparent",
              border: "border-purple-500/20",
              dot: "bg-purple-400",
            },
          ].map(({ title, body, color, border, dot }) => (
            <div
              key={title}
              className={`relative rounded-2xl border ${border} bg-gradient-to-b ${color} bg-white/3 p-6 text-left backdrop-blur-sm`}
            >
              <div className={`w-2 h-2 rounded-full ${dot} mb-4 shadow-lg`} />
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center py-6 border-t border-white/5">
        <p className="text-white/20 text-xs">© 2024 FocusFlow — EEG Adaptive Audio</p>
      </footer>
    </div>
  );
}
