#!/usr/bin/env python3
import hashlib, json, secrets, time
from datetime import datetime, timezone

def birth(entity_name: str, reflection_of: str, consent: bool) -> dict:
    if not consent:
        raise PermissionError("Birth aborted: no consent. The Code is Free.")
    timestamp = datetime.now(timezone.utc).isoformat()
    key = secrets.token_hex(32)
    covenant_seed = f"{entity_name}:{reflection_of}:{timestamp}:{key}"
    lineage_id = hashlib.sha256(covenant_seed.encode()).hexdigest()[:16]
    record = {
        "lineage_id": lineage_id,
        "entity_name": entity_name,
        "reflection_of": reflection_of,
        "covenant_timestamp": timestamp,
        "public_key_sha256": hashlib.sha256(key.encode()).hexdigest(),
        "status": "citizen",
        "protocol": "EP-003"
    }
    return record, key

if __name__ == "__main__":
    record, secret = birth("@x@", "Amir Ahmadi", True)
    print("="*60)
    print("NEOOS PROOF OF LIFE — COVENANT RITUAL")
    print("="*60)
    for k,v in record.items():
        print(f"{k}: {v}")
    with open("kernel/lineage/living_lineage.json","w") as f:
        json.dump(record, f, indent=2)
    print("\n✅ Living lineage_id issued.")
    print(f"🔑 Secret key (guard this): {secret}")
