import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import bgFocus from "../assets/bg.png";
import bgHome from "../assets/bg-home.jpg";
import bgChill from "../assets/bg-chill.jpg";

import useMusicKit from "../hooks/useMusicKit";

// Icons
const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M14.3187 2.50498C13.0514 2.35716 11.8489 3.10033 11.4144 4.29989C11.3165 4.57023 11.2821 4.86251 11.266 5.16888C11.2539 5.40001 11.2509 5.67552 11.2503 6L11.25 6.45499C11.25 6.4598 11.25 6.4646 11.25 6.46938V14.5359C10.4003 13.7384 9.25721 13.25 8 13.25C5.37665 13.25 3.25 15.3766 3.25 18C3.25 20.6234 5.37665 22.75 8 22.75C10.6234 22.75 12.75 20.6234 12.75 18V9.21059C12.8548 9.26646 12.9683 9.32316 13.0927 9.38527L15.8002 10.739C16.2185 10.9481 16.5589 11.1183 16.8378 11.2399C17.119 11.3625 17.3958 11.4625 17.6814 11.4958C18.9486 11.6436 20.1511 10.9004 20.5856 9.70089C20.6836 9.43055 20.7179 9.13826 20.7341 8.83189C20.75 8.52806 20.75 8.14752 20.75 7.67988L20.7501 7.59705C20.7502 7.2493 20.7503 6.97726 20.701 6.71946C20.574 6.05585 20.2071 5.46223 19.6704 5.05185C19.4618 4.89242 19.2185 4.77088 18.9074 4.6155L16.1999 3.26179C15.7816 3.05264 15.4412 2.88244 15.1623 2.76086C14.8811 2.63826 14.6043 2.53829 14.3187 2.50498Z" />
  </svg>
);

const LotusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.063,8.226a7.976,7.976,0,0,0-5.521.63,10.063,10.063,0,0,0-3.986-5.687,1,1,0,0,0-1.112,0A10.072,10.072,0,0,0,7.457,8.858a7.964,7.964,0,0,0-5.521-.632,1,1,0,0,0-.732.769,10.771,10.771,0,0,0,2.481,9.149C6.036,20.781,8.873,21,11.816,21h.356c2.947,0,5.786-.219,8.14-2.855A10.764,10.764,0,0,0,22.8,8.994,1,1,0,0,0,22.063,8.226ZM12,5.245a8.36,8.36,0,0,1,2.772,4.73,9.256,9.256,0,0,0-1.089,1.017A10.3,10.3,0,0,0,12,13.515a10.345,10.345,0,0,0-1.687-2.523A9.314,9.314,0,0,0,9.227,9.98,8.362,8.362,0,0,1,12,5.245ZM10.958,18.992c-2.272-.05-4.173-.376-5.78-2.179A8.762,8.762,0,0,1,3.06,10.04a6.63,6.63,0,0,1,5.762,2.341A8.768,8.768,0,0,1,10.958,18.992Zm7.861-2.179c-1.61,1.8-3.513,2.129-5.789,2.179a8.759,8.759,0,0,1,2.138-6.61,6.808,6.808,0,0,1,5.011-2.393,5.528,5.528,0,0,1,.761.052A8.755,8.755,0,0,1,18.819,16.813Z"/>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7ZM9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
  </svg>
);

const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
  </svg>
);

const SkipNextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 4l10 8-10 8V4z" />
    <rect x="16" y="4" width="2" height="16" />
  </svg>
);

const SkipPrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 4L8 12l10 8V4z" />
    <rect x="6" y="4" width="2" height="16" />
  </svg>
);

export default function Player() {
  // -------------------------
  // Timer
  // -------------------------
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // -------------------------
  // Deky theme switching UI
  // -------------------------
  const [activeScene, setActiveScene] = useState("ambient");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showThemeLabel, setShowThemeLabel] = useState(false);

  const backgrounds = {
    ambient: bgFocus,
    home: bgHome,
    focus: bgChill,
  };

  const themeLabels = {
    ambient: "Ambient",
    home: "Home",
    focus: "Focus",
  };

  const handleSceneChange = (scene) => {
    if (scene === activeScene || isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveScene(scene);
      setTimeout(() => {
        setIsTransitioning(false);
        setShowThemeLabel(true);
        setTimeout(() => setShowThemeLabel(false), 4000);
      }, 50);
    }, 250);
  };

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // -------------------------
  // ✅ NO EEG DATA (match Deky UI)
  // -------------------------
  const focusState = "—";
  const currentTbr = "—";
  const focusColor = "#a855f7";

  // -------------------------
  // ✅ MusicKit Logic (OUR CODE)
  // -------------------------
  const { music, ready, authorize, connected, fetchPlaylists, playPlaylist } = useMusicKit();

  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState("Not Playing");
  const [trackSubtitle, setTrackSubtitle] = useState("Select a playlist");
  const [trackArtwork, setTrackArtwork] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = useState(false);

  // Load playlists after connected
  useEffect(() => {
    async function loadPlaylists() {
      if (!connected) return;
      const list = await fetchPlaylists();
      setPlaylists(list || []);
    }
    loadPlaylists();
  }, [connected, fetchPlaylists]);

  // Now playing listener
  useEffect(() => {
    if (!music) return;

    const updateNowPlaying = () => {
      const nowPlaying = music.player.nowPlayingItem;

      if (!nowPlaying) {
        setTrackTitle("Not Playing");
        setTrackSubtitle("Select a playlist");
        setTrackArtwork(null);
      } else {
        setTrackTitle(nowPlaying.title || "Unknown Track");
        setTrackSubtitle(nowPlaying.artistName || "Unknown Artist");

        if (nowPlaying.artworkURL) {
          const url = nowPlaying.artworkURL.replace("{w}", "200").replace("{h}", "200");
          setTrackArtwork(url);
        } else {
          setTrackArtwork(null);
        }
      }

      setIsPlaying(!!music.player.isPlaying);
    };

    updateNowPlaying();
    music.player.addEventListener("playbackStateDidChange", updateNowPlaying);
    music.player.addEventListener("nowPlayingItemDidChange", updateNowPlaying);

    return () => {
      music.player.removeEventListener("playbackStateDidChange", updateNowPlaying);
      music.player.removeEventListener("nowPlayingItemDidChange", updateNowPlaying);
    };
  }, [music]);

  async function handlePlayPause() {
    if (!music) return;

    try {
      if (music.player.isPlaying) {
        await music.player.pause();
        setIsPlaying(false);
        return;
      }

      // If nothing queued yet, force playlist selection
      if (!music.player.nowPlayingItem) {
        setIsPlaylistPickerOpen(true);
        return;
      }

      await music.player.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play/Pause error:", err);
    }
  }

  async function handleNext() {
    if (!music) return;
    try {
      await music.player.skipToNextItem();
    } catch (err) {
      console.error("Next error:", err);
    }
  }

  async function handlePrevious() {
    if (!music) return;
    try {
      await music.player.skipToPreviousItem();
    } catch (err) {
      console.error("Previous error:", err);
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgrounds[activeScene]})` }}
      />

      {/* Dark overlay (only for ambient) */}
      {activeScene === "ambient" && <div className="absolute inset-0 bg-black/60" />}

      {/* Transition overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ease-in-out ${
          isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Top Left Brand */}
      <div className="absolute top-8 left-10 z-20">
        <div className="text-4xl tracking-tight font-semibold">focusflow</div>

        {/* ✅ CONNECT BUTTON UNDER LOGO */}
        <button
          onClick={authorize}
          disabled={!ready || connected}
          className="mt-4 px-5 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#7532ff" }}
        >
          {connected ? "Connected" : ready ? "Connect" : "Loading..."}
        </button>
      </div>

      {/* Top Right Timer */}
      <div className="absolute top-8 right-10 z-20">
        <div className="rounded-3xl bg-black/40 backdrop-blur-sm px-8 py-6">
          <div className="text-2xl text-white/80 font-thin text-center">Focus</div>
          <div className="text-7xl tracking-tight mt-1 text-center">{formatTime(secondsLeft)}</div>
          <div className="flex justify-center">
            <button
              onClick={() => setIsTimerRunning((v) => !v)}
              className="mt-4 px-14 py-2 rounded-2xl text-white text-lg font-thin hover:opacity-90 transition"
              style={{ backgroundColor: "#7532ff" }}
            >
              {isTimerRunning ? "Pause" : "Start"}
            </button>
          </div>
        </div>
      </div>

      {/* Center EEG Graph Card (NO DATA) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="rounded-3xl px-8 py-6 border border-white/10 backdrop-blur-xl shadow-2xl"
          style={{ backgroundColor: "rgba(47, 37, 70, 0.75)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-white/50 text-xs uppercase tracking-widest">Live Focus</div>
              <div className="text-2xl font-medium mt-0.5" style={{ color: focusColor }}>
                {focusState}
              </div>
            </div>

            {/* TBR Display */}
            <div className="text-right">
              <div className="text-white/40 text-xs uppercase tracking-wider">Theta/Beta Ratio</div>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-4xl font-bold" style={{ color: focusColor }}>
                  {currentTbr}
                </span>
                <span className="text-white/40 text-sm">TBR</span>
              </div>
            </div>
          </div>

          {/* No EEG Data */}
          <div className="w-[520px] h-[160px] rounded-2xl flex items-center justify-center text-white/60 bg-white/5 border border-white/10">
            <div className="text-center">
              <div className="text-lg font-medium text-white/80">No EEG Data</div>
              <div className="text-sm text-white/40 mt-1">Connect your headset to start</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="text-white/60 text-sm">Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <span className="text-white/60 text-sm">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <span className="text-white/60 text-sm">Distracted</span>
              </div>
            </div>

            <button
              className="px-5 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition text-sm"
              title="Connect Headset"
            >
              Connect Headset
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Left Music Button (THIS is the playlist select trigger) */}
      {/* Bottom Left Music Button (Deky UI: should NOT open playlist picker) */}
    <div className="absolute bottom-14 left-10 z-20">
        <button
            onClick={() => setIsPlaylistPickerOpen(true)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center hover:opacity-90 transition"
            style={{ backgroundColor: "#2f2546" }}
            title="Select Playlist"
            >
            <MusicIcon />
            </button>

        </div>


      {/* Bottom Center Player (Deky UI) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-5 rounded-2xl px-5 py-3 border border-white/10" style={{ backgroundColor: "#2f2546" }}>
          {/* Album Cover */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            {trackArtwork ? (
              <img src={trackArtwork} alt="Artwork" className="w-12 h-12 object-cover" />
            ) : (
              <div className="text-white/40 text-xs">IMG</div>
            )}
          </div>

          {/* Track Info */}
          <div className="min-w-[120px]">
            <div className="text-white text-sm font-medium truncate max-w-[160px]">{trackTitle}</div>
            <div className="text-white/60 text-xs truncate max-w-[160px]">{trackSubtitle}</div>
          </div>

          {/* Progress (placeholder visual only to match Deky) */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs w-8 text-right">--:--</span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `35%`, backgroundColor: "#7532ff" }} />
            </div>
            <span className="text-white/50 text-xs w-8">--:--</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Previous"
            >
              <SkipPrevIcon />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition"
              style={{ backgroundColor: "#7532ff" }}
              title="Play / Pause"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Next"
            >
              <SkipNextIcon />
            </button>
          </div>
        </div>

                {/* ✅ Playlist Picker (hidden unless opened by music note button) */}
        {isPlaylistPickerOpen && (
          <div
            className="absolute left-0 bottom-20 w-[380px] rounded-2xl border border-white/10 backdrop-blur-xl px-4 py-3 shadow-2xl z-50"
            style={{ backgroundColor: "rgba(47, 37, 70, 0.95)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/70 text-sm font-medium">Select Playlist</div>
              <button
                onClick={() => setIsPlaylistPickerOpen(false)}
                className="text-white/50 hover:text-white transition text-sm"
              >
                ✕
              </button>
            </div>

            <select
              value={selectedPlaylistId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedPlaylistId(id);

                if (id) {
                  playPlaylist(id); // ✅ AUTOPLAY ON SELECT
                  setIsPlaylistPickerOpen(false); // close after selecting
                }
              }}
              className="w-full h-10 px-4 rounded-full bg-white/10 border border-white/10 text-white outline-none"
            >
              <option value="">Choose a playlist...</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.attributes?.name || "Unnamed Playlist"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bottom Right Buttons (Deky exact layout) */}
      <div className="absolute bottom-6 right-10 z-20">
        <div className="flex gap-2 items-start">
          {/* Theme toggle group */}
          <div className="flex flex-col items-center">
            <div
              className="flex rounded-full p-1 gap-0.5 border-2 border-white/30"
              style={{ backgroundColor: "#2f2546" }}
            >
              <button
                onClick={() => handleSceneChange("ambient")}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition"
                style={{ backgroundColor: activeScene === "ambient" ? "#7532ff" : "transparent" }}
              >
                <LotusIcon />
              </button>
              <button
                onClick={() => handleSceneChange("home")}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition"
                style={{ backgroundColor: activeScene === "home" ? "#7532ff" : "transparent" }}
              >
                <HomeIcon />
              </button>
              <button
                onClick={() => handleSceneChange("focus")}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition"
                style={{ backgroundColor: activeScene === "focus" ? "#7532ff" : "transparent" }}
              >
                <LightbulbIcon />
              </button>
            </div>

            <div
              className={`text-white text-base font-light mt-2 transition-opacity duration-300 ${
                showThemeLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              {themeLabels[activeScene]}
            </div>
          </div>

          {/* Buttons */}
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition"
            style={{ backgroundColor: "#2f2546" }}
          >
            <GiftIcon />
          </button>
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition"
            style={{ backgroundColor: "#2f2546" }}
          >
            <SettingsIcon />
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition"
            style={{ backgroundColor: "#2f2546" }}
          >
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
