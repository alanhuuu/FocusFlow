import { useEffect, useMemo, useState } from "react";
import focusBg from "../assets/bg.png";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

      points.push({
        x,
        y,
      });
    }

    return points;
  }, [phase]);

  // -------------------------
  // Player controls (UI only for now)
  // -------------------------
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      {/* Background base */}
{/* Background Image (your screenshot) */}
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: `url(${focusBg})` }}
/>

{/* Dark overlay so text stays readable */}
<div className="absolute inset-0 bg-black/40 pointer-events-none" />


<div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/60" />



      {/* Top Left Brand */}
      <div className="absolute top-8 left-10 z-20">
        <div className="text-3xl font-extrabold tracking-tight">
          Focus<span className="text-white/60">Flow</span>
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/60 mt-1">
          EEG Adaptive Player
        </div>
      </div>

      {/* Top Right Timer */}
      <div className="absolute top-8 right-10 z-20 flex items-end gap-4">
        <div className="text-right">
          <div className="text-xs text-white/60 tracking-widest uppercase">
            Focus Timer
          </div>
          <div className="text-6xl font-extrabold tracking-tight">
            {formatTime(secondsLeft)}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => addMinutes(5)}
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            +5m
          </button>
          <button
            onClick={() => addMinutes(-5)}
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            -5m
          </button>

          <button
            onClick={() => setIsTimerRunning((v) => !v)}
            className="px-4 py-2 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
          >
            {isTimerRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>

      {/* Center Title + EEG Graph */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 pt-8 pb-32">
        <div className="text-center mb-8">
          <div className="text-sm text-white/70 tracking-wide">
            Live Brainwave Stream
          </div>
          <div className="text-4xl font-semibold mt-2">
            Stay locked in. We’ll handle the music.
          </div>
        </div>

        {/* Graph Card */}
        <div className="w-full max-w-4xl h-[220px] rounded-[32px] bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-full w-full px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">EEG Waveform</div>
              <div className="text-xs text-white/60">
                mode: alpha/theta/beta (demo)
              </div>
            </div>

            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eegData}>
                  <XAxis dataKey="x" hide />
                  <YAxis domain={[-2, 2]} hide />
                  <Tooltip content={() => null} />
                  <Line
                    type="monotone"
                    dataKey="y"
                    strokeWidth={3}
                    dot={false}
                    stroke="rgba(255,255,255,0.9)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Player Controls */}
      <div className="absolute bottom-10 left-10 z-20">
        <div className="w-[300px] rounded-[28px] bg-white/10 border border-white/15 backdrop-blur-xl shadow-xl p-5">
          <div className="text-xs text-white/60 uppercase tracking-widest">
            Now Playing
          </div>

          <div className="mt-2">
            <div className="text-lg font-semibold leading-tight">
              Deep Focus Mix
            </div>
            <div className="text-sm text-white/60">FocusFlow Radio</div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => alert("Skip (later MusicKit)")}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              ⏭ Skip
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex-1 px-4 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>

          <div className="mt-4 text-xs text-white/60">
            Adaptive mode:{" "}
            <span className="text-white font-semibold">ON</span> • Decision in{" "}
            <span className="text-white font-semibold">10s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
