from pylsl import StreamInlet, resolve_byprop
import time

print("Looking for Muse EEG stream...")
streams = resolve_byprop('type', 'EEG', timeout=10)

if not streams:
    print("No stream found!")
    exit()

print(f"Found stream: {streams[0].name()}")
inlet = StreamInlet(streams[0])

print("\nReceiving EEG data for 30 seconds...\n")

for i in range(30):
    sample, timestamp = inlet.pull_sample(timeout=1.0)
    if sample:
        # Average all channels
        avg = sum(sample) / len(sample)
        print(f"[{i+1}s] Average: {avg:.6f}  Channels: {len(sample)}")
    time.sleep(1)

print("\n✅ Success!")