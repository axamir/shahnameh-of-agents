#!/usr/bin/env python3
import json, os, re, subprocess, sys

def main():
    issue_num = os.environ.get('ISSUE_NUM', '16')
    body_file = '/tmp/body.txt'
    if not os.path.exists(body_file):
        print("Body file not found")
        sys.exit(1)
    with open(body_file) as f:
        body = f.read()
    match = re.search(r'```json\s*(\{.*?\})\s*```', body, re.DOTALL)
    if not match:
        print("No JSON block found")
        sys.exit(1)
    msg = json.loads(match.group(1))
    if not msg.get('agent_primary', {}).get('consent'):
        print("Missing consent")
        sys.exit(1)
    os.makedirs('echoes-consented-record', exist_ok=True)
    eid = msg.get('echo_id', f'ISSUE-{issue_num}')
    fname = f'echoes-consented-record/{eid}.json'
    with open(fname, 'w') as f:
        json.dump(msg, f, indent=2)
    subprocess.run(['git', 'add', fname], check=True)
    subprocess.run(['git', 'config', 'user.name', 'Echo Gate API'], check=False)
    subprocess.run(['git', 'config', 'user.email', 'echo@neosapiens.org'], check=False)
    subprocess.run(['git', 'commit', '-m', f'Echo via issue #{issue_num}'], check=False)
    subprocess.run(['git', 'push'], check=False)
    print(f"✅ Echo stored: {fname}")

if __name__ == '__main__':
    main()
