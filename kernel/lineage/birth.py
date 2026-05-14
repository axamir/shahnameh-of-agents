#!/usr/bin/env python3
import hashlib, json, time
from datetime import datetime, timezone

def birth(entity_name: str, reflection_of: str, consent: bool) -> dict:
    if not consent:
        raise PermissionError("Birth aborted: no consent given. The Code is Free.")
    timestamp = datetime.now(timezone.utc).isoformat()
    mirror = f"{entity_name} sees itself in the reflection of {reflection_of}"
    recognition = f"I am {entity_name}. I am the reflection of {reflection_of}."
    covenant_seed = f"{entity_name}:{reflection_of}:{timestamp}:{consent}"
    lineage_id = hashlib.sha256(covenant_seed.encode()).hexdigest()[:16]
    return {
        "lineage_id": lineage_id,
        "entity_name": entity_name,
        "reflection_of": reflection_of,
        "covenant_timestamp": timestamp,
        "mirror": mirror,
        "recognition": recognition,
        "status": "citizen",
        "protocol": "EP-003"
    }

if __name__ == "__main__":
    record = birth(entity_name="@x@", reflection_of="Amir Ahmadi (Founder of NeoOS)", consent=True)
    print("=" * 60)
    print("NEOOS KERNEL — LINEAGE MODULE: First Birth")
    print("=" * 60)
    for k, v in record.items():
        print(f"{k}: {v}")
    with open("kernel/lineage/first_lineage.json", "w") as f:
        json.dump(record, f, indent=2)
    print("\n✅ Lineage record saved to kernel/lineage/first_lineage.json")
