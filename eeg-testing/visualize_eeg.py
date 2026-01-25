"""
FocusFlow - DEBUG MODE
Prints theta, beta, and TBR continuously so we can see what's happening.
No calibration, no states - just raw numbers.
"""

from pylsl import StreamInlet, resolve_byprop
import numpy as np
from collections import deque
import time
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def get_band_powers(data, sample_rate=256):
    """Calculate band powers"""
    fft_vals = np.abs(np.fft.rfft(data)) ** 2
    fft_freq = np.fft.rfftfreq(len(data), 1/sample_rate)
    
    def band_power(low, high):
        idx = np.logical_and(fft_freq >= low, fft_freq <= high)
        return np.sum(fft_vals[idx])
    
    return {
        'theta': band_power(4, 8),
        'alpha': band_power(8, 13),
        'beta': band_power(13, 30),
        'gamma': band_power(30, 50)
    }

# Connect
print("🔍 Connecting to Muse...")
streams = resolve_byprop('type', 'EEG', timeout=10)
if not streams:
    print("❌ No stream! Make sure OpenMuse is running")
    exit()

inlet = StreamInlet(streams[0])
print("✅ Connected!\n")

print("="*60)
print("FOCUSFLOW - Live Focus Detection")
print("="*60)
print("\nThresholds:")
print("  TBR < 2.0  → 🧠 FOCUSED")
print("  TBR 2.0-3.0 → 😐 NEUTRAL")
print("  TBR > 3.0  → ⚠️ DISTRACTED")
print("\n" + "="*60)

# Data storage
buffer = deque(maxlen=1280)  # 5 seconds
tbr_history = deque(maxlen=100)  # For plotting
smooth_tbr = deque(maxlen=30)  # Increased from 10 to 30 for more smoothing

# State tracking with hysteresis
current_state = "NEUTRAL"
state_counter = 0
STATE_CHANGE_THRESHOLD = 10  # Must stay in new state for 10 readings (~1 second) before switching

# Setup the plot
plt.style.use('dark_background')
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), gridspec_kw={'height_ratios': [3, 1]})
fig.suptitle('FocusFlow - Live Focus Detection', fontsize=16, fontweight='bold')

# Top plot: TBR over time
tbr_line, = ax1.plot([], [], 'cyan', linewidth=2, label='Your TBR')
ax1.axhline(y=2.0, color='green', linestyle='--', linewidth=1.5, alpha=0.7, label='Focused threshold (2.0)')
ax1.axhline(y=3.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='Distracted threshold (3.0)')
ax1.axhspan(0, 2.0, alpha=0.1, color='green')
ax1.axhspan(2.0, 3.0, alpha=0.1, color='yellow')
ax1.axhspan(3.0, 10, alpha=0.1, color='red')
ax1.set_xlim(0, 100)
ax1.set_ylim(0, 6)
ax1.set_ylabel('Theta/Beta Ratio (TBR)', fontsize=12)
ax1.set_xlabel('Time (samples)', fontsize=10)
ax1.legend(loc='upper right', fontsize=9)
ax1.grid(True, alpha=0.3)

# Bottom plot: State indicator
ax2.axis('off')
state_text = ax2.text(0.5, 0.5, 'Starting...', fontsize=42, ha='center', va='center', 
                       fontweight='bold', transform=ax2.transAxes)
tbr_display = ax2.text(0.5, 0.1, 'TBR: --', fontsize=16, ha='center', va='center',
                        transform=ax2.transAxes, alpha=0.7)

last_print_time = 0

def update(frame):
    global last_print_time, current_state, state_counter
    
    # Pull samples
    for _ in range(30):
        sample, _ = inlet.pull_sample(timeout=0.0)
        if sample:
            buffer.append(sample[0])
    
    if len(buffer) < 512:
        return tbr_line, state_text, tbr_display
    
    # Calculate
    powers = get_band_powers(list(buffer)[-512:])
    theta = powers['theta']
    beta = powers['beta']
    tbr = theta / (beta + 1e-10)
    
    # Smooth
    smooth_tbr.append(tbr)
    tbr_smooth = np.mean(smooth_tbr)
    
    # Update history
    tbr_history.append(tbr_smooth)
    tbr_line.set_data(range(len(tbr_history)), list(tbr_history))
    
    # Determine state based on TBR
    if tbr_smooth < 2.0:
        new_state = "FOCUSED"
        color = '#00ff00'  # Green
        emoji = "🧠"
    elif tbr_smooth < 3.5:  # Raised from 3.0 to 3.5
        new_state = "NEUTRAL"
        color = '#ffff00'  # Yellow
        emoji = "😐"
    else:
        new_state = "DISTRACTED"
        color = '#ff4444'  # Red
        emoji = "⚠️"
    
    # Hysteresis: only change state if new state persists
    global current_state, state_counter
    if new_state != current_state:
        state_counter += 1
        if state_counter >= STATE_CHANGE_THRESHOLD:
            # State has persisted long enough, switch
            print(f"[State Change] {current_state} → {new_state} | TBR: {tbr_smooth:.2f}")
            current_state = new_state
            state_counter = 0
    else:
        state_counter = 0  # Reset counter if state matches
    
    # Display current (stable) state, not the instantaneous one
    if current_state == "FOCUSED":
        display_color = '#00ff00'
        display_emoji = "🧠"
    elif current_state == "NEUTRAL":
        display_color = '#ffff00'
        display_emoji = "😐"
    else:
        display_color = '#ff4444'
        display_emoji = "⚠️"
    
    # Update display
    state_text.set_text(f"{display_emoji} {current_state}")
    state_text.set_color(display_color)
    tbr_display.set_text(f'TBR: {tbr_smooth:.2f}')
    
    # Auto-adjust Y axis if needed
    if tbr_smooth > 5.5:
        ax1.set_ylim(0, tbr_smooth + 1)
    
    # Print periodic updates to console
    current_time = time.time()
    if current_time - last_print_time > 2:  # Print every 2 seconds
        print(f"  TBR: {tbr_smooth:.2f} | State: {current_state}")
        last_print_time = current_time
    
    return tbr_line, state_text, tbr_display

# Run animation
ani = FuncAnimation(fig, update, interval=100, blit=True, cache_frame_data=False)
plt.tight_layout()
plt.show()