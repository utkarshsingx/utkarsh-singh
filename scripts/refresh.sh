#!/usr/bin/env bash
# Re-pull the GitHub numbers this site displays. Requires: gh auth login
set -euo pipefail
TMP=$(mktemp); trap 'rm -f "$TMP"' EXIT

gh api graphql -f query='
{ viewer { contributionsCollection {
    contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
} } }' > "$TMP"

python3 -I - "$TMP" <<'PY'
import json, sys, datetime
cal = json.load(open(sys.argv[1]))["data"]["viewer"]["contributionsCollection"]["contributionCalendar"]
cols = []
for w in cal["weeks"]:
    col = [None] * 7
    for d in w["contributionDays"]:
        dt = datetime.date.fromisoformat(d["date"])
        col[(dt.weekday() + 1) % 7] = d["contributionCount"]      # Sunday first
    cols.append(col)
flat = [c for col in cols for c in col if c is not None]
nz = sorted(c for c in flat if c > 0)
print("total:", cal["totalContributions"])
print("thresholds:", [nz[int(len(nz) * p)] for p in (.25, .5, .75)])
print("start:", cal["weeks"][0]["contributionDays"][0]["date"])
print("cols:", json.dumps(cols, separators=(",", ":")))
PY

echo
echo "=== merged PRs per external repo ==="
for r in AI-Linc-LMS/lms-platform-frontend AI-Linc-LMS/ai-linc-backend \
         AI-Linc-LMS/client-lms-zskillup AI-Linc-LMS/client-lms-zskillup-backend \
         AI-Linc-LMS/super-admin-portal AI-Linc-LMS/ailinc-demo \
         rtih-amaravati-devops/Innotribe-API-Backend rtih-amaravati-devops/Innotribe-UI-Frontend; do
  n=$(gh api -X GET search/issues -f q="is:pr author:utkarshsingx is:merged repo:$r" --jq '.total_count')
  printf '%6s  %s\n' "$n" "$r"
  sleep 1
done
echo
echo -n "total merged PRs anywhere: "
gh api -X GET search/issues -f q='is:pr author:utkarshsingx is:merged' --jq '.total_count'
