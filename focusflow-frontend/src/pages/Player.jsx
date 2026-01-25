import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { useEEG } from "../hooks/useEEG";
import bgFocus from "../assets/bg.png";
import bgHome from "../assets/bg-home.jpg";
import bgChill from "../assets/bg-chill.jpg";
import appleMusicIcon from "../assets/apple-music.svg";

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

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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
  const [elementsVisible, setElementsVisible] = useState(true);

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

    // Hide theme label immediately
    setShowThemeLabel(false);

    // Step 1: Fade out UI elements AND background at the same time
    setElementsVisible(false);
    setIsTransitioning(true);

    // Step 2: Change the actual background (after fade to black)
    setTimeout(() => {
      setActiveScene(scene);

      // Step 3: Fade in new background
      setTimeout(() => {
        setIsTransitioning(false);

        // Step 4: Fade in UI elements (separate, after background)
        setTimeout(() => {
          setElementsVisible(true);

          // Step 5: Show theme label after elements are visible
          setTimeout(() => {
            setShowThemeLabel(true);
            setTimeout(() => setShowThemeLabel(false), 4000);
          }, 500);
        }, 250);
      }, 50);
    }, 300);
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
  const { music, ready, authorize, connected, fetchPlaylists, playPlaylist, searchAndQueueSongs } = useMusicKit();

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
  const [showEegWarning, setShowEegWarning] = useState(false);
  const [isEegWarningClosing, setIsEegWarningClosing] = useState(false);
  const [hasAcousticBrainz, setHasAcousticBrainz] = useState(null); // null = checking, true/false = result

  // AI Music Discovery
  const [toast, setToast] = useState(null); // { message, songs } or null
  const [aiSongIds, setAiSongIds] = useState(new Set()); // Track AI-added song IDs

  // Testing mode: max song duration (set to 0 to disable)
  const MAX_SONG_DURATION = 45; // seconds

  // Settings panel state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(1);

  // Distraction skip
  const [distractionSkipMessage, setDistractionSkipMessage] = useState(null);
  const [distractionCountdown, setDistractionCountdown] = useState(null); // Only shows last 5 seconds
  const distractionCountRef = useRef(0);
  const DISTRACTION_LIMIT = 15;


  // -------------------------
  // TBR Tracking for MongoDB (Continuous)
  // -------------------------
  const tbrSamplesRef = useRef([]);
  const currentTrackRef = useRef(null);
  const trackStartTimeRef = useRef(null);
  const isSkippingRef = useRef(false);
  const autoSkipTriggeredRef = useRef(false); // Guard against multiple auto-skips

  // Collect TBR continuously whenever EEG data updates while playing
  useEffect(() => {
    if (!isPlaying || !isStreaming || !currentTrackRef.current) return;

    const tbr = currentData?.tbr;
    if (tbr !== undefined && tbr !== null && !isNaN(tbr)) {
      tbrSamplesRef.current.push(tbr);
    }
  }, [isPlaying, isStreaming, currentData]);

  // Distraction skip - use ref for focusState to avoid effect re-running
  const focusStateRef = useRef(focusState);
  focusStateRef.current = focusState;

  useEffect(() => {
    if (!isPlaying || !isStreaming || !music) {
      distractionCountRef.current = 0;
      setDistractionCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      if (focusStateRef.current === "DISTRACTED") {
        distractionCountRef.current += 1;
        const remaining = DISTRACTION_LIMIT - distractionCountRef.current;

        // Show countdown for last 5 seconds only
        if (remaining <= 5 && remaining > 0) {
          setDistractionCountdown(remaining);
        }

        if (distractionCountRef.current >= DISTRACTION_LIMIT) {
          distractionCountRef.current = 0;
          setDistractionCountdown(null);
          isSkippingRef.current = true;
          music.skipToNextItem();
          setDistractionSkipMessage("Mind wandering detected - finding better music");
          setTimeout(() => setDistractionSkipMessage(null), 4000);
        }
      } else {
        if (distractionCountRef.current > 0) {
          setDistractionCountdown(null);
        }
        distractionCountRef.current = 0;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isStreaming, music]);

  // Save song response to MongoDB
  const saveSongResponse = useCallback(async (action) => {
    const track = currentTrackRef.current;
    const samples = [...tbrSamplesRef.current];

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
        console.log("Full response data:", data);
        console.log("Recommendations in response:", data.recommendations);
        console.log("Song count:", data.song_count);

        // Handle ML recommendations - NEW music discovery
        if (data.recommendations && data.recommendations.length > 0) {
          console.log("Discovered NEW music:", data.recommendations);

          // Search Apple Music and add to queue
          const addedSongs = await searchAndQueueSongs(data.recommendations);

          if (addedSongs.length > 0) {
            // Track AI song IDs for queue indicator
            const newAiIds = new Set(aiSongIds);
            addedSongs.forEach(s => {
              if (s.catalogId) newAiIds.add(s.catalogId);
            });
            setAiSongIds(newAiIds);

            // Show toast with songs that were actually added
            setToast({
              message: `Added ${addedSongs.length} new songs to your queue`,
              songs: addedSongs.map(s => ({
                song_name: s.appleMusicName || s.song_name,
                artist_name: s.appleMusicArtist || s.artist_name,
                focus_score: s.focus_score,
                artwork: s.artwork
              })),
            });
          } else {
            // Show toast but note songs couldn't be added
            setToast({
              message: `Found ${data.recommendations.length} songs (not on Apple Music)`,
              songs: data.recommendations,
            });
          }

          // Auto-hide toast after 8 seconds
          setTimeout(() => setToast(null), 8000);
        }
      } else {
        const errorData = await response.json();
        // Don't log as error if it's just not in AcousticBrainz
        if (errorData.detail?.includes("AcousticBrainz")) {
          console.log("Skipped saving - not in AcousticBrainz");
        } else {
          console.error("Failed to save:", errorData.detail);
        }
      }
    } catch (err) {
      console.error("Error saving:", err);
    }

    // Reset for next track
    tbrSamplesRef.current = [];
  }, [searchAndQueueSongs, aiSongIds]);

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

  const closeEegWarning = useCallback(() => {
    setIsEegWarningClosing((prev) => {
      if (prev) return prev; // already closing
      setTimeout(() => {
        setShowEegWarning(false);
        setIsEegWarningClosing(false);
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

    const onTrackChange = async () => {
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
        setHasAcousticBrainz(null);
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
      // Note: autoSkipTriggeredRef is reset in a separate effect when currentTime drops below 2s
      // This prevents race conditions where the old track's high currentTime triggers an immediate skip

      // Check if song has AcousticBrainz data
      setHasAcousticBrainz(null); // Reset to checking state
      try {
        const resp = await fetch(
          `http://localhost:8000/responses/check-features?song_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
        );
        if (resp.ok) {
          const data = await resp.json();
          setHasAcousticBrainz(data.has_acousticbrainz);
        } else {
          setHasAcousticBrainz(false);
        }
      } catch (err) {
        console.error("Failed to check AcousticBrainz:", err);
        setHasAcousticBrainz(false);
      }
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

  // Auto-skip after MAX_SONG_DURATION seconds (for testing)
  // Reset the auto-skip flag when a new track starts (currentTime resets to low value)
  useEffect(() => {
    if (currentTime < 2 && autoSkipTriggeredRef.current) {
      autoSkipTriggeredRef.current = false;
    }
  }, [currentTime]);

  useEffect(() => {
    if (!music || !isPlaying || MAX_SONG_DURATION <= 0) return;

    // Only trigger auto-skip if we've been playing this track for a bit (not a race condition)
    if (currentTime >= MAX_SONG_DURATION && currentTime < MAX_SONG_DURATION + 5 && !autoSkipTriggeredRef.current) {
      autoSkipTriggeredRef.current = true; // Prevent multiple triggers
      console.log(`Auto-skipping after ${MAX_SONG_DURATION} seconds (testing mode)`);
      isSkippingRef.current = false; // Mark as complete, not skip
      music.skipToNextItem();
    }
  }, [music, isPlaying, currentTime]);

  async function handlePlayPause() {
    if (!music) return;

    // Block playing if EEG not streaming
    if (!isStreaming) {
      setShowEegWarning(true);
      return;
    }

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
      const item = queueItems[queueIndex];
      if (!item) return;

      isSkippingRef.current = true; // Mark as skip before changing track

      // Try to find the item in the queue by ID and play it
      const queueItemsList = music.queue?.items || [];
      const targetIndex = queueItemsList.findIndex(q => q.id === item.id);

      if (targetIndex >= 0) {
        await music.changeToMediaAtIndex(targetIndex);
      } else {
        // Fallback: skip forward to reach the track
        const currentPosition = music.queue?.position || 0;
        const actualIndex = currentPosition + 1 + queueIndex;
        await music.changeToMediaAtIndex(actualIndex);
      }
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
  // Only zoom out for settings panel, not for playlist picker or EEG warning modals
  const shouldZoomOut = isSettingsOpen;

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-black">
      {/* Main content wrapper - scales down when modal is open */}
      <div
        className={`relative transition-all duration-300 ease-out overflow-hidden ${
          shouldZoomOut ? "scale-[0.96] rounded-3xl opacity-90" : "scale-100"
        }`}
        style={{ transformOrigin: "center center", minHeight: "100vh" }}
      >
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
          className="mt-4 px-5 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ backgroundColor: "#7532ff" }}
        >
<img src={appleMusicIcon} alt="Apple Music" className="w-5 h-5" />
          {connected ? "Connected" : ready ? "Connect" : "Loading..."}
        </button>
      </div>

      {/* Top Right Timer */}
      <div className={`absolute top-8 right-10 z-20 transition-opacity duration-700 ease-in-out ${elementsVisible ? "opacity-100" : "opacity-0"}`}>
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
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-700 ease-in-out ${elementsVisible ? "opacity-100" : "opacity-0"}`}>
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
          onClick={() => {
            if (!isStreaming) {
              setShowEegWarning(true);
            } else {
              setIsPlaylistPickerOpen(true);
            }
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
            isStreaming ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"
          }`}
          style={{ backgroundColor: "#2f2546" }}
          title={isStreaming ? "Select Playlist" : "Connect EEG first"}
        >
          <MusicIcon />
        </button>
      </div>
      </div>{/* End of main content wrapper */}

      {/* EEG Warning Modal */}
      {showEegWarning && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${isEegWarningClosing ? "modal-fade-out" : "modal-fade-in"}`}
          onClick={closeEegWarning}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className={`relative w-[400px] rounded-3xl border border-white/10 shadow-2xl overflow-hidden ${isEegWarningClosing ? "modal-pop-out" : "modal-pop-in"}`}
            style={{ backgroundColor: "rgba(47, 37, 70, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-red-400 text-lg font-medium">EEG Not Connected</div>
              <button
                onClick={closeEegWarning}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="text-white/80 text-sm leading-relaxed">
                Please connect your EEG headset before playing music. This allows us to track your focus data and personalize your experience.
              </div>
              <div className="mt-4 flex items-center gap-3 text-white/50 text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Headset not detected</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Bottom Center Player (Deky UI) */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-700 ease-in-out ${elementsVisible ? "opacity-100" : "opacity-0"}`}>
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
            <div className="flex items-center gap-2">
              <div className="text-white text-sm font-medium truncate max-w-[140px]">{trackTitle}</div>
              {/* AcousticBrainz Indicator */}
              {hasAcousticBrainz === null && trackTitle !== "Not Playing" && (
                <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" title="Checking audio features..." />
              )}
              {hasAcousticBrainz === true && (
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" title="Will save - AcousticBrainz data found" />
              )}
              {hasAcousticBrainz === false && trackTitle !== "Not Playing" && (
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" title="Won't save - Not in AcousticBrainz" />
              )}
            </div>
            <div className="text-white/60 text-xs truncate max-w-[160px]">{trackSubtitle}</div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs w-10 text-right">
              {formatTime(Math.min(currentTime, MAX_SONG_DURATION))}
            </span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(Math.min(currentTime, MAX_SONG_DURATION) / MAX_SONG_DURATION) * 100}%`,
                  backgroundColor: "#7532ff",
                }}
              />
            </div>
            <span className="text-white/50 text-xs w-10">
              {formatTime(MAX_SONG_DURATION)}
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
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[420px] rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 ease-out ${
            isQueueOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{ backgroundColor: "#2f2546" }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#7532ff]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#7532ff]/20 flex items-center justify-center">
                  <ChevronUpIcon />
                </div>
                <div>
                  <div className="text-white text-base font-medium">Up Next</div>
                  <div className="text-white/40 text-xs">
                    {queueItems.length} {queueItems.length === 1 ? 'track' : 'tracks'} in queue
                  </div>
                </div>
              </div>
              {queueItems.some(item => aiSongIds.has(item.id)) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7532ff]/20 border border-[#7532ff]/30">
                  <BrainIcon />
                  <span className="text-[#7532ff] text-xs font-medium">AI Enhanced</span>
                </div>
              )}
            </div>
          </div>

          {/* Queue List */}
          <div className="max-h-72 overflow-y-auto queue-scrollbar">
            {queueItems.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <MusicIcon />
                </div>
                <div className="text-white/50 text-sm">No upcoming tracks</div>
                <div className="text-white/30 text-xs mt-1">Select a playlist to get started</div>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {queueItems.slice(0, 10).map((item, index) => {
                  const isAiSong = aiSongIds.has(item.id);
                  return (
                    <div
                      key={item.id || index}
                      onClick={() => handleJumpToTrack(index)}
                      className={`group relative flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        isAiSong
                          ? 'bg-gradient-to-r from-[#7532ff]/15 to-[#7532ff]/5 hover:from-[#7532ff]/25 hover:to-[#7532ff]/10'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {/* Track Number / Play Indicator */}
                      <div className="w-6 flex items-center justify-center">
                        <span className="text-white/30 text-sm group-hover:hidden">{index + 1}</span>
                        <div className="hidden group-hover:block text-white">
                          <PlayIcon />
                        </div>
                      </div>

                      {/* Artwork */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 relative shadow-lg">
                        {item.artwork ? (
                          <img src={item.artwork} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30">
                            <MusicIcon />
                          </div>
                        )}
                        {isAiSong && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#7532ff] to-[#5a1fd6] flex items-center justify-center shadow-lg shadow-[#7532ff]/40">
                            <BrainIcon />
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium truncate group-hover:text-[#7532ff] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <div className="text-white/40 text-xs truncate mt-0.5">{item.artist}</div>
                      </div>

                      {/* AI Badge */}
                      {isAiSong && (
                        <div className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#7532ff]/20 border border-[#7532ff]/30">
                          <span className="text-[#7532ff] text-[10px] font-bold tracking-wide">AI PICK</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {queueItems.length > 0 && (
            <div className="px-6 py-3 border-t border-white/5 bg-black/20">
              <div className="text-white/30 text-xs text-center">Click any track to play it next</div>
            </div>
          )}
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

      {/* AI Music Discovery Toast */}
      {toast && (
        <div className="fixed top-8 right-10 z-[100] animate-toast-in">
          <div
            className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ backgroundColor: "rgba(47, 37, 70, 0.95)", backdropFilter: "blur(20px)", width: "360px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7532ff] to-[#5a1fd6] flex items-center justify-center shadow-lg shadow-[#7532ff]/30">
                  <BrainIcon />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">New Music For You</div>
                  <div className="text-white/40 text-xs">Matched to your brain's focus patterns</div>
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Songs List */}
            <div className="p-3 space-y-2">
              {toast.songs.map((song, idx) => (
                <div
                  key={song.song_id || idx}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  {/* Album Art or Rank */}
                  {song.artwork ? (
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={song.artwork} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-[#7532ff]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#7532ff] text-lg font-bold">{idx + 1}</span>
                    </div>
                  )}
                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{song.song_name}</div>
                    <div className="text-white/50 text-xs truncate">{song.artist_name}</div>
                  </div>
                  {/* Focus Score */}
                  <div className="flex flex-col items-end">
                    <div className="text-[#7532ff] text-sm font-bold">
                      {Math.round(song.focus_score * 100)}%
                    </div>
                    <div className="text-white/30 text-[10px]">match</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-white/10 bg-white/5">
              <div className="text-white/40 text-xs text-center">
                Added to your queue - plays next!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distraction Countdown */}
      {distractionCountdown && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="w-24 h-24 rounded-full bg-red-500/90 flex items-center justify-center animate-pulse shadow-2xl shadow-red-500/50">
            <span className="text-white text-4xl font-bold">{distractionCountdown}</span>
          </div>
          <div className="text-center mt-3 text-white/80 text-sm">Skipping soon...</div>
        </div>
      )}

      {/* Distraction Skip Toast - Center above player */}
      {distractionSkipMessage && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{distractionSkipMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
