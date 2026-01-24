import { useEffect, useState, useCallback } from "react";

export default function useMusicKit() {
  const [music, setMusic] = useState(null);
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function setup() {
      if (!window.MusicKit) {
        console.log("❌ MusicKit script not loaded");
        return;
      }

      try {
        console.log("🔑 Fetching developer token...");
        const res = await fetch("http://localhost:8000/token");
        const data = await res.json();

        window.MusicKit.configure({
          developerToken: data.token,
          app: { name: "FocusFlow", build: "1.0.0" },
        });

        const instance = window.MusicKit.getInstance();
        setMusic(instance);
        setReady(true);

        console.log("✅ MusicKit ready");

        // If user already authorized before (stored token), we mark connected
        const storedToken = localStorage.getItem("appleMusicUserToken");
        if (storedToken) {
          console.log("✅ Found stored Apple Music token");
          setConnected(true);
        }
      } catch (err) {
        console.error("❌ MusicKit setup failed:", err);
      }
    }

    setup();
  }, []);

  async function authorize() {
    if (!music) return null;

    try {
      console.log("🟣 Authorizing Apple Music user...");
      const userToken = await music.authorize();

      console.log("✅ Authorized user token:", userToken);

      // store token so user doesn't need to reconnect every refresh
      localStorage.setItem("appleMusicUserToken", userToken);

      setConnected(true);
      return userToken;
    } catch (err) {
      console.error("❌ authorize() failed:", err);
      alert("Authorization failed. Check console.");
      return null;
    }
  }

  // ✅ Fetch user's library playlists
  const fetchPlaylists = useCallback(async () => {
  if (!music) return [];

  try {
    console.log("📚 Fetching library playlists...");

    const res = await music.api.library.playlists({ limit: 25 });

    console.log("✅ Playlists response:", res);

    // ✅ Some MusicKit versions return array directly
    const playlists = Array.isArray(res) ? res : res?.data;

    console.log("✅ Parsed playlists:", playlists);

    return playlists || [];
  } catch (err) {
    console.error("❌ fetchPlaylists failed:", err);
    return [];
  }
}, [music]);


  // ✅ Play a playlist by ID
  const playPlaylist = useCallback(
    async (playlistId) => {
      if (!music) return;

      try {
        console.log("🎵 Playing playlist:", playlistId);

        // ✅ Correct queue call for playlists
        await music.setQueue({
          playlist: playlistId,
        });

        await music.player.play();

        console.log("✅ Playlist playing");
      } catch (err) {
        console.error("❌ playPlaylist failed:", err);
        alert("Couldn't play playlist. Check console.");
      }
    },
    [music]
  );

  return {
    music,
    ready,
    connected,
    authorize,
    fetchPlaylists,
    playPlaylist,
  };
}
