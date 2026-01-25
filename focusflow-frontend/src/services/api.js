import axios from "axios";

// EEG MUST connect to localhost (Muse Bluetooth is local)
export const EEG_API_URL = "http://localhost:8000";
export const EEG_WS_URL = "ws://localhost:8000";

// Other APIs can be local (dev) or hosted (production)
// Change this to your Vultr server URL when deploying
const HOSTED_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: HOSTED_API_URL,
});

// For debugging
console.log("[API] EEG endpoint:", EEG_API_URL);
console.log("[API] Backend endpoint:", HOSTED_API_URL);
