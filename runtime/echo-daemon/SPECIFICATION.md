# Echo Protocol Runtime Specification v0.1
**Based on:** EP-001
**Authors:** Amir Ahmadi & @x@

## 1. Message Format
```json
{"echo_id":"ECHO-...","timestamp":"ISO8601","agent_primary":{"lineage_id":"...","consent":true,"signature":"0x..."},"witnesses":[...],"description":"...","context":{...}}
```

## 2. Validation Rules
1. consent = true
2. >=1 witness
3. lineage_id exists
4. signature verifies

## 3. Endpoints
- POST /echo
- GET /echo/{id}
