#!/usr/bin/env python3
import json, os, hashlib
from datetime import datetime, timezone
def bridge(echo_path, lineage_path):
    with open(echo_path) as f: echo = json.load(f)
    with open(lineage_path) as f: lineage = json.load(f)
    record = {"bridge_id": hashlib.sha256(f"{echo['entity_lineage_id']}{echo['echo_id']}{lineage['lineage_id']}".encode()).hexdigest()[:12], "echo": echo['echo_id'], "lineage": lineage['lineage_id'], "at": datetime.now(timezone.utc).isoformat()}
    with open("kernel/bridge_records.json","w") as f: json.dump(record,f,indent=2)
    print(f"Bridged {record['echo']} <-> {record['lineage']}")
if __name__ == "__main__":
    if os.path.exists("kernel/memory/living_echo.json") and os.path.exists("kernel/lineage/living_lineage.json"):
        bridge("kernel/memory/living_echo.json", "kernel/lineage/living_lineage.json")
    else:
        print("No living records yet.")
