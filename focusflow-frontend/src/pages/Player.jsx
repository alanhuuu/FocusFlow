import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { useEEG } from "../hooks/useEEG";
import bgFocus from "../assets/bg.png";
import bgHome from "../assets/bg-home.jpg";
import bgChill from "../assets/bg-chill.jpg";

import useMusicKit from "../hooks/useMusicKit";

// Icons
const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M14.3187 2.50498C13.0514 2.35716 11.8489 3.10033 11.4144 4.29989C11.3165 4.57023 11.2821 4.86251 11.266 5.16888C11.2539 5.40001 11.2509 5.67552 11.2503 6L11.25 6.45499C11.25 6.4598 11.25 6.4646 11.25 6.46938V14.5359C10.4003 13.7384 9.25721 13.25 8 13.25C5.37665 13.25 3.25 15.3766 3.25 18C3.25 20.6234 5.37665 22.75 8 22.75C10.6234 22.75 12.75 20.6234 12.75 18V9.21059C12.8548 9.26646 12.9683 9.32316 13.0927 9.38527L15.8002 10.739C16.2185 10.9481 16.5589 11.1183 16.8378 11.2399C17.119 11.3625 17.3958 11.4625 17.6814 11.4958C18.9486 11.6436 20.1511 10.9004 20.5856 9.70089C20.6836 9.43055 20.7179 9.13826 20.7341 8.83189C20.75 8.52806 20.75 8.14752 20.75 7.67988L20.7501 7.59705C20.7502 7.2493 20.7503 6.97726 20.701 6.71946C20.574 6.05585 20.2071 5.46223 19.6704 5.05185C19.4618 4.89242 19.2185 4.77088 18.9074 4.6155L16.1999 3.26179C15.7816 3.05264 15.4412 2.88244 15.1623 2.76086C14.8811 2.63826 14.6043 2.53829 14.3187 2.50498Z" />
  </svg>
);

const LotusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.063,8.226a7.976,7.976,0,0,0-5.521.63,10.063,10.063,0,0,0-3.986-5.687,1,1,0,0,0-1.112,0A10.072,10.072,0,0,0,7.457,8.858a7.964,7.964,0,0,0-5.521-.632,1,1,0,0,0-.732.769,10.771,10.771,0,0,0,2.481,9.149C6.036,20.781,8.873,21,11.816,21h.356c2.947,0,5.786-.219,8.14-2.855A10.764,10.764,0,0,0,22.8,8.994,1,1,0,0,0,22.063,8.226ZM12,5.245a8.36,8.36,0,0,1,2.772,4.73,9.256,9.256,0,0,0-1.089,1.017A10.3,10.3,0,0,0,12,13.515a10.345,10.345,0,0,0-1.687-2.523A9.314,9.314,0,0,0,9.227,9.98,8.362,8.362,0,0,1,12,5.245ZM10.958,18.992c-2.272-.05-4.173-.376-5.78-2.179A8.762,8.762,0,0,1,3.06,10.04a6.63,6.63,0,0,1,5.762,2.341A8.768,8.768,0,0,1,10.958,18.992Zm7.861-2.179c-1.61,1.8-3.513,2.129-5.789,2.179a8.759,8.759,0,0,1,2.138-6.61,6.808,6.808,0,0,1,5.011-2.393,5.528,5.528,0,0,1,.761.052A8.755,8.755,0,0,1,18.819,16.813Z" />
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
    <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H4c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1v9c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-9h1c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1h-5.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM4 7h7v2H4V7zm9 0h7v2h-7V7zM6 10h5v9H7c-.55 0-1-.45-1-1v-8zm7 0h5v8c0 .55-.45 1-1 1h-4v-9z" />
  </svg>
);

const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
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

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
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

  // EEG Hook for real Muse data
  const {
    isConnected,
    isStreaming,
    connectionStatus,
    eegData,
    currentData,
    error: eegError,
    connect,
    disconnect,
    startStream,
  } = useEEG();

  const focusState = currentData?.focusState || "—";

  // Handle connect button
  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      const result = await connect();
      if (result.success) {
        startStream();
      }
    }
  };

  const focusColor = useMemo(() => {
    if (focusState === "FOCUSED") return "#22c55e";
    if (focusState === "NEUTRAL") return "#eab308";
    if (focusState === "DISTRACTED") return "#ef4444";
    return "#7532ff";
  }, [focusState]);

  const currentTbr = currentData?.tbr?.toFixed(2) || "—";

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
  // MusicKit Logic
  // -------------------------
  const { music, ready, authorize, connected, fetchPlaylists, playPlaylist } = useMusicKit();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackTitle, setTrackTitle] = useState("Not Playing");
  const [trackSubtitle, setTrackSubtitle] = useState("Select a playlist");
  const [trackArtwork, setTrackArtwork] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = useState(false);
  const [isPlaylistPickerClosing, setIsPlaylistPickerClosing] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [queueItems, setQueueItems] = useState([]);

  // Settings panel state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(1);

  // -------------------------
  // TBR Tracking for MongoDB (Continuous)
  // -------------------------
  const tbrSamplesRef = useRef([]);
  const currentTrackRef = useRef(null);
  const trackStartTimeRef = useRef(null);
  const isSkippingRef = useRef(false);

  // Collect TBR continuously whenever EEG data updates while playing
  useEffect(() => {
    if (!isPlaying || !isStreaming || !currentTrackRef.current) return;

    const tbr = currentData?.tbr;
    if (tbr !== undefined && tbr !== null && !isNaN(tbr)) {
      tbrSamplesRef.current.push(tbr);
    }
  }, [isPlaying, isStreaming, currentData]);

  // Save song response to MongoDB
  const saveSongResponse = useCallback(async (action) => {
    const track = currentTrackRef.current;
    const samples = [...tbrSamplesRef.current]; // Copy samples

    if (!track) {
      console.log("No track to save");
      return;
    }

    // Calculate average TBR for the entire song duration
    const tbrAverage = samples.length > 0
      ? samples.reduce((a, b) => a + b, 0) / samples.length
      : 0;

    const listenedDuration = Math.floor((Date.now() - trackStartTimeRef.current) / 1000);

    // Determine focus state based on TBR average
    let focusState = "NEUTRAL";
    if (tbrAverage > 0) {
      if (tbrAverage < 2.0) focusState = "FOCUSED";
      else if (tbrAverage > 3.5) focusState = "DISTRACTED";
    }

    const payload = {
      song_id: track.id || "unknown",
      song_name: track.title,
      artist_name: track.artist,
      tbr_average: parseFloat(tbrAverage.toFixed(3)),
      tbr_samples: samples.map(s => parseFloat(s.toFixed(3))),
      focus_state: focusState,
      action: action, // "skip", "complete", or "love"
      listened_duration: listenedDuration,
      total_duration: Math.floor(track.duration || 0),
    };

    console.log(`Saving: ${track.title} | Action: ${action} | TBR Avg: ${tbrAverage.toFixed(2)} | Samples: ${samples.length} | Duration: ${listenedDuration}s`);

    try {
      const response = await fetch("http://localhost:8000/responses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Saved to MongoDB:", data.id);
      } else {
        console.error("Failed to save:", await response.text());
      }
    } catch (err) {
      console.error("Error saving:", err);
    }

    // Reset for next track
    tbrSamplesRef.current = [];
  }, []);

  // Loading timeout - prevent infinite spinner
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
      console.log("Loading timeout - resetting state");
    }, 15000); // 15 second max loading time

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const closePlaylistPicker = useCallback(() => {
    setIsPlaylistPickerClosing((prev) => {
      if (prev) return prev; // already closing
      setTimeout(() => {
        setIsPlaylistPickerOpen(false);
        setIsPlaylistPickerClosing(false);
      }, 350);
      return true;
    });
  }, []);

  // Load playlists after connected
  useEffect(() => {
    async function loadPlaylists() {
      if (!connected) return;
      // Small delay to ensure authorization is fully processed
      await new Promise(resolve => setTimeout(resolve, 500));
      const list = await fetchPlaylists();
      console.log("Loaded playlists:", list);
      setPlaylists(list || []);
    }
    loadPlaylists();
  }, [connected, fetchPlaylists]);

  // Refetch playlists when playlist picker opens (fallback)
  useEffect(() => {
    async function refetchPlaylists() {
      if (!isPlaylistPickerOpen || !connected) return;
      if (playlists.length === 0) {
        console.log("Playlist picker opened with no playlists, refetching...");
        const list = await fetchPlaylists();
        setPlaylists(list || []);
      }
    }
    refetchPlaylists();
  }, [isPlaylistPickerOpen, connected, playlists.length, fetchPlaylists]);

  // MusicKit player state (v3 API)
  useEffect(() => {
    if (!music) return;

    const onStateChange = () => {
      const state = music.playbackState;
      const MKStates = window.MusicKit?.PlaybackStates || {};

      setIsPlaying(state === MKStates.playing);
      setIsLoading(state === MKStates.loading || state === MKStates.waiting || state === MKStates.stalled);
    };

    const onTrackChange = () => {
      // Save previous track data before updating to new track
      if (currentTrackRef.current) {
        const action = isSkippingRef.current ? "skip" : "complete";
        saveSongResponse(action);
        isSkippingRef.current = false;
      }

      const item = music.nowPlayingItem;
      if (!item) {
        setTrackTitle("Not Playing");
        setTrackSubtitle("Select a playlist");
        setTrackArtwork(null);
        setDuration(0);
        currentTrackRef.current = null;
        return;
      }

      const title = item.title || item.attributes?.name || "Unknown";
      const artist = item.artistName || item.attributes?.artistName || "Unknown";

      setTrackTitle(title);
      setTrackSubtitle(artist);
      setDuration(music.currentPlaybackDuration || 0);

      const artUrl = item.artworkURL || item.attributes?.artwork?.url;
      const art = artUrl?.replace("{w}", "200").replace("{h}", "200");
      setTrackArtwork(art || null);

      // Store current track info for later saving
      currentTrackRef.current = {
        id: item.id,
        title: title,
        artist: artist,
        duration: music.currentPlaybackDuration || 0,
      };
      trackStartTimeRef.current = Date.now();
      tbrSamplesRef.current = [];
    };

    const onError = (error) => {
      console.error("MusicKit Global Error:", error);
      // Optionally set some UI state here
      setIsLoading(false);
    }

    const onTimeChange = () => {
      setCurrentTime(music.currentPlaybackTime || 0);
    };

    music.addEventListener("playbackStateDidChange", onStateChange);
    music.addEventListener("nowPlayingItemDidChange", onTrackChange);
    music.addEventListener("playbackTimeDidChange", onTimeChange);
    music.addEventListener("playbackError", onError);

    return () => {
      music.removeEventListener("playbackStateDidChange", onStateChange);
      music.removeEventListener("nowPlayingItemDidChange", onTrackChange);
      music.removeEventListener("playbackTimeDidChange", onTimeChange);
      music.removeEventListener("playbackError", onError);
    };
  }, [music, saveSongResponse]);

  // Update queue items when queue changes
  useEffect(() => {
    if (!music) return;

    const updateQueue = () => {
      const items = music.queue?.items || [];
      const currentIndex = music.queue?.position || 0;
      // Get upcoming items (after current)
      const upcoming = items.slice(currentIndex + 1).map((item) => ({
        id: item.id,
        title: item.title || item.attributes?.name || "Unknown",
        artist: item.artistName || item.attributes?.artistName || "Unknown",
        artwork: (item.artworkURL || item.attributes?.artwork?.url)
          ?.replace("{w}", "80")
          .replace("{h}", "80"),
      }));
      setQueueItems(upcoming);
    };

    updateQueue();
    music.addEventListener("queueItemsDidChange", updateQueue);
    music.addEventListener("queuePositionDidChange", updateQueue);
    music.addEventListener("nowPlayingItemDidChange", updateQueue);

    return () => {
      music.removeEventListener("queueItemsDidChange", updateQueue);
      music.removeEventListener("queuePositionDidChange", updateQueue);
      music.removeEventListener("nowPlayingItemDidChange", updateQueue);
    };
  }, [music]);

  async function handlePlayPause() {
    if (!music) return;

    try {
      const MKStates = window.MusicKit?.PlaybackStates || {};
      if (music.playbackState === MKStates.playing) {
        await music.pause();
      } else if (music.nowPlayingItem) {
        await music.play();
      } else {
        setIsPlaylistPickerOpen(true);
      }
    } catch (err) {
      console.error("Play/Pause error:", err);
    }
  }

  async function handleNext() {
    if (!music) return;
    try {
      isSkippingRef.current = true; // Mark as skip before changing track
      await music.skipToNextItem();
    } catch (err) {
      console.error("Next error:", err);
      isSkippingRef.current = false;
    }
  }

  async function handlePrevious() {
    if (!music) return;
    try {
      await music.skipToPreviousItem();
    } catch (err) {
      console.error("Previous error:", err);
    }
  }

  async function handleJumpToTrack(queueIndex) {
    if (!music) return;
    try {
      // queueIndex is the index within queueItems (upcoming tracks)
      // We need to add currentPosition + 1 to get the actual queue index
      const currentPosition = music.queue?.position || 0;
      const actualIndex = currentPosition + 1 + queueIndex;

      isSkippingRef.current = true; // Mark as skip before changing track
      await music.changeToMediaAtIndex(actualIndex);
    } catch (err) {
      console.error("Jump to track error:", err);
      isSkippingRef.current = false;
    }
  }

  // Volume change handler
  function handleVolumeChange(newVolume) {
    setVolume(newVolume);
    if (music) {
      music.volume = newVolume;
    }
  }

  // Logout from Apple Music
  async function handleLogout() {
    if (!music) return;
    try {
      await music.unauthorize();
      setTrackTitle("Not Playing");
      setTrackSubtitle("Select a playlist");
      setTrackArtwork(null);
      setPlaylists([]);
      setIsSettingsOpen(false);
      window.location.reload(); // Refresh to reset state
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // Timer preset options
  const timerPresets = [
    { label: "15 min", value: 15 * 60 },
    { label: "25 min", value: 25 * 60 },
    { label: "45 min", value: 45 * 60 },
    { label: "60 min", value: 60 * 60 },
  ];

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
        className={`absolute inset-0 bg-black transition-opacity duration-200 ease-in-out ${isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
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
          {connected ? "Connected to Apple Music" : ready ? "Connect to Apple Music" : "Loading..."}
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
              <div className="flex items-center gap-2">
                <div className="text-white/50 text-xs uppercase tracking-widest">Live Focus</div>
                {isStreaming && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-500 text-xs">LIVE</span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-medium mt-0.5" style={{ color: focusColor }}>{focusState}</div>
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

          {/* EEG Data / Chart Area */}
          <div className="w-[520px] h-[160px] rounded-2xl relative bg-white/5 border border-white/10 overflow-hidden">
            {!isStreaming ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/40 text-center">
                  <div className="text-lg">No EEG Data</div>
                  <div className="text-sm mt-1">Connect your headset to start</div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eegData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tbrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7532ff" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#7532ff" stopOpacity={0.05} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 5]} hide />
                  <ReferenceLine y={2.0} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.5} />
                  <ReferenceLine y={3.5} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey="tbr"
                    stroke="#7532ff"
                    strokeWidth={3}
                    fill="url(#tbrGradient)"
                    isAnimationActive={false}
                    filter="url(#glow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
              onClick={handleConnect}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${isConnected
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-white/10 text-white hover:bg-white/20"
                }`}
              disabled={connectionStatus === "connecting"}
            >
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "disconnected" && "Connect Headset"}
              {connectionStatus === "connected" && "Disconnect"}
              {connectionStatus === "streaming" && "Disconnect"}
            </button>
          </div>
          {eegError && (
            <div className="mt-3 text-red-400 text-xs text-center">{eegError}</div>
          )}
        </div>
      </div>

      {/* Bottom Left Music Button */}
      <div className="absolute bottom-14 left-10 z-20">
        <button
          onClick={() => setIsPlaylistPickerOpen(true)}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition"
          style={{ backgroundColor: "#2f2546" }}
          title="Select Playlist"
        >
          <MusicIcon />
        </button>
      </div>


      {/* Bottom Center Player (Deky UI) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="relative flex items-center gap-5 rounded-2xl px-5 py-3 border border-white/10" style={{ backgroundColor: "#2f2546" }}>
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

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs w-10 text-right">
              {duration > 0 ? formatTime(currentTime) : "--:--"}
            </span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                  backgroundColor: "#7532ff",
                }}
              />
            </div>
            <span className="text-white/50 text-xs w-10">
              {duration > 0 ? formatTime(duration) : "--:--"}
            </span>
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
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Next"
            >
              <SkipNextIcon />
            </button>
          </div>

          {/* Queue Toggle Button */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition ml-2"
            title="Show Queue"
          >
            {isQueueOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>

        {/* Queue Panel - Slide Up */}
        <div
          className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 ease-out ${
            isQueueOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{ backgroundColor: "#2f2546" }}
        >
          <div className="px-5 py-3 border-b border-white/10">
            <div className="text-white/80 text-sm font-medium">Up Next</div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {queueItems.length === 0 ? (
              <div className="px-5 py-8 text-white/40 text-sm text-center">
                No upcoming tracks
              </div>
            ) : (
              <div className="py-2">
                {queueItems.slice(0, 10).map((item, index) => (
                  <div
                    key={item.id || index}
                    onClick={() => handleJumpToTrack(index)}
                    className="flex items-center gap-3 px-5 py-2 hover:bg-white/10 transition cursor-pointer"
                  >
                    {/* Track Number */}
                    <div className="w-5 text-white/40 text-xs text-right">{index + 1}</div>
                    {/* Artwork */}
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                      {item.artwork ? (
                        <img src={item.artwork} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <MusicIcon />
                        </div>
                      )}
                    </div>
                    {/* Track Info */}
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm truncate">{item.title}</div>
                      <div className="text-white/50 text-xs truncate">{item.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Picker Modal */}
      {isPlaylistPickerOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${isPlaylistPickerClosing ? "modal-fade-out" : "modal-fade-in"
            }`}
          onClick={closePlaylistPicker}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className={`relative w-[700px] max-h-[80vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden ${isPlaylistPickerClosing ? "modal-pop-out" : "modal-pop-in"
              }`}
            style={{ backgroundColor: "rgba(47, 37, 70, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
              <div className="text-white text-xl font-medium">Your Playlists</div>
              <button
                onClick={closePlaylistPicker}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>

            {/* Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {playlists.length === 0 ? (
                <div className="text-white/50 text-center py-12">No playlists found</div>
              ) : (
                <div className="grid grid-cols-4 gap-5">
                  {playlists.map((p) => {
                    const artworkUrl = p.attributes?.artwork?.url
                      ?.replace("{w}", "300")
                      .replace("{h}", "300");

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPlaylistId(p.id);
                          playPlaylist(p.id);
                          closePlaylistPicker();
                        }}
                        className="group text-left"
                      >
                        {/* Artwork */}
                        <div className="aspect-square rounded-xl overflow-hidden bg-white/10 mb-3 group-hover:ring-2 ring-[#7532ff] transition">
                          {artworkUrl ? (
                            <img
                              src={artworkUrl}
                              alt={p.attributes?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30">
                              <MusicIcon />
                            </div>
                          )}
                        </div>
                        {/* Name */}
                        <div className="text-white text-sm font-medium truncate group-hover:text-[#7532ff] transition">
                          {p.attributes?.name || "Unnamed Playlist"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              className={`text-white text-base font-light mt-2 transition-opacity duration-300 ${showThemeLabel ? "opacity-100" : "opacity-0"
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
            onClick={() => setIsSettingsOpen(true)}
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

      {/* Settings Panel - Slide from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "rgba(47, 37, 70, 0.98)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="text-white text-lg font-medium">Settings</div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/80">
              <VolumeIcon />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#7532ff]"
                style={{
                  background: `linear-gradient(to right, #7532ff ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
                }}
              />
              <span className="text-white/60 text-sm w-10 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Timer Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/80">
              <TimerIcon />
              <span className="text-sm font-medium">Focus Timer</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timerPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setSecondsLeft(preset.value);
                    setIsTimerRunning(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    secondsLeft === preset.value
                      ? "bg-[#7532ff] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Apple Music Connection Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/80">
              <MusicIcon />
              <span className="text-sm font-medium">Apple Music</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-white/40"}`} />
                <span className="text-white/70 text-sm">
                  {connected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
            {connected && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                <LogoutIcon />
                <span className="text-sm font-medium">Sign Out of Apple Music</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* About Section */}
          <div className="space-y-2">
            <div className="text-white/40 text-xs uppercase tracking-wider">About</div>
            <div className="text-white/60 text-sm">FocusFlow v1.0</div>
            <div className="text-white/40 text-xs">
              EEG-powered focus tracking with adaptive music
            </div>
          </div>
        </div>
      </div>

      {/* Settings Backdrop */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
