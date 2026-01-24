import { useEffect, useMemo, useState } from "react";
import focusBg from "../assets/bg.png";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Player() {
  // -------------------------
  // Timer (Pomodoro-style)
  // -------------------------
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  function addMinutes(mins) {
    setSecondsLeft((s) => Math.max(0, s + mins * 60));
  }

  // -------------------------
  // Fake EEG sine wave graph data (animated)
  // -------------------------
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => p + 0.25);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const eegData = useMemo(() => {
    const points = [];
    const freq = 0.35;
    const amp = 1;

    for (let i = 0; i < 180; i++) {
      const x = i;
      const y =
        amp * Math.sin(i * freq + phase) +
        0.35 * Math.sin(i * 0.08 + phase * 0.6);

      points.push({ x, y });
    }

    return points;
  }, [phase]);

  // -------------------------
  // Player controls (UI only for now)
  // -------------------------
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${focusBg})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Soft vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/60" />

      {/* ======================= */}
      {/* Top Left Brand */}
      {/* ======================= */}
      <div className="absolute top-10 left-12 z-20">
        <div className="text-4xl font-extrabold tracking-tight">
          Focus<span className="text-white/50">Flow</span>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-white/60 mt-1">
          EEG Adaptive Player
        </div>
      </div>

      {/* ======================= */}
      {/* Top Right Timer Card */}
      {/* ======================= */}
      <div className="absolute top-10 right-12 z-20">
        <div className="rounded-[32px] bg-black/30 border border-white/10 backdrop-blur-2xl shadow-2xl px-8 py-6 w-[290px] text-center">
          <div className="text-xs text-white/50 tracking-widest uppercase">
            Focus Timer
          </div>

          <div className="text-6xl font-extrabold tracking-tight mt-2">
            {formatTime(secondsLeft)}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => addMinutes(5)}
                className="flex-1 h-[44px] rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition"
              >
                +5m
              </button>

              <button
                onClick={() => addMinutes(-5)}
                className="flex-1 h-[44px] rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition"
              >
                -5m
              </button>
            </div>

            <button
              onClick={() => setIsTimerRunning((v) => !v)}
              className="h-[48px] rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 transition shadow-lg shadow-violet-600/30"
            >
              {isTimerRunning ? "Pause" : "Start"}
            </button>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* Center Section */}
      {/* ======================= */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-28 px-12">
        {/* Title */}
        <div className="text-center max-w-4xl">
          <div className="text-sm text-white/60 tracking-wide">
            Live Brainwave Stream
          </div>
          <div className="text-5xl font-semibold mt-3 leading-tight">
            Stay locked in. We’ll handle the music.
          </div>
        </div>

        {/* Graph */}
        <div className="mt-14 w-full max-w-5xl">
          <div className="h-[270px] rounded-[40px] bg-black/25 border border-white/10 backdrop-blur-2xl shadow-2xl px-10 py-8">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">
                EEG Waveform
              </div>
              <div className="text-xs text-white/50">
                mode: alpha/theta/beta
              </div>
            </div>

            <div className="mt-6 h-[170px]">
              <LineChart
                xAxis={[
                  {
                    data: eegData.map((p) => p.x),
                    disableLine: true,
                    disableTicks: true,
                    tickLabelStyle: { fill: "transparent" },
                  },
                ]}
                yAxis={[
                  {
                    min: -2,
                    max: 2,
                    disableLine: true,
                    disableTicks: true,
                    tickLabelStyle: { fill: "transparent" },
                  },
                ]}
                series={[
                  {
                    data: eegData.map((p) => p.y),
                    curve: "natural",
                    color: "rgba(255,255,255,0.95)",
                  },
                ]}
                height={170}
                margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
                sx={{
                  "& .MuiChartsAxis-line": { display: "none" },
                  "& .MuiChartsAxis-tick": { display: "none" },
                  "& .MuiChartsTooltip-root": { display: "none" },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* Bottom Left Player Card */}
      {/* ======================= */}
      <div className="absolute bottom-12 left-12 z-20">
        <div className="w-[360px] rounded-[32px] bg-black/30 border border-white/10 backdrop-blur-2xl shadow-2xl px-6 py-6">
          <div className="text-xs text-white/50 uppercase tracking-widest">
            Now Playing
          </div>

          <div className="mt-2">
            <div className="text-3xl font-semibold leading-tight">
              Deep Focus Mix
            </div>
            <div className="text-lg text-white/55 mt-1">
              FocusFlow Radio
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => alert("Skip (later MusicKit)")}
              className="h-[56px] rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition text-lg font-semibold"
            >
              ⏭ Skip
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="h-[56px] rounded-full bg-violet-600 hover:bg-violet-500 transition shadow-lg shadow-violet-600/30 text-lg font-semibold"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
