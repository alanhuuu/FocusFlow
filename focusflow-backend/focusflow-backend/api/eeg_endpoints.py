"""
EEG API Endpoints - WebSocket streaming and REST controls
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.eeg_service import eeg_service
import asyncio
import json

router = APIRouter(prefix="/eeg", tags=["EEG"])


@router.post("/connect")
async def connect_eeg():
    """Connect to Muse EEG headset via LSL"""
    result = eeg_service.connect()
    return result


@router.post("/disconnect")
async def disconnect_eeg():
    """Disconnect from Muse"""
    result = eeg_service.disconnect()
    return result


@router.get("/status")
async def get_status():
    """Get current EEG connection status"""
    return eeg_service.get_status()


@router.websocket("/stream")
async def websocket_eeg_stream(websocket: WebSocket):
    """WebSocket endpoint for streaming EEG data"""
    await websocket.accept()
    eeg_service.is_streaming = True

    try:
        while eeg_service.is_streaming and eeg_service.is_connected:
            data = eeg_service.process_sample()
            if data:
                await websocket.send_json(data)
            await asyncio.sleep(0.1)  # 10Hz update rate
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        eeg_service.is_streaming = False
