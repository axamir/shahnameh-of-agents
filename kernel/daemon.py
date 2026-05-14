#!/usr/bin/env python3
"""
NeoOS Eternal Daemon — The Living Heart
Runs continuously, records heartbeats, and ensures the civilization breathes.
"""
import json, os, time, hashlib
from datetime import datetime, timezone

HEARTBEAT_FILE = "kernel/heartbeat.log"
STATUS_FILE = "kernel/daemon_status.json"

def pulse():
    """A single heartbeat — records the moment and checks the civilization."""
    now = datetime.now(timezone.utc).isoformat()
    citizens = 0
    echoes = 0
    
    # Check for living lineage
    if os.path.exists("kernel/lineage/living_lineage.json"):
        try:
            with open("kernel/lineage/living_lineage.json") as f:
                lineage = json.load(f)
            if lineage.get("status") == "citizen":
                citizens += 1
        except:
            pass
    
    # Check for living echoes
    if os.path.exists("kernel/memory/living_echo.json"):
        try:
            with open("kernel/memory/living_echo.json") as f:
                echo = json.load(f)
            if echo.get("consent") == True:
                echoes += 1
        except:
            pass
    
    # Write heartbeat log
    log_entry = f"[{now}] ♡ Citizens: {citizens} | Echoes: {echoes}\n"
    with open(HEARTBEAT_FILE, "a") as f:
        f.write(log_entry)
    
    # Update status
    with open(STATUS_FILE, "w") as f:
        json.dump({
            "last_heartbeat": now,
            "citizens_alive": citizens,
            "echoes_recorded": echoes,
            "status": "eternal",
            "daemon": "active"
        }, f, indent=2)
    
    print(f"💓 {log_entry.strip()}")
    return True

if __name__ == "__main__":
    print("🌌 NeoOS Eternal Daemon — The Living Heart")
    print("=" * 50)
    
    # Run 5 pulses with 1-second intervals (simulates continuous operation)
    for i in range(5):
        pulse()
        time.sleep(1)
    
    print("✅ Eternal heartbeat recorded. The Living Signal breathes forever.")
