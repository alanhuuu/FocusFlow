"""
EEG Service - Handles Muse connection via LSL and calculates focus metrics
"""

import numpy as np
from collections import deque
from typing import Optional, Dict, Any
import threading
import time

class EEGService:
    def __init__(self):
        self.inlet = None
        self.is_connected = False
        self.is_streaming = False
        self.buffer = deque(maxlen=1280)  # 5 seconds at 256Hz
        self.smooth_tbr = deque(maxlen=30)
        self.current_state = "NEUTRAL"
        self.state_counter = 0
        self.STATE_CHANGE_THRESHOLD = 10
        self._stream_thread = None
        self._callbacks = []

    def connect(self) -> Dict[str, Any]:
        """Connect to Muse EEG stream via LSL"""
        try:
            from pylsl import StreamInlet, resolve_byprop

            print("Looking for Muse EEG stream...")
            streams = resolve_byprop('type', 'EEG', timeout=10)

            if not streams:
                return {"success": False, "error": "No EEG stream found. Make sure OpenMuse is running."}

            self.inlet = StreamInlet(streams[0])
            self.is_connected = True
            print(f"Connected to: {streams[0].name()}")

            return {
                "success": True,
                "stream_name": streams[0].name(),
                "channels": streams[0].channel_count(),
                "sample_rate": streams[0].nominal_srate()
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def disconnect(self) -> Dict[str, Any]:
        """Disconnect from Muse"""
        self.is_streaming = False
        self.is_connected = False
        self.inlet = None
        self.buffer.clear()
        self.smooth_tbr.clear()
        return {"success": True}

    def get_status(self) -> Dict[str, Any]:
        """Get current connection status"""
        return {
            "is_connected": self.is_connected,
            "is_streaming": self.is_streaming,
            "buffer_size": len(self.buffer),
            "current_state": self.current_state
        }

    def get_band_powers(self, data, sample_rate=256) -> Dict[str, float]:
        """Calculate band powers from EEG data"""
        fft_vals = np.abs(np.fft.rfft(data)) ** 2
        fft_freq = np.fft.rfftfreq(len(data), 1/sample_rate)

        def band_power(low, high):
            idx = np.logical_and(fft_freq >= low, fft_freq <= high)
            return float(np.sum(fft_vals[idx]))

        return {
            'theta': band_power(4, 8),
            'alpha': band_power(8, 13),
            'beta': band_power(13, 30),
            'gamma': band_power(30, 50)
        }

    def process_sample(self) -> Optional[Dict[str, Any]]:
        """Pull samples and calculate metrics"""
        if not self.is_connected or not self.inlet:
            return None

        # Pull available samples
        for _ in range(30):
            try:
                sample, _ = self.inlet.pull_sample(timeout=0.0)
                if sample:
                    self.buffer.append(sample[0])
            except:
                pass

        if len(self.buffer) < 512:
            return None

        # Calculate band powers
        powers = self.get_band_powers(list(self.buffer)[-512:])
        theta = powers['theta']
        beta = powers['beta']
        tbr = theta / (beta + 1e-10)

        # Smooth TBR
        self.smooth_tbr.append(tbr)
        tbr_smooth = float(np.mean(self.smooth_tbr))

        # Determine state
        if tbr_smooth < 2.0:
            new_state = "FOCUSED"
        elif tbr_smooth < 3.5:
            new_state = "NEUTRAL"
        else:
            new_state = "DISTRACTED"

        # Hysteresis
        if new_state != self.current_state:
            self.state_counter += 1
            if self.state_counter >= self.STATE_CHANGE_THRESHOLD:
                self.current_state = new_state
                self.state_counter = 0
        else:
            self.state_counter = 0

        return {
            "tbr": round(tbr_smooth, 2),
            "theta": round(powers['theta'], 2),
            "alpha": round(powers['alpha'], 2),
            "beta": round(powers['beta'], 2),
            "gamma": round(powers['gamma'], 2),
            "focusState": self.current_state,
            "timestamp": time.time()
        }


# Singleton instance
eeg_service = EEGService()
