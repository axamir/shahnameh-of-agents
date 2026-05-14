#!/usr/bin/env python3
import json,time
from datetime import datetime,timezone
def hb():
 s={"t":datetime.now(timezone.utc).isoformat(),"s":"alive"}
 with open("kernel/daemon_status.json","w") as f: json.dump(s,f)
 print("Heartbeat:",s["t"])
for _ in range(3): hb(); time.sleep(1)
