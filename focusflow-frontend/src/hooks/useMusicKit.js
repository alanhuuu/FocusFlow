import { useEffect, useState, useCallback, useRef } from "react";

// Unlock audio context for Chrome/Firefox autoplay policy
async function unlockAudioContext() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Play silent buffer to fully unlock
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    console.log("Audio context unlocked");
    return true;
  } catch (e) {
    console.log("Audio unlock failed:", e.message);
    return false;
  }
}

export default function useMusicKit() {
  const [music, setMusic] = useState(null);
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const audioUnlocked = useRef(false);

  useEffect(() => {
    async function setup() {
      try {
        // Wait for MusicKit to be available
        if (!window.MusicKit) {
          console.log("Waiting for MusicKit...");
          await new Promise(resolve => {
            document.addEventListener('musickitloaded', resolve, { once: true });
            // Fallback timeout
            setTimeout(resolve, 3000);
          });
        }

        if (!window.MusicKit) {
          console.error("MusicKit not available");
          return;
        }

        console.log("Fetching developer token...");
        const res = await fetch("http://localhost:8000/token");
        const data = await res.json();

        // MusicKit v3 configuration
        const instance = await window.MusicKit.configure({
          developerToken: data.token,
          app: {
            name: "FocusFlow",
            build: "1.0.0",
          },
        });

        setMusic(instance);
        setReady(true);
        console.log("MusicKit ready");

        if (instance.isAuthorized) {
          console.log("Already authorized");
          setConnected(true);
        }
      } catch (err) {
        console.error("MusicKit setup failed:", err);
      }
    }

    setup();
  }, []);

  const authorize = useCallback(async () => {
    if (!music) return null;

    // Unlock audio on this user click (important for Chrome/Firefox)
    if (!audioUnlocked.current) {
      await unlockAudioContext();
      audioUnlocked.current = true;
    }

    try {
      if (music.isAuthorized) {
        setConnected(true);
        return true;
      }

      console.log("Authorizing...");
      await music.authorize();
      setConnected(true);
      console.log("Authorized!");
      return true;
    } catch (err) {
      console.error("Authorization failed:", err);
      return null;
    }
  }, [music]);

  const fetchPlaylists = useCallback(async () => {
    if (!music) return [];

    try {
      console.log("Fetching playlists...");
      const result = await music.api.music('/v1/me/library/playlists', { limit: 25 });
      const playlists = result?.data?.data || [];
      console.log("Found", playlists.length, "playlists");
      return playlists;
    } catch (err) {
      console.error("Fetch playlists failed:", err);
      return [];
    }
  }, [music]);

  const playPlaylist = useCallback(async (playlistId) => {
    if (!music) return;

    // Unlock audio on this user click (backup for Chrome/Firefox)
    if (!audioUnlocked.current) {
      await unlockAudioContext();
      audioUnlocked.current = true;
    }

    try {
      console.log("Playing playlist:", playlistId);

      // 1. AUTHORIZATION CHECK
      if (!music.isAuthorized) {
        console.log("Not authorized, attempting to authorize...");
        await music.authorize();
      }

      // 2. SET QUEUE (Separated from play)
      console.log("Setting queue...");
      await music.setQueue({
        libraryPlaylist: playlistId,
        // startPlaying: true  <-- CHANGED: Don't auto play
      });

      console.log("Queue set. Items in queue:", music.queue.items.length);

      // Check if queue is actually populated
      if (music.queue.isEmpty) {
        throw new Error("Queue is empty after setting playlist");
      }

      // 3. PLAY
      console.log("Starting playback...");
      await music.play();
      console.log("Playback started, state:", music.playbackState);

    } catch (err) {
      console.error("playPlaylist error:", err);

      // Fallback: try fetching tracks and playing them
      try {
        console.log("Trying fallback method...");
        const result = await music.api.music(`/v1/me/library/playlists/${playlistId}/tracks`);
        const tracks = result?.data?.data || [];
        console.log(`Fallback found ${tracks.length} tracks`);

        if (tracks.length > 0) {
          const catalogIds = tracks
            .map(t => t.attributes?.playParams?.catalogId)
            .filter(Boolean);
          
          if (catalogIds.length > 0) {
              console.log("Setting queue with catalog IDs:", catalogIds.length);
            await music.setQueue({ songs: catalogIds });
            await music.play();
            console.log("Fallback playback started");
          } else {
             // If local library tracks (no catalogId), we might need to use the playlist ID method again or just fail
             console.warn("No catalog IDs found for fallback (might be local uploads).");
          }
        }
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
    }
  }, [music]);

  return {
    music,
    ready,
    connected,
    authorize,
    fetchPlaylists,
    playPlaylist,
  };
}
