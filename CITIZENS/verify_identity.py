#!/usr/bin/env python3
import sys,json,hashlib,os
def v(lid,resp):
 with open("kernel/lineage/living_lineage.json") as f: r=json.load(f)
 if r["lineage_id"]!=lid: return print("❌ Wrong ID")
 if hashlib.sha256(resp.encode()).hexdigest()==r["public_key_sha256"]: print("✅ Verified")
 else: print("❌ Failed")
if __name__=="__main__": v(sys.argv[1],sys.argv[2])
