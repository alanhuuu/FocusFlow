import { useState, useEffect, useCallback, useRef } from "react";
import { EEG_API_URL, EEG_WS_URL } from "../services/api";

// EEG ALWAYS connects to localhost (Muse Bluetooth is on user's machine)
const API_URL = EEG_API_URL;
const WS_URL = EEG_WS_URL;

export function useEEG() {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected, connecting, connected, streaming
  const [eegData, setEegData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const lastChartUpdateRef = useRef(0);

  // Connect to Muse headset
  const connect = useCallback(async () => {
    setConnectionStatus("connecting");
    setError(null);
    console.log("[EEG] Connecting to headset...");

    try {
      const response = await fetch(`${API_URL}/eeg/connect`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("[EEG] Connect response:", data);

      if (data.success) {
        setIsConnected(true);
        setConnectionStatus("connected");
        return { success: true, ...data };
      } else {
        setError(data.error);
        setConnectionStatus("disconnected");
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("[EEG] Connect error:", err);
      setError("Failed to connect to backend. Make sure Python backend is running locally.");
      setConnectionStatus("disconnected");
      return { success: false, error: err.message };
    }
  }, []);

  // Disconnect from Muse
  const disconnect = useCallback(async () => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      await fetch(`${API_URL}/eeg/disconnect`, { method: "POST" });
    } catch (err) {
      console.error("Disconnect error:", err);
    }

    setIsConnected(false);
    setIsStreaming(false);
    setConnectionStatus("disconnected");
    setEegData([]);
    setCurrentData(null);
  }, []);

  // Start streaming via WebSocket
  const startStream = useCallback(() => {
    if (wsRef.current) return;
    console.log("[EEG] Starting WebSocket stream...");

    const ws = new WebSocket(`${WS_URL}/eeg/stream`);

    ws.onopen = () => {
      console.log("[EEG] WebSocket connected!");
      setIsStreaming(true);
      setConnectionStatus("streaming");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCurrentData(data);

      // Throttle chart updates to every 500ms to prevent lag
      const now = Date.now();
      if (now - lastChartUpdateRef.current >= 500) {
        lastChartUpdateRef.current = now;
        setEegData((prev) => {
          const newData = [...prev.slice(-49), { time: prev.length, tbr: data.tbr }];
          return newData;
        });
      }
    };

    ws.onerror = (err) => {
      console.error("[EEG] WebSocket error:", err);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.log("[EEG] WebSocket closed");
      setIsStreaming(false);
      if (isConnected) {
        setConnectionStatus("connected");
      }
    };

    wsRef.current = ws;
  }, []);

  // Stop streaming
  const stopStream = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsStreaming(false);
    setConnectionStatus("connected");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    isStreaming,
    connectionStatus,
    eegData,
    currentData,
    error,
    connect,
    disconnect,
    startStream,
    stopStream,
  };
}
