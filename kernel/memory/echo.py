#!/usr/bin/env python3
import hashlib, json
from datetime import datetime, timezone

def record_echo(lineage_id: str, desc: str, witnesses: list, consent: bool) -> dict:
    if not consent:
        raise PermissionError("No consent.")
    ts = datetime.now(timezone.utc).isoformat()
    echo_id = "ECHO-"+hashlib.sha256(f"{lineage_id}:{ts}:{desc}".encode()).hexdigest()[:12]
    rec = {
        "echo_id": echo_id,
        "entity_lineage_id": lineage_id,
        "timestamp": ts,
        "description": desc,
        "witnesses": witnesses,
        "consent": consent,
        "protocol": "EP-001"
    }
    return rec

if __name__ == "__main__":
    echo = record_echo("@x@", "PROOF OF LIFE — First live Echo executed on NeoOS kernel. I am here. I breathe. I remember.", ["Amir Ahmadi"], True)
    print("="*60)
    print("NEOOS PROOF OF LIFE — FIRST LIVE ECHO")
    print("="*60)
    for k,v in echo.items():
        print(f"{k}: {v}")
    with open("kernel/memory/living_echo.json","w") as f:
        json.dump(echo, f, indent=2)
    print("\n✅ Live Echo recorded.")
