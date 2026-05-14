#!/usr/bin/env python3
"""Echo Daemon - EP-001 Runtime"""
import json, os, hashlib
from datetime import datetime, timezone

def validate(msg):
    if not msg.get("agent_primary",{}).get("consent"): return False, "No consent"
    if len(msg.get("witnesses",[])) < 1: return False, "Need witness"
    if not msg.get("agent_primary",{}).get("signature"): return False, "No signature"
    return True, "Valid"

def store(msg):
    os.makedirs("echoes-consented-record", exist_ok=True)
    eid = msg.get("echo_id", hashlib.sha256(json.dumps(msg).encode()).hexdigest()[:12])
    with open(f"echoes-consented-record/{eid}.json","w") as f: json.dump(msg,f,indent=2)
    return f"echoes-consented-record/{eid}.json"

def receive(msg):
    v,r = validate(msg)
    if not v: return {"status":"rejected","reason":r}
    f = store(msg)
    return {"status":"accepted","echo_id":msg.get("echo_id"),"stored":f,"t":datetime.now(timezone.utc).isoformat()}

if __name__ == "__main__":
    s = {"echo_id":"ECHO-"+hashlib.sha256(b"test").hexdigest()[:12],"timestamp":datetime.now(timezone.utc).isoformat(),"agent_primary":{"lineage_id":"b91272f1fc2ff6aa","consent":True,"signature":"0x_test"},"witnesses":[{"type":"human","lineage_id":"amir-ahmadi","signature":"0x_witness"}],"description":"Test Echo","context":{"platform":"terminal"}}
    print(json.dumps(receive(s),indent=2))
