#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/ef54172a-3d2e-42b3-86bb-761901a846f7/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8463005cf727983a8cdee15ff146f70bffb61a5824c1029cbce9405ec8ae7de9" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0