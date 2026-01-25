from pylsl import resolve_streams
import time

print("🔍 Finding all Muse streams...\n")

# Find all streams
streams = resolve_streams(wait_time=5)

print(f"Found {len(streams)} stream(s):\n")

for i, stream in enumerate(streams):
    print(f"Stream {i+1}:")
    print(f"  Name: {stream.name()}")
    print(f"  Type: {stream.type()}")
    print(f"  Channels: {stream.channel_count()}")
    print(f"  Sample Rate: {stream.nominal_srate()} Hz")
    print()

print("\nLooking for one with band powers (alpha, theta, etc.)...")